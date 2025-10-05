// src/pages/TermsAndConditions.jsx
import { motion } from "framer-motion";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-sky-950 to-gray-900 text-white px-6 py-10">
      <motion.h1
        className="text-4xl sm:text-5xl font-bold text-center text-sky-400 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Terms & Conditions
      </motion.h1>

      <motion.div
        className="max-w-4xl mx-auto bg-gray-800/70 border border-gray-700 rounded-2xl p-8 shadow-lg text-gray-200 space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <p>
          By accessing and using the Air Quality Dashboard, you agree to be bound by these Terms and Conditions.
          If you do not agree, please refrain from using the service.
        </p>

        <h2 className="text-xl font-semibold text-sky-300">1. Use of Service</h2>
        <p className="text-gray-300">
          The service provides air quality and weather information for personal, non-commercial use.
          You must not misuse or attempt to disrupt the service.
        </p>

        <h2 className="text-xl font-semibold text-sky-300">2. Accuracy</h2>
        <p className="text-gray-300">
          While we strive for accuracy, data is provided “as is” and may not reflect real-time conditions.
          Always use your own judgment for health-related decisions.
        </p>

        <h2 className="text-xl font-semibold text-sky-300">3. Intellectual Property</h2>
        <p className="text-gray-300">
          All content, design, and AI-generated summaries are the intellectual property of the service.
          You may not reproduce or distribute content without permission.
        </p>

        <h2 className="text-xl font-semibold text-sky-300">4. Limitation of Liability</h2>
        <p className="text-gray-300">
          We are not liable for any damages arising from the use or inability to use the service.
          This includes, but is not limited to, health outcomes or technical failures.
        </p>

        <h2 className="text-xl font-semibold text-sky-300">5. Modifications</h2>
        <p className="text-gray-300">
          We may update these terms at any time. Continued use of the service constitutes acceptance of any changes.
        </p>

        <p className="text-gray-400 text-sm">Effective Date: 5 October 2025</p>
      </motion.div>
    </div>
  );
}
