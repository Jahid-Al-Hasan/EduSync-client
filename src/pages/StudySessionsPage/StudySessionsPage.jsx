import { Link } from "react-router";
import { Calendar, Clock, User, BookOpen } from "lucide-react";
import useAxios from "../../hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import LoadingPage from "../../components/LoadingPage/LoadingPage";

const StudySessionsPage = () => {
  const axiosInstance = useAxios();
  const currentDate = new Date();

  const {
    data: sessions = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["approved-sessions"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/api/study-sessions/approved");
      return data;
    },
  });

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return (
      <div className="text-center py-8 text-error">Error: {error.message}</div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl lg:text-3xl font-bold mb-8">
        Available Study Sessions
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessions.map((session) => {
          const isOngoing = new Date(session.registrationEnd) >= currentDate;

          return (
            <div key={session._id} className="card bg-base-200 shadow-lg">
              <div className="card-body">
                <h2 className="card-title">{session.title}</h2>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>Tutor: {session.tutorName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(session.classStart).toLocaleDateString()} -{" "}
                    {new Date(session.classEnd).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{session.duration} hours per session</span>
                </div>
                <p className="mt-2">
                  {session.description.substring(0, 100)}...
                </p>
                <div className="card-actions justify-between items-center mt-4">
                  <span
                    className={`badge ${
                      isOngoing ? "badge-success" : "badge-error"
                    }`}
                  >
                    {isOngoing ? "Ongoing" : "Closed"}
                  </span>
                  <Link
                    to={`/sessions/${session._id}`}
                    className="btn btn-primary btn-sm"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Read More
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

export default StudySessionsPage;
