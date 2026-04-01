import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdOutlineKey } from "react-icons/md";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "sonner";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { MdClose } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import SuspendMemberModal from "./SuspendMemberModal";
import UnsuspendMemberModal from "./UnsuspendMemberModal";
import DeleteMemberModal from "./DeleteMemberModal";

const TeamMemberDrawer = ({ member, onClose, onUpdate, onDelete }) => {
  const token = localStorage.getItem("token");
  const [openSection, setOpenSection] = useState(null);
  const [permissions, setPermissions] = useState({});
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showUnsuspendModal, setShowUnsuspendModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (member?.permissions) {
      const mapped = member.permissions.reduce((acc, p) => {
        const key = p.module_name?.toLowerCase() || `module-${p.module}`;
        acc[key] = {
          module: p.module,
          view: !!p.can_view,
          edit: !!p.can_edit,
          delete: !!p.can_delete,
        };
        return acc;
      }, {});
      setPermissions(mapped);

      setFormData({
        first_name: member.first_name || "",
        last_name: member.last_name || "",
        phone: member.phone || "",
        email: member.email || "",
      });
    } else {
      setPermissions({});
      setFormData({
        first_name: member?.first_name || "",
        last_name: member?.last_name || "",
        phone: member?.phone || "",
        email: member?.email || "",
      });
    }
  }, [member]);

  if (!member) return null;

  const toggleSection = (section) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  const handlePermissionChange = (section, type) => {
    setPermissions((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [type]: !prev[section]?.[type],
      },
    }));
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveChanges = async () => {
    try {
      setLoading(true);
      if (!token) {
        toast.error("No token found. Please log in again.");
        setLoading(false);
        return;
      }

      const permissionsArray = Object.values(permissions).map((p) => ({
        module: p.module,
        can_view: p.view,
        can_edit: p.edit,
        can_delete: p.delete,
      }));

      const res = await axios.put(
        `https://service.swiftsuite.app/accounts/subaccounts/${member.id}/`,
        {
          ...formData,
          permissions: permissionsArray,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Member details updated successfully.");
      setEditing(false);
      if (onUpdate) onUpdate(res.data);
    } catch (error) {
      console.error("Failed to update member:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to update member. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchMemberById = async (id) => {
    try {
      const res = await axios.get(
        `https://service.swiftsuite.app/accounts/subaccounts/${id}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    } catch (err) {
      console.error("Failed to fetch member:", err);
      return null;
    }
  };

  const handleSuspendSuccess = async () => {
    const updated = await fetchMemberById(member.id);
    if (updated && onUpdate) onUpdate(updated);
    setShowSuspendModal(false);
  };

  const handleUnsuspendSuccess = async () => {
    const updated = await fetchMemberById(member.id);
    if (updated && onUpdate) onUpdate(updated);
    setShowUnsuspendModal(false);
  };

  const permissionSections = Object.keys(permissions);
  const fullName = `${member.last_name} ${member.first_name}`;

  const toTitleCase = (str) =>
    str
      ? str
          .split(" ")
          .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : w))
          .join(" ")
      : "";

  const isSuspended = (() => {
    if (typeof member.is_suspended !== "undefined") return member.is_suspended;
    if (typeof member.is_active !== "undefined") return !member.is_active;
    return false;
  })();

  const actionText = isSuspended ? "Unsuspend Member" : "Suspend Member";
  const actionColor = isSuspended ? "text-[#027840]" : "text-[#00000099]";

  return (
    <AnimatePresence>
      <Toaster position="top-right" />
      <motion.div
        className="fixed inset-0 bg-black/50 z-[40]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <motion.div
        className="fixed right-0 top-0 h-full w-full sm:w-[400px] bg-white shadow-lg z-50 overflow-y-auto"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "tween" }}
      >
        <div className="flex justify-between items-center p-4 border-b text-[15px]">
          <button onClick={onClose}>
            <MdClose size={22} className="md:hidden block" />
          </button>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1 text-[#027840] border border-[#027840] py-1 px-2 rounded-[5px]"
            >
              <FiEdit size={18} /> Edit
            </button>
          ) : (
            <button
              onClick={handleSaveChanges}
              disabled={loading}
              className="px-3 py-1 bg-[#027840] text-white rounded-lg flex gap-2 items-center hover:bg-green-700 transition disabled:opacity-50"
            >
              <FiEdit size={18} />
              {loading ? "Saving..." : "Save Changes"}
            </button>
          )}
        </div>

        <div className="flex justify-between items-center p-4">
          <h3 className="text-[18px] font-bold">Member Details</h3>
          {member.profile_image ? (
            <img
              src={member.profile_image}
              alt={fullName}
              className="border rounded-full h-[2.5rem] w-[2.5rem] object-cover"
            />
          ) : (
            <div className="border rounded-full h-[2.5rem] w-[2.5rem] flex items-center justify-center bg-gray-300 font-bold">
              {member.first_name?.[0] || ""}
              {member.last_name?.[0] || ""}
            </div>
          )}
        </div>

        <div className="p-4 space-y-4">
          <div>
            <p className="text-sm font-semibold text-[#027840]">First Name</p>
            {editing ? (
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                className="border border-[#02784033] rounded-[5px] px-1 py-2 focus:outline-none w-1/2 text-[15px]"
              />
            ) : (
              <p className="text-[15px] font-medium">{formData.first_name}</p>
            )}
          </div>

          <div>
            <p className="text-sm font-semibold text-[#027840]">Last Name</p>
            {editing ? (
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                className="border border-[#02784033] rounded-[5px] px-1 py-2 focus:outline-none w-1/2 text-[15px]"
              />
            ) : (
              <p className="text-[15px] font-medium">{formData.last_name}</p>
            )}
          </div>

          <div>
            <p className="text-sm font-semibold text-[#027840]">Email</p>
            <p className="text-[15px] font-medium text-gray-700">
              {formData.email || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-[#027840]">Phone</p>
            {editing ? (
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="border border-[#02784033] rounded-[5px] px-1 py-2 focus:outline-none w-1/2 text-[15px]"
              />
            ) : (
              <p className="text-[15px] font-medium">
                {formData.phone || "N/A"}
              </p>
            )}
          </div>
        </div>

        <div className="p-4">
          <div className="flex justify-between items-center">
            <p className="font-bold text-[18px]">Access Permissions</p>
            <MdOutlineKey />
          </div>
          <p className="text-sm text-[#027840] font-semibold mb-2">
            Current access permissions for this member
          </p>

          <div className="space-y-2">
            {permissionSections.map((key, index) => (
              <div key={`${key}-${index}`}>
                <button
                  onClick={() => toggleSection(key)}
                  className="w-full flex justify-between text-[15px] text-[#027840] items-center py-2 font-medium text-left"
                >
                  {toTitleCase(key)}
                  {openSection === key ? (
                    <IoChevronUp size={15} />
                  ) : (
                    <IoChevronDown size={15} />
                  )}
                </button>

                {openSection === key && (
                  <div className="pb-3 space-y-4">
                    {["edit", "delete", "view"].map((type, idx) => {
                      const labelText =
                        type === "view" ? "View only" : `Can ${type}`;
                      return (
                        <label
                          key={`${key}-${type}-${idx}`}
                          className="flex items-center justify-between text-[13px]"
                        >
                          <span>{labelText}</span>
                          <input
                            type="checkbox"
                            disabled={!editing}
                            checked={!!permissions[key]?.[type]}
                            onChange={() => handlePermissionChange(key, type)}
                            className="peer w-4 h-4 rounded-[3px] border border-[#027840] bg-white cursor-pointer transition-all duration-200 appearance-none checked:bg-[#027840] checked:border-green-500 focus:ring-2 focus:ring-green-300 focus:ring-offset-1"
                          />
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="border-t p-4">
          <div className="block w-full text-left py-3 flex justify-between hover:bg-gray-100">
            <p className="font-bold text-[#000000CC] text-[18px]">
              Manage member
            </p>
            <ManageAccountsIcon fontSize="medium" />
          </div>

          <button
            onClick={() =>
              isSuspended ? setShowUnsuspendModal(true) : setShowSuspendModal(true)
            }
            className={`block w-full text-left text-[15px] flex items-center gap-2 py-3 hover:bg-gray-100 ${actionColor}`}
          >
            <ManageAccountsIcon size={18} />
            {actionText}
          </button>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="block w-full text-left text-[15px] flex items-center gap-3 py-3 text-[#BB8232CC] hover:bg-gray-100"
          >
            <RiDeleteBin6Fill size={18} />
            Delete Member
          </button>
        </div>

        <SuspendMemberModal
          isOpen={showSuspendModal}
          onClose={() => setShowSuspendModal(false)}
          memberName={fullName}
          memberId={member.id}
          onSuspendSuccess={handleSuspendSuccess}
        />

        <UnsuspendMemberModal
          isOpen={showUnsuspendModal}
          onClose={() => setShowUnsuspendModal(false)}
          memberName={fullName}
          memberId={member.id}
          onUnsuspendSuccess={handleUnsuspendSuccess}
        />

        <DeleteMemberModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          memberName={fullName}
          memberId={member.id}
          onDeleteSuccess={() => onDelete && onDelete(member.id)}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default TeamMemberDrawer;
