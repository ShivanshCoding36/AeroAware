import { motion } from "framer-motion";
import { FaLinkedin, FaYoutube, FaEnvelope } from 'react-icons/fa';
import { Link } from "react-router-dom";
export default function Footer() {
  return (
    <motion.footer
      className="bg-gray-900 border-t border-gray-800 text-gray-400 text-center py-6"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-5xl mx-auto px-4">
        <p className="text-sm">
          Built with ❤️ in India using NASA POWER, OpenAQ, and Gemini
        </p>
        <p className="text-xs mt-2 text-gray-500">
          © {new Date().getFullYear()} AeroAware — NASA Space Apps Challenge 2025
        </p>
        <div className="flex justify-center mt-3 space-x-4 text-sm">
            <div className="flex justify-center gap-6">
        <Link
          to="/privacy"
          className="hover:text-sky-400 transition-colors duration-200"
        >
          Privacy Policy
        </Link>
        <Link
          to="/terms"
          className="hover:text-sky-400 transition-colors duration-200"
        >
          Terms & Conditions
        </Link>
        <br />
      </div>
            <a href="https://www.linkedin.com/in/shivanshmathur9" target="_blank" rel="noopener noreferrer">
              <FaLinkedin />
            </a><span>•</span>
            <a href="mailto:shivanshmathur221@gmail.com">
              <FaEnvelope />
            </a><span>•</span>
            <a href="https://www.youtube.com/@shivanshmathur9" target="_blank" rel="noopener noreferrer">
              <FaYoutube />
            </a>
          
        </div>
      </div>
    </motion.footer>
  );
}
