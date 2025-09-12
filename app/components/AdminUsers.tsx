import React, { useEffect, useState } from "react";
import { useAlert } from "@/components/ui/custom-alert";

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
  const [verifyingUsers, setVerifyingUsers] = useState<Set<number>>(new Set());
  const { showAlert, AlertComponent } = useAlert();

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

  const toggleUserVerification = async (
    userId: number,
    currentStatus: boolean
  ) => {
    setVerifyingUsers((prev) => new Set(prev).add(userId));

    try {
      const response = await fetch("/api/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          isVerified: !currentStatus,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        // Update the user in the local state
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, isVerified: !currentStatus } : user
          )
        );
        showAlert({
          title: "Success",
          description: result.message,
          type: "success",
        });
      } else {
        const error = await response.json();
        showAlert({
          title: "Error",
          description: `Error: ${error.error}`,
          type: "error",
        });
      }
    } catch (error) {
      showAlert({
        title: "Error",
        description: "Failed to update user verification status",
        type: "error",
      });
    } finally {
      setVerifyingUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
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
      <AlertComponent />
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
                <th className="px-4 py-2 border-b text-left">Actions</th>
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
                  <td className="px-4 py-2 border-b">
                    <button
                      onClick={() =>
                        toggleUserVerification(user.id, user.isVerified)
                      }
                      disabled={verifyingUsers.has(user.id)}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        user.isVerified
                          ? "bg-red-100 text-red-700 hover:bg-red-200"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {verifyingUsers.has(user.id)
                        ? "Updating..."
                        : user.isVerified
                        ? "Unverify"
                        : "Verify"}
                    </button>
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
