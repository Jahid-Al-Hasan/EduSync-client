import { Bookmark, Quote, Star, ThumbsUp, Users } from "lucide-react";
import { motion } from "framer-motion";

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Michael Rodriguez",
      role: "Medical Student",
      avatar: "https://randomuser.me/api/portraits/men/75.jpg",
      content:
        "The Medical Terminology course helped me tremendously in my first year of med school. The tutor's teaching style made complex terms easy to remember.",
      rating: 5,
    },
    {
      id: 2,
      name: "Sophia Chen",
      role: "Computer Science Major",
      avatar: "https://randomuser.me/api/portraits/women/33.jpg",
      content:
        "I went from zero to confident in Python in just 6 weeks. The hands-on projects were exactly what I needed to prepare for my internship.",
      rating: 5,
    },
    {
      id: 3,
      name: "James Wilson",
      role: "Business Student",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
      content:
        "The financial accounting sessions clarified concepts I'd struggled with all semester. Worth every penny!",
      rating: 4,
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-base-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Students Say</h2>
          <p className="opacity-60 text-base lg:text-lg max-w-3xl mx-auto">
            Join thousands of students who have accelerated their learning with
            our platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className="card bg-base-200 shadow-lg hover:shadow-xl border border-base-300 "
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="card-body">
                <div className="flex items-center gap-2 text-yellow-400 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <Quote className="h-8 w-8 text-primary opacity-20 mb-2" />
                <p className="opacity-90 italic mb-6">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="avatar">
                    <div className="w-12 h-12 rounded-full">
                      <img src={testimonial.avatar} alt={testimonial.name} />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
