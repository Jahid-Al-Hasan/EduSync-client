import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  BookOpen,
  ExternalLink,
  FileImage,
  Trash2,
  Edit,
  Loader2,
} from "lucide-react";
import useAxios from "../../../hooks/useAxios";
import Swal from "sweetalert2";
import { useState } from "react";

const ViewMaterials = () => {
  const axiosInstance = useAxios();
  const queryClient = useQueryClient();
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    driveLink: "",
  });

  // Fetch materials
  const { data: materials = [], isLoading } = useQuery({
    queryKey: ["session-materials"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/api/tutor-materials");
      return data;
    },
  });

  // Delete mutation
  const deleteMaterial = useMutation({
    mutationFn: async (materialId) => {
      await axiosInstance.delete(`/api/tutor-materials/${materialId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["session-materials"]);
      Swal.fire("Deleted!", "Material has been deleted.", "success");
    },
    onError: (error) => {
      Swal.fire("Error!", error.message, "error");
    },
  });

  // Update mutation
  const updateMaterial = useMutation({
    mutationFn: async ({ id, updatedData }) => {
      const { data } = await axiosInstance.patch(
        `/api/tutor-materials/${id}`,
        updatedData
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["session-materials"]);
      setEditingMaterial(null);
      Swal.fire("Updated!", "Material has been updated.", "success");
    },
    onError: (error) => {
      Swal.fire("Error!", error.message, "error");
    },
  });

  // Handle edit
  const handleEdit = (material) => {
    setEditingMaterial(material._id);
    setEditFormData({
      title: material.title,
      driveLink: material.driveLink || "",
    });
  };

  // Handle edit submit
  const handleEditSubmit = (materialId) => {
    updateMaterial.mutate({ id: materialId, updatedData: editFormData });
  };

  // Group materials by sessionId
  const groupedBySession = materials.reduce((acc, material) => {
    if (!acc[material.sessionTitle]) {
      acc[material.sessionTitle] = [];
    }
    acc[material.sessionTitle].push(material);
    return acc;
  }, {});

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto lg:p-4 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-4">
        <BookOpen className="inline-block mr-2" /> Study Materials
      </h1>

      {Object.entries(groupedBySession).map(
        ([sessionTitle, sessionMaterials]) => (
          <div
            key={sessionTitle}
            className="card bg-base-100 shadow-xl border border-base-300"
          >
            <div className="card-body">
              <h2 className="card-title text-xl mb-2 text-primary">
                Session Title:{" "}
                <span className="text-base-content">{sessionTitle}</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sessionMaterials.map((material) => (
                  <div
                    key={material._id}
                    className="card bg-base-200 p-4 rounded-lg shadow-sm relative"
                  >
                    {/* Edit/Delete Buttons */}
                    <div className="absolute top-2 right-2 flex gap-1">
                      <button
                        onClick={() => handleEdit(material)}
                        className="btn btn-circle btn-sm btn-ghost hover:bg-base-300"
                        disabled={deleteMaterial.isLoading}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => {
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
                              deleteMaterial.mutate(material._id);
                            }
                          });
                        }}
                        className="btn btn-circle btn-sm btn-ghost hover:bg-error/20"
                        disabled={deleteMaterial.isLoading}
                      >
                        {deleteMaterial.isLoading &&
                        deleteMaterial.variables === material._id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} className="text-error" />
                        )}
                      </button>
                    </div>

                    {material.imageUrl && (
                      <figure className="mb-3">
                        <img
                          src={material.imageUrl}
                          alt={material.title}
                          className="w-full h-40 object-cover rounded"
                        />
                      </figure>
                    )}

                    {editingMaterial === material._id ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editFormData.title}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              title: e.target.value,
                            })
                          }
                          className="input input-bordered input-sm w-full"
                        />
                        <input
                          type="url"
                          value={editFormData.driveLink}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              driveLink: e.target.value,
                            })
                          }
                          placeholder="Google Drive Link"
                          className="input input-bordered input-sm w-full"
                        />
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => setEditingMaterial(null)}
                            className="btn btn-sm btn-ghost"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleEditSubmit(material._id)}
                            className="btn btn-sm btn-primary"
                            disabled={updateMaterial.isLoading}
                          >
                            {updateMaterial.isLoading ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              "Save"
                            )}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <FileImage size={20} /> {material.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Uploaded by: {material.tutorEmail}
                        </p>
                        <div className="card-actions justify-end">
                          {material.driveLink && (
                            <a
                              href={material.driveLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-sm btn-outline btn-primary"
                            >
                              <ExternalLink size={16} className="mr-1" />
                              View File
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default ViewMaterials;
