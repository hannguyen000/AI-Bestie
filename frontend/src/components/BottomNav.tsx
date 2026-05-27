import { Sparkles, Heart, House, Shirt, User } from "lucide-react";
import { Link } from "react-router-dom"; 
import { ROUTES } from "../routes/routes";

export function BottomNav() {
  return (
    <div className="h-18 bg-white/80 backdrop-blur-md border-t border-white/50 flex justify-around items-center px-4 
                shadow-[0_-4px_10px_-2px_rgba(156,163,175,0.5)]">
      <Link to={ROUTES.GLOW_UP}>
        <NavIcon icon={<Sparkles size={20} />} label="Glow up" />
      </Link>
      <Link to={ROUTES.HEALTH}>
        <NavIcon icon={<Heart size={20} />} label="Health" />
      </Link>
      <Link to={ROUTES.HOME}>
        <NavIcon icon={<House size={20} />} label="Home" active />
      </Link>
      <Link to={ROUTES.CLOSET}>
        <NavIcon icon={<Shirt size={20} />} label="Closet" />
      </Link>
      <Link to={ROUTES.PROFILE}>
        <NavIcon icon={<User size={20} />} label="Profile" />
      </Link>
    </div>
  );
}

function NavIcon({ icon, label, active }: any) {
  return (
    <div className={`flex flex-col items-center gap-1 ${active ? "text-pink-500" : "text-gray-400"} hover:bg-gray-100 rounded-lg p-2 transition-colors duration-200 scale-100 hover:scale-120`}>
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </div>
  );
}
