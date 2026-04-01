import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdMoreHoriz, MdClose, MdSearch } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "sonner";

const UsersAdmin = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredUserId, setHoveredUserId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const itemsPerPage = 10;

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "https://service.swiftsuite.app/accounts/manage-user/",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) =>
    `${u.first_name} ${u.last_name} ${u.email}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openDrawer = (user) => {
    setSelectedUser(user);
    setDrawerOpen(true);
    setHoveredUserId(null);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedUser(null);
  };

  const deleteUser = async () => {
    if (!selectedUser) return;

    setDeleting(true);

    try {
      await axios.delete(
        `https://service.swiftsuite.app/accounts/manage-user/${selectedUser.id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
      setShowDeleteConfirm(false);
      closeDrawer();
    } finally {
      setDeleting(false);
    }
  };

  const totalUsers = users.length;
  const totalParentAccounts = users.filter((u) => !u.parent_id).length;
  const totalSubaccounts = users.filter((u) => u.parent_id).length;

  const stats = [
    { title: "Total Users", value: totalUsers, percent: 10 },
    { title: "Total Parent Accounts", value: totalParentAccounts, percent: 5 },
    { title: "Total Subaccounts", value: totalSubaccounts, percent: 15 },
  ];

  return (
    <div className="p-6">
      <Toaster position="top-right" />

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          Users
          <span className="text-sm px-3 py-1 rounded-full bg-[#027840] text-white font-medium">
            {search.trim()
              ? `${filteredUsers.length} / ${users.length}`
              : users.length}
          </span>
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="border border-[#02784033] rounded-lg p-6 bg-white"
          >
            <h2 className="text-gray-500 font-medium">{stat.title}</h2>
            <p className="text-2xl font-bold mt-2">{stat.value}</p>
            <p className="mt-4 text-sm text-[#027840]">
              ▲ {stat.percent}% from last month
            </p>
          </div>
        ))}
      </div>

      <div className="flex justify-end mb-6">
        <div className="relative w-full sm:w-72">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
          <input
            type="text"
            placeholder="Search by name or email"
            className="w-full pl-10 pr-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-[#027840] border"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-[13px] overflow-hidden border border-gray-300 table-fixed">
          <thead className="bg-[#027840] text-white">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Phone</th>
              <th className="px-4 py-2 text-left">Profile</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading &&
              Array.from({ length: itemsPerPage }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {Array.from({ length: 5 }).map((__, j) => (
                    <td key={j} className="border-b px-4 py-4 bg-gray-200" />
                  ))}
                </tr>
              ))}

            {!loading &&
              paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="border-b px-4 py-2">
                    {user.first_name} {user.last_name}
                  </td>

                  <td className="border-b px-4 py-2">{user.email}</td>

                  <td className="border-b px-4 py-2">
                    {user.phone || "No phone"}
                  </td>

                  <td className="border-b px-4 py-2">
                    <img
                      src={
                        user.profile_image ||
                        `https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}`
                      }
                      alt="Profile"
                      className="w-12 h-12 rounded-full object-cover border"
                    />
                  </td>

                  <td className="border-b px-4 py-2">
                    <div
                      className="relative"
                      onMouseEnter={() => setHoveredUserId(user.id)}
                      onMouseLeave={() =>
                        setTimeout(() => {
                          if (hoveredUserId === user.id) {
                            setHoveredUserId(null);
                          }
                        }, 600)
                      }
                    >
                      <button className="text-xl text-gray-600 hover:text-gray-900 transition p-1">
                        <MdMoreHoriz />
                      </button>

                      <AnimatePresence>
                        {hoveredUserId === user.id && (
                          <motion.div
                            initial={{ opacity: 0, y: -8, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-xl z-50 overflow-hidden"
                          >
                            <button
                              onClick={() => openDrawer(user)}
                              className="w-full text-left px-5 py-3 text-sm hover:bg-gray-100 transition font-medium"
                            >
                              View details
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </td>
                </tr>
              ))}

            {!loading && paginatedUsers.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 border rounded-lg ${
                currentPage === i + 1
                  ? "bg-[#027840] text-white border-[#027840]"
                  : "hover:bg-gray-50"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}

      <AnimatePresence>
        {drawerOpen && selectedUser && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              onClick={closeDrawer}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className="fixed right-0 top-0 h-full w-full sm:w-[460px] bg-white z-50 p-6 overflow-y-auto shadow-2xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">User Details</h2>
                <button
                  onClick={closeDrawer}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <MdClose size={28} />
                </button>
              </div>

              <div className="flex flex-col items-center gap-6">
                <img
                  src={
                    selectedUser.profile_image ||
                    `https://ui-avatars.com/api/?name=${selectedUser.first_name}+${selectedUser.last_name}&size=128`
                  }
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-[#027840]/20 shadow-lg"
                />

                <div className="text-center">
                  <p className="font-bold text-xl">
                    {selectedUser.first_name} {selectedUser.last_name}
                  </p>

                  <p className="text-gray-600 mt-1">
                    {selectedUser.email}
                  </p>

                  <p className="text-gray-500 mt-2">
                    {selectedUser.phone || "No phone number provided"}
                  </p>
                </div>
              </div>

              <div className="mt-10 w-full">
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium"
                >
                  Delete User
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDeleteConfirm && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-[60]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteConfirm(false)}
            />

            <motion.div
              className="fixed inset-0 flex items-center justify-center z-[70] p-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="bg-white max-w-md w-full rounded-xl p-6 shadow-xl">
                <h3 className="text-xl font-semibold text-red-600 mb-3">
                  Delete User
                </h3>

                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this user? This will
                  permanently remove the account and all associated data.
                </p>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 border rounded-lg"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={deleteUser}
                    disabled={deleting}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    {deleting ? "Deleting..." : "Delete User"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UsersAdmin;