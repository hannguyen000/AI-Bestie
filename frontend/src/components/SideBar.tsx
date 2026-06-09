import { Sparkles, Heart, House, Shirt, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "../routes/routes";

export function Sidebar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const items = [
    { label: "Home", icon: <House size={20} />, path: ROUTES.HOME },
    { label: "Glow up", icon: <Sparkles size={20} />, path: ROUTES.GLOW_UP },
    { label: "Health", icon: <Heart size={20} />, path: ROUTES.HEALTH },
    { label: "Closet", icon: <Shirt size={20} />, path: ROUTES.CLOSET },
    { label: "Profile", icon: <User size={20} />, path: ROUTES.PROFILE },
  ];

  return (
    <div className="hidden md:flex flex-col w-64 h-full bg-white/50 backdrop-blur-md border-r border-gray-200 p-6 space-y-6">
      <h2 className="text-xl font-black text-pink-500 mb-6">MENU</h2>
      <nav className="flex flex-col gap-4">
        {items.map((item) => (
          <Link 
            key={item.label} 
            to={item.path}
            className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
              isActive(item.path) ? "bg-pink-100 text-pink-600 font-bold" : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}