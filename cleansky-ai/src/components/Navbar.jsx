import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { Rocket, Home, Info, Map } from "lucide-react";

export default function Navbar() {
  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Dashboard", path: "/dashboard", icon: Map },
    { name: "About", path: "/about", icon: Info },
  ];

  return (
    <motion.nav
      className="fixed top-0 left-0 w-full bg-gray-900/80 backdrop-blur-md border-b border-gray-800 z-50"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          className="flex items-center space-x-2 text-sky-400 font-bold text-lg"
          whileHover={{ scale: 1.05 }}
        >
          <Rocket className="w-5 h-5" />
          <span>AeroAware</span>
        </motion.div>

        {/* Links */}
        <div className="flex space-x-6">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-1 px-3 py-2 rounded-lg transition-all duration-300 ${
                  isActive
                    ? "bg-sky-700 text-white"
                    : "text-gray-300 hover:text-white hover:bg-gray-800"
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}
