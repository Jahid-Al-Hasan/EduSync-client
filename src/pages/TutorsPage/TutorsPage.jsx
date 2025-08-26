import { useQuery } from "@tanstack/react-query";
import {
  GraduationCap,
  Star,
  Users,
  BookOpen,
  Mail,
  MapPin,
} from "lucide-react";
import { motion } from "framer-motion";
import useAxios from "../../hooks/useAxios";
import LoadingPage from "../../components/LoadingPage/LoadingPage";
import ErrorPage from "../Error/ErrorPage";
import Swal from "sweetalert2";

const TutorsPage = () => {
  const axiosInstance = useAxios();

  const {
    data: tutors,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["tutors"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/api/users/tutors");
      return data;
    },
  });

  if (isLoading) return <LoadingPage />;
  if (isError) return <ErrorPage />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Meet Our Expert Tutors
        </h1>
        <p className="opacity-60 text-lg max-w-2xl mx-auto">
          Learn from experienced educators passionate about sharing their
          knowledge and helping students succeed.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tutors?.map((tutor) => (
          <motion.div
            key={tutor._id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true, margin: "-50px" }}
            className="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="card-body">
              <div className="flex items-start gap-4 mb-4">
                <div className="avatar">
                  <div className="w-16 h-16 rounded-full border border-primary ring-offset-base-100 ring-offset-2">
                    <img
                      src={
                        tutor.photoURL ||
                        "https://i.ibb.co/Y7J7ZRCq/icons8-user-100-2.png"
                      }
                      alt={tutor?.name}
                      className="object-cover"
                    />
                  </div>
                </div>
                <div>
                  <h2 className="card-title">{tutor?.name}</h2>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <GraduationCap className="h-4 w-4" />
                    <span>{tutor.specialization || "General Education"}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mt-4">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  <span>
                    {tutor?.rating?.toFixed(1) || "New"} (
                    {tutor?.reviewCount || 0} reviews)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <span>{tutor.sessionCount || 0} sessions hosted</span>
                </div>

                {tutor.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <span className="text-gray-600">{tutor.location}</span>
                  </div>
                )}

                {tutor.bio && (
                  <p className="text-gray-600 mt-2 line-clamp-3">{tutor.bio}</p>
                )}
              </div>

              <div className="card-actions justify-between mt-6">
                <div className="flex flex-wrap gap-2">
                  {tutor.subjects?.slice(0, 3).map((subject) => (
                    <span
                      key={subject}
                      className="badge badge-outline badge-sm"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => {
                    Swal.fire({
                      title: `Contact ${tutor.name}`,
                      html: `
                            <div class="text-center">
                              <p>Email the tutor directly at:</p>
                              <a href="mailto:${tutor.email}" class="text-primary font-bold">
                                ${tutor.email}
                              </a>
                            </div>
                          `,
                      icon: "info",
                      confirmButtonText: "Close",
                      showCloseButton: true,
                      focusConfirm: false,
                    });
                  }}
                  className="btn btn-primary btn-sm"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Contact
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {tutors?.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-xl font-medium">No tutors available</h3>
          <p className="mt-2 text-gray-500">
            Check back later or contact support
          </p>
        </div>
      )}
    </div>
  );
};

export default TutorsPage;
