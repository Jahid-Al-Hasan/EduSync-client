import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useAuth } from "../../../hooks/useAuth";
import Swal from "sweetalert2";
import { Clock, CheckCircle, XCircle, RefreshCw } from "lucide-react";

const MySessions = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // Fetch tutor's sessions
  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ["my-sessions", user?.uid],
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `/api/my-sessions?tutorEmail=${user?.email}`
      );
      return data;
    },
  });

  // Mutation to resubmit rejected session
  const resubmitSession = useMutation({
    mutationFn: async (sessionId) => {
      const { data } = await axiosSecure.patch(
        `/api/sessions/resubmit/${sessionId}`,
        {
          status: "pending",
        }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["my-sessions"]);
      Swal.fire("Success!", "Session resubmitted for approval.", "success");
    },
    onError: (error) => {
      console.error("Error resubmitting session:", error);
      Swal.fire("Error!", "Failed to resubmit session.", "error");
    },
  });

  const handleResubmit = (sessionId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will send the session for admin approval again.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, resubmit!",
    }).then((result) => {
      if (result.isConfirmed) {
        resubmitSession.mutate(sessionId);
      }
    });
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading your sessions...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="card bg-base-200 shadow-lg">
        <div className="card-body">
          <h1 className="card-title text-2xl md:text-3xl mb-6">
            My Study Sessions
          </h1>

          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Students</th>
                  <th>Schedule</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {sessions.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      No sessions found
                    </td>
                  </tr>
                ) : (
                  sessions.map((session) => (
                    <tr key={session._id}>
                      <td className="font-medium">{session.title}</td>
                      <td>
                        <span
                          className={`badge ${
                            session.status === "approved"
                              ? "badge-success"
                              : session.status === "rejected"
                              ? "badge-error"
                              : "badge-warning"
                          } gap-1`}
                        >
                          {session.status === "approved" && (
                            <CheckCircle className="w-4 h-4" />
                          )}
                          {session.status === "rejected" && (
                            <XCircle className="w-4 h-4" />
                          )}
                          {session.status === "pending" && (
                            <Clock className="w-4 h-4" />
                          )}
                          {session.status.charAt(0).toUpperCase() +
                            session.status.slice(1)}
                        </span>
                      </td>
                      <td>
                        {session.currentStudents}/{session.maxStudents}
                      </td>
                      <td>
                        {new Date(session.classStart).toLocaleDateString()}
                      </td>
                      <td>
                        {session.status === "rejected" ? (
                          <button
                            className="btn btn-primary btn-sm"
                            disabled={resubmitSession.isLoading}
                            onClick={() => handleResubmit(session._id)}
                          >
                            {resubmitSession.isLoading ? (
                              <span className="loading loading-spinner"></span>
                            ) : (
                              <>
                                <RefreshCw className="w-4 h-4 mr-1" />
                                Resubmit
                              </>
                            )}
                          </button>
                        ) : (
                          <button className="btn btn-error btn-sm">---</button>
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

export default MySessions;
