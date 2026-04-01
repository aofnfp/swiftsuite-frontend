import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdSearch } from "react-icons/md";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import TeamMemberDrawer from "./TeamMemberDrawer";
import { ThreeDots } from "react-loader-spinner";

const TeamsManage = () => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [permission, setPermission] = useState("")

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://service.swiftsuite.app/accounts/subaccounts/",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMembers(res.data?.results || []);
      console.log(res);
      if (res.data?.count === 0) {
        setPermission("No members found")
      }
      
    } catch (error) {
      console.error("Error fetching team members:", error);
      if (error.response.status === 403 && error.response.data.detail === "You don't have view permission."){
        setPermission("You don't have view permission.")
      }else {
         setPermission("No members found")
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const handleMemberUpdate = (updatedMember) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === updatedMember.id ? updatedMember : m))
    );
  };

  const handleMemberDelete = (id) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    setSelectedMember(null);
  };

  const filteredMembers = members.filter((m) => {
    const name = `${m.last_name} ${m.first_name}`.toLowerCase();
    return (
      name.includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="mx-auto mt-[3rem]">
      <div className="bg-white px-4 py-2 mb-4">
        <h1 className="font-semibold text-2xl mb-2">Your Team</h1>
        <p className="md:w-2/3 text-[#00000099] text-[18px]">
          These are your team members who have accepted your invite to join your
          team on Swift Suite.
        </p>
      </div>

    
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search for team member"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-md pl-4 pr-10 py-2 text-gray-700 outline-none placeholder:text-green-700 placeholder:text-sm placeholder:opacity-60"
          />
          <MdSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl" />
        </div>
      </div>

    
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <ThreeDots height="40" width="40" color="#027840" />
        </div>
      ) : filteredMembers.length === 0 ? (
        <p className="text-gray-500 text-center py-6">{permission}</p>
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


                <div className="flex items-center gap-2">
                  {!member.is_active && (
                    <div className="bg-[#00000033] text-xs font-semibold px-2 py-[2px] border rounded shadow-sm whitespace-nowrap">
                      Suspended
                    </div>
                  )}

              
                  <button
                    onClick={() => setSelectedMember(member)}
                    className="transition opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
                  >
                    <HiOutlineDotsHorizontal className="text-2xl text-gray-600 hover:text-black" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    
      <TeamMemberDrawer
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
        onUpdate={handleMemberUpdate}
        onDelete={handleMemberDelete}
      />
    </div>
  );
};

export default TeamsManage;
