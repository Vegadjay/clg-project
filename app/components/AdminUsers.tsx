import React, { useEffect, useState } from "react";

interface Users {
  id: number;
  name: string;
  email: string;
  phone: number;
  address: string;
  role: string;
  libraryCardNumber: string;
  isVerified: boolean;
  createdAt: Date;
}

export const AdminUsers = () => {
  const [users, setUsers] = useState<Users[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const resp = await fetch("/api/users");
      const result = await resp.json();
      setUsers(Array.isArray(result.users) ? result.users : []);
    } catch (e) {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const uniqueRoles = Array.from(new Set(users.map((u) => u.role))).sort();

  const filteredUsers = users.filter((user) => {
    if (roleFilter && user.role !== roleFilter) return false;

    if (search.trim() !== "") {
      const searchLower = search.toLowerCase();
      const phoneStr = String(user.phone);
      return (
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        phoneStr.includes(searchLower) ||
        user.address.toLowerCase().includes(searchLower) ||
        user.libraryCardNumber.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  return (
    <div className="py-6">
      <h2 className="text-2xl font-bold mb-4">All Users</h2>
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-2">
        <div className="flex items-center gap-2">
          <label htmlFor="role-filter" className="font-medium">
            Filter by role:
          </label>
          <select
            id="role-filter"
            className="border rounded px-2 py-1"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All</option>
            {uniqueRoles.map((role) => (
              <option key={role} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="user-search" className="font-medium">
            Search:
          </label>
          <input
            id="user-search"
            type="text"
            className="border rounded px-2 py-1"
            placeholder="Name, email, phone, etc."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      {loading ? (
        <div className="text-zinc-500">Loading users...</div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-zinc-500">No users found.</div>
      ) : (
        <div className="overflow-x-auto border border-zinc-200 rounded-lg">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-zinc-100">
                <th className="px-4 py-2 border-b text-left">ID</th>
                <th className="px-4 py-2 border-b text-left">Name</th>
                <th className="px-4 py-2 border-b text-left">Email</th>
                <th className="px-4 py-2 border-b text-left">Phone</th>
                <th className="px-4 py-2 border-b text-left">Address</th>
                <th className="px-4 py-2 border-b text-left">Role</th>
                <th className="px-4 py-2 border-b text-left">Library Card #</th>
                <th className="px-4 py-2 border-b text-left">Verified</th>
                <th className="px-4 py-2 border-b text-left">Created At</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-zinc-50">
                  <td className="px-4 py-2 border-b">{user.id}</td>
                  <td className="px-4 py-2 border-b">{user.name}</td>
                  <td className="px-4 py-2 border-b">{user.email}</td>
                  <td className="px-4 py-2 border-b">{user.phone}</td>
                  <td className="px-4 py-2 border-b">{user.address}</td>
                  <td className="px-4 py-2 border-b capitalize">{user.role}</td>
                  <td className="px-4 py-2 border-b">
                    {user.libraryCardNumber}
                  </td>
                  <td className="px-4 py-2 border-b">
                    {user.isVerified ? (
                      <span className="text-green-600 font-semibold">Yes</span>
                    ) : (
                      <span className="text-red-500">No</span>
                    )}
                  </td>
                  <td className="px-4 py-2 border-b">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
