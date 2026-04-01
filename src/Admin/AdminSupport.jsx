import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  MdMoreHoriz,
  MdOutlineAccessTime,
  MdTrendingUp,
  MdConfirmationNumber,
  MdPersonOutline,
  MdOutlineReportProblem,
  MdVisibility,
  MdCheckCircleOutline,
  MdFlag,
  MdDeleteOutline,
  MdHourglassEmpty,
  MdCheckCircle,
} from "react-icons/md";
import SupportModal from "./SupportModal";
import SupportDrawer from "./SupportDrawer";

const AdminSupport = () => {
  const [tickets, setTickets] = useState([
    {
      id: "#23ADFGG",
      complainant: "Adeniyi Ibrahim",
      timestamp: "2026-01-18T10:14:00.000Z",
      type: "Billing",
      status: "pending",
      message:
        "Hi, I was charged twice for my subscription this month. Please help me reverse one charge.",
      avatar:
        "https://api.dicebear.com/7.x/initials/svg?seed=Adeniyi%20Ibrahim",
      evidence: [
        {
          kind: "image",
          name: "payment-screenshot.png",
          url: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=60",
        },
      ],
    },
    {
      id: "#91KLMQZ",
      complainant: "Sarah Johnson",
      timestamp: "2026-01-18T14:02:00.000Z",
      type: "Account",
      status: "closed",
      message: "I can’t update my profile info. It keeps reverting after saving.",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Sarah%20Johnson",
      evidence: [{ kind: "file", name: "screen-recording.mp4", url: "#" }],
    },
    {
      id: "#77PPX9A",
      complainant: "Michael Chen",
      timestamp: "2026-01-17T09:40:00.000Z",
      type: "Bug",
      status: "flagged",
      message:
        "Dashboard crashes when I click 'Export'. I’ve tried multiple browsers.",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Michael%20Chen",
      evidence: [],
    },
    {
      id: "#10TRS8C",
      complainant: "Chioma Okafor",
      timestamp: "2026-01-17T16:25:00.000Z",
      type: "Marketplace",
      status: "pending",
      message:
        "My marketplace listings are not syncing. Items show 'queued' forever.",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Chioma%20Okafor",
      evidence: [
        {
          kind: "image",
          name: "sync-issue.png",
          url: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=1200&q=60",
        },
      ],
    },
    {
      id: "#42HNE2J",
      complainant: "David Williams",
      timestamp: "2026-01-16T11:05:00.000Z",
      type: "Subscription",
      status: "closed",
      message:
        "Please cancel my subscription and confirm if I’ll be billed again.",
      avatar:
        "https://api.dicebear.com/7.x/initials/svg?seed=David%20Williams",
      evidence: [],
    },
    {
      id: "#66QWERTY",
      complainant: "Fatima Bello",
      timestamp: "2026-01-16T18:30:00.000Z",
      type: "Login",
      status: "pending",
      message: "I keep getting logged out immediately after signing in. Any fix?",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Fatima%20Bello",
      evidence: [],
    },
    {
      id: "#58ZXC12",
      complainant: "Grace Kim",
      timestamp: "2026-01-15T08:12:00.000Z",
      type: "Billing",
      status: "flagged",
      message:
        "Invoice shows wrong VAT amount compared to what was displayed at checkout.",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Grace%20Kim",
      evidence: [{ kind: "file", name: "invoice.pdf", url: "#" }],
    },
    {
      id: "#02MNVB7",
      complainant: "Ifeanyi Umeh",
      timestamp: "2026-01-15T13:55:00.000Z",
      type: "Account",
      status: "closed",
      message:
        "I changed my email but didn’t receive any confirmation mail at all.",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Ifeanyi%20Umeh",
      evidence: [],
    },
    {
      id: "#39PLM0K",
      complainant: "Aisha Abdullahi",
      timestamp: "2026-01-14T12:45:00.000Z",
      type: "Bug",
      status: "pending",
      message:
        "Mobile view overlaps the navbar and I can’t click the menu button.",
      avatar:
        "https://api.dicebear.com/7.x/initials/svg?seed=Aisha%20Abdullahi",
      evidence: [],
    },
    {
      id: "#88HJK2L",
      complainant: "Emeka Nwosu",
      timestamp: "2026-01-14T19:20:00.000Z",
      type: "Other",
      status: "closed",
      message:
        "Just a suggestion: please add dark mode, it would really help at night.",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Emeka%20Nwosu",
      evidence: [],
    },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [openMenu, setOpenMenu] = useState({ id: null, x: 0, y: 0 });
  const menuRef = useRef(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerTicketId, setDrawerTicketId] = useState(null);

  const selectedTicket = useMemo(() => {
    if (!selectedTicketId) return null;
    return tickets.find((t) => t.id === selectedTicketId) || null;
  }, [selectedTicketId, tickets]);

  const drawerTicket = useMemo(() => {
    if (!drawerTicketId) return null;
    return tickets.find((t) => t.id === drawerTicketId) || null;
  }, [drawerTicketId, tickets]);

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTicketId(null);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setDrawerTicketId(null);
  };

  const openDrawerForTicket = (ticket) => {
    if (!ticket?.id) return;
    setDrawerTicketId(ticket.id);
    setIsDrawerOpen(true);
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
      if (e.key === "Escape") {
        setOpenMenu({ id: null, x: 0, y: 0 });
        closeModal();
        closeDrawer();
      }
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

  const stats = useMemo(() => {
    const total = tickets.length;
    const pending = tickets.filter((t) => t.status === "pending").length;
    const resolved = tickets.filter((t) => t.status === "closed").length;
    return { total, pending, resolved };
  }, [tickets]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(tickets.length / itemsPerPage)),
    [tickets.length]
  );

  useEffect(() => {
    setCurrentPage((p) => Math.min(Math.max(1, p), totalPages));
  }, [totalPages]);

  const paginatedTickets = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return tickets.slice(start, end);
  }, [tickets, currentPage]);

  const openActionMenu = (e, ticket) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const menuWidth = 160;

    const isClosed = ticket.status === "closed";
    const itemsCount = isClosed ? 2 : 4;
    const itemHeight = 40;
    const menuHeight = itemsCount * itemHeight;

    const padding = 8;

    let x = rect.left + padding;
    x = Math.max(8, Math.min(x, window.innerWidth - menuWidth - 8));

    let y = rect.bottom + padding;
    if (window.innerHeight - rect.bottom < menuHeight + 16) {
      y = rect.top - menuHeight - padding;
    }

    setOpenMenu({ id: ticket.id, x, y });
  };

  const handleViewDetails = (ticketId) => {
    setSelectedTicketId(ticketId);
    setIsModalOpen(true);
    setOpenMenu({ id: null, x: 0, y: 0 });
  };

  const handleResolve = (ticketId) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: "closed" } : t))
    );
    setOpenMenu({ id: null, x: 0, y: 0 });
  };

  const handleFlag = (ticketId) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: "flagged" } : t))
    );
    setOpenMenu({ id: null, x: 0, y: 0 });
  };

  const handleDelete = (ticketId) => {
    setTickets((prev) => prev.filter((t) => t.id !== ticketId));
    setOpenMenu({ id: null, x: 0, y: 0 });
    if (selectedTicketId === ticketId) closeModal();
    if (drawerTicketId === ticketId) closeDrawer();
  };

  const formatTimestamp = (iso) => {
    const d = new Date(iso);
    return `${d.toLocaleDateString()} • ${d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  const statusMeta = (status) => {
    const base =
      "inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold w-fit capitalize";
    if (status === "pending")
      return { cls: `${base} text-yellow-700`, Icon: MdHourglassEmpty };
    if (status === "closed")
      return { cls: `${base} text-emerald-700`, Icon: MdCheckCircle };
    if (status === "flagged")
      return { cls: `${base} text-red-700`, Icon: MdFlag };
    return { cls: `${base} text-gray-700`, Icon: null };
  };

  const StatusCell = ({ status }) => {
    const { cls, Icon } = statusMeta(status);
    return (
      <span className={cls}>
        {Icon ? <Icon className="text-base" /> : null}
        <span>{status}</span>
      </span>
    );
  };

  return (
    <div className="w-full px-6 py-6">
      <div className="mt-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border border-[#02784033] rounded-lg p-6 bg-white">
            <div className="flex items-center justify-between">
              <h2 className="text-gray-500 font-medium">
                Total support ticket opened
              </h2>
              <MdConfirmationNumber className="text-[#027840] text-2xl" />
            </div>
            <p className="text-2xl font-bold mt-2">{stats.total}</p>
            <p className="mt-4 text-sm text-[#027840] flex items-center gap-1">
              <MdTrendingUp className="text-lg" /> 2% increase from last month
            </p>
          </div>

          <div className="border border-[#02784033] rounded-lg p-6 bg-white">
            <div className="flex items-center justify-between">
              <h2 className="text-gray-500 font-medium">Pending tickets</h2>
              <MdOutlineReportProblem className="text-[#027840] text-2xl" />
            </div>
            <p className="text-2xl font-bold mt-2">{stats.pending}</p>
            <p className="mt-4 text-sm text-[#027840] flex items-center gap-1">
              <MdTrendingUp className="text-lg" /> 2% increase from last month
            </p>
          </div>

          <div className="border border-[#02784033] rounded-lg p-6 bg-white">
            <div className="flex items-center justify-between">
              <h2 className="text-gray-500 font-medium">Resolved ticket</h2>
              <MdPersonOutline className="text-[#027840] text-2xl" />
            </div>
            <p className="text-2xl font-bold mt-2">{stats.resolved}</p>
            <p className="mt-4 text-sm text-[#027840] flex items-center gap-1">
              <MdTrendingUp className="text-lg" /> 2% increase from last month
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-[13px] overflow-hidden border border-gray-300 table-fixed">
            <thead className="bg-[#027840] text-white">
              <tr>
                <th className="px-4 py-2 text-left">Ticket ID</th>
                <th className="px-4 py-2 text-left">Complainant</th>
                <th className="px-4 py-2 text-left">Time stamp</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedTickets.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="border-b px-4 py-2 font-semibold">{t.id}</td>
                  <td className="border-b px-4 py-2">{t.complainant}</td>

                  <td className="border-b px-4 py-2">
                    <div className="flex items-center gap-2 text-gray-700">
                      <MdOutlineAccessTime className="text-lg text-gray-500" />
                      <span>{formatTimestamp(t.timestamp)}</span>
                    </div>
                  </td>

                  <td className="border-b px-4 py-2">{t.type}</td>

                  <td className="border-b px-4 py-2">
                    <StatusCell status={t.status} />
                  </td>

                  <td className="border-b px-4 py-2">
                    <button
                      className="text-xl text-gray-600 hover:text-gray-900 transition p-1 rounded-md hover:bg-gray-100"
                      onClick={(e) => openActionMenu(e, t)}
                    >
                      <MdMoreHoriz />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
      </div>

      {openMenu.id && (
        <div
          ref={menuRef}
          style={{ position: "fixed", left: openMenu.x, top: openMenu.y }}
          className="w-[150px] bg-white border rounded-lg shadow-xl z-50 overflow-hidden"
        >
          {(() => {
            const ticket = tickets.find((t) => t.id === openMenu.id);
            const isClosed = ticket?.status === "closed";

            const Item = ({ icon: Icon, label, onClick, danger }) => (
              <button
                onClick={onClick}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition font-medium flex items-center gap-2 ${
                  danger ? "text-red-600" : "text-gray-800"
                }`}
              >
                <Icon className="text-lg" />
                {label}
              </button>
            );

            return (
              <>
                <Item
                  icon={MdVisibility}
                  label="View Details"
                  onClick={() => handleViewDetails(openMenu.id)}
                />

                {!isClosed && (
                  <>
                    <Item
                      icon={MdCheckCircleOutline}
                      label="Resolve"
                      onClick={() => handleResolve(openMenu.id)}
                    />
                    <Item
                      icon={MdFlag}
                      label="Flag"
                      onClick={() => handleFlag(openMenu.id)}
                    />
                  </>
                )}

                <Item
                  icon={MdDeleteOutline}
                  label="Delete"
                  danger
                  onClick={() => handleDelete(openMenu.id)}
                />
              </>
            );
          })()}
        </div>
      )}

      <SupportModal
        isOpen={isModalOpen}
        ticket={selectedTicket}
        onClose={closeModal}
        onOpenChats={(t) => {
          closeModal();
          openDrawerForTicket(t);
        }}
      />

      <SupportDrawer
        isOpen={isDrawerOpen}
        ticket={drawerTicket}
        onClose={closeDrawer}
      />
    </div>
  );
};

export default AdminSupport;
