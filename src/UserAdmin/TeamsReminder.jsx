import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdSearch } from "react-icons/md";
import { ThreeDots } from "react-loader-spinner";
import { Toaster, toast } from "sonner";

const TeamsReminder = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sendingId, setSendingId] = useState(null);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://service.swiftsuite.app/accounts/subaccounts/?search=pending",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMembers(res.data?.results || []);
    } catch (error) {
      console.error("Error fetching team members:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const filteredMembers = members.filter((m) => {
    const name = `${m.last_name} ${m.first_name}`.toLowerCase();
    return (
      name.includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase())
    );
  });

  const sendReminder = async (userId) => {
    try {
      setSendingId(userId);

      const token = localStorage.getItem("token");
      const url = `https://service.swiftsuite.app/accounts/send-reminder/${userId}/`;

      await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Reminder sent successfully!");
    } catch (err) {
      console.error("Reminder error:", err);
      toast.error("Failed to send reminder.");
    } finally {
      setSendingId(null);
    }
  };

  return (
    <div className="mx-auto mt-[3rem]">
      <Toaster position="top-right" />
      <div className="bg-white px-4 py-5 mb-4">
        <h1 className="font-semibold text-2xl">Pending Team Members</h1>
        <p className="md:w-2/3 text-[#00000099] text-[18px]">
          Send reminders to your team members who have not completed verification.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <ThreeDots height="40" width="40" color="#027840" />
        </div>
      ) : filteredMembers.length === 0 ? (
        <p className="text-gray-500 text-center py-6">No pending team members found.</p>
      ) : (
        <div className="space-y-4">
          {filteredMembers.map((member) => {
            const initials = `${member.first_name?.[0] || ""}${
              member.last_name?.[0] || ""
            }`;

            return (
              <div
                key={member.id}
                className="group relative flex justify-between items-center border border-gray-200 rounded-lg p-2 bg-white hover:shadow-sm transition"
              >
                <div className="flex items-center gap-4">
                  {member.profile_image ? (
                    <img
                      src={member.profile_image}
                      alt={member.first_name}
                      className="w-10 h-10 rounded-[5px] object-cover border"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-[5px] bg-[#027840] text-white flex items-center justify-center text-xl font-bold">
                      {initials}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2 text-[17px] font-semibold">
                      {member.last_name} {member.first_name}
                    </div>
                    <div className="text-sm text-gray-600">{member.email}</div>
                  </div>
                </div>

                <button
                  onClick={() => sendReminder(member.id)}
                  disabled={sendingId === member.id}
                  className="bg-[#027840] text-white px-4 py-1.5 rounded-md text-sm transition shadow flex items-center justify-center min-w-[120px]"
                >
                  {sendingId === member.id ? (
                    <ThreeDots height="20" width="30" color="#fff" />
                  ) : (
                    "Send Reminder"
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TeamsReminder;
