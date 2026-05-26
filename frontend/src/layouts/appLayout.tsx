import type { ReactNode } from "react";
import { Sparkles, Heart, Home, Shirt, User } from "lucide-react";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return <div className="phone-shell bg-aura-gradient">{children}</div>;
}

export function BottomNav() {
  return (
    <div className="fixed bottom-0 w-full h-16 bg-white/80 backdrop-blur-md border-t border-white/50 flex justify-around items-center px-4">
      <NavIcon icon={<Sparkles size={20} />} label="Glow up" />
      <NavIcon icon={<Heart size={20} />} label="Health" />
      <NavIcon icon={<Home size={20} />} label="Home" active />
      <NavIcon icon={<Shirt size={20} />} label="Closet" />
      <NavIcon icon={<User size={20} />} label="Profile" />
    </div>
  );
}

function NavIcon({ icon, label, active }: any) {
  return (
    <div className={`flex flex-col items-center gap-1 ${active ? "text-aura-pink-dark" : "text-gray-400"}`}>
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </div>
  );
}
