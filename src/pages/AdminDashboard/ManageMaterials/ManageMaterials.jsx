import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import {
  Trash2,
  Download,
  Link as LinkIcon,
  BookOpen,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useState } from "react";
import useAxios from "../../../hooks/useAxios";

const ITEMS_PER_PAGE = 10;

const ManageMaterials = () => {
  const axiosInstance = useAxios();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  // Fetch paginated materials
  const { data, isLoading } = useQuery({
    queryKey: ["all-materials", page],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/api/materials/all?page=${page}&limit=${ITEMS_PER_PAGE}`
      );
      return data;
    },
    keepPreviousData: true,
  });

  const materials = data?.materials || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  // Delete material mutation
  const deleteMaterial = useMutation({
    mutationFn: async (materialId) => {
      const { data } = await axiosInstance.delete(
        `/api/materials/${materialId}`
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["all-materials"]);
      Swal.fire("Deleted!", "The material has been removed.", "success");
    },
    onError: (error) => {
      console.error("Error deleting material:", error);
      Swal.fire("Error!", "Failed to delete material.", "error");
    },
  });

  const handleDelete = (materialId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently remove the material!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMaterial.mutate(materialId);
      }
    });
  };

  const handleDownload = async (imageUrl) => {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const anchor = document.createElement("a");
    anchor.href = blobUrl;
    anchor.download = `study-material-${Date.now()}`;
    anchor.click();
    URL.revokeObjectURL(blobUrl);
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading materials...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="card bg-base-200 shadow-lg">
        <div className="card-body">
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="w-8 h-8" />
            <h1 className="card-title text-2xl md:text-3xl">
              Manage Study Materials
            </h1>
          </div>

          {materials.length === 0 ? (
            <div className="text-center py-8">
              <p>No materials found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Tutor Email</th>
                      <th>Content</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {materials.map((material) => (
                      <tr key={material._id}>
                        <td>
                          <div className="font-medium">{material.title}</div>
                        </td>
                        <td>{material.tutorEmail}</td>
                        <td>
                          <div className="flex flex-wrap gap-2">
                            {material.imageUrl && (
                              <button
                                onClick={() =>
                                  handleDownload(material.imageUrl)
                                }
                                className="btn btn-xs btn-outline"
                              >
                                <Download className="w-3 h-3 mr-1" />
                                Image
                              </button>
                            )}
                            {material.driveLink && (
                              <a
                                href={material.driveLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-xs btn-outline"
                              >
                                <LinkIcon className="w-3 h-3 mr-1" />
                                Drive Link
                              </a>
                            )}
                          </div>
                        </td>
                        <td>
                          <button
                            onClick={() => handleDelete(material._id)}
                            className="btn btn-error btn-xs"
                            disabled={deleteMaterial.isLoading}
                          >
                            {deleteMaterial.isLoading ? (
                              <span className="loading loading-spinner loading-xs"></span>
                            ) : (
                              <>
                                <Trash2 className="w-3 h-3 mr-1" />
                                Remove
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="flex justify-center items-center gap-4 mt-6">
                <button
                  className="btn btn-sm"
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                >
                  <ChevronsLeft className="w-4 h-4 mr-1" />
                  Prev
                </button>
                <span>
                  Page <strong>{page}</strong> of <strong>{totalPages}</strong>
                </span>
                <button
                  className="btn btn-sm"
                  onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
                  disabled={page === totalPages}
                >
                  Next
                  <ChevronsRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageMaterials;
