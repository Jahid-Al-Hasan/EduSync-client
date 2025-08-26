import {
  BookOpen,
  Calendar,
  Clock,
  DollarSign,
  Star,
  User,
  ArrowRight,
  Bookmark,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../hooks/useAxios";

const StudentDashboard = () => {
  const axiosInstance = useAxios();
  const {
    data: stats,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["student-stats"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/student-stats");
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
        <h1 className="text-3xl font-bold">Student Dashboard</h1>
        <p className="opacity-80 dark:opacity-80 mt-2">
          Overview of your learning journey and progress
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Bookings Card */}
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/20">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h2 className="card-title text-3xl">
                  {stats?.bookings?.total || 0}
                </h2>
                <p className="opacity-80 dark:opacity-80">Total Bookings</p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <div className="badge badge-outline badge-success">
                {stats?.bookings?.upcoming || 0} Upcoming
              </div>
              <div className="badge badge-outline badge-info">
                {stats?.bookings?.completed || 0} Completed
              </div>
            </div>
          </div>
        </div>

        {/* Spending Card */}
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/20">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h2 className="card-title text-3xl">
                  {formatCurrency(stats?.spending || 0)}
                </h2>
                <p className="opacity-80 dark:opacity-80">Total Spent</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm opacity-80">
                On {stats?.bookings?.total || 0} sessions
              </div>
            </div>
          </div>
        </div>

        {/* Favorite Tutor Card */}
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/20">
                <Star className="w-6 h-6 text-amber-600" />
              </div>
              <div className="ml-4">
                <h2 className="card-title text-xl truncate">
                  {stats?.favoriteTutor || "None"}
                </h2>
                <p className="opacity-80 dark:opacity-80">Favorite Tutor</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm text-amber-600">
                <User className="w-4 h-4 mr-1" />
                <span>Most sessions booked with</span>
              </div>
            </div>
          </div>
        </div>

        {/* Avg. Session Cost Card */}
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/20">
                <Bookmark className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h2 className="card-title text-3xl">
                  {stats?.bookings?.total > 0
                    ? formatCurrency(stats.spending / stats.bookings.total)
                    : formatCurrency(0)}
                </h2>
                <p className="opacity-80 dark:opacity-80">Avg. Session Cost</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm opacity-80">Per session</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings and Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Recent Bookings</h2>
            <div className="mt-4">
              {stats?.recentBookings?.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentBookings.map((booking, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <h3 className="font-semibold">
                          {booking.sessionTitle}
                        </h3>
                        <p className="text-sm opacity-80">
                          with {booking.tutorName}
                        </p>
                        <p
                          className={`badge badge-sm ${
                            new Date(booking.classStart) > new Date()
                              ? "badge-success"
                              : "badge-info"
                          }`}
                        >
                          {new Date(booking.classStart) > new Date()
                            ? "Class Upcoming"
                            : new Date(booking.classStart) < new Date() &&
                              new Date(booking.classEnd) > new Date()
                            ? "Class Ongoing"
                            : "Completed"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {formatCurrency(booking.registrationFee)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 opacity-80 mx-auto mb-4" />
                  <p className="opacity-80">No bookings yet</p>
                  <a href="/sessions" className="btn btn-primary btn-sm mt-4">
                    Browse Sessions
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Learning Progress */}
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Learning Progress</h2>
            <div className="mt-4 space-y-6">
              {/* Sessions Progress */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">
                    Sessions Completion
                  </span>
                  <span className="text-sm font-bold">
                    {stats?.bookings?.total > 0
                      ? Math.round(
                          (stats.bookings.completed / stats.bookings.total) *
                            100
                        )
                      : 0}
                    %
                  </span>
                </div>
                <progress
                  className="progress progress-primary w-full"
                  value={stats?.bookings?.completed || 0}
                  max={stats?.bookings?.total || 1}
                ></progress>
                <div className="flex justify-between text-xs opacity-80 mt-1">
                  <span>{stats?.bookings?.completed || 0} Completed</span>
                  <span>{stats?.bookings?.total || 0} Total</span>
                </div>
              </div>

              {/* Upcoming Sessions */}
              <div>
                <div className="flex items-center mb-2">
                  <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                  <span className="text-sm font-medium">Upcoming Sessions</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {stats?.bookings?.upcoming || 0}
                </div>
                <div className="text-xs opacity-80 mt-1">
                  Sessions scheduled for the future
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
