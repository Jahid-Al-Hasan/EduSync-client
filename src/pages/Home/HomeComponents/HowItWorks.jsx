import { useState } from "react";
import {
  Search,
  Calendar,
  Users,
  GraduationCap,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router";

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      icon: <Search className="w-8 h-8" />,
      title: "Browse Sessions",
      description:
        "Explore a wide range of study sessions across various subjects and skill levels. Filter by topic, tutor, or schedule to find the perfect match.",
      color: "bg-primary",
      features: ["1000+ Sessions", "50+ Subjects", "Advanced Filters"],
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Book & Schedule",
      description:
        "Reserve your spot in upcoming sessions. Choose from free or premium options and get instant confirmation with calendar integration.",
      color: "bg-secondary",
      features: ["Instant Booking", "Calendar Sync", "Flexible Scheduling"],
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Join & Collaborate",
      description:
        "Connect with expert tutors and students in interactive virtual classrooms. Real-time collaboration with screen sharing and resource sharing.",
      color: "bg-accent",
      features: ["Live Sessions", "Group Collaboration", "Resource Sharing"],
    },
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: "Achieve Success",
      description:
        "Track your progress, access session recordings, and build your learning portfolio with certifications and achievement badges.",
      color: "bg-info",
      features: ["Progress Tracking", "Session Recordings", "Certifications"],
    },
  ];

  const nextStep = () => {
    setActiveStep((prev) => (prev + 1) % steps.length);
  };

  const prevStep = () => {
    setActiveStep((prev) => (prev - 1 + steps.length) % steps.length);
  };

  return (
    <section id="how-it-works" className="max-w-7xl mx-auto py-16 px-4">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-lg opacity-80 max-w-2xl mx-auto">
            Simple steps to start your collaborative learning journey. Join our
            community and transform your educational experience.
          </p>
        </div>

        {/* Desktop Steps Grid */}
        <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <div
              key={index}
              className="card transition-all duration-300 transform hover:-translate-y-2 group"
            >
              <div className="card-body text-center relative">
                {/* Step Number */}
                <div className="absolute top-4 left-4">
                  <span className="text-2xl font-bold text-primary">
                    0{index + 1}
                  </span>
                </div>

                {/* Icon */}
                <div
                  className={`w-20 h-20 rounded-full ${step.color} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <div className="text-base-100 text-4xl">{step.icon}</div>
                </div>

                {/* Content */}
                <h3 className="card-title text-xl mb-4 justify-center">
                  {step.title}
                </h3>
                <p className="opacity-80 mb-6">{step.description}</p>

                {/* Features List */}
                <div className="space-y-2">
                  {step.features.map((feature, featureIndex) => (
                    <span
                      key={featureIndex}
                      className="badge badge-outline badge-sm mr-2 mb-2"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="lg:hidden mb-12">
          <div className="card bg-base-200 shadow-lg">
            <div className="card-body text-center">
              {/* Step Number */}
              <div className="text-center mb-4">
                <span className="text-2xl font-bold text-primary">
                  0{activeStep + 1}
                </span>
              </div>

              {/* Icon */}
              <div
                className={`w-16 h-16 rounded-full ${steps[activeStep].color} flex items-center justify-center mx-auto mb-6`}
              >
                <div className="text-base-100">{steps[activeStep].icon}</div>
              </div>

              {/* Content */}
              <h3 className="card-title text-xl mb-4 justify-center">
                {steps[activeStep].title}
              </h3>
              <p className="opacity-80 mb-6">{steps[activeStep].description}</p>

              {/* Features List */}
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {steps[activeStep].features.map((feature, index) => (
                  <span key={index} className="badge badge-outline badge-sm">
                    {feature}
                  </span>
                ))}
              </div>

              {/* Navigation Arrows */}
              <div className="flex justify-between items-center">
                <button
                  onClick={prevStep}
                  className="btn btn-ghost btn-circle"
                  aria-label="Previous step"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <div className="flex gap-2">
                  {steps.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveStep(index)}
                      className={`w-3 h-3 rounded-full ${
                        index === activeStep ? "bg-primary" : "bg-base-300"
                      }`}
                      aria-label={`Go to step ${index + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextStep}
                  className="btn btn-ghost btn-circle"
                  aria-label="Next step"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-base-100 border border-accent rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold mb-4">
              Start Your Learning Journey Today
            </h3>
            <p className="text-lg opacity-80 mb-6 max-w-2xl mx-auto">
              Join 100,000+ students and 500+ tutors who are already
              transforming their educational experience with our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <button className="btn btn-accent btn-md lg:btn-lg">
                  Register Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
