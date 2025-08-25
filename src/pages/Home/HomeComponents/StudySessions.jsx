import { motion } from "framer-motion";
import useAxios from "../../../hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import {
  Clock,
  User,
  Calendar,
  BookOpen,
  DollarSign,
  Users,
} from "lucide-react";
import { Link } from "react-router";

const StudySessionCards = () => {
  const axiosInstance = useAxios();
  const {
    data: sessions = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["approvedSessions"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/study-sessions/approved");
      return res.data;
    },
  });

  if (isLoading)
    return <div className="text-center py-8">Loading sessions...</div>;
  if (isError)
    return (
      <div className="text-center py-8 text-error">Failed to load sessions</div>
    );

  // Filter sessions to show only ongoing ones (based on registration dates)
  const currentDate = new Date();
  const ongoingSessions = sessions
    ?.filter((session) => {
      const startDate = new Date(session.registrationStart);
      const endDate = new Date(session.registrationEnd);
      return currentDate >= startDate && currentDate <= endDate;
    })
    .slice(0, 6); // Show max 6 sessions

  if (!ongoingSessions?.length) {
    return (
      <div className="text-center py-12">
        <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium">
          No ongoing sessions available
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Check back later for new study sessions.
        </p>
      </div>
    );
  }

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-base-200">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center">
          Available Study Sessions
        </h2>
        <motion.p
          className="text-center text-lg mt-4 mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 0.8, y: 0 }}
          transition={{ delay: 0.1, duration: 1 }}
          viewport={{ once: true }}
        >
          Join ongoing study sessions and accelerate your learning journey
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ongoingSessions.map((session) => (
            <motion.div
              key={session._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: session._id * 0.1, duration: 1 }}
              viewport={{ once: true }}
            >
              <SessionCard session={session} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const SessionCard = ({ session }) => {
  const currentDate = new Date();
  const startDate = new Date(session.registrationStart);
  const endDate = new Date(session.registrationEnd);
  const isOngoing = currentDate >= startDate && currentDate <= endDate;
  const spotsLeft = session.maxStudents - session.currentStudents;

  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 h-full flex flex-col">
      <div className="card-body flex flex-col">
        <div className="flex justify-between items-start">
          <h3 className="card-title text-xl">{session.title}</h3>
          <span
            className={`badge ${isOngoing ? "badge-success" : "badge-error"}`}
          >
            {isOngoing ? "Ongoing" : "Closed"}
          </span>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <img
            src={
              session.tutorPhoto ||
              "https://randomuser.me/api/portraits/lego/1.jpg"
            }
            alt={session.tutorName}
            className="w-8 h-8 rounded-full"
          />
          <span className="font-medium">{session.tutorName}</span>
        </div>

        <p className="opacity-80 mt-2 line-clamp-3">{session.description}</p>

        <div className="mt-4 space-y-2 text-sm flex-grow">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>
              Starts: {new Date(session.classStart).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>
              Duration: {session.duration}{" "}
              {session.duration === 1 ? "week" : "weeks"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span>
              Fee:{" "}
              {session.registrationFee > 0
                ? `$${session.registrationFee}`
                : "Free"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Spots: {spotsLeft > 0 ? `${spotsLeft} left` : "Full"}</span>
          </div>
        </div>

        <div className="card-actions justify-end mt-4">
          <Link to={`/sessions/${session._id}`}>
            <button className="btn btn-primary btn-sm">Read More</button>{" "}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudySessionCards;
