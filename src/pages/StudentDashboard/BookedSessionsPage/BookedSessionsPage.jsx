import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  Clock,
  User,
  BookOpen,
  ArrowRight,
  DollarSign,
  CheckCircle,
} from "lucide-react";
import { Link } from "react-router";
import { format, isAfter, isBefore } from "date-fns";
import { useAuth } from "../../../hooks/useAuth";
import LoadingPage from "../../../components/LoadingPage/LoadingPage";
import useAxios from "../../../hooks/useAxios";

const BookedSessionsPage = () => {
  const { user } = useAuth();
  const axiosInstance = useAxios();

  const {
    data: bookedSessions = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["bookedSessions", user?.email],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/api/booked-sessions?studentEmail=${user.email}`
      );
      return data;
    },
    enabled: !!user?.email,
  });

  const getSessionStatus = (session) => {
    const now = new Date();
    const classStart = new Date(session.classStart);
    const classEnd = new Date(session.classEnd);

    if (session.status?.toLowerCase() === "cancelled") {
      return { text: "Cancelled", color: "error" };
    }

    if (isBefore(classEnd, now)) {
      return { text: "Completed", color: "success" };
    }

    if (isAfter(now, classStart) && isBefore(now, classEnd)) {
      return { text: "Ongoing", color: "info" };
    }

    if (isAfter(classStart, now)) {
      return { text: "Upcoming", color: "warning" };
    }

    return { text: "Scheduled", color: "primary" };
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  if (error) {
    return (
      <div className="alert alert-error max-w-2xl mx-auto">
        Error loading booked sessions.
        <button onClick={refetch} className="btn btn-sm ml-4">
          Retry
        </button>
      </div>
    );
  }

  if (bookedSessions.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="mx-auto h-12 w-12 opacity-50" />
        <h3 className="mt-2 text-lg font-medium">No Booked Sessions</h3>
        <p className="mt-1">You haven't booked any study sessions yet.</p>
        <Link to="/study-sessions" className="btn btn-primary mt-4">
          Browse Available Sessions
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto lg:px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold pl-2">My Booked Sessions</h1>
        <div className="text-sm">
          Showing {bookedSessions.length} session
          {bookedSessions.length !== 1 ? "s" : ""}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookedSessions.map((session) => {
          const status = getSessionStatus(session);

          return (
            <div
              key={session._id}
              className="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <h2 className="card-title">{session.sessionTitle}</h2>
                  <span className={`badge badge-${status.color}`}>
                    {status.text}
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <User className="w-5 h-5" />
                  <span>Tutor: {session.tutorName}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>
                      {format(new Date(session.classStart), "MMM d, yyyy")}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span>
                      {format(new Date(session.classStart), "h:mm a")}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {session.paymentStatus === "paid" ? (
                      <DollarSign className="w-5 h-5 text-green-500" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                    <span>
                      {session.paymentStatus === "paid"
                        ? "Paid session"
                        : "Free session"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>
                      Booked on {format(new Date(session.bookingDate), "MMM d")}
                    </span>
                  </div>
                </div>

                <div className="card-actions justify-end mt-4">
                  <Link
                    to={`/dashboard/student/sessions/${session.sessionId}`}
                    className="btn btn-primary btn-sm"
                  >
                    View Details <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BookedSessionsPage;
