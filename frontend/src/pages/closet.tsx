import { useState, useEffect } from "react";
import { supabase } from "../config/supabase";
import AppLayout from "../layouts/appLayout"; 
import { 
  PASTE_COLORS, 
  TEXT_COLORS,
} from "../config/auraConfig";
import { useOutfitBoard } from "../hooks/outfitBoard";
import { motion, AnimatePresence } from "framer-motion";
import { WARDROBE_CATEGORIES, WARDROBE_COLORS, SEASONS, type ClosetItem } from "../config/wardrobe";

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

  const [wardrobe, setWardrobe] = useState<ClosetItem[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [form, setForm] = useState({ category: "tops", name: "", color: "", season: "" });

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
        setUserId(user.id);
        setWardrobe(data?.wardrobe ?? []);
      }
      setLoading(false);
      
    }
    fetchData();
  }, []);
  if (loading) return <div className="flex h-full items-center justify-center">Loading...</div>;

  const saveWardrobe = async (next: ClosetItem[]) => {
  setWardrobe(next);
    if (userId) await supabase.from("profiles").update({ wardrobe: next }).eq("id", userId);
  };

  const addItem = () => {
    if (!form.name.trim()) return;
    saveWardrobe([...wardrobe, {
      id: `w_${Date.now()}`,
      name: form.name.trim(),
      category: form.category,
      color: form.color || undefined,
      season: form.season || undefined,
    }]);
    setForm({ ...form, name: "", color: "", season: "" });
  };

  const removeItem = (id: string) => saveWardrobe(wardrobe.filter((w) => w.id !== id));

return (
  <AppLayout>
    {/* Background */}
    <div
      className="absolute inset-0 z-0"
      style={{
        backgroundColor: PASTE_COLORS[profile?.aura_id] || PASTE_COLORS.healer,
      }}
    />

    {/* Main Content */}
    <main className="relative z-10 h-full w-full overflow-y-auto pb-20">
      <div className="max-w-5xl mx-auto p-2">
        
        {/* Closet Items */}
        <div className="flex flex-col glass-card p-5 rounded-3xl mt-4 shadow-lg mx-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gradient-pink md:text-lg">MY CLOSET</h3>
            <span className="text-[10px] text-gray-400 font-bold">{wardrobe.length} items</span>
          </div>
          <p className="text-[11px] text-gray-500 mb-3 italic md:text-sm">
            Organize your wardrobe for the best outfit recommendations
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {WARDROBE_CATEGORIES.map((c) => {
              const n = wardrobe.filter((w) => w.category === c.key).length;
              return (
                <span key={c.key}
                  className={`text-[11px] px-2.5 py-1 rounded-full ${n ? "bg-white/70 text-gray-700" : "bg-white/30 text-gray-400"}`}>
                  {c.emoji} {c.label}{n > 0 && <b className="ml-1">{n}</b>}
                </span>
              );
            })}
          </div>
          <button onClick={() => setIsClosetOpen(true)}
            className="bg-white px-8 py-1 rounded-full text-xs font-bold shadow-md hover:scale-105 transition-transform md:text-sm flex justify-center items-center"
            style={{ color: TEXT_COLORS[profile?.aura_id] || TEXT_COLORS.healer }}>
            Explore my items ➤
          </button>
        </div>

          {/* Pinterest Style Board */}
          <div className="glass-card p-5 rounded-3xl mt-4 shadow-lg mx-2">
            {/* Header */}
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gradient-pink md:text-lg">
                YOUR PINTEREST PICK TODAY
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
                  {/* Add item */}
                  <div className="glass-card p-4 rounded-2xl mb-6 bg-white/60">
                    <p className="text-xs font-bold text-gray-600 mb-3">Add an item</p>
                    <div className="flex gap-2 mb-3">
                      <select value={form.category} onChange={(e) => setForm({ ...form, name: "", category: e.target.value })}
                        className="flex-1 p-2 rounded-xl border border-gray-200 bg-white text-sm">
                        {WARDROBE_CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.emoji} {c.label}</option>)}
                      </select>
                      <input list="wardrobe-sugg" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Item name" className="flex-[2] p-2 rounded-xl border border-gray-200 bg-white text-sm" />
                      <datalist id="wardrobe-sugg">
                        {(WARDROBE_CATEGORIES.find((c) => c.key === form.category)?.suggestions ?? []).map((s) => <option key={s} value={s} />)}
                      </datalist>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap mb-3">
                      {WARDROBE_COLORS.map((c) => (
                        <button key={c.name} title={c.name}
                          onClick={() => setForm({ ...form, color: form.color === c.hex ? "" : c.hex })}
                          className={`w-6 h-6 rounded-full ${form.color === c.hex ? "ring-2 ring-pink-400" : "border border-gray-200"}`}
                          style={{ backgroundColor: c.hex }} />
                      ))}
                    </div>

                    <div className="flex gap-2 mb-3">
                      {SEASONS.map((s) => (
                        <button key={s} onClick={() => setForm({ ...form, season: form.season === s ? "" : s })}
                          className={`px-3 py-1 rounded-full text-xs border ${form.season === s ? "bg-pink-500 text-white border-pink-500" : "bg-white text-gray-500 border-gray-200"}`}>
                          {s}
                        </button>
                      ))}
                    </div>

                    <button onClick={addItem} disabled={!form.name.trim()}
                      className="w-full py-2 rounded-full bg-purple-400 text-white text-sm font-bold disabled:opacity-40">
                      + Add to closet
                    </button>
                  </div>

                  {/* Items grouped by category */}
                  {WARDROBE_CATEGORIES.map((c) => {
                    const items = wardrobe.filter((w) => w.category === c.key);
                    return (
                      <div key={c.key} className="mb-6">
                        <h2 className="font-bold mb-3 text-gray-800 flex items-center gap-2">
                          <span>{c.emoji}</span>{c.label}
                          <span className="text-xs font-normal text-gray-400">({items.length})</span>
                        </h2>
                        {items.length ? (
                          <div className="flex flex-wrap gap-2">
                            {items.map((it) => (
                              <div key={it.id} className="flex items-center gap-2 bg-white/70 rounded-xl px-3 py-2 border border-gray-100">
                                {it.color && <span className="w-3 h-3 rounded-full border border-gray-200" style={{ backgroundColor: it.color }} />}
                                <span className="text-sm text-gray-700">{it.name}</span>
                                {it.season && <span className="text-[9px] text-gray-400 bg-gray-100 px-1.5 rounded-full">{it.season}</span>}
                                <button onClick={() => removeItem(it.id)} className="text-gray-300 hover:text-rose-400 ml-0.5">×</button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-gray-300 italic">No items yet</p>
                        )}
                      </div>
                    );
                  })}
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
