import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  BookOpen,
  Users,
  MessageSquare,
  HelpCircle,
} from "lucide-react";
import Logo from "../Logo/Logo";

const Footer = () => {
  const footerLinks = [
    {
      title: "Quick Links",
      links: [
        { name: "Home", href: "/" },
        { name: "About Us", href: "/about" },
        { name: "Courses", href: "/courses" },
        { name: "Tutors", href: "/tutors" },
        { name: "Study Groups", href: "/groups" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "FAQ", href: "/faq", icon: <HelpCircle size={16} /> },
        {
          name: "Contact Us",
          href: "/contact",
          icon: <MessageSquare size={16} />,
        },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Blog", href: "/blog", icon: <BookOpen size={16} /> },
        { name: "Community", href: "/community", icon: <Users size={16} /> },
        { name: "Webinars", href: "/webinars" },
        { name: "Study Materials", href: "/materials" },
      ],
    },
  ];

  const contactInfo = [
    { icon: <Mail size={18} />, text: "support@studycollab.com" },
    { icon: <Phone size={18} />, text: "+1 (555) 123-4567" },
    { icon: <MapPin size={18} />, text: "123 Learning St, Edu City" },
  ];

  const socialLinks = [
    { icon: <Facebook size={20} />, href: "#" },
    { icon: <Twitter size={20} />, href: "#" },
    { icon: <Instagram size={20} />, href: "#" },
    { icon: <Linkedin size={20} />, href: "#" },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Logo />
            <p className="mb-6">
              Empowering students through collaborative learning and expert
              guidance.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  className="text-gray-400 hover:text-primary transition-colors"
                  whileHover={{ y: -3 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Footer Links */}
          {footerLinks.map((column, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold text-white mb-4">
                {column.title}
              </h3>
              <ul className="space-y-3">
                {column.links.map((link, linkIndex) => (
                  <motion.li
                    key={linkIndex}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <a
                      href={link.href}
                      className="flex items-center gap-2 hover:text-primary transition-colors"
                    >
                      {link.icon && (
                        <span className="text-primary">{link.icon}</span>
                      )}
                      {link.name}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold text-white mb-4">
              Contact Us
            </h3>
            <ul className="space-y-4">
              {contactInfo.map((info, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-primary mt-0.5">{info.icon}</span>
                  <span>{info.text}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div
          className="border-t border-gray-800 my-8"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        />

        {/* Copyright */}
        <motion.div
          className="text-center text-gray-500 text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <p>
            &copy; {new Date().getFullYear()} StudyCollab. All rights reserved.
          </p>
          <p className="mt-2">
            Designed with ❤️ for better learning experiences
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
