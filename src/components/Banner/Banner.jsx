import { motion } from "framer-motion";
import {
  BookOpen,
  Users,
  Clock,
  GraduationCap,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router";

const Banner = () => {
  return (
    <motion.section
      className="hero min-h-[70vh] relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background image with overlay */}
      <div
        className="hero-overlay absolute inset-0"
        style={{
          backgroundImage: `
      linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.6) 0%,
        rgba(0, 0, 0, 0.3) 100%
      ),
      url(/bg-img.jpg)
    `,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundBlendMode: "overlay",
        }}
      ></div>

      <div className="hero-content text-center text-neutral-content relative z-10">
        <div className="max-w-4xl">
          <motion.h1
            className="mb-5 text-4xl md:text-6xl font-bold"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Elevate Your Learning Experience
          </motion.h1>

          <motion.p
            className="mb-8 text-lg md:text-xl"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Connect with tutors, join study sessions, and access resources all
            in one place.
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Link to="/study-sessions">
              <button className="btn btn-primary gap-2">
                <BookOpen size={18} />
                Browse Sessions
              </button>
            </Link>
            <Link to="/tutors">
              <button className="btn btn-outline btn-accent gap-2">
                <Users size={18} />
                Find Tutors
              </button>
            </Link>
          </motion.div>

          {/* Features grid */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            {[
              { icon: <GraduationCap size={24} />, text: "Expert Tutors" },
              { icon: <BookOpen size={24} />, text: "100+ Sessions" },
              { icon: <Clock size={24} />, text: "Flexible Timing" },
              { icon: <Users size={24} />, text: "Peer Learning" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-2 p-4 bg-base-100/10 rounded-lg backdrop-blur-sm"
              >
                <div className="text-primary">{item.icon}</div>
                <p className="font-medium">{item.text}</p>
              </div>
            ))}
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="mt-12 flex flex-col items-center"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <p className="mb-2">Explore more</p>
            <ArrowRight className="rotate-90" />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default Banner;
