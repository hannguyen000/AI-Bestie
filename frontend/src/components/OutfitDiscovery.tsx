import { useState } from "react";

export function OutfitDiscovery({ open, onClose, images, collections, onAddToCollection, onCreateCollection }: {
  open: boolean;
  onClose: () => void;
  images: string[];
  collections: { id: string; name: string; outfits: string[] }[];
  onAddToCollection: (id: string, url: string) => void;
  onCreateCollection: (name: string, url: string) => void;
}) {
  const [index, setIndex] = useState(0);
  const [showSave, setShowSave] = useState(false);
  const [newName, setNewName] = useState("");
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  if (!open) return null;

  const url = images[index] ?? "";
  const next = () => { setShowSave(false); setIndex((i) => (i + 1) % Math.max(images.length, 1)); };

  const flash = (label: string) => { setSavedMsg(`Saved to ${label}`); setTimeout(() => setSavedMsg(null), 1500); };

  const handleAdd = (id: string, name: string) => { onAddToCollection(id, url); setShowSave(false); flash(name); };
  const handleCreate = () => {
    if (!newName.trim()) return;
    onCreateCollection(newName.trim(), url); setShowSave(false); flash(newName.trim()); setNewName("");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 p-4">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-5 relative">
        <button onClick={onClose} className="absolute top-4 right-5 text-sm font-bold text-gray-500">Close</button>
        <h2 className="text-center font-black text-rose-600 tracking-wide mb-4">STYLE DISCOVERY</h2>

        <div className="rounded-2xl overflow-hidden bg-gray-100 aspect-[4/5] mb-3">
          {url ? <img src={url} alt="outfit" className="w-full h-full object-cover" /> : <div className="w-full h-full" />}
        </div>
        <p className="text-xs text-gray-500 italic text-center mb-5">High-quality curated outfit inspiration</p>

        <div className="flex items-center justify-center gap-6">
          <button onClick={() => setShowSave(true)}
            className="w-14 h-14 rounded-full bg-purple-600 text-white flex flex-col items-center justify-center shadow-lg">
            <span className="text-lg leading-none">♥</span><span className="text-[8px] mt-0.5">Save</span>
          </button>
          <button onClick={next}
            className="w-14 h-14 rounded-full bg-purple-800 text-white flex flex-col items-center justify-center shadow-lg">
            <span className="text-lg leading-none">➤</span><span className="text-[8px] mt-0.5">Next</span>
          </button>
        </div>

        {savedMsg && <p className="text-center text-xs text-emerald-500 font-bold mt-3">{savedMsg} ✓</p>}

        {showSave && (
          <div className="absolute inset-0 bg-black/20 rounded-3xl flex items-center justify-center p-6"
            onClick={() => setShowSave(false)}>
            <div className="bg-white rounded-2xl shadow-xl p-4 w-full max-w-xs" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-3">
                <p className="text-sm font-bold text-gray-700">Save to collection</p>
                <button onClick={() => setShowSave(false)} className="text-xs text-gray-400">Close</button>
              </div>
              <div className="space-y-2 mb-3">
                {collections.length ? collections.map((c) => (
                  <button key={c.id} onClick={() => handleAdd(c.id, c.name)}
                    className="w-full py-2 rounded-xl border border-amber-200 bg-amber-50 text-sm text-gray-700 hover:bg-amber-100">
                    {c.name}
                  </button>
                )) : <p className="text-xs text-gray-400 text-center py-1">No collections yet</p>}
              </div>
              <div className="flex gap-2">
                <input value={newName} onChange={(e) => setNewName(e.target.value)}
                  placeholder="+ New collection" className="flex-1 p-2 rounded-xl border border-gray-200 text-sm outline-none" />
                <button onClick={handleCreate} disabled={!newName.trim()}
                  className="px-3 rounded-xl bg-purple-400 text-white text-sm disabled:opacity-40">Add</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}