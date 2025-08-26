import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import useAxios from "../../../hooks/useAxios";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const AdminDashboard = () => {
  const axiosInstance = useAxios();

  const {
    data: stats,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["overview-stats"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/api/overview-stats");
      return data;
    },
  });

  if (isLoading)
    return <p className="text-center mt-10 opacity-80">Loading...</p>;
  if (isError)
    return (
      <p className="text-center mt-10 opacity-80">Failed to load stats.</p>
    );

  // Pie Chart data for Users
  const usersData = [
    { name: "Students", value: stats.users.students },
    { name: "Tutors", value: stats.users.tutors },
    {
      name: "Admins",
      value: stats.users.total - (stats.users.students + stats.users.tutors),
    },
  ];

  // Bar Chart data for Sessions
  const sessionData = [
    { name: "Approved", value: stats.sessions.approved },
    { name: "Pending", value: stats.sessions.pending },
    { name: "Rejected", value: stats.sessions.rejected },
  ];

  return (
    <div className="p-6 grid gap-6 md:grid-cols-2">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:col-span-2">
        <div className="card bg-base-200 shadow-xl p-4 rounded-2xl">
          <div className="opacity-70 text-sm">Total Users</div>
          <h2 className="text-2xl font-bold">{stats.users.total}</h2>
        </div>
        <div className="card bg-base-200 shadow-xl p-4 rounded-2xl">
          <div className="opacity-70 text-sm">Total Sessions</div>
          <h2 className="text-2xl font-bold">{stats.sessions.total}</h2>
        </div>
        <div className="card bg-base-200 shadow-xl p-4 rounded-2xl">
          <div className="opacity-70 text-sm">Total Bookings</div>
          <h2 className="text-2xl font-bold">{stats.bookings}</h2>
        </div>
        <div className="card bg-base-200 shadow-xl p-4 rounded-2xl">
          <div className="opacity-70 text-sm">Revenue</div>
          <h2 className="text-2xl font-bold">${stats.revenue}</h2>
        </div>
      </div>

      {/* Pie Chart - Users */}
      <div className="card bg-base-200 shadow-xl p-4 rounded-2xl">
        <h3 className="text-lg font-semibold mb-4 opacity-80">
          Users Breakdown
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={usersData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
              dataKey="value"
            >
              {usersData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart - Sessions */}
      <div className="card bg-base-200 shadow-xl p-4 rounded-2xl">
        <h3 className="text-lg font-semibold mb-4 opacity-80">
          Sessions Status
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={sessionData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminDashboard;
