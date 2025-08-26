import {
  BookOpen,
  Users,
  DollarSign,
  Calendar,
  TrendingUp,
  UserCheck,
  Bookmark,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../hooks/useAxios";

const TutorDashboard = () => {
  const axiosInstance = useAxios();
  const {
    data: stats,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["tutor-stats"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/tutor-stats");
      return res.data;
    },
  });

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="mt-4 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="alert alert-error max-w-md">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current flex-shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Error loading dashboard: {error.message}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Tutor Dashboard</h1>
        <p className="opacity-80 mt-2">
          Overview of your teaching performance and statistics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Sessions Card */}
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/20">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h2 className="card-title text-3xl">
                  {stats?.sessions?.total || 0}
                </h2>
                <p className="opacity-80">Total Sessions</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-blue-600">
                {stats?.sessions?.approved || 0} Approved
              </div>
            </div>
          </div>
        </div>

        {/* Students Card */}
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/20">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h2 className="card-title text-3xl">{stats?.students || 0}</h2>
                <p className="opacity-80">Total Students</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm text-green-600">
                <UserCheck className="w-4 h-4 mr-1" />
                <span>Unique learners</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Card */}
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/20">
                <Bookmark className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h2 className="card-title text-3xl">{stats?.bookings || 0}</h2>
                <p className="opacity-80">Total Bookings</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm text-purple-600">
                <Calendar className="w-4 h-4 mr-1" />
                <span>All time bookings</span>
              </div>
            </div>
          </div>
        </div>

        {/* Earnings Card */}
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/20">
                <DollarSign className="w-6 h-6 text-amber-600" />
              </div>
              <div className="ml-4">
                <h2 className="card-title text-3xl">
                  {formatCurrency(stats?.earnings || 0)}
                </h2>
                <p className="opacity-80">Total Earnings</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm text-amber-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>Lifetime revenue</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Session Approval Rate */}
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Session Approval Rate</h2>
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Approval Progress</span>
                <span className="text-sm font-bold">
                  {stats?.sessions?.total > 0
                    ? Math.round(
                        (stats.sessions.approved / stats.sessions.total) * 100
                      )
                    : 0}
                  %
                </span>
              </div>
              <progress
                className="progress progress-primary w-full"
                value={stats?.sessions?.approved || 0}
                max={stats?.sessions?.total || 1}
              ></progress>
              <div className="flex justify-between text-xs opacity-80 mt-1">
                <span>{stats?.sessions?.approved || 0} Approved</span>
                <span>{stats?.sessions?.total || 0} Total</span>
              </div>
            </div>
          </div>
        </div>

        {/* Student Engagement */}
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Student Engagement</h2>
            <div className="mt-4 space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">
                    Avg. Bookings per Student
                  </span>
                  <span className="text-sm font-bold">
                    {stats?.students > 0
                      ? (stats.bookings / stats.students).toFixed(1)
                      : 0}
                  </span>
                </div>
                <div className="text-xs opacity-80">
                  How many times each student books on average
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Conversion Rate</span>
                  <span className="text-sm font-bold">
                    {stats?.sessions?.approved > 0
                      ? Math.round(
                          (stats.bookings / stats.sessions.approved) * 100
                        )
                      : 0}
                    %
                  </span>
                </div>
                <div className="text-xs opacity-80">
                  Percentage of approved sessions that get booked
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;
