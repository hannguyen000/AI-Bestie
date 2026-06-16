import { PRODUCTS, findConflicts, type SkincareProduct } from "../config/skincareCatalog";

export function SkincareCloset({
  open, onClose, closet, onToggle,
}: {
  open: boolean;
  onClose: () => void;
  closet: string[];
  onToggle: (id: string) => void;
}) {
  if (!open) return null;

  const conflicts = findConflicts(closet);
  const general = PRODUCTS.filter((p) => p.zone === "general");
  const acne = PRODUCTS.filter((p) => p.zone === "acne");

  const Card = ({ p }: { p: SkincareProduct }) => {
    const owned = closet.includes(p.id);
    return (
      <button
        onClick={() => onToggle(p.id)}
        className={`relative text-left glass-card p-3 rounded-2xl border transition-all ${owned ? "border-emerald-300" : "border-transparent"}`}
      >
        {owned && (
          <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-emerald-400 text-white flex items-center justify-center text-xs shadow">✓</span>
        )}
        <p className="text-sm font-bold text-gray-700">{p.name}</p>
        <p className="text-[10px] text-gray-400 mb-2">{p.category}</p>
        <div className="flex flex-wrap gap-1">
          {p.benefits.map((b) => (
            <span key={b} className="text-[9px] px-2 py-0.5 rounded-full bg-pink-50 text-pink-500">{b}</span>
          ))}
        </div>
      </button>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/30 p-4" onClick={onClose}>
      <div
        className="bg-white/90 backdrop-blur w-full max-w-md max-h-[85vh] overflow-y-auto rounded-3xl p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-black text-purple-700 text-lg uppercase tracking-wide">Skincare Closet</h2>
          <button onClick={onClose} className="text-sm text-gray-500 font-bold">Close</button>
        </div>

        {conflicts.length > 0 && (
          <div className="bg-amber-50 border border-amber-300 rounded-2xl p-3 mb-4">
            <p className="text-amber-700 font-bold text-sm mb-1">⚠️ Conflict Alert!</p>
            {conflicts.map((c, i) => (
              <p key={i} className="text-[11px] text-amber-700 leading-snug mb-0.5">
                <b>{c.a} + {c.b}:</b> {c.reason}
              </p>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mb-5">
          {general.map((p) => <Card key={p.id} p={p} />)}
        </div>

        <p className="text-purple-500 font-bold text-sm mb-2">Acne Zone</p>
        <div className="grid grid-cols-2 gap-3">
          {acne.map((p) => <Card key={p.id} p={p} />)}
        </div>
      </div>
    </div>
  );
}