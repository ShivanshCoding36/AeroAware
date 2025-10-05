// src/pages/About.jsx
import { motion } from "framer-motion";

export default function About() {
  const cards = [
    {
      title: "Our Mission",
      desc: "Empower communities with accessible air quality insights and real-time pollution forecasts using open NASA data.",
      icon: "🌍",
    },
    {
      title: "Our Technology",
      desc: "Combines NASA POWER weather data, OpenAQ ground sensors, and machine learning models trained on historical trends.",
      icon: "🛰️",
    },
    {
      title: "Our Vision",
      desc: "To make environmental awareness effortless, intuitive, and actionable — one forecast at a time.",
      icon: "🌤️",
    },
    {
      title: "Made For Space Apps 2025",
      desc: "Built for NASA’s global hackathon, AeroAware merges innovation, sustainability, and AI for cleaner air and a better planet.",
      icon: "🚀",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-sky-950 py-20 px-6 flex flex-col items-center">
      <motion.h1
        className="text-5xl font-bold text-sky-400 mb-10"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        About AeroAware
      </motion.h1>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2 max-w-6xl">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            className="bg-gray-800/70 border border-gray-700 p-8 rounded-3xl shadow-lg hover:shadow-sky-600/30 transition-all backdrop-blur-sm"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.2, duration: 0.7 }}
          >
            <div className="text-5xl mb-4">{card.icon}</div>
            <h3 className="text-2xl font-semibold text-sky-300 mb-2">{card.title}</h3>
            <p className="text-gray-300 leading-relaxed">{card.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
