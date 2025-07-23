import { useParams, useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Calendar,
  Clock,
  User,
  Star,
  MessageSquare,
  ArrowLeft,
} from "lucide-react";
import useAxios from "../../hooks/useAxios";
import { useState } from "react";

const SessionDetailsPage = () => {
  const axiosInstance = useAxios();
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: session,
    isLoading: loadingSession,
    error: sessionError,
  } = useQuery({
    queryKey: ["session", id],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/api/sessions/${id}?studentEmail=${user?.email}`
      );
      return data;
    },
    enabled: !!id,
  });

  const {
    data: reviews = [],
    isLoading: loadingReviews,
    error: reviewsError,
  } = useQuery({
    queryKey: ["reviews", id],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/api/reviews/${id}`);
      return data;
    },
    enabled: !!id,
  });

  const loading = loadingSession || loadingReviews;

  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);

  const handleReviewSubmit = async () => {
    if (!comment || !rating) return;
    setSubmittingReview(true);
    try {
      await axiosInstance.post("/api/reviews", {
        sessionId: id,
        studentEmail: user.email,
        studentName: user.displayName,
        rating,
        comment,
        createdAt: new Date().toISOString(),
      });
      setComment("");
      setRating(5);
      queryClient.invalidateQueries(["reviews", id]);
    } catch (error) {
      console.error("Review submission failed:", error);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleBookSession = async () => {
    if (!user || user.role !== "student") {
      navigate("/login");
    }
    setBooking(true);

    try {
      if (session.registrationFee > 0) {
        navigate(`/payment/${session._id}`);
      } else {
        await axiosInstance.post("/api/booking", {
          sessionId: session._id,
          studentEmail: user.email,
          studentName: user.displayName,
          tutorEmail: session.tutorEmail,
          tutorName: session.tutorName,
          registrationFee: session.registrationFee,
          sessionTitle: session.title,
          classStart: session.classStart,
          classEnd: session.classEnd,
        });
        navigate("/dashboard/booked-sessions");
      }
    } catch (error) {
      console.error("Booking failed:", error);
    } finally {
      setBooking(false);
    }
  };

  if (loading)
    return <div className="text-center py-8">Loading session details...</div>;

  if (sessionError) {
    return (
      <div className="text-center py-8 text-red-500">
        Failed to load session. Please try again later.
      </div>
    );
  }

  if (reviewsError) {
    return (
      <div className="text-center py-8 text-red-500">
        Failed to load reviews. Please try again later.
      </div>
    );
  }

  const currentDate = new Date();
  const isRegistrationOpen =
    new Date(session.registrationStart) <= currentDate &&
    new Date(session.registrationEnd) >= currentDate;
  const canBook = isRegistrationOpen && user?.role === "student";
  const averageRating =
    reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length ||
    0;

  return (
    <div className="container mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="btn btn-ghost mb-6">
        <ArrowLeft className="w-5 h-5" /> Back to Sessions
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="card bg-base-200 shadow-lg">
            <div className="card-body">
              <h1 className="card-title text-3xl">{session.title}</h1>
              <div className="flex items-center gap-2 mt-2">
                <User className="w-5 h-5" />
                <span className="font-medium">Tutor: {session.tutorName}</span>
              </div>

              <div className="flex items-center gap-4 mt-4">
                <div className="badge badge-primary gap-2">
                  <Star className="w-4 h-4" />
                  {averageRating.toFixed(1)} ({reviews.length} reviews)
                </div>
                <div
                  className={`badge ${
                    isRegistrationOpen ? "badge-success" : "badge-error"
                  } gap-2`}
                >
                  {isRegistrationOpen
                    ? "Registration Open"
                    : "Registration Closed"}
                </div>
              </div>

              <div className="divider"></div>

              <p className="text-lg">{session.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="space-y-2">
                  <h3 className="font-bold">Registration Period</h3>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>
                      {new Date(session.registrationStart).toLocaleDateString()}{" "}
                      - {new Date(session.registrationEnd).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-bold">Class Schedule</h3>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span>
                      {new Date(session.classStart).toLocaleDateString()} -{" "}
                      {new Date(session.classEnd).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-bold">Session Duration</h3>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span>{session.duration} hours per session</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-bold">Registration Fee</h3>
                  <div className="flex items-center gap-2">
                    {session.registrationFee > 0 ? (
                      <span className="font-bold text-lg">
                        ${session.registrationFee}
                      </span>
                    ) : (
                      <span className="badge badge-success">FREE</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="card-actions justify-end mt-6">
                {!session?.isBooked ? (
                  <button
                    onClick={handleBookSession}
                    disabled={!canBook || booking}
                    className={`btn btn-primary ${booking ? "loading" : ""}`}
                  >
                    {booking ? "Processing..." : "Book Now"}
                  </button>
                ) : (
                  <button disabled className={`btn btn-accent`}>
                    Already Booked
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Reviews</h2>
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review._id} className="card bg-base-200">
                    <div className="card-body">
                      <div className="flex items-center gap-4">
                        <div className="avatar placeholder">
                          <div className="bg-neutral text-neutral-content rounded-full w-12">
                            <span>{review.studentName.charAt(0)}</span>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-bold">{review.studentName}</h3>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating ? "fill-current" : ""
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="mt-2">{review.comment}</p>
                      <p className="text-sm opacity-70 mt-2">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 mx-auto opacity-50 mb-4" />
                <p>No reviews yet</p>
              </div>
            )}

            {session?.isBooked && user?.role === "student" && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-2">Leave a Review</h2>
                <div className="form-control space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="label-text">Your Rating:</span>
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        className={`w-6 h-6 cursor-pointer ${
                          index < rating ? "text-yellow-400" : "text-gray-400"
                        }`}
                        onClick={() => setRating(index + 1)}
                      />
                    ))}
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text">Comment</span>
                    </label>
                    <textarea
                      className="textarea textarea-bordered w-full"
                      rows="3"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    ></textarea>
                  </div>
                  <button
                    className={`btn btn-primary ${
                      submittingReview ? "loading" : ""
                    }`}
                    onClick={handleReviewSubmit}
                    disabled={submittingReview || !comment.trim()}
                  >
                    Submit Review
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="card bg-base-200 shadow-lg">
            <div className="card-body">
              <h2 className="card-title">About the Tutor</h2>
              <div className="flex items-center gap-4">
                <div className="avatar">
                  <div className="w-16 rounded-full bg-base-300">
                    {session.tutorPhoto ? (
                      <img src={session.tutorPhoto} alt={session.tutorName} />
                    ) : (
                      <User className="w-8 h-8 m-auto" />
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-bold">{session.tutorName}</h3>
                  <p className="text-sm">{session?.tutorBio}...</p>
                </div>
              </div>
              <div className="card-actions justify-end mt-4">
                <button
                  onClick={() => navigate(`/tutors/${session.tutorId}`)}
                  className="btn btn-ghost btn-sm"
                >
                  View Profile
                </button>
              </div>
            </div>
          </div>

          <div className="card bg-base-200 shadow-lg">
            <div className="card-body">
              <h2 className="card-title">Session Requirements</h2>
              <ul className="list-disc pl-5 space-y-2">
                {session.requirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionDetailsPage;
