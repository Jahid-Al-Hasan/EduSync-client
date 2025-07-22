import { Link } from "react-router";
import {
  Calendar,
  Clock,
  User,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import useAxios from "../../hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import LoadingPage from "../../components/LoadingPage/LoadingPage";
import { useState } from "react";

const StudySessionsPage = () => {
  const axiosInstance = useAxios();
  const currentDate = new Date();
  const [currentPage, setCurrentPage] = useState(1);
  const sessionsPerPage = 6;

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

  // Calculate pagination
  const indexOfLastSession = currentPage * sessionsPerPage;
  const indexOfFirstSession = indexOfLastSession - sessionsPerPage;
  const currentSessions = sessions.slice(
    indexOfFirstSession,
    indexOfLastSession
  );
  const totalPages = Math.ceil(sessions.length / sessionsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

      {sessions.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-xl font-medium">No study sessions available</h3>
          <p className="mt-2 text-gray-500">
            Check back later for new sessions
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentSessions.map((session) => {
              const isOngoing =
                new Date(session.registrationEnd) >= currentDate;

              return (
                <div
                  key={session._id}
                  className="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow"
                >
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

          {/* Pagination */}
          {sessions.length > sessionsPerPage && (
            <div className="flex justify-center mt-8">
              <div className="join">
                <button
                  onClick={() =>
                    paginate(currentPage > 1 ? currentPage - 1 : 1)
                  }
                  disabled={currentPage === 1}
                  className="join-item btn btn-outline"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`join-item btn ${
                        currentPage === number ? "btn-active" : "btn-outline"
                      }`}
                    >
                      {number}
                    </button>
                  )
                )}

                <button
                  onClick={() =>
                    paginate(
                      currentPage < totalPages ? currentPage + 1 : totalPages
                    )
                  }
                  disabled={currentPage === totalPages}
                  className="join-item btn btn-outline"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StudySessionsPage;
