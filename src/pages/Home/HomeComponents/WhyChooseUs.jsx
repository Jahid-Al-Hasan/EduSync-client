import React from "react";
import { Lightbulb, BookOpen, Users, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router";

const WhyWeAreBest = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const imageVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: (custom) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: custom * 0.2,
        duration: 0.8,
        type: "spring",
      },
    }),
  };

  return (
    <section className="py-16 px-4 md:px-20 bg-base-100">
      {/* Top Heading */}
      <motion.div
        className="text-center mb-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <motion.h2
          className="text-3xl md:text-4xl font-bold"
          variants={itemVariants}
        >
          Why Choose Our Platform
        </motion.h2>
        <motion.p
          className="text-sm mt-2 text-gray-500"
          variants={itemVariants}
        >
          TRANSFORMING EDUCATION THROUGH COLLABORATION
        </motion.p>
      </motion.div>

      {/* Content Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Left Content */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.h3
            className="text-2xl md:text-3xl font-bold"
            variants={itemVariants}
          >
            Collaborative Learning <br /> Redefined
          </motion.h3>
          <motion.p className="mt-4 mb-6 text-gray-600" variants={itemVariants}>
            Our platform connects students with expert tutors and peers to
            create an engaging learning environment that adapts to your schedule
            and learning style.
          </motion.p>
          <motion.ul className="space-y-4" variants={containerVariants}>
            <motion.li
              className="flex items-center gap-2 text-gray-700"
              variants={itemVariants}
              whileHover={{ x: 5 }}
            >
              <Lightbulb className="text-primary" size={20} /> Interactive
              Learning Sessions
            </motion.li>
            <motion.li
              className="flex items-center gap-2 text-gray-700"
              variants={itemVariants}
              whileHover={{ x: 5 }}
            >
              <BookOpen className="text-primary" size={20} /> Comprehensive
              Study Materials
            </motion.li>
            <motion.li
              className="flex items-center gap-2 text-gray-700"
              variants={itemVariants}
              whileHover={{ x: 5 }}
            >
              <Users className="text-primary" size={20} /> Peer-to-Peer
              Collaboration
            </motion.li>
            <motion.li
              className="flex items-center gap-2 text-gray-700"
              variants={itemVariants}
              whileHover={{ x: 5 }}
            >
              <Clock className="text-primary" size={20} /> Flexible Scheduling
            </motion.li>
          </motion.ul>

          <Link to="/study-sessions">
            <motion.button
              className="mt-8 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-full text-sm font-medium shadow-md hover:shadow-lg transition duration-300 cursor-pointer"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore All Courses
            </motion.button>
          </Link>
        </motion.div>

        {/* Right Images */}
        <div className="flex justify-center gap-4">
          <motion.div
            className="w-48 md:w-56 h-72 rounded-2xl overflow-hidden relative shadow-lg"
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={imageVariants}
            whileHover={{ y: -10 }}
          >
            <img
              src="/about1.jpg"
              alt="Group study session"
              className="object-cover w-full h-full"
            />
            <motion.div
              className="absolute top-0 left-0 w-8 h-8 bg-secondary rounded-full -translate-x-1/2 -translate-y-1/2"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>

          <motion.div
            className="w-48 md:w-56 h-72 rounded-2xl overflow-hidden relative shadow-lg"
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={imageVariants}
            whileHover={{ y: -10 }}
          >
            <img
              src="/about2.jpg"
              alt="Online learning"
              className="object-cover w-full h-full"
            />
            <motion.div
              className="absolute bottom-0 right-0 w-16 h-16 bg-primary rounded-full translate-x-1/2 translate-y-1/2"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyWeAreBest;
