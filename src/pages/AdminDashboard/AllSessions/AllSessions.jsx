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
} from "lucide-react";
import Swal from "sweetalert2";

const AllSessions = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [approvalModal, setApprovalModal] = useState(null);
  const [feeType, setFeeType] = useState("free");
  const [registrationFee, setRegistrationFee] = useState(0);

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
    mutationFn: async (sessionId) => {
      const { data } = await axiosSecure.patch(
        `/api/sessions/${sessionId}/reject`,
        {
          status: "rejected",
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

  const handleReject = (sessionId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to reject this session",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, reject it!",
    }).then((result) => {
      if (result.isConfirmed) {
        rejectSession.mutate(sessionId);
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
                                {/* <button className="btn btn-info btn-sm">
                                  <Edit className="w-4 h-4" />
                                  Edit
                                </button> */}
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
