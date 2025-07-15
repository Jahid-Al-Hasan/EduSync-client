import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { BookOpen, ExternalLink, FileImage } from "lucide-react";

const ViewMaterials = () => {
  const axiosSecure = useAxiosSecure();

  const { data: materials = [], isLoading } = useQuery({
    queryKey: ["session-materials"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/api/tutor-materials");
      return data;
    },
  });

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
    <div className="container mx-auto p-4 space-y-8">
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
                    className="card bg-base-200 p-4 rounded-lg shadow-sm"
                  >
                    {material.imageUrl && (
                      <figure className="mb-3">
                        <img
                          src={material.imageUrl}
                          alt={material.title}
                          className="w-full h-40 object-cover rounded"
                        />
                      </figure>
                    )}
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
