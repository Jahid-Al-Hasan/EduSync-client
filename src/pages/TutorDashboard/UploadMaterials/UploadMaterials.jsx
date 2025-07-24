import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../../hooks/useAuth";
import Swal from "sweetalert2";
import { useState } from "react";
import axios from "axios";
import useAxios from "../../../hooks/useAxios";
import { useRef } from "react";
import { useEffect } from "react";

const UploadMaterials = () => {
  const { user } = useAuth();
  const axiosInstance = useAxios();
  const queryClient = useQueryClient();
  const [selectedSession, setSelectedSession] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const formRef = useRef(null);

  useEffect(() => {
    if (selectedSession && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedSession]);

  // Fetch approved sessions for this tutor
  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ["approved-sessions", user?.email],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/api/study-sessions/approved/tutor?tutorEmail=${user?.email}`
      );
      return data;
    },
    enabled: !!user?.email,
  });

  // Mutation to upload materials
  const uploadMaterials = useMutation({
    mutationFn: async (formData) => {
      const { data } = await axiosInstance.post(
        "/api/tutor-materials",
        formData
      );
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
    <div className="container mx-auto lg:px-4 py-8">
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
                    <div className="card-body ">
                      <h3 className="card-title h-full">{session.title}</h3>
                      <div className="h-full">
                        <p>
                          Class Start:{" "}
                          {new Date(session.classStart).toLocaleString()}
                        </p>
                        <p>
                          Class End:{" "}
                          {new Date(session.classEnd).toLocaleString()}
                        </p>
                      </div>
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
            <div className="mt-8 p-4 bg-base-100 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-6">
                Upload Materials for:{" "}
                <span className="text-primary">{selectedSession.title}</span>
              </h2>

              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="space-y-6 max-w-2xl mx-auto"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Title Field */}
                  <div className="form-control md:col-span-2">
                    <label className="label">
                      <span className="label-text font-medium">Title*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      placeholder="Materials title"
                      className="input input-bordered w-full"
                      required
                    />
                  </div>

                  {/* Session ID Field */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">
                        Study Session ID
                      </span>
                    </label>
                    <input
                      type="text"
                      value={selectedSession._id}
                      className="input input-bordered w-full bg-base-200"
                      readOnly
                    />
                  </div>

                  {/* Tutor Email Field */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">
                        Tutor Email
                      </span>
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      className="input input-bordered w-full bg-base-200"
                      readOnly
                    />
                  </div>

                  {/* Image Upload Field */}
                  <div className="form-control md:col-span-2">
                    <label className="label">
                      <span className="label-text font-medium">
                        Image Upload
                      </span>
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="file-input file-input-bordered w-full"
                    />
                    {imageUrl && (
                      <div className="mt-3 flex justify-center">
                        <img
                          src={imageUrl}
                          alt="Preview"
                          className="max-w-full h-auto max-h-60 rounded-lg border"
                        />
                      </div>
                    )}
                  </div>

                  {/* Google Drive Link */}
                  <div className="form-control md:col-span-2">
                    <label className="label">
                      <span className="label-text font-medium">
                        Google Drive Link
                      </span>
                    </label>
                    <input
                      type="url"
                      name="driveLink"
                      placeholder="https://drive.google.com/..."
                      className="input input-bordered w-full"
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                  <button
                    type="button"
                    className="btn btn-outline sm:w-32"
                    onClick={() => setSelectedSession(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary sm:w-48"
                    disabled={uploadMaterials.isLoading}
                  >
                    {uploadMaterials.isLoading ? (
                      <>
                        <span className="loading loading-spinner"></span>
                        Uploading...
                      </>
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
