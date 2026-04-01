import React, { useEffect, useMemo, useRef, useState } from "react";
import { MdMoreHoriz, MdNotificationsNone } from "react-icons/md";
import axios from "axios";
import NotificationDrawer from "./NotificationDrawer";

const AdminNotification = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingNotification, setEditingNotification] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [openMenu, setOpenMenu] = useState({ id: null, x: 0, y: 0 });
  const menuRef = useRef(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          "https://service.swiftsuite.app/api/v2/templates/",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setNotifications(data?.results || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const openDrawer = (notification = null) => {
    setEditingNotification(notification);
    setDrawerOpen(true);
    setOpenMenu({ id: null, x: 0, y: 0 });
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditingNotification(null);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://service.swiftsuite.app/api/v2/templates/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setOpenMenu({ id: null, x: 0, y: 0 });
    }
  };

  const handleNotificationSaved = (savedNotification, isEdit) => {
    setNotifications((prev) => {
      if (isEdit) {
        return prev.map((n) =>
          n.id === savedNotification.id ? savedNotification : n
        );
      }
      return [savedNotification, ...prev];
    });

    setCurrentPage(1);
    closeDrawer();
  };

  useEffect(() => {
    const onDown = (e) => {
      if (
        openMenu.id &&
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setOpenMenu({ id: null, x: 0, y: 0 });
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpenMenu({ id: null, x: 0, y: 0 });
    };
    const onScroll = () => {
      if (openMenu.id) setOpenMenu({ id: null, x: 0, y: 0 });
    };

    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, true);

    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [openMenu.id]);

  const toLabel = (s) =>
    String(s || "")
      .replaceAll("_", " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

  const resolveTypesStack = (n) => {
    const types = Array.isArray(n?.types)
      ? n.types.map((t) => String(t).toLowerCase())
      : [];

    const hasInApp =
      types.includes("in_app") ||
      types.includes("in-app") ||
      types.includes("app");
    const hasEmail = types.includes("email");

    const out = [];
    if (hasInApp) out.push("In-App");
    if (hasEmail) out.push("Email");
    return out.length ? out : ["—"];
  };

  const resolveRecipientsStack = (n) => {
    const r = Array.isArray(n?.recipients) ? n.recipients : [];
    return r.length ? r.map(toLabel) : ["—"];
  };

  
  const resolveTiming = (n) => {
    const hasRecurring =
      n?.recurring_start ||
      n?.recurring_end ||
      n?.recurring_frequency ||
      n?.recurring_interval;

    if (hasRecurring) return "Recurring";

    if (n?.date || n?.time) {
      const d = n?.date ? new Date(n.date).toLocaleDateString() : "";
      const t = n?.time ? String(n.time) : "";
      return [d, t].filter(Boolean).join(" ");
    }

    return n?.trigger_type ? toLabel(n.trigger_type) : "—";
  };

  const openActionMenu = (e, n) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const menuWidth = 192;
    const menuHeight = 96;
    const padding = 8;

    let y = rect.bottom + padding;
    if (window.innerHeight - rect.bottom < menuHeight + 16) {
      y = rect.top - menuHeight - padding;
    }

    let x = rect.right - menuWidth;
    x = Math.max(8, Math.min(x, window.innerWidth - menuWidth - 8));

    setOpenMenu({ id: n.id, x, y });
  };

  const totals = useMemo(() => {
    let email = 0;
    let inApp = 0;

    notifications.forEach((n) => {
      const types = Array.isArray(n?.types)
        ? n.types.map((t) => String(t).toLowerCase())
        : [];
      const hasInApp =
        types.includes("in_app") ||
        types.includes("in-app") ||
        types.includes("app");
      const hasEmail = types.includes("email");

      if (hasEmail) email += 1;
      if (hasInApp) inApp += 1;
    });

    return { total: notifications.length, email, inApp };
  }, [notifications]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(notifications.length / itemsPerPage)),
    [notifications.length]
  );

  useEffect(() => {
    setCurrentPage((p) => Math.min(Math.max(1, p), totalPages));
  }, [totalPages]);

  const paginatedNotifications = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return notifications.slice(start, end);
  }, [notifications, currentPage]);

  return (
    <div className="w-full px-6 py-6">
      <div className="mt-8 space-y-6">
        <div className=" lg:w-1/3 md:w-2/3 w-full">
          <div className="border border-[#02784033] rounded-lg p-6 bg-white flex flex-col">
            <div className="flex items-start gap-3 text-[#027840]">
              <div className="w-10 h-10 rounded-full/10 flex items-center justify-center">
                <MdNotificationsNone className=" text-2xl" />
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">
                  Create Notification
                </h3>
                <p className="my-3 text-sm text-gray-600">
                  Use custom notification settings to send messages to users.
                </p>
              </div>
            </div>

            <button
              onClick={() => openDrawer(null)}
              className="mt-auto px-4 py-3 rounded-lg bg-[#027840] text-white font-medium hover:opacity-90 w-fit"
            >
              Create new
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border border-[#02784033] rounded-lg p-6 bg-white">
            <h2 className=" font-medium mb-5 text-[#027840]">
              Total Notification created
            </h2>
            <p className="text-2xl font-bold">{totals.total}</p>
          </div>

          <div className="border border-[#02784033] rounded-lg p-6 bg-white">
            <h2 className=" font-medium mb-5 text-[#027840]">Email Notification</h2>
            <p className="text-2xl font-bold">{totals.email}</p>
          </div>

          <div className="border border-[#02784033] rounded-lg p-6 bg-white">
            <h2 className=" font-medium mb-5 text-[#027840]">In-App notification</h2>
            <p className="text-2xl font-bold">{totals.inApp}</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-[13px] overflow-hidden border border-gray-300 table-fixed">
            <thead className="bg-[#027840] text-white">
              <tr>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Date Created</th>
                <th className="px-4 py-2 text-left">Last Sent</th>
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-left">Receipient</th>
                <th className="px-4 py-2 text-left">Timing</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading &&
                Array.from({ length: itemsPerPage }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 7 }).map((__, j) => (
                      <td key={j} className="border-b px-4 py-4 bg-gray-200" />
                    ))}
                  </tr>
                ))}

              {!loading &&
                paginatedNotifications.map((n) => (
                  <tr key={n.id} className="hover:bg-gray-50">
                    <td className="border-b px-4 py-2 align-top">
                      <div className="flex flex-col gap-1">
                        {resolveTypesStack(n).map((t) => (
                          <span key={t}>{t}</span>
                        ))}
                      </div>
                    </td>

                    <td className="border-b px-4 py-2 align-top">
                      {n.created_at
                        ? new Date(n.created_at).toLocaleDateString()
                        : "—"}
                    </td>

                    <td className="border-b px-4 py-2 align-top">
                      {n.last_sent_at
                        ? new Date(n.last_sent_at).toLocaleDateString()
                        : "—"}
                    </td>

                    <td className="border-b px-4 py-2 align-top">
                      {n.category || "—"}
                    </td>

                    <td className="border-b px-4 py-2 align-top">
                      <div className="flex flex-col gap-1">
                        {resolveRecipientsStack(n).map((r) => (
                          <span key={r}>{r}</span>
                        ))}
                      </div>
                    </td>

                    <td className="border-b px-4 py-2 align-top">
                      {resolveTiming(n)}
                    </td>

                    <td className="border-b px-4 py-2 align-top">
                      <button
                        className="text-xl text-gray-600 hover:text-gray-900 transition p-1 rounded-md hover:bg-gray-100"
                        onClick={(e) => openActionMenu(e, n)}
                      >
                        <MdMoreHoriz />
                      </button>
                    </td>
                  </tr>
                ))}

              {!loading && paginatedNotifications.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-500">
                    No notifications found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {!loading && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <div className="bg-white p-2 rounded-xl">
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
        </div>
        )}
      </div>

      {openMenu.id && (
        <div
          ref={menuRef}
          style={{ position: "fixed", left: openMenu.x, top: openMenu.y }}
          className="w-48 bg-white border rounded-lg shadow-xl z-50 overflow-hidden"
        >
          <button
            onClick={() => {
              const notif = notifications.find((x) => x.id === openMenu.id);
              openDrawer(notif || null);
              setOpenMenu({ id: null, x: 0, y: 0 });
            }}
            className="w-full text-left px-5 py-3 text-sm hover:bg-gray-100 transition font-medium"
          >
            Edit
          </button>

          <button
            onClick={() => handleDelete(openMenu.id)}
            className="w-full text-left px-5 py-3 text-sm hover:bg-gray-100 transition font-medium text-red-600"
          >
            Delete
          </button>
        </div>
      )}

      <NotificationDrawer
        isOpen={drawerOpen}
        onClose={closeDrawer}
        notification={editingNotification}
        onSaved={handleNotificationSaved}
      />
      </div>
  );
};

export default AdminNotification;
