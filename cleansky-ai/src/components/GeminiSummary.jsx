// src/components/GeminiSummary.jsx
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Loader2, Zap, Cloud, Droplet, Thermometer } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai'; // ESM import

// Initialize Gemini model
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-4">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <Loader2 className="w-8 h-8 text-sky-400" />
    </motion.div>
    <p className="ml-3 text-sky-300 font-medium">Analyzing Air Quality...</p>
  </div>
);

// DataCard Component
const DataCard = ({ icon: Icon, title, value, unit, color }) => (
  <div className="flex flex-col items-center justify-center p-4 bg-gray-700/50 rounded-xl shadow-inner border border-gray-600">
    <Icon className={`w-8 h-8 ${color}`} />
    <p className="text-sm font-light text-gray-300 mt-2">{title}</p>
    <p className="text-2xl font-bold text-white mt-1">{value} <span className="text-base font-medium">{unit}</span></p>
  </div>
);

// Main GeminiSummary Component
export default function GeminiSummary({ data }) {
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSummary = useCallback(async () => {
    if (!data) return;
    setIsLoading(true);
    setSummary("");

    const userQuery = `
      You are an expert environmental health analyst. Provide a factual, trustworthy, and actionable air quality report. Dont put anything in bold. 
      Use Google Search grounding to ensure health advice is current. 
      Do not include a title or introduction in your output, just the report text.

      Current PM2.5: ${data.ground.pm25} μg/m³
      Predicted Next Hour PM2.5: ${data.forecast.predicted_pm25_next_hour.toFixed(2)} μg/m³
      Temperature: ${data.weather.temperature}°C
      Humidity: ${data.weather.humidity}%

      The summary must be concise (max 250 words) and include:
      1. Health meaning of current PM2.5 level (Good, Moderate, Unhealthy).
      2. Vulnerable groups most affected.
      3. 3-5 actionable protective measures for residents.
    `;

    try {
      const result = await model.generateContent(userQuery);
      const responseText = result.response.text() || "No summary available.";
      setSummary(responseText);
    } catch (err) {
      console.error("Gemini API error:", err);
      setSummary("Failed to generate summary. Try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [data]);

  // Auto-generate summary when data changes
  useEffect(() => {
    handleSummary();
  }, [handleSummary]);

  if (!data) return null;

  return (
    <motion.div
      className="bg-gray-800 rounded-2xl p-6 w-full max-w-4xl mx-auto mt-8 border border-gray-700 shadow-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-extrabold text-white mb-6">
        AI Air Quality Report for {data.city || "Your Area"}
      </h2>

      {/* Data Display Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <DataCard 
          icon={Cloud} 
          title="Current PM2.5" 
          value={data.ground.pm25} 
          unit="μg/m³" 
          color="text-yellow-400" 
        />
        <DataCard 
          icon={Zap} 
          title="Next Hour Est." 
          value={data.forecast.predicted_pm25_next_hour.toFixed(2)} 
          unit="μg/m³" 
          color="text-orange-400" 
        />
        <DataCard 
          icon={Thermometer} 
          title="Temperature" 
          value={data.weather.temperature} 
          unit="°C" 
          color="text-red-400" 
        />
        <DataCard 
          icon={Droplet} 
          title="Humidity" 
          value={data.weather.humidity} 
          unit="%" 
          color="text-blue-400" 
        />
      </div>
      {/* Summary Output */}
      <motion.div
        className="bg-gray-700 p-5 rounded-xl border border-gray-600 min-h-[150px]"
        key={summary} // ensures animation when content updates
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {isLoading ? <LoadingSpinner /> : (
          <p className="text-gray-300 whitespace-pre-line text-sm leading-relaxed">
            {summary || "Click 'Generate AI Summary' to receive a health and action report based on the current data."}
          </p>
        )}
      </motion.div>
      <p className="text-sm text-gray-400 text-right mt-2 mb-0">Powered by Gemini</p>
    </motion.div>
  );
}
