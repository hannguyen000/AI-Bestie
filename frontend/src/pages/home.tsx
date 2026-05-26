import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Heart, House, Shirt, User, Droplets, CalendarDays } from "lucide-react";
import { supabase } from "../config/supabase";

// Mock Data cho Aura Images
const CHARACTER_IMAGES: Record<string, string> = {
  healer: "https://ymivxyrrshkpyyrkndgu.supabase.co/storage/v1/object/public/system-assets/aura_healer.png",
  mentor: "https://ymivxyrrshkpyyrkndgu.supabase.co/storage/v1/object/public/system-assets/aura_mentor.png",
  sunshine: "https://ymivxyrrshkpyyrkndgu.supabase.co/storage/v1/object/public/system-assets/aura_sunshine.png",
};

export default function Home() {
  const [profile, setProfile] = useState<any>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    // Fetch dữ liệu profile để tính toán nước
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        setProfile(data);
      }
    }
    fetchData();
  }, []);

  const waterGoal = profile ? (profile.weight * 0.033).toFixed(1) : "2.0";

  return (
    <div className="relative flex flex-col h-full overflow-hidden">
      {/* Background blobs */}
      <div
        className="absolute -top-10 -right-10 w-56 h-56 rounded-full opacity-50"
        style={{
          background: "radial-gradient(circle, #DDD5F7, transparent 70%)",
          animation: "float 4s ease-in-out infinite",
        }}
      />
      <div
        className="absolute bottom-0 -left-16 w-48 h-48 rounded-full opacity-40"
        style={{
          background: "radial-gradient(circle, #F7C5D8, transparent 70%)",
          animation: "float 5s ease-in-out infinite 0.5s",
        }}
      />

      <Sparkles />
      <div className="p-6">
        {/* Chat Widget */}
        <div className="glass-card p-5 rounded-3xl flex gap-4 items-center mb-6 shadow-sm border border-white/50">
          <img src={CHARACTER_IMAGES[profile?.aura_type] || CHARACTER_IMAGES.healer} className="w-16 h-16 rounded-full" />
          <div>
            <p className="text-xs font-medium text-gray-600 mb-2">Hey {profile?.name || "Bestie"}. You're so beautiful today.</p>
            <button onClick={() => setIsChatOpen(true)} className="bg-white px-4 py-1.5 rounded-full text-xs font-bold border shadow-sm">Start to chat</button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card p-4 rounded-3xl text-center">
            <Droplets className="mx-auto mb-2 text-blue-400" />
            <p className="text-xl font-bold">{waterGoal}L</p>
            <p className="text-[10px] text-gray-400">Water Goal</p>
          </div>
          <div className="glass-card p-4 rounded-3xl text-center">
            <CalendarDays className="mx-auto mb-2 text-pink-400" />
            <p className="text-sm font-bold">Day 5</p>
            <p className="text-[10px] text-gray-400">Cycle Tracker</p>
          </div>
        </div>

        {/* Pinterest Style Board */}
        <div className="glass-card p-5 rounded-3xl mt-6">
          <h3 className="text-xs font-bold mb-3 uppercase tracking-wider">Your Pinterest Pick</h3>
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-1 h-24 bg-gray-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>

      {/* Chat Fullscreen Modal */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div 
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            className="fixed inset-0 z-50 bg-[#Fdf5f7] p-6 flex flex-col"
          >
            <button onClick={() => setIsChatOpen(false)} className="text-sm font-bold mb-4">Beenden</button>
            <div className="flex-1 flex items-center justify-center text-gray-400">Chat Interface...</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 w-full h-16 bg-white/80 backdrop-blur-md border-t flex justify-around items-center px-4">
        <NavIcon icon={<Sparkles size={20} />} label="Glow up" />
        <NavIcon icon={<Heart size={20} />} label="Health" />
        <NavIcon icon={<House size={20} />} label="Home" active />
        <NavIcon icon={<Shirt size={20} />} label="Closet" />
        <NavIcon icon={<User size={20} />} label="Profile" />
      </div>
    </div>
  );
}

function NavIcon({ icon, label, active }: any) {
  return (
    <div className={`flex flex-col items-center gap-1 ${active ? "text-pink-500" : "text-gray-400"}`}>
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </div>
  );
}