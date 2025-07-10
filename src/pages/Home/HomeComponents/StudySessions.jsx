import { BookOpen, Clock, Calendar, User } from "lucide-react";

const StudySessions = () => {
  // Sample data - replace with your API data
  const sessions = [
    {
      id: 1,
      title: "Advanced Calculus",
      tutor: "Dr. Smith",
      description: "Master multivariable calculus concepts and applications",
      startDate: "2023-06-15",
      endDate: "2023-08-20",
      status: "ongoing",
    },
    // Add 5 more session objects...
  ];

  const currentDate = new Date();

  return (
    <section className="py-16 bg-base-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Available Study Sessions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions
            .filter((session) => session.status === "approved")
            .map((session) => {
              const isOngoing =
                new Date(session.startDate) <= currentDate &&
                new Date(session.endDate) >= currentDate;

              return (
                <div key={session.id} className="card bg-base-200 shadow-xl">
                  <div className="card-body">
                    <div className="flex justify-between items-start">
                      <h3 className="card-title">{session.title}</h3>
                      <span
                        className={`badge ${
                          isOngoing ? "badge-success" : "badge-error"
                        }`}
                      >
                        {isOngoing ? "Ongoing" : "Closed"}
                      </span>
                    </div>
                    <p className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {session.tutor}
                    </p>
                    <p className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(session.startDate).toLocaleDateString()} -{" "}
                      {new Date(session.endDate).toLocaleDateString()}
                    </p>
                    <p>{session.description}</p>
                    <div className="card-actions justify-end">
                      <button className="btn btn-primary btn-sm">
                        <BookOpen className="w-4 h-4" />
                        Read More
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
};

export default StudySessions;
