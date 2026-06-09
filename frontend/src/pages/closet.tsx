import { useState, useEffect } from "react";
import { supabase } from "../config/supabase";
import AppLayout from "../layouts/appLayout"; 
import { 
  PASTE_COLORS, 
  TEXT_COLORS,
} from "../config/auraConfig";
import { useOutfitBoard } from "../hooks/outfitBoard";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = {
  Tops: ["Sweater", "Baby Tee", "Cardigan", "Camisole"],
  Bottoms: ["Wide-leg Jeans", "Flare Jeans", "Cargo Pants", "Baggy Pants"],
  Outerwear: ["Denim Jacket", "Blazer"],
  Colors: ["Pastel Pink", "Soft Blue", "Creamy White", "Light Gray"],
  Accessories: ["Pearl Necklace", "Bucket Hat", "Round Sunglasses", "Mini Backpack"]
};

const OTHER_BOARDS: Record<string, string[]> = {
  "Mood": [
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",
    "https://images.unsplash.com/photo-1539109136881-3be0616acf4b"
  ],
  "Summer Vibes": [
    "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c",
    "https://images.unsplash.com/photo-1491895200222-0fc4a4c35e18"
  ],
  "Closet Item": [
    "https://images.unsplash.com/photo-1523381210434-271e8be1f52b"
  ]
};

export default function Closet() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isClosetOpen, setIsClosetOpen] = useState(false);


  const toggleItem = (item: string) => {
    setSelectedItems(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const {
    weather,
    images,
    caption,
    title,
    loading: boardLoading
  } = useOutfitBoard(profile);

  const temp = weather ? Math.round(weather.main?.temp) : null;

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        setProfile(data);
      }
      setLoading(false);
    }
    fetchData();
  }, []);
  if (loading) return <div className="flex h-full items-center justify-center">Loading...</div>;

return (
  <AppLayout>
    {/* Background Layer*/}
    <div 
      className=" w-full"
      style={{
        backgroundColor: PASTE_COLORS[profile?.aura_id] || PASTE_COLORS.healer,
      }}
    />

    {/* Main Content */}
    <main className="relative z-10 h-full w-full overflow-y-auto pb-20">
      <div className="max-w-3xl mx-auto p-2">
        
        {/* Closet Items */}
        <div className="flex flex-col glass-card p-5 rounded-3xl mt-4 shadow-lg mx-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gradient-pink md:text-lg mb-3">MY CLOSET</h3>
          <p className="text-[11px] text-gray-500 mb-3 italic leading-relaxed md:text-sm">
            Access your personalized closet and save your item to have the best recommended outfit
          </p>
          <button
            onClick={() => setIsClosetOpen(true)}
            className="bg-white px-8 py-1 rounded-full text-xs font-bold shadow-md hover:scale-105 transition-transform md:text-sm justify-center items-center flex"
            style={{ color: TEXT_COLORS[profile?.aura_id] || TEXT_COLORS.healer }}   
          >
            Explore my items ➤
          </button>   
        </div>

          {/* Pinterest Style Board */}
          <div className="glass-card p-5 rounded-3xl mt-4 shadow-lg mx-2">
            {/* Header */}
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gradient-pink md:text-lg">
                YOUR PINTEREST PICK
              </h3>
              {temp !== null && (
                <span className="text-[10px] text-gray-400 font-medium md:text-sm">
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
        
          {/* Collection of other outfit boards */}
          <div className="flex flex-col glass-card p-5 rounded-3xl mt-4 shadow-lg mx-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gradient-pink md:text-lg mb-3">COLLECTION</h3>
            <div className="flex gap-4 mt-2 overflow-x-auto pb-4 scrollbar-hide">
              {Object.entries(OTHER_BOARDS).map(([boardName, boardItems]) => (
                <div key={boardName} className="shrink-0 w-32">
                  {/* Container ảnh collection */}
                  <div className="grid grid-cols-2 gap-1 w-32 h-32 bg-white/40 p-1 rounded-2xl border border-white/50 shadow-sm overflow-hidden">
                    {boardItems.slice(0, 4).map((imgUrl, i) => (
                      <img 
                        key={i} 
                        src={imgUrl} 
                        alt="collection item" 
                        className="w-full h-full object-cover rounded-md"
                      />
                    ))}
                  </div>
                  <h3 className="text-xs font-bold text-gray-800 mt-2 truncate text-center">
                    {boardName}
                  </h3>
                </div>
              ))}
            </div>
          </div>

        {/* Closet Fullscreen Modal */}
        <AnimatePresence>
          {isClosetOpen && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute inset-0 z-50 flex flex-col"
              style={{
                backgroundColor: PASTE_COLORS[profile?.aura_id] || PASTE_COLORS.healer,
              }}
            >
              <div className="absolute inset-0 bg-white/30 z-0" />

              <div className="relative z-10 flex flex-col h-full">
                {/* Header*/}
                <div className="flex justify-between items-center px-6 py-4">
                  <button onClick={() => setIsClosetOpen(false)} className="text-sm font-bold text-gray-700">Save</button>
                  <h1 className="text-lg font-bold text-gray-800 mt-10">MY CLOSET</h1>
                  <button onClick={() => setIsClosetOpen(false)} className="text-sm font-bold text-gray-700">Close</button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 pb-10">
                  {Object.entries(CATEGORIES).map(([cat, items]) => (
                    <div key={cat} className="mb-8">
                      <h2 className="font-bold mb-4 text-gray-800 text-lg">{cat}</h2>
                      <div className="flex flex-wrap gap-2">
                        {items.map(item => (
                          <button
                            key={item}
                            onClick={() => toggleItem(item)}
                            className={`px-4 py-2 rounded-xl text-sm border transition-all flex items-center gap-1 ${
                              selectedItems.includes(item) 
                              ? "bg-white/80 border-gray-300 text-gray-900 shadow-sm" 
                              : "bg-white/40 border-transparent text-gray-600 hover:bg-white/60"
                            }`}
                          >
                            {selectedItems.includes(item) && "×"} {item}
                          </button>
                        ))}
                        {/* Button (+) to add new item */}
                        <button className="px-4 py-2 rounded-xl text-sm border border-dashed border-gray-400 text-gray-500">
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </main>
    </AppLayout>
  );
}
