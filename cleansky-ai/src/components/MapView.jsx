// src/components/MapView.jsx
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { motion } from "framer-motion";
import "leaflet/dist/leaflet.css";

export default function MapView({ lat, lon, pm25 }) {
  if (!lat || !lon) return null;

  const getColor = (value) => {
    if (value < 20) return "#38bdf8"; // good
    if (value < 50) return "#facc15"; // moderate
    if (value < 100) return "#f97316"; // unhealthy
    return "#ef4444"; // hazardous
  };

  return (
    <motion.div
      className="rounded-2xl overflow-hidden border border-gray-700 shadow-md w-full h-[400px] mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <MapContainer
        center={[lat, lon]}
        zoom={11}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        <CircleMarker
          center={[lat, lon]}
          radius={40}
          color={getColor(pm25)}
          fillOpacity={0.3}
          stroke={false}
        >
          <Popup>
            <div className="text-sm">
              <strong>PM2.5:</strong> {pm25.toFixed(1)} μg/m³ <br />
              <em>{pm25 < 50 ? "Good Air" : "Poor Air"}</em>
            </div>
          </Popup>
        </CircleMarker>
      </MapContainer>
    </motion.div>
  );
}
