import { motion } from "framer-motion";

export default function AQCard({ title, value, unit }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-gray-800 rounded-2xl p-5 shadow-md text-center border border-gray-700"
    >
      <h2 className="text-xl font-semibold text-gray-300">{title}</h2>
      <p className="text-3xl font-bold text-sky-400 mt-2">{value?.toFixed(1)} {unit}</p>
    </motion.div>
  );
}
