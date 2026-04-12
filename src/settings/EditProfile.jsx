import React, { useEffect, useState, useRef, useCallback } from "react";
import { Pencil, Upload } from "lucide-react";
import { getImage, uploadImage } from "../api/authApi";
import { Toaster, toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const EditProfile = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
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

  const SERVER_IMG_KEY = "profileImage";
  const VERSION_KEY = "profileImageVersion";

  useEffect(() => {
    const serverImage = localStorage.getItem(SERVER_IMG_KEY);
    if (serverImage) {
      setUploadedImage(serverImage);
    }
  }, []);

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

        if (res.profile_image) {
          const version = Date.now().toString();
          localStorage.setItem(SERVER_IMG_KEY, res.profile_image);
          localStorage.setItem(VERSION_KEY, version);
          setUploadedImage(res.profile_image);

          window.dispatchEvent(
            new CustomEvent("profile-updated", {
              detail: { image: res.profile_image, version },
            })
          );
        } else {
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

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    const previewUrl = URL.createObjectURL(file);
    objectUrlRef.current = previewUrl;

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

      await fetchServerProfile();
      toast.success("Profile picture uploaded!");
    } catch (err) {
      toast.error("Upload failed – please try again.");
      await fetchServerProfile();
    } finally {
      setUploadingImg(false);
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
    <div className="w-full">
      <Toaster richColors position="top-right" />

      <div className="mb-4 overflow-hidden rounded-xl bg-white">
        <div className="flex flex-col gap-3 border-b px-4 py-3 text-sm font-semibold sm:flex-row sm:items-center sm:justify-between sm:px-6 md:px-8 lg:px-12">
          <p>Profile Image</p>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full items-center justify-center gap-2 rounded-[8px] border px-3 py-2 text-sm text-[#027840] sm:w-auto sm:justify-start"
          >
            {uploadedImage ? (
              <>
                <Pencil size={14} />
                <span>Edit</span>
              </>
            ) : (
              <>
                <Upload size={14} />
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

        <div className="flex justify-center px-4 py-5 sm:justify-start sm:px-6 md:px-8 lg:px-12">
          {uploadingImg ? (
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[#027840] to-[#025c33] p-[3px] sm:h-[5rem] sm:w-[5rem]">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-white">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="h-9 w-9 rounded-full border-4 border-b-[#027840] border-l-transparent border-r-transparent border-t-[#027840]"
                />
              </div>
            </div>
          ) : uploadedImage ? (
            <img
              src={uploadedImage}
              alt="Profile"
              className="h-20 w-20 rounded-full border-2 object-cover sm:h-[5rem] sm:w-[5rem]"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-gray-400 bg-gray-200 sm:h-[5rem] sm:w-[5rem]">
              <span className="text-3xl text-gray-500">+</span>
            </div>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl bg-white py-5">
        <div className="flex flex-col gap-3 border-b px-4 py-3 text-sm font-semibold sm:flex-row sm:items-center sm:justify-between sm:px-6 md:px-8 lg:px-12">
          <p>Personal Information</p>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex w-full items-center justify-center gap-2 rounded-[8px] border px-3 py-2 text-sm text-[#027840] sm:w-auto sm:justify-start"
          >
            <Pencil size={14} />
            <span>Edit</span>
          </button>
        </div>

        {userInfo ? (
          <div className="px-4 py-5 sm:px-6 md:px-8 lg:px-12">
            <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-7 lg:grid-cols-3">
              <div className="rounded-lg bg-gray-50 p-4 sm:bg-transparent sm:p-0">
                <p className="text-sm text-gray-500">First Name</p>
                <p className="break-words font-semibold">{userInfo.first_name || "-"}</p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4 sm:bg-transparent sm:p-0">
                <p className="text-sm text-gray-500">Last Name</p>
                <p className="break-words font-semibold">{userInfo.last_name || "-"}</p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4 sm:col-span-2 sm:bg-transparent sm:p-0 lg:col-span-1">
                <p className="text-sm text-gray-500">Phone number</p>
                <p className="break-words font-semibold">{userInfo.phone || "-"}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="px-4 py-5 text-gray-500 sm:px-6 md:px-8 lg:px-12">
            Loading profile information...
          </p>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 px-3 py-3 sm:items-center sm:px-4">
            <motion.div
              initial={{ y: "100vh", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100vh", opacity: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 15 }}
              className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-4 shadow-lg sm:p-6"
            >
              <h2 className="mb-4 text-base font-semibold sm:text-lg">
                Edit Personal Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm text-gray-500">First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="w-full rounded-md border p-2 text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm text-gray-500">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="w-full rounded-md border p-2 text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm text-gray-500">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1234567890"
                    className="w-full rounded-md border p-2 text-sm sm:text-base"
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-full rounded-lg border px-4 py-2 sm:w-auto"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="w-full rounded-lg bg-[#027840] px-4 py-2 text-white disabled:opacity-70 sm:w-auto"
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