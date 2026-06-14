import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays } from "lucide-react";
import { supabase } from "../config/supabase";
import AppLayout from "../layouts/appLayout";
import {
  CHARACTER_IMAGES_WITHOUT_BG,
  CHARACTER_BACKGROUNDS,
  TEXT_COLORS,
  PASTE_COLORS,
} from "../config/auraConfig";
import { useOutfitBoard } from "../hooks/outfitBoard";
import { getCycleInfo } from "../components/cycle";
import { useDailyLog } from "../hooks/useDailyLog";
import { WaterRing } from "../components/WaterRing";

function timeAgo(iso?: string | null) {
  if (!iso) return null;
  const min = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}hr ago`;
  return `${Math.floor(hr / 24)}d ago`;
}

export default function Home() {
  const [profile, setProfile] = useState<any>(null);
    const [profileLoading, setProfileLoading] = useState(true);


  // Chat
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

 const {
    weather,
    images,
    caption,
    title,
    loading: boardLoading
  } = useOutfitBoard(profile);

  const cycle = getCycleInfo(
    profile?.last_period_date,
    profile?.cycle_length,
    profile?.period_length
  );

  const { log: dailyLog, addWater } = useDailyLog();
const goalMl = profile?.weight ? Math.round(profile.weight * 33) : 2000; // ~33ml/kg
const waterPct = Math.min(100, Math.round((dailyLog.water_ml / goalMl) * 100));

  // Send message 
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isSending) return;
    const userMessage = inputMessage;
    setInputMessage("");
    setIsSending(true);
    const updatedMessages = [...messages, { role: "user", text: userMessage }];
    setMessages(updatedMessages);

    try {
      const response = await fetch(
        "https://ymivxyrrshkpyyrkndgu.supabase.co/functions/v1/chat-bestie",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            message: userMessage,
            aura_id: profile?.aura_id || "healer",
            username: profile?.username || "Bestie",
            history: messages,
          }),
        }
      );
      const data = await response.json();
      setMessages([...updatedMessages, { role: "model", text: data.reply }]);
    } catch (err: any) {
      console.error("Lỗi khi chat:", err);
    } finally {
      setIsSending(false);
    }
  };

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  // Fetch profile
  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        setProfile(data);
      }
      setProfileLoading(false);
    }
    fetchData();
  }, []);

  if (profileLoading)
    return <div className="flex h-full items-center justify-center">Loading...</div>;

  const temp = weather ? Math.round(weather.main?.temp) : null;

  return (
    <AppLayout hideNav={isChatOpen}>
      <div
        className="relative h-full w-full overflow-y-auto pb-20 md:pb-0"
        style={{ backgroundColor: PASTE_COLORS[profile?.aura_id] || PASTE_COLORS.healer }}
      >
        <main className="flex-1 h-full overflow-y-auto">
        <div className="max-w-3xl mx-auto p-2 overflow-y-auto">
          {/* Chat Widget Card */}
          <div
            className="relative p-2 rounded-3xl flex gap-4 items-center mb-6 mt-7 mx-2 overflow-hidden"
            style={{ boxShadow: "0 10px 10px rgba(0,0,0,0.2)" }}
          >
            <div
              className="absolute inset-0 z-0"
              style={{
                backgroundImage: `url(${CHARACTER_BACKGROUNDS[profile?.aura_id] || CHARACTER_BACKGROUNDS.healer})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: 0.9,
              }}
            />
            <div className="relative z-10 flex gap-4 items-center w-full md:h-50">
              <img
                src={CHARACTER_IMAGES_WITHOUT_BG[profile?.aura_id] || CHARACTER_IMAGES_WITHOUT_BG .healer}
                className="w-32 h-40 object-contain drop-shadow-lg -mt-2 -mb-2 md:w-40 md:h-55"
              />
              <div className="flex-1 pr-3">
                <p
                  className="text-xs font-medium mb-5 md:text-lg"
                  style={{ color: TEXT_COLORS[profile?.aura_id] || TEXT_COLORS.healer }}
                >
                  Hey {profile?.username || "Bestie"}. How are you today?
                </p>
                <button
                  onClick={() => setIsChatOpen(true)}
                  className="bg-white px-8 py-1 rounded-full text-xs font-bold shadow-md hover:scale-105 transition-transform md:text-lg"
                  style={{ color: TEXT_COLORS[profile?.aura_id] || TEXT_COLORS.healer }}
                >
                  Start to chat
                </button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card p-4 rounded-3xl text-center shadow-lg ml-2 mr-1">
              <h2 className="font-body font-black text-xs text-gradient-pink mb-3 md:text-lg">WATER TRACKER</h2>
               <WaterRing pct={waterPct} className="w-28 h-28 mx-auto" />
              <p className="text-sm font-bold text-gray-700 mt-3">
                {(dailyLog.water_ml / 1000).toFixed(1)}L of {(goalMl / 1000).toFixed(1)}L
              </p>
              {dailyLog.last_drank_at && (
                <p className="text-[11px] text-gray-400 mt-0.5">last drank: {timeAgo(dailyLog.last_drank_at)}</p>
              )}
              <div className="flex items-center justify-center gap-2 mt-3">
                <button onClick={() => addWater(-250)} className="w-8 h-8 rounded-full bg-white/70 shadow text-gray-600 text-lg leading-none">−</button>
                <span className="text-[10px] text-gray-500">250 ml</span>
                <button onClick={() => addWater(250)} className="w-8 h-8 rounded-full bg-blue-400 text-white shadow text-lg leading-none">+</button>
              </div>
            </div>
            <div className="glass-card p-4 rounded-3xl text-center shadow-lg ml-1 mr-2 md:text-lg">
              <h2 className="font-body font-black text-xs text-gradient-pink mb-4 md:text-lg">
                CYCLE TRACKER
              </h2>
              <CalendarDays size={100} className=" mx-auto mb-2 text-purple-300" />
              {cycle ? (
                cycle.isOnPeriod ? (
                  <>
                    <p className="text-xl font-bold text-rose-500">Day {cycle.cycleDay}</p>
                    <p className="text-[10px] text-gray-400 md:text-sm">On your period</p>
                  </>
                ) : (
                  <>
                    <p className="text-xl font-bold">{cycle.daysUntilNext}</p>
                    <p className="text-[10px] text-gray-400 md:text-sm">
                      {cycle.daysUntilNext === 1 ? "day" : "days"} until period
                    </p>
                  </>
                )
              ) : (
                <>
                  <p className="text-sm font-bold">--</p>
                  <p className="text-[10px] text-gray-400 md:text-sm">Set up cycle</p>
                </>
              )}
            </div>
          </div>

          {/* Pinterest Style Board */}
          <div className="glass-card p-5 rounded-3xl mt-4 shadow-lg mx-2">
            {/* Header */}
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gradient-pink md:text-lg">
                YOUR PINTEREST PICK TODAY
              </h3>
              <br />
              {temp !== null && (
                <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap">
                  {temp}°C · {weather?.weather?.[0]?.description}
                </span>
              )}
            </div>

            {/* AI Caption */}
            {boardLoading ? (
              <div className="h-3 w-2/3 bg-gray-200 rounded animate-pulse mb-3" />
            ) : (
              <p className="text-[11px] text-gray-500 mb-3 italic leading-relaxed md:text-sm">
                {caption}
              </p>
            )}

            {/* Board title tag */}
            {!boardLoading && title && (
              <div className="mb-2 md:mb-10">
                <span
                  className="text-[9px] font-bold px-2 py-0.5 rounded-full text-white md:text-sm"
                  style={{
                    backgroundColor: TEXT_COLORS[profile?.aura_id] || TEXT_COLORS.healer,
                    opacity: 0.85,
                  }}
                >
                  {title}
                </span>
              </div>
            )}

            {/* Images */}
            <div className="flex gap-2">
              {boardLoading
                ? [1, 2, 3].map((i) => (
                    <div key={i} className="flex-1 h-36 bg-gray-200 rounded-2xl animate-pulse" />
                  ))
                : images.length > 0
                ? images.map((url, i) => (
                    <div key={i} className="flex-1 h-36 rounded-2xl overflow-hidden md:h-90">
                      <img
                        src={url}
                        alt="style inspo"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))
                : [1, 2, 3].map((i) => (
                    <div key={i} className="flex-1 h-36 bg-gray-100 rounded-2xl" />
                  ))}
            </div>
          </div>
        </div>

        {/* Chat Fullscreen Modal */}
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute inset-0 z-100 flex flex-col mt-10 md:max-w-3xl md:justify-center md:flex-col md:mx-auto"
              style={{
                backgroundImage: `url(${CHARACTER_BACKGROUNDS[profile?.aura_id] || CHARACTER_BACKGROUNDS.healer})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-white/20 z-0" />

              <div className="relative z-10 flex flex-col h-full">
                {/* Header */}
                <div className="flex justify-between items-center px-6 pt-5 pb-4">
                  <button
                    onClick={() => setIsChatOpen(false)}
                    className="text-sm font-bold text-gray-700 hover:text-gray-900"
                  >
                    ← Minimize
                  </button>
                  <button
                    onClick={() => { setIsChatOpen(false); setMessages([]); }}
                    className="text-sm font-bold text-gray-700 hover:text-gray-900"
                  >
                    End Chat
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[75%] p-3 rounded-2xl text-xs shadow-sm ${
                          msg.role === "user"
                            ? "bg-white text-gray-800 rounded-tr-none"
                            : "text-white rounded-tl-none"
                        }`}
                        style={
                          msg.role !== "user"
                            ? { backgroundColor: TEXT_COLORS[profile?.aura_id] || TEXT_COLORS.healer }
                            : {}
                        }
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {isSending && (
                    <div className="flex justify-start">
                      <div
                        className="px-4 py-2 rounded-2xl rounded-tl-none text-xs text-white italic animate-pulse"
                        style={{
                          backgroundColor: TEXT_COLORS[profile?.aura_id] || TEXT_COLORS.healer,
                        }}
                      >
                        Your Bestie is typing...
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="px-4 pb-8 pt-3 flex gap-2 items-center bg-white/30 backdrop-blur-sm" style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}>
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 rounded-full text-xs border border-white/50 bg-white/80 focus:outline-none shadow-inner"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isSending}
                    className="bg-white p-2 px-4 rounded-full shadow-md text-xs font-bold hover:scale-105 transition-all disabled:opacity-50"
                    style={{ color: TEXT_COLORS[profile?.aura_id] || TEXT_COLORS.healer }}
                  >
                    ➤
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </main>
      </div>
    </AppLayout>
  );
}