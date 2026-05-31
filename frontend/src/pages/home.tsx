import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Droplets, CalendarDays } from "lucide-react";
import { supabase } from "../config/supabase";
import AppLayout from "../layouts/appLayout"; 
import { 
  CHARACTER_IMAGES, 
  CHARACTER_BACKGROUNDS, 
  TEXT_COLORS, 
  PASTE_COLORS 
} from "../config/auraConfig";

export default function Home() {
  const [profile, setProfile] = useState<any>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        console.log("Dữ liệu profile từ DB:", data);
        setProfile(data);
      }
      setLoading(false);
    }
    fetchData();
  }, []);
  if (loading) return <div className="flex h-full items-center justify-center">Loading...</div>;
  const waterGoal = profile ? (profile.weight * 0.033).toFixed(1) : "2.0";

  return (
    <AppLayout>
      <div className="relative h-full w-full overflow-y-auto pb-20">
        
        {/* Blurred Background Layer */}
        <div 
          className="absolute inset-0 z-0 opacity-50"
          style={{
            backgroundColor: PASTE_COLORS[profile?.aura_id] || PASTE_COLORS.healer,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 1.0
          }}
        />

        <div className="relative z-10 p-6">
          {/* Chat Widget */}
          <div className="relative overflow-hidden">
            <div 
              className="relative p-2 rounded-3xl flex gap-4 items-center mb-6 mt-7 mr-2 ml-2 overflow-hidden"
              style={{
                boxShadow: '0 10px 10px rgba(0,0,0,0.2)',               }}
            >
              <div 
                className="absolute inset-0 z-0"
                style={{
                  backgroundImage: `url(${CHARACTER_BACKGROUNDS[profile?.aura_id] || CHARACTER_BACKGROUNDS.healer})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: 0.9, 
                }}
              />
            <div className="relative z-10 flex gap-4 items-center w-full">
              <img 
                src={CHARACTER_IMAGES[profile?.aura_id] || CHARACTER_IMAGES.healer} 
                className="w-32 h-40 object-contain drop-shadow-lg -mt-2 -mb-2" 
              />
              <div className="flex-1 pr-3">
                <p className="text-xs font-medium mb-5 " style={{ color: TEXT_COLORS[profile?.aura_id] || TEXT_COLORS.healer }}>
                  Hey {profile?.username || "Bestie"}. How are you today?
                </p>
                <button 
                  onClick={() => setIsChatOpen(true)} 
                  className="bg-white px-8 py-1 rounded-full text-xs font-bold shadow-md hover:scale-105 transition-transform" 
                  style={{ color: TEXT_COLORS[profile?.aura_id] || TEXT_COLORS.healer }}
                >
                  Start to chat
                </button>
              </div>
          </div>
          </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card p-4 rounded-3xl text-center shadow-lg ml-2 mr-1">
              <h2 className="font-body font-black text-xs text-gradient-pink mb-4">
                WATER TRACKER
              </h2>
              <Droplets className="mx-auto mb-2 text-blue-400" />
              <p className="text-xl font-bold">{waterGoal}L</p>
              <p className="text-[10px] text-gray-400">Water Goal</p>
            </div>
            <div className="glass-card p-4 rounded-3xl text-center shadow-lg ml-1 mr-2">
              <h2 className="font-body font-black text-xs text-gradient-pink mb-4">
                CYCLE TRACKER
              </h2>
              <CalendarDays className="mx-auto mb-2 text-pink-400" />
              <p className="text-sm font-bold">Day 5</p>
              <p className="text-[10px] text-gray-400">Cycle Tracker</p>
            </div>
          </div>

          {/* Pinterest Style Board */}
          <div className="glass-card p-5 rounded-3xl mt-6 shadow-lg ml-2 mr-2">
            <h3 className="text-xs font-bold mb-3 uppercase tracking-wider text-gradient-pink">
              Your Pinterest Pick
            </h3>
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
              className="absolute inset-0 z-[100] p-6 flex flex-col mt-[10%]"
              style={{
                backgroundImage: `url(${CHARACTER_BACKGROUNDS[profile?.aura_id] || CHARACTER_BACKGROUNDS.healer})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute inset-0 bg-white/10 mt-5 z-0" />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-center mb-6">
                  <button 
                    onClick={() => setIsChatOpen(false)} 
                    className="text-sm font-bold text-gray-700 hover:text-gray-900"
                  >
                    Minimieren
                  </button>
                  
                  <button 
                    onClick={() => setIsChatOpen(false)} 
                    className="text-sm font-bold text-gray-700 hover:text-gray-900"
                  >
                    Beenden
                  </button>
                </div>
                <div className="flex-1 flex items-center justify-center text-gray-800 font-medium">
                  Chat Interface...
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}
