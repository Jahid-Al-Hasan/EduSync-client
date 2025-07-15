import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useAuth } from "../../../hooks/useAuth";
import Swal from "sweetalert2";
import { useState } from "react";
import axios from "axios";

const UploadMaterials = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [selectedSession, setSelectedSession] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  // Fetch approved sessions for this tutor
  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ["approved-sessions", user?.email],
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `/api/study-sessions/approved/tutor?tutorEmail=${user?.email}`
      );
      return data;
    },
    enabled: !!user?.email,
  });

  // Mutation to upload materials
  const uploadMaterials = useMutation({
    mutationFn: async (formData) => {
      const { data } = await axiosSecure.post("/api/tutor-materials", formData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["session-materials"]);
      Swal.fire("Success!", "Materials uploaded successfully!", "success");
      setSelectedSession(null);
      setImageUrl("");
    },
    onError: (error) => {
      console.error("Error uploading materials:", error);
      Swal.fire("Error!", "Failed to upload materials.", "error");
    },
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      // Upload to ImgBB or your preferred image hosting service
      const imageUploadUrl = `https://api.imgbb.com/1/upload?key=${
        import.meta.env.VITE_IMGBB_API
      }`;
      const response = await axios.post(imageUploadUrl, formData);
      setImageUrl(response.data.data.url);
    } catch (error) {
      console.error("Error uploading image:", error);
      Swal.fire("Error!", "Failed to upload image.", "error");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      title: e.target.title.value,
      sessionId: selectedSession._id,
      sessionTitle: selectedSession.title,
      tutorEmail: user.email,
      imageUrl,
      driveLink: e.target.driveLink.value,
    };
    uploadMaterials.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">Loading your approved sessions...</div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="card bg-base-200 shadow-lg">
        <div className="card-body">
          <h1 className="card-title text-2xl md:text-3xl mb-6">
            Upload Study Materials
          </h1>

          {/* List of approved sessions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              Your Approved Sessions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sessions.length === 0 ? (
                <p>No approved sessions found</p>
              ) : (
                sessions.map((session) => (
                  <div
                    key={session._id}
                    className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="card-body">
                      <h3 className="card-title">{session.title}</h3>
                      <p>Session ID: {session._id}</p>
                      <div className="card-actions justify-end">
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => setSelectedSession(session)}
                        >
                          Upload Materials
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Upload form (shown when session is selected) */}
          {selectedSession && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">
                Upload Materials for: {selectedSession.title}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Title*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    placeholder="Materials title"
                    className="input input-bordered"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Study Session ID</span>
                  </label>
                  <input
                    type="text"
                    value={selectedSession._id}
                    className="input input-bordered"
                    readOnly
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Tutor Email</span>
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    className="input input-bordered"
                    readOnly
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Image Upload</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="file-input file-input-bordered w-full"
                  />
                  {imageUrl && (
                    <div className="mt-2">
                      <img
                        src={imageUrl}
                        alt="Preview"
                        className="max-w-xs max-h-40"
                      />
                    </div>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Google Drive Link</span>
                  </label>
                  <input
                    type="url"
                    name="driveLink"
                    placeholder="https://drive.google.com/..."
                    className="input input-bordered"
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setSelectedSession(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={uploadMaterials.isLoading}
                  >
                    {uploadMaterials.isLoading ? (
                      <span className="loading loading-spinner"></span>
                    ) : (
                      "Upload Materials"
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadMaterials;
