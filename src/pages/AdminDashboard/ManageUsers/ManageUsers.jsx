import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { Search, User, Mail, Shield, Edit, RefreshCw } from "lucide-react";
import Swal from "sweetalert2";
import debounce from "lodash/debounce";
import useAxios from "../../../hooks/useAxios";

const ManageUsers = () => {
  const queryClient = useQueryClient();
  const axiosInstance = useAxios();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [editingUserId, setEditingUserId] = useState(null);
  const [newRole, setNewRole] = useState("");

  // Debounce effect
  const debounceSearch = useCallback(
    debounce((term) => {
      setDebouncedSearch(term);
    }, 800),
    []
  );

  useEffect(() => {
    debounceSearch(searchTerm);
    return debounceSearch.cancel;
  }, [searchTerm, debounceSearch]);

  // Fetch users with debounced search
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["all-users", debouncedSearch],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/api/users?search=${debouncedSearch}`
      );
      return data;
    },
  });

  // Update user role mutation
  const updateRole = useMutation({
    mutationFn: async ({ userId, role }) => {
      const { data } = await axiosInstance.patch(`/api/users/${userId}/role`, {
        role,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["all-users"]);
      Swal.fire("Success!", "User role updated successfully.", "success");
      setEditingUserId(null);
    },
    onError: (error) => {
      console.error("Error updating role:", error);
      Swal.fire("Error!", "Failed to update user role.", "error");
    },
  });

  const handleRoleUpdate = (userId) => {
    if (!newRole) {
      Swal.fire("Error!", "Please select a role", "error");
      return;
    }
    updateRole.mutate({ userId, role: newRole });
  };

  const roleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "badge-primary";
      case "tutor":
        return "badge-secondary";
      case "student":
        return "badge-accent";
      default:
        return "badge-neutral";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto lg:px-4 py-8">
      <div className="card bg-base-200 shadow-lg">
        <div className="card-body">
          <h1 className="card-title text-2xl md:text-3xl mb-6">Manage Users</h1>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <div className="absolute z-10 inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  className="input input-bordered w-full pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar placeholder">
                            <div className="bg-neutral text-neutral-content rounded-full w-10">
                              {!user.photoURL ? (
                                <User className="w-5 h-5" />
                              ) : (
                                <img src={user.photoURL} alt="" />
                              )}
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">
                              {user.name || "No name provided"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {user.email}
                        </div>
                      </td>
                      <td>
                        {editingUserId === user._id ? (
                          <select
                            className="select select-bordered select-sm"
                            value={newRole}
                            onChange={(e) => setNewRole(e.target.value)}
                          >
                            <option value="">Select Role</option>
                            <option value="admin">Admin</option>
                            <option value="tutor">Tutor</option>
                            <option value="student">Student</option>
                          </select>
                        ) : (
                          <span
                            className={`badge ${roleBadgeColor(
                              user.role
                            )} gap-1`}
                          >
                            <Shield className="w-3 h-3" />
                            {user.role}
                          </span>
                        )}
                      </td>
                      <td>
                        {editingUserId === user._id ? (
                          <div className="flex gap-2">
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => handleRoleUpdate(user._id)}
                              disabled={updateRole.isLoading}
                            >
                              {updateRole.isLoading ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                              ) : (
                                "Save"
                              )}
                            </button>
                            <button
                              className="btn btn-ghost btn-sm"
                              onClick={() => setEditingUserId(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            className="btn btn-info btn-sm"
                            onClick={() => {
                              setEditingUserId(user._id);
                              setNewRole(user.role);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                            Edit Role
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
