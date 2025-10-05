// src/pages/PrivacyPolicy.jsx
import { motion } from "framer-motion";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-sky-950 to-gray-900 text-white px-6 py-10">
      <motion.h1
        className="text-4xl sm:text-5xl font-bold text-center text-sky-400 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Privacy Policy
      </motion.h1>

      <motion.div
        className="max-w-4xl mx-auto bg-gray-800/70 border border-gray-700 rounded-2xl p-8 shadow-lg text-gray-200 space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <p>
          Your privacy is important to us. This Privacy Policy explains how we collect,
          use, and protect the information you provide when using our Air Quality Dashboard.
        </p>

        <h2 className="text-xl font-semibold text-sky-300">1. Information We Collect</h2>
        <ul className="list-disc list-inside text-gray-300">
          <li>Location data to provide accurate air quality information.</li>
          <li>Email address if you choose to receive optional updates.</li>
          <li>Aggregated usage data to improve our services.</li>
        </ul>

        <h2 className="text-xl font-semibold text-sky-300">2. How We Use Information</h2>
        <ul className="list-disc list-inside text-gray-300">
          <li>To provide real-time air quality and weather information.</li>
          <li>To generate personalized insights via AI summary.</li>
          <li>To improve app functionality and user experience.</li>
        </ul>

        <h2 className="text-xl font-semibold text-sky-300">3. Data Sharing</h2>
        <p className="text-gray-300">
          We do not sell or share your personal information with third parties, except as required
          by law or to provide services you have explicitly requested.
        </p>

        <h2 className="text-xl font-semibold text-sky-300">4. Security</h2>
        <p className="text-gray-300">
          We implement reasonable technical measures to protect your data against unauthorized access,
          alteration, or disclosure.
        </p>

        <h2 className="text-xl font-semibold text-sky-300">5. Analytics</h2>
        <p className="text-gray-300">
          We may use anonymous analytics tools to understand app usage and improve performance.
          These tools do not identify individual users.
        </p>

        <h2 className="text-xl font-semibold text-sky-300">6. Changes</h2>
        <p className="text-gray-300">
          We may update this policy periodically. Changes will be posted here with the latest date.
        </p>

        <p className="text-gray-400 text-sm">Effective Date: 5 October 2025</p>
      </motion.div>
    </div>
  );
}
