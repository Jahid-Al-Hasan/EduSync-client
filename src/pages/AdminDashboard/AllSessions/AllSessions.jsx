import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useState } from "react";
import {
  BookOpen,
  CheckCircle,
  XCircle,
  Clock,
  Edit,
  Trash2,
  DollarSign,
  RefreshCw,
  Calendar,
  Clock as ClockIcon,
  Users,
} from "lucide-react";
import Swal from "sweetalert2";

const AllSessions = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [approvalModal, setApprovalModal] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [feeType, setFeeType] = useState("free");
  const [registrationFee, setRegistrationFee] = useState(0);
  const [sessionForm, setSessionForm] = useState({
    title: "",
    description: "",
    maxStudents: 20,
    registrationStart: "",
    registrationEnd: "",
    classStart: "",
    classEnd: "",
    registrationFee: 0,
  });

  // Fetch all sessions
  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ["all-sessions"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/api/sessions");
      return data;
    },
  });

  // Approve session mutation
  const approveSession = useMutation({
    mutationFn: async ({ sessionId, registrationFee }) => {
      const { data } = await axiosSecure.patch(
        `/api/sessions/${sessionId}/approve`,
        {
          status: "approved",
          registrationFee,
        }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["all-sessions"]);
      Swal.fire("Approved!", "The session has been approved.", "success");
      setApprovalModal(null);
    },
    onError: (error) => {
      console.error("Error approving session:", error);
      Swal.fire("Error!", "Failed to approve session.", "error");
    },
  });

  // Reject session mutation
  const rejectSession = useMutation({
    mutationFn: async ({
      sessionId,
      status,
      rejectionReason,
      rejectionFeedback,
    }) => {
      console.log(sessionId);
      const { data } = await axiosSecure.patch(
        `/api/sessions/${sessionId}/reject`,
        {
          status,
          rejectionReason,
          rejectionFeedback,
        }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["all-sessions"]);
      Swal.fire("Rejected!", "The session has been rejected.", "success");
    },
    onError: (error) => {
      console.error("Error rejecting session:", error);
      Swal.fire("Error!", "Failed to reject session.", "error");
    },
  });

  // Delete session mutation
  const deleteSession = useMutation({
    mutationFn: async (sessionId) => {
      const { data } = await axiosSecure.delete(`/api/sessions/${sessionId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["all-sessions"]);
      Swal.fire("Deleted!", "The session has been deleted.", "success");
    },
    onError: (error) => {
      console.error("Error deleting session:", error);
      Swal.fire("Error!", "Failed to delete session.", "error");
    },
  });

  // Update session mutation
  const updateSession = useMutation({
    mutationFn: async ({ sessionId, updatedData }) => {
      const { data } = await axiosSecure.patch(
        `/api/sessions/${sessionId}`,
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

  const handleApprove = (sessionId) => {
    if (feeType === "paid" && registrationFee <= 0) {
      Swal.fire("Error!", "Please enter a valid registration fee", "error");
      return;
    }
    approveSession.mutate({
      sessionId,
      registrationFee: feeType === "free" ? 0 : registrationFee,
    });
  };

  // feedback html
  const feedbackHtml = (
    <>
      <div class="text-left">
        <div class="form-control">
          <label class="label">
            <span class="label-text">Rejection Reason*</span>
          </label>
          <select id="rejectionReason" class="select select-bordered w-full">
            <option value="" disabled selected>
              Select a reason
            </option>
            <option value="Incomplete Information">
              Incomplete Information
            </option>
            <option value="Inappropriate Content">Inappropriate Content</option>
            <option value="Schedule Conflict">Schedule Conflict</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div class="form-control mt-4">
          <label class="label">
            <span class="label-text">Feedback (Optional)</span>
          </label>
          <textarea
            id="rejectionFeedback"
            class="textarea textarea-bordered"
            placeholder="Provide additional feedback..."
            required
          ></textarea>
        </div>
      </div>
    </>
  );

  const handleReject = (sessionId) => {
    Swal.fire({
      title: "Reject Session",
      html: feedbackHtml,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirm Rejection",
      cancelButtonText: "Cancel",
      preConfirm: () => {
        const reason = document.getElementById("rejectionReason").value;
        const feedback = document.getElementById("rejectionFeedback").value;

        if (!reason) {
          Swal.showValidationMessage("Please select a rejection reason");
          return false;
        }

        return { reason, feedback };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const { reason, feedback } = result.value;
        rejectSession.mutate({
          sessionId,
          status: "rejected",
          rejectionReason: reason,
          rejectionFeedback: feedback,
        });
      }
    });
  };

  const handleDelete = (sessionId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteSession.mutate(sessionId);
      }
    });
  };

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
      registrationFee: session.registrationFee || 0,
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

    const registrationFee = parseInt(sessionForm.registrationFee);

    updateSession.mutate({
      sessionId: editModal,
      updatedData: {
        title: sessionForm.title,
        description: sessionForm.description,
        maxStudents: sessionForm.maxStudents,
        registrationStart,
        registrationEnd,
        classStart,
        classEnd,
        registrationFee,
      },
    });
  };

  const statusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <span className="badge badge-success gap-1">
            <CheckCircle className="w-3 h-3" />
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="badge badge-error gap-1">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="badge badge-warning gap-1">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
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
    <div className="container mx-auto px-4 py-8">
      {/* Approval Modal */}
      <dialog
        id="approval_modal"
        className="modal"
        open={approvalModal !== null}
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg">Session Approval</h3>
          <div className="py-4 space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Session Fee Type</span>
              </label>
              <div className="flex gap-4">
                <label className="label cursor-pointer gap-2">
                  <input
                    type="radio"
                    name="feeType"
                    className="radio"
                    checked={feeType === "free"}
                    onChange={() => {
                      setFeeType("free");
                      setRegistrationFee(0);
                    }}
                  />
                  <span className="label-text">Free</span>
                </label>
                <label className="label cursor-pointer gap-2">
                  <input
                    type="radio"
                    name="feeType"
                    className="radio"
                    checked={feeType === "paid"}
                    onChange={() => setFeeType("paid")}
                  />
                  <span className="label-text">Paid</span>
                </label>
              </div>
            </div>

            {feeType === "paid" && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Registration Fee</span>
                </label>
                <label className="input-group">
                  <span>
                    <DollarSign className="w-4 h-4" />
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="input input-bordered w-full"
                    value={registrationFee}
                    onChange={(e) =>
                      setRegistrationFee(parseFloat(e.target.value) || 0)
                    }
                  />
                </label>
              </div>
            )}
          </div>
          <div className="modal-action">
            <button
              className="btn btn-success"
              onClick={() => handleApprove(approvalModal)}
              disabled={approveSession.isLoading}
            >
              {approveSession.isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                "Approve"
              )}
            </button>
            <button
              className="btn btn-ghost"
              onClick={() => setApprovalModal(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      </dialog>

      {/* Edit Modal */}
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
                    setSessionForm({ ...sessionForm, title: e.target.value })
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
                      maxStudents: parseInt(e.target.value) || 1,
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Registration fee</span>
                </label>
                <input
                  type="number"
                  min="0"
                  className="input input-bordered"
                  value={sessionForm.registrationFee}
                  onChange={(e) =>
                    setSessionForm({
                      ...sessionForm,
                      registrationFee: e.target.value,
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

      <div className="card bg-base-200 shadow-lg">
        <div className="card-body">
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="w-8 h-8" />
            <h1 className="card-title text-2xl md:text-3xl">
              Manage Study Sessions
            </h1>
          </div>

          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Tutor</th>
                  <th>Status</th>
                  <th>Fee</th>
                  <th>Students</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sessions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      No sessions found
                    </td>
                  </tr>
                ) : (
                  sessions.map((session) => (
                    <tr key={session._id}>
                      <td>{session.title}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {session.tutorName}
                          </span>
                          <span className="text-sm opacity-70">
                            {session.tutorEmail}
                          </span>
                        </div>
                      </td>
                      <td>{statusBadge(session.status)}</td>
                      <td>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {session.registrationFee || 0}
                        </div>
                      </td>
                      <td>
                        {session.currentStudents}/{session.maxStudents}
                      </td>
                      <td>
                        <div className="flex gap-2">
                          {session.status === "pending" ? (
                            <>
                              <button
                                className="btn btn-success btn-sm"
                                onClick={() => setApprovalModal(session._id)}
                              >
                                <CheckCircle className="w-4 h-4" />
                                Approve
                              </button>
                              <button
                                className="btn btn-error btn-sm"
                                onClick={() => handleReject(session._id)}
                                disabled={rejectSession.isLoading}
                              >
                                {rejectSession.isLoading ? (
                                  <RefreshCw className="w-4 h-4 animate-spin" />
                                ) : (
                                  <XCircle className="w-4 h-4" />
                                )}
                                Reject
                              </button>
                            </>
                          ) : (
                            session.status === "approved" && (
                              <>
                                <button
                                  className="btn btn-info btn-sm"
                                  onClick={() => handleEditClick(session)}
                                >
                                  <Edit className="w-4 h-4" />
                                  Update
                                </button>
                                <button
                                  className="btn btn-error btn-sm"
                                  onClick={() => handleDelete(session._id)}
                                  disabled={deleteSession.isLoading}
                                >
                                  {deleteSession.isLoading ? (
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="w-4 h-4" />
                                  )}
                                  Delete
                                </button>
                              </>
                            )
                          )}
                        </div>
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

export default AllSessions;
