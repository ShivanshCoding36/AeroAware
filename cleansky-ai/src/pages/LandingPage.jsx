// src/pages/LandingPage.jsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function LandingPage() {
  const features = [
    {
      title: "AI-Powered Air Forecasting",
      text: "Predict next-hour PM2.5 levels using real NASA data and machine learning.",
      icon: "🤖",
    },
    {
      title: "Real-Time Data Fusion",
      text: "Combines ground sensor data and NASA POWER weather insights in real time.",
      icon: "📡",
    },
    {
      title: "Personalized Alerts",
      text: "Get email alerts when air quality worsens beyond your safety threshold.",
      icon: "📧",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center text-center px-6 py-20 bg-gradient-to-br from-sky-950 to-gray-900 min-h-screen">
      <motion.h1
        className="text-5xl sm:text-6xl font-extrabold text-sky-400 mb-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Breathe Better with AeroAware
      </motion.h1>

      <motion.p
        className="text-gray-300 max-w-2xl mb-10 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 1 }}
      >
        Powered by NASA data, AI, and real-time sensors — AeroAware helps you monitor and predict air quality for your community.
      </motion.p>
      <motion.button initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 1 }}>
      <Link
        to="/dashboard"
        className="bg-sky-500 hover:bg-sky-600 text-white px-8 py-3 rounded-xl font-semibold text-lg transition"
      >
        Launch Dashboard 🚀
      </Link>
</motion.button>
      <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-5xl">
        {features.map((f, i) => (
          <motion.div
            key={i}
            className="bg-gray-800/60 border border-gray-700 rounded-2xl p-6 backdrop-blur-sm hover:shadow-lg hover:shadow-sky-700/30 transition-all"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.2, duration: 0.7 }}
          >
            <div className="text-5xl mb-4">{f.icon}</div>
            <h3 className="text-2xl font-semibold text-sky-300 mb-2">{f.title}</h3>
            <p className="text-gray-400 text-base">{f.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
