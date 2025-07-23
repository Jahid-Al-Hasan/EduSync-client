import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../../hooks/useAuth";
import Swal from "sweetalert2";
import {
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Edit,
  Calendar,
  ClockIcon,
} from "lucide-react";
import { useState } from "react";
import useAxios from "../../../hooks/useAxios";

const MySessions = () => {
  const { user } = useAuth();
  const axiosInstance = useAxios();
  const queryClient = useQueryClient();
  const [editModal, setEditModal] = useState(null);
  const [sessionForm, setSessionForm] = useState({
    title: "",
    description: "",
    maxStudents: 20,
    registrationStart: "",
    registrationEnd: "",
    classStart: "",
    classEnd: "",
  });

  // Fetch tutor's sessions
  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ["my-sessions", user?.uid],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/api/my-sessions?tutorEmail=${user?.email}`
      );
      return data;
    },
  });

  // Mutation to resubmit rejected session
  const resubmitSession = useMutation({
    mutationFn: async (sessionId) => {
      const { data } = await axiosInstance.patch(
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

  // Update session mutation
  const updateSession = useMutation({
    mutationFn: async ({ sessionId, updatedData }) => {
      const { data } = await axiosInstance.patch(
        `/api/sessions/${sessionId}/tutor`,
        updatedData
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["all-sessions"]);
      Swal.fire("Updated!", "The session has been updated.", "success");
      setEditModal(null);
    },
    onError: (error) => {
      console.error("Error updating session:", error);
      Swal.fire("Error!", "Failed to update session.", "error");
    },
  });

  const handleEditClick = (session) => {
    setEditModal(session._id);
    setSessionForm({
      title: session.title,
      description: session.description,
      maxStudents: session.maxStudents,
      registrationStart: new Date(session.registrationStart)
        .toISOString()
        .slice(0, 16),
      registrationEnd: new Date(session.registrationEnd)
        .toISOString()
        .slice(0, 16),
      classStart: new Date(session.classStart).toISOString().slice(0, 16),
      classEnd: new Date(session.classEnd).toISOString().slice(0, 16),
    });
  };

  const handleUpdate = () => {
    // Validate form data
    if (!sessionForm.title || !sessionForm.description) {
      Swal.fire("Error!", "Title and description are required", "error");
      return;
    }

    const registrationStart = new Date(sessionForm.registrationStart);
    const registrationEnd = new Date(sessionForm.registrationEnd);
    const classStart = new Date(sessionForm.classStart);
    const classEnd = new Date(sessionForm.classEnd);

    if (registrationStart >= registrationEnd) {
      Swal.fire("Error!", "Registration end must be after start", "error");
      return;
    }

    if (classStart >= classEnd) {
      Swal.fire("Error!", "Class end must be after start", "error");
      return;
    }

    if (classStart <= registrationEnd) {
      Swal.fire("Error!", "Class must start after registration ends", "error");
      return;
    }

    updateSession.mutate({
      sessionId: editModal,
      updatedData: {
        title: sessionForm.title,
        description: sessionForm.description,
        maxStudents: parseInt(sessionForm.maxStudents),
        registrationStart,
        registrationEnd,
        classStart,
        classEnd,
      },
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
                        <div className="flex items-center gap-2">
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
                          {/* Rejection reason icon */}
                          {session.status === "rejected" &&
                            session.rejectionReason && (
                              <button
                                className="tooltip tooltip-left"
                                data-tip="View reason"
                                onClick={() =>
                                  Swal.fire({
                                    icon: "info",
                                    title: session.rejectionReason,
                                    text: session.rejectionFeedback,
                                  })
                                }
                              >
                                <span className="text-error">
                                  <XCircle className="w-4 h-4 cursor-pointer" />
                                </span>
                              </button>
                            )}
                        </div>
                      </td>
                      <td>
                        {session.currentStudents}/{session.maxStudents}
                      </td>
                      <td>
                        {new Date(session.classStart).toLocaleDateString()}
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            className="btn btn-info btn-sm"
                            onClick={() => handleEditClick(session)}
                          >
                            <Edit className="w-4 h-4" />
                            Update
                          </button>
                          {session.status === "rejected" && (
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
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* update modal */}
          <dialog id="edit_modal" className="modal" open={editModal !== null}>
            <div className="modal-box max-w-3xl">
              <h3 className="font-bold text-lg">Edit Session</h3>
              <div className="py-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Title*</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered"
                      value={sessionForm.title}
                      onChange={(e) =>
                        setSessionForm({
                          ...sessionForm,
                          title: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Max Students*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      className="input input-bordered"
                      value={sessionForm.maxStudents}
                      onChange={(e) =>
                        setSessionForm({
                          ...sessionForm,
                          maxStudents: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Description*</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered h-32"
                    value={sessionForm.description}
                    onChange={(e) =>
                      setSessionForm({
                        ...sessionForm,
                        description: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Registration Start*
                      </span>
                    </label>
                    <input
                      type="datetime-local"
                      className="input input-bordered"
                      value={sessionForm.registrationStart}
                      onChange={(e) =>
                        setSessionForm({
                          ...sessionForm,
                          registrationStart: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Registration End*
                      </span>
                    </label>
                    <input
                      type="datetime-local"
                      className="input input-bordered"
                      value={sessionForm.registrationEnd}
                      onChange={(e) =>
                        setSessionForm({
                          ...sessionForm,
                          registrationEnd: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text flex items-center gap-2">
                        <ClockIcon className="w-4 h-4" />
                        Class Start*
                      </span>
                    </label>
                    <input
                      type="datetime-local"
                      className="input input-bordered"
                      value={sessionForm.classStart}
                      onChange={(e) =>
                        setSessionForm({
                          ...sessionForm,
                          classStart: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text flex items-center gap-2">
                        <ClockIcon className="w-4 h-4" />
                        Class End*
                      </span>
                    </label>
                    <input
                      type="datetime-local"
                      className="input input-bordered"
                      value={sessionForm.classEnd}
                      onChange={(e) =>
                        setSessionForm({
                          ...sessionForm,
                          classEnd: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="modal-action">
                <button
                  className="btn btn-primary"
                  onClick={handleUpdate}
                  disabled={updateSession.isLoading}
                >
                  {updateSession.isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    "Update Session"
                  )}
                </button>
                <button
                  className="btn btn-ghost"
                  onClick={() => setEditModal(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </dialog>
        </div>
      </div>
    </div>
  );
};

export default MySessions;
