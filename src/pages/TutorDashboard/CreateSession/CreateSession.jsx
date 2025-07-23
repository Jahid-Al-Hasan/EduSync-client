import { useState } from "react";
import {
  Calendar,
  Clock,
  BookOpen,
  CheckCircle,
  XCircle,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { useAuth } from "../../../hooks/useAuth";
import useAxios from "../../../hooks/useAxios";

const CreateSession = () => {
  const { user } = useAuth();
  const axiosInstance = useAxios();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [requirements, setRequirements] = useState([""]);
  const [topics, setTopics] = useState([""]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [sessionData, setSessionData] = useState({
    title: "",
    tutorName: user?.displayName || "",
    tutorEmail: user?.email || "",
    description: "",
    registrationStart: "",
    registrationEnd: "",
    classStart: "",
    classEnd: "",
    duration: 1,
    registrationFee: 0,
    maxStudents: 20,
    requirements: [],
    topics: [],
    status: "pending",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSessionData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddRequirement = () => {
    setRequirements([...requirements, ""]);
  };

  const handleRequirementChange = (index, value) => {
    const newRequirements = [...requirements];
    newRequirements[index] = value;
    setRequirements(newRequirements);
  };

  const handleRemoveRequirement = (index) => {
    if (requirements.length > 1) {
      const newRequirements = [...requirements];
      newRequirements.splice(index, 1);
      setRequirements(newRequirements);
    }
  };

  const handleAddTopic = () => {
    setTopics([...topics, ""]);
  };

  const handleTopicChange = (index, value) => {
    const newTopics = [...topics];
    newTopics[index] = value;
    setTopics(newTopics);
  };

  const handleRemoveTopic = (index) => {
    if (topics.length > 1) {
      const newTopics = [...topics];
      newTopics.splice(index, 1);
      setTopics(newTopics);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Filter out empty requirements and topics
      const filteredRequirements = requirements.filter(
        (req) => req.trim() !== ""
      );
      const filteredTopics = topics.filter((topic) => topic.trim() !== "");

      const payload = {
        ...sessionData,
        requirements: filteredRequirements,
        topics: filteredTopics,
        currentStudents: 0,
      };

      const { data } = await axiosInstance.post("/api/create-session", payload);

      if (!data) {
        Swal.fire("Failed to create session");
      } else {
        Swal.fire("Session created successfully! Awaiting admin approval");
        queryClient.invalidateQueries(["study-sessions"]);
        navigate("/dashboard/my-sessions");
      }
    } catch (error) {
      console.error("Error creating session:", error);
      Swal.fire("Failed to create session. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="card bg-base-200 shadow-lg">
        <div className="card-body">
          <h1 className="card-title text-2xl md:text-3xl flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            Create New Study Session
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Session Title*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={sessionData.title}
                  onChange={handleChange}
                  placeholder="Session Title"
                  className="input input-bordered"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Tutor Name*</span>
                </label>
                <input
                  type="text"
                  name="tutorName"
                  value={sessionData.tutorName}
                  onChange={handleChange}
                  className="input input-bordered"
                  required
                  readOnly
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Description*</span>
              </label>
              <textarea
                name="description"
                value={sessionData.description}
                onChange={handleChange}
                placeholder="Detailed description of what students will learn..."
                className="textarea textarea-bordered h-32"
                required
              />
            </div>

            {/* Date & Time Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Registration Start*
                  </span>
                </label>
                <input
                  type="datetime-local"
                  name="registrationStart"
                  value={sessionData.registrationStart}
                  onChange={handleChange}
                  className="input input-bordered"
                  required
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
                  name="registrationEnd"
                  value={sessionData.registrationEnd}
                  onChange={handleChange}
                  className="input input-bordered"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Class Start*
                  </span>
                </label>
                <input
                  type="datetime-local"
                  name="classStart"
                  value={sessionData.classStart}
                  onChange={handleChange}
                  className="input input-bordered"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Class End*
                  </span>
                </label>
                <input
                  type="datetime-local"
                  name="classEnd"
                  value={sessionData.classEnd}
                  onChange={handleChange}
                  className="input input-bordered"
                  required
                />
              </div>
            </div>

            {/* Session Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Duration (hours)*</span>
                </label>
                <input
                  type="number"
                  name="duration"
                  min="0.5"
                  step="0.5"
                  value={sessionData.duration}
                  onChange={handleChange}
                  className="input input-bordered"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Max Students*</span>
                </label>
                <input
                  type="number"
                  name="maxStudents"
                  min="1"
                  value={sessionData.maxStudents}
                  onChange={handleChange}
                  className="input input-bordered"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Registration Fee</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3">$</span>
                  <input
                    type="number"
                    name="registrationFee"
                    min="0"
                    step="0.01"
                    value={sessionData.registrationFee}
                    onChange={handleChange}
                    className="input input-bordered pl-8"
                    disabled
                  />
                  <span className="absolute right-3 top-3 text-sm opacity-70">
                    (Set by admin)
                  </span>
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div className="space-y-4">
              <label className="label">
                <span className="label-text">Requirements*</span>
              </label>
              {requirements.map((req, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={req}
                    onChange={(e) =>
                      handleRequirementChange(index, e.target.value)
                    }
                    placeholder={`Requirement ${index + 1}`}
                    className="input input-bordered flex-1"
                    required={index === 0}
                  />
                  {requirements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveRequirement(index)}
                      className="btn btn-square btn-error btn-sm"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  )}
                  {index === requirements.length - 1 && (
                    <button
                      type="button"
                      onClick={handleAddRequirement}
                      className="btn btn-square btn-primary btn-sm"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Topics */}
            <div className="space-y-4">
              <label className="label">
                <span className="label-text">Topics*</span>
              </label>
              {topics.map((topic, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => handleTopicChange(index, e.target.value)}
                    placeholder={`Topic ${index + 1}`}
                    className="input input-bordered flex-1"
                    required={index === 0}
                  />
                  {topics.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTopic(index)}
                      className="btn btn-square btn-error btn-sm"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  )}
                  {index === topics.length - 1 && (
                    <button
                      type="button"
                      onClick={handleAddTopic}
                      className="btn btn-square btn-primary btn-sm"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="card-actions justify-end">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Create Session"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateSession;
