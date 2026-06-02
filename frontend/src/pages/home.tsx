import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Droplets, CalendarDays } from "lucide-react";
import { supabase } from "../config/supabase";
import AppLayout from "../layouts/appLayout";
import {
  CHARACTER_IMAGES,
  CHARACTER_BACKGROUNDS,
  TEXT_COLORS,
  PASTE_COLORS,
} from "../config/auraConfig";

// Helpers

function getWeatherLabel(weather: any): string {
  if (!weather) return "mild";
  const temp = weather.main?.temp ?? 25;
  const desc = (weather.weather?.[0]?.main ?? "").toLowerCase();
  if (desc.includes("rain") || desc.includes("drizzle")) return "rainy";
  if (desc.includes("snow")) return "snowy";
  if (desc.includes("cloud")) return temp < 20 ? "cool and cloudy" : "warm and cloudy";
  if (temp >= 32) return "hot";
  if (temp >= 25) return "warm and sunny";
  if (temp >= 18) return "pleasant";
  return "cool";
}

async function fetchOutfitCaption(
  weatherLabel: string,
  styleTags: string[],
  groqKey: string
): Promise<string> {
  const prompt = `The weather today is ${weatherLabel}. The user's fashion style is: ${styleTags.join(", ")}. 
Write ONE short, fun, gen-Z bestie sentence (max 15 words) suggesting a cute outfit for today. 
No hashtags. Just the sentence.`;

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${groqKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 60,
      temperature: 0.9,
    }),
  });
  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() ?? "Style it your way today! ✨";
}

const STYLE_QUERY_MAP: Record<string, string> = {
  Cute:        "korean cute girl outfit ootd",
  Trendy:      "trendy street style outfit ootd",
  Sporty:      "sporty chic outfit athleisure ootd",
  Office:      "office fashion women outfit elegant",
  Street:      "streetwear outfit urban style ootd",
  Harmonious:  "soft aesthetic outfit pastel fashion",
  Minimalist:  "minimalist outfit clean aesthetic fashion",
  Y2K:         "y2k fashion outfit aesthetic",
  Boho:        "boho chic outfit aesthetic fashion",
  Vintage:     "vintage outfit retro fashion aesthetic",
};

function getAgeGroup(age: number): string {
  if (age < 18) return "teen girl";
  if (age < 25) return "young woman";
  if (age < 35) return "woman";
  if (age < 50) return "midlife woman";
  return "mature woman";
}

async function fetchPexelsImages(
  tags: string[],
  pexelsKey: string,
  age?: number          
): Promise<string[]> {
  if (!tags?.length) return [];

  const ageGroup = age ? getAgeGroup(age) : "woman";
  const selectedTags = tags.slice(0, 2);
  const allImages: string[] = [];

  for (const tag of selectedTags) {
    const baseQuery = STYLE_QUERY_MAP[tag] ?? `${tag} fashion outfit aesthetic ootd`;
    // Kết hợp age group vào query
    const query = `${ageGroup} ${baseQuery}`;
    const perPage = selectedTags.length === 1 ? 3 : 2;
    const randomPage = Math.floor(Math.random() * 5) + 1;

    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}&page=${randomPage}&orientation=portrait&size=medium`,
      { headers: { Authorization: pexelsKey } }
    );
    const data = await res.json();
    if (data.photos?.length) {
      const shuffled = data.photos.sort(() => Math.random() - 0.5);
      allImages.push(...shuffled.map((p: any) => p.src.large2x));
    }
  }

  const unique = [...new Map(allImages.map(url => [url, url])).values()];
  return unique.slice(0, 3);
}

// Component

export default function Home() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Chat
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Pinterest + weather
  const [weather, setWeather] = useState<any>(null);
  const [pinterestImages, setPinterestImages] = useState<string[]>([]);
  const [outfitCaption, setOutfitCaption] = useState<string>("");
  const [boardTitle, setBoardTitle] = useState<string>("");
  const [boardLoading, setBoardLoading] = useState(true);

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
      setLoading(false);
    }
    fetchData();
  }, []);

  // Fetch weather + Pinterest board
  useEffect(() => {
    if (!profile) return;

    async function buildBoard() {
      console.log("styles:", profile?.styles);
console.log("pexels key:", import.meta.env.VITE_PEXELS_ACCESS_KEY);
      setBoardLoading(true);
      try {
        const weatherKey = import.meta.env.VITE_OPENWEATHER_KEY;
        const pexelsKey = import.meta.env.VITE_PEXELS_ACCESS_KEY;
        const groqKey = import.meta.env.VITE_GROQ_API_KEY; 

        const pos = await new Promise<GeolocationPosition>((res, rej) =>
          navigator.geolocation.getCurrentPosition(res, rej, { timeout: 5000 })
        ).catch(() => null);

        let weatherData = null;
        let weatherLabel = "mild";

        if (pos && weatherKey) {
          const { latitude, longitude } = pos.coords;
          const wRes = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${weatherKey}`
          );
          weatherData = await wRes.json();
          setWeather(weatherData);
          weatherLabel = getWeatherLabel(weatherData);
        }

        // 2. Board title from style tags + weather
        const tags: string[] = (() => {
          try {
            return JSON.parse(profile?.styles ?? "[]");
          } catch {
            return [];
          }
        })();
        const tagLabel = tags.length > 0 ? tags.join(" & ") : "Your Style";
        setBoardTitle(`${tagLabel} · ${weatherLabel}`.toUpperCase());

        // 3. Fetch Pinterest images from Pexels based on style tags + weather
        if (pexelsKey && tags.length > 0) {
          const imgs = await fetchPexelsImages(tags, pexelsKey);
          setPinterestImages(imgs);
        }
        // 4. Fetch AI-generated outfit caption from Groq based on weather + style tags
        if (groqKey && tags.length > 0) {
          const caption = await fetchOutfitCaption(weatherLabel, tags, groqKey);
          setOutfitCaption(caption);
        } else {
          // Fallback caption without AI if no Groq key or no tags
          const fallbacks: Record<string, string> = {
            rainy: "It's raining! Wear a raincoat! 🌧️",
            hot: "It's hot today, mix a crop top with wide legs for a cool look! ☀️",
            cool: "It's getting cool, layer up with a jacket for an aesthetic look! 🍂",
            snowy: "It's snowing, wear an oversized coat with boots for the win! ❄️",
          };
          setOutfitCaption(
            fallbacks[weatherLabel] ??
              `Hey, with today ${weatherLabel} weather, this look is perfect to you ✨`
          );
        }
      } catch (e) {
        console.error("Board build error:", e);
        setOutfitCaption("Style it your way today! ✨");
      } finally {
        setBoardLoading(false);
      }
    }

    buildBoard();
  }, [profile]);

  if (loading)
    return <div className="flex h-full items-center justify-center">Loading...</div>;

  const waterGoal = profile ? (profile.weight * 0.033).toFixed(1) : "2.0";
  const temp = weather ? Math.round(weather.main?.temp) : null;

  return (
    <AppLayout>
      <div className="relative h-full w-full overflow-y-auto pb-20">
        {/* Background */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundColor: PASTE_COLORS[profile?.aura_id] || PASTE_COLORS.healer,
          }}
        />

        <div className="relative z-10 p-6">
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
            <div className="relative z-10 flex gap-4 items-center w-full">
              <img
                src={CHARACTER_IMAGES[profile?.aura_id] || CHARACTER_IMAGES.healer}
                className="w-32 h-40 object-contain drop-shadow-lg -mt-2 -mb-2"
              />
              <div className="flex-1 pr-3">
                <p
                  className="text-xs font-medium mb-5"
                  style={{ color: TEXT_COLORS[profile?.aura_id] || TEXT_COLORS.healer }}
                >
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
          <div className="glass-card p-5 rounded-3xl mt-4 shadow-lg mx-2">
            {/* Header */}
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gradient-pink">
                YOUR PINTEREST PICK
              </h3>
              {temp !== null && (
                <span className="text-[10px] text-gray-400 font-medium">
                  {temp}°C · {weather?.weather?.[0]?.description}
                </span>
              )}
            </div>

            {/* AI Caption */}
            {boardLoading ? (
              <div className="h-3 w-2/3 bg-gray-200 rounded animate-pulse mb-3" />
            ) : (
              <p className="text-[11px] text-gray-500 mb-3 italic leading-relaxed">
                {outfitCaption}
              </p>
            )}

            {/* Board title tag */}
            {!boardLoading && boardTitle && (
              <div className="mb-2">
                <span
                  className="text-[9px] font-bold px-2 py-0.5 rounded-full text-white"
                  style={{
                    backgroundColor: TEXT_COLORS[profile?.aura_id] || TEXT_COLORS.healer,
                    opacity: 0.85,
                  }}
                >
                  {boardTitle}
                </span>
              </div>
            )}

            {/* Images */}
            <div className="flex gap-2">
              {boardLoading
                ? [1, 2, 3].map((i) => (
                    <div key={i} className="flex-1 h-36 bg-gray-200 rounded-2xl animate-pulse" />
                  ))
                : pinterestImages.length > 0
                ? pinterestImages.map((url, i) => (
                    <div key={i} className="flex-1 h-36 rounded-2xl overflow-hidden">
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
              className="absolute inset-0 z-100 flex flex-col mt-10"
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
                <div className="px-4 pb-8 pt-3 flex gap-2 items-center bg-white/30 backdrop-blur-sm">
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
      </div>
    </AppLayout>
  );
}