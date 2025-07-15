import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useAuth } from "../../../hooks/useAuth";
import { useState } from "react";
import {
  BookOpen,
  Download,
  Link,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

const StudyMaterials = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [expandedSession, setExpandedSession] = useState(null);

  // Fetch user's booked sessions
  const { data: bookedSessions = [], isLoading: sessionsLoading } = useQuery({
    queryKey: ["booked-sessions", user?.email],
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `/api/booked-sessions?studentEmail=${user?.email}`
      );
      return data;
    },
  });

  // Fetch materials for a specific session
  const { data: materials = [], isLoading: materialsLoading } = useQuery({
    queryKey: ["session-materials", expandedSession],
    queryFn: async () => {
      if (!expandedSession) return [];
      const { data } = await axiosSecure.get(
        `/api/materials?sessionId=${expandedSession}`
      );
      return data;
    },
    enabled: !!expandedSession,
  });

  const toggleSession = (sessionId) => {
    setExpandedSession(expandedSession === sessionId ? null : sessionId);
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

  if (sessionsLoading) {
    return (
      <div className="text-center py-8">Loading your booked sessions...</div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="card bg-base-200 shadow-lg">
        <div className="card-body">
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="w-8 h-8" />
            <h1 className="card-title text-2xl md:text-3xl">Study Materials</h1>
          </div>

          {bookedSessions.length === 0 ? (
            <div className="text-center py-8">
              <p>You haven't booked any sessions yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookedSessions.map((session) => (
                <div
                  key={session._id}
                  className="collapse collapse-arrow bg-base-100"
                >
                  <input
                    type="checkbox"
                    checked={expandedSession === session.sessionId}
                    onChange={() => toggleSession(session.sessionId)}
                  />
                  <div className="collapse-title text-lg font-medium flex items-center">
                    {expandedSession === session.sessionId ? (
                      <ChevronDown className="w-5 h-5 mr-2" />
                    ) : (
                      <ChevronRight className="w-5 h-5 mr-2" />
                    )}
                    {session.sessionTitle}
                  </div>
                  <div className="collapse-content">
                    {materialsLoading &&
                    expandedSession === session.sessionId ? (
                      <div className="text-center py-4">
                        Loading materials...
                      </div>
                    ) : materials.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        {materials.map((material) => (
                          <div
                            key={material._id}
                            className="card bg-base-100 shadow-sm"
                          >
                            <div className="card-body p-4">
                              <h3 className="card-title text-md">
                                {material.title}
                              </h3>

                              {material.imageUrl && (
                                <div className="mt-2">
                                  <div className="relative">
                                    <img
                                      src={material.imageUrl}
                                      alt={material.title}
                                      className="rounded-lg w-full h-auto max-h-48 object-contain"
                                    />
                                    <button
                                      onClick={() =>
                                        handleDownload(material.imageUrl)
                                      }
                                      className="btn btn-sm btn-primary absolute bottom-2 right-2"
                                    >
                                      <Download className="w-4 h-4 mr-1" />
                                      Download
                                    </button>
                                  </div>
                                </div>
                              )}

                              {material.driveLink && (
                                <div className="mt-3">
                                  <a
                                    href={material.driveLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-sm btn-outline w-full"
                                  >
                                    <Link className="w-4 h-4 mr-1" />
                                    View on Google Drive
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p>No materials available for this session yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyMaterials;
