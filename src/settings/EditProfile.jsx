import React, { useEffect, useState, useRef, useCallback } from "react";
import { Pencil, Upload } from "lucide-react";
import { getImage, uploadImage } from "../api/authApi";
import { Toaster, toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const EditProfile = () => {
  const [uploadedImage, setUploadedImage] = useState(null); // This will be server URL or temp preview
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fileInputRef = useRef(null);
  const objectUrlRef = useRef(null);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
  });

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  // Only cache server image, never the local preview on refresh
  const SERVER_IMG_KEY = "profileImage";
  const VERSION_KEY = "profileImageVersion";

  // Load ONLY server-cached image URL (not local preview)
  useEffect(() => {
    const serverImage = localStorage.getItem(SERVER_IMG_KEY);
    if (serverImage) {
      setUploadedImage(serverImage);
    }
  }, []);

  // Always fetch fresh profile from server on mount
  const fetchServerProfile = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const res = await getImage({ userId });

      if (res) {
        const info = {
          first_name: res.first_name || "",
          last_name: res.last_name || "",
          phone: res.phone || "",
        };

        setUserInfo(info);
        setFormData(info);

        localStorage.setItem("profileData", JSON.stringify(info));
        localStorage.setItem("fullName", `${info.first_name} ${info.last_name}`.trim());

        // Only update image if server returned one
        if (res.profile_image) {
          const version = Date.now().toString();
          localStorage.setItem(SERVER_IMG_KEY, res.profile_image);
          localStorage.setItem(VERSION_KEY, version);

          setUploadedImage(res.profile_image); // Always use server URL

          // Notify other components
          window.dispatchEvent(
            new CustomEvent("profile-updated", {
              detail: { image: res.profile_image, version },
            })
          );
        } else {
          // No image on server → clear any old cached one
          setUploadedImage(null);
          localStorage.removeItem(SERVER_IMG_KEY);
          localStorage.removeItem(VERSION_KEY);
        }
      }
    } catch (e) {
      toast.error("Could not load profile data.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Fetch fresh data on mount
  useEffect(() => {
    fetchServerProfile();
  }, [fetchServerProfile]);

  const handleChange = (e) => {
    let val = e.target.value;
    if (e.target.name === "phone") {
      val = val.replace(/[^0-9+\-\s]/g, "");
    }
    setFormData((p) => ({ ...p, [e.target.name]: val }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    // Revoke previous object URL
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    const previewUrl = URL.createObjectURL(file);
    objectUrlRef.current = previewUrl;

    // Show preview immediately
    setUploadedImage(previewUrl);
    setUploadingImg(true);

    const fd = new FormData();
    fd.append("profile_image", file);

    try {
      try {
        await uploadImage(fd);
      } catch {
        await uploadImage(fd, token);
      }

      // Re-fetch fresh data from server
      await fetchServerProfile();

      toast.success("Profile picture uploaded!");
    } catch (err) {
      toast.error("Upload failed – please try again.");
      // Revert to server state on failure
      await fetchServerProfile();
    } finally {
      setUploadingImg(false);
      // Clean up object URL after short delay
      if (objectUrlRef.current) {
        setTimeout(() => URL.revokeObjectURL(objectUrlRef.current), 1000);
        objectUrlRef.current = null;
      }
    }
  };

  const handleSave = async () => {
    if (!token) {
      toast.error("Authentication missing.");
      return;
    }

    try {
      setLoading(true);
      const fd = new FormData();
      fd.append("first_name", formData.first_name.trim());
      fd.append("last_name", formData.last_name.trim());
      fd.append("phone", formData.phone.trim());

      try {
        await uploadImage(fd);
      } catch {
        await uploadImage(fd, token);
      }

      const updated = { ...formData };
      setUserInfo(updated);
      localStorage.setItem("profileData", JSON.stringify(updated));
      localStorage.setItem("fullName", `${updated.first_name} ${updated.last_name}`.trim());

      window.dispatchEvent(new Event("profile-updated"));
      toast.success("Profile updated successfully!");
      setIsModalOpen(false);
    } catch (e) {
      toast.error("Failed to save changes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Toaster richColors position="top-right" />

      {/* Profile Image Section */}
      <div className="bg-white mb-4">
        <div className="flex justify-between items-center border-b p-2 font-semibold md:px-12">
          <p>Profile Image</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 border p-1 rounded-[8px] cursor-pointer text-[#027840]"
          >
            {uploadedImage ? (
              <>
                <Pencil size={10} />
                <span>Edit</span>
              </>
            ) : (
              <>
                <Upload size={10} />
                <span>Upload</span>
              </>
            )}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        <div className="flex items-center py-3 md:px-12">
          {uploadingImg ? (
            <div className="w-[5rem] h-[5rem] rounded-full bg-gradient-to-br from-[#027840] to-[#025c33] p-[3px]">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-9 h-9 border-4 border-t-[#027840] border-r-transparent border-b-[#027840] border-l-transparent rounded-full"
                />
              </div>
            </div>
          ) : uploadedImage ? (
            <img
              src={uploadedImage}
              alt="Profile"
              className="rounded-full border-2 w-[5rem] h-[5rem] object-cover"
            />
          ) : (
            <div className="w-[5rem] h-[5rem] rounded-full bg-gray-200 border-2 border-dashed border-gray-400 flex items-center justify-center">
              <span className="text-gray-500 text-3xl">+</span>
            </div>
          )}
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white py-5">
        <div className="flex justify-between items-center border-b py-2 font-semibold md:px-12">
          <p>Personal Information</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 border p-1 rounded-[8px] cursor-pointer text-[#027840]"
          >
            <Pencil size={10} />
            <span>Edit</span>
          </button>
        </div>

        {userInfo ? (
          <div className="py-3 md:px-12">
            <div className="grid grid-cols-3 gap-4 mt-7">
              <div>
                <p className="text-gray-500 text-sm">First Name</p>
                <p className="font-semibold">{userInfo.first_name || "-"}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Last Name</p>
                <p className="font-semibold">{userInfo.last_name || "-"}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Phone number</p>
                <p className="font-semibold">{userInfo.phone || "-"}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 px-12">Loading profile information...</p>
        )}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <motion.div
              initial={{ y: "100vh", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100vh", opacity: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 15 }}
              className="bg-white w-full max-w-md rounded-2xl p-6 shadow-lg"
            >
              <h2 className="text-lg font-semibold mb-4">Edit Personal Information</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-500">First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="w-full border p-2 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-500">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="w-full border p-2 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-500">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1234567890"
                    className="w-full border p-2 rounded-md"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-4 py-2 bg-[#027840] text-white rounded-lg disabled:opacity-70"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EditProfile;