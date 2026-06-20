import { useState, useEffect } from "react";
import { supabase } from "../config/supabase";
import AppLayout from "../layouts/appLayout";
import { PASTE_COLORS } from "../config/auraConfig";
import { useDailyLog } from "../hooks/useDailyLog";
import { WaterBottle } from "../components/WaterBottle";
import { SKIN_CONCERNS, PRODUCTS } from "../config/skincareCatalog";
import { SkincareCloset } from "../components/SkincareCloset";
import { RITUAL_ORDER, productsForStep, conflictsForPeriod } from "../config/skincareCatalog";

const HABITS = [
  { key: "sleep", label: "Slept enough last night" },
  { key: "breakfast", label: "Healthy breakfast" },
  { key: "water", label: "Drank enough water" },
  { key: "exercise", label: "Exercise" },
  { key: "skincare", label: "Skincare routine" },
];

const SKINCARE_STEPS = [
  { key: "cleanser", label: "Cleanser", note: "Gentle & refreshing" },
  { key: "toner", label: "Toner", note: "Hydration" },
  { key: "serum", label: "Serum", note: "Vitamin C · brighten" },
  { key: "sunscreen", label: "Sunscreen", note: "SPF 50+ · must apply!" },
];

const glowColor = (s: number) =>
  s <= 0 ? "bg-gray-100" : s < 34 ? "bg-teal-200" : s < 67 ? "bg-teal-400" : "bg-teal-600";

export default function GlowUp() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [monthScores, setMonthScores] = useState<Record<string, number>>({});
  const { log, loading: logLoading, addWater, toggleHabit, toggleSkincare, toggleSkinFocus } = useDailyLog();
  
  const goalMl = profile?.weight ? Math.round(profile.weight * 33) : 2000;

  const [userId, setUserId] = useState<string | null>(null);
  const [customHabits, setCustomHabits] = useState<{ key: string; label: string }[]>([]);
  const [newHabit, setNewHabit] = useState("");

  const [closet, setCloset] = useState<string[]>([]);
  const [showCloset, setShowCloset] = useState(false);
  const [period, setPeriod] = useState<"am" | "pm">("am");

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id); 
        const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
        setProfile(data); 
        setCloset(data?.closet ?? []);
        setCustomHabits(data?.custom_habits ?? []); 

        const now = new Date();
        const first = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
        const last = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0];
        const { data: logs } = await supabase
          .from("daily_logs")
          .select("log_date, water_ml, habits, skincare")
          .eq("user_id", user.id)
          .gte("log_date", first)
          .lte("log_date", last);

        const goal = data?.weight ? Math.round(data.weight * 33) : 2000;
        const map: Record<string, number> = {};
        (logs ?? []).forEach((l: any) => {
          const w = Math.min(100, ((l.water_ml ?? 0) / goal) * 100);
          const h = (Object.values(l.habits ?? {}).filter(Boolean).length / HABITS.length) * 100;
          const s = (Object.values(l.skincare ?? {}).filter(Boolean).length / SKINCARE_STEPS.length) * 100;
          map[l.log_date] = Math.round((w + h + s) / 3);
        });
        setMonthScores(map);
      }
      setLoading(false);
    })();
  }, []);

  const saveCustomHabits = async (next: { key: string; label: string }[]) => {
  setCustomHabits(next);
  if (userId) {
    await supabase.from("profiles").update({ custom_habits: next }).eq("id", userId);
  }
};

  const addCustomHabit = () => {
    const label = newHabit.trim();
    if (!label) return;
    saveCustomHabits([...customHabits, { key: `c_${Date.now()}`, label }]);
    setNewHabit("");
  };

  const removeCustomHabit = (key: string) =>
    saveCustomHabits(customHabits.filter((h) => h.key !== key));

  const toggleProduct = (id: string) => {
  const next = closet.includes(id) ? closet.filter((x) => x !== id) : [...closet, id];
    setCloset(next);
    if (userId) supabase.from("profiles").update({ closet: next }).eq("id", userId).then();
  };

  const recommended = log.skin_focus.length
    ? PRODUCTS.filter((p) => p.concerns.some((c) => log.skin_focus.includes(c)))
    : [];

  if (loading || logLoading)
    return <div className="flex h-full items-center justify-center">Loading...</div>;

  const allHabits = [...HABITS, ...customHabits];
  const habitsPct = allHabits.length
    ? Math.round((allHabits.filter((h) => log.habits[h.key]).length / allHabits.length) * 100)
    : 0;
  const ritualKeys = [
    ...RITUAL_ORDER.am.map((s) => `am_${s}`),
    ...RITUAL_ORDER.pm.map((s) => `pm_${s}`),
  ];
  const skincarePct = Math.round(
    (ritualKeys.filter((k) => log.skincare[k]).length / ritualKeys.length) * 100
  );
  const waterPct = Math.min(100, Math.round((log.water_ml / goalMl) * 100));
  const totalGlow = Math.round((habitsPct + skincarePct + waterPct) / 3);

  const now = new Date();
  const year = now.getFullYear(), month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthLabel = now.toLocaleString("en-US", { month: "long", year: "numeric" });

  return (
    <AppLayout>
      <div
        className="relative h-full w-full overflow-y-auto pb-20 md:pb-0 space-y-6"
        style={{ backgroundColor: PASTE_COLORS[profile?.aura_id] || PASTE_COLORS.healer }}
      >
        <div className="max-w-5xl mx-auto p-2 overflow-y-auto">
        {/* 1. Monthly Glow Map */}
        <div className="glass-card p-5 rounded-3xl mt-5">
          <div className="flex justify-between items-center mb-4">
          <h3 className="text-md text-gradient-pink font-bold text-gray-400 uppercase mb-4">Monthly Glow Map</h3>
            <span className="text-xs text-gray-400">{monthLabel}</span>
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const score = monthScores[dateStr] ?? 0;
              return <div key={day} title={`${dateStr}: ${score}%`} className={`h-6 rounded-md ${glowColor(score)}`} />;
            })}
          </div>
          <div className="flex items-center justify-end gap-1 mt-3 text-[10px] text-gray-400">
            <span>Low</span>
            <span className="w-3 h-3 rounded bg-teal-200" />
            <span className="w-3 h-3 rounded bg-teal-400" />
            <span className="w-3 h-3 rounded bg-teal-600" />
            <span>High</span>
          </div>
        </div>

        {/* 2. Daily Progress Overview */}
        <div className="glass-card p-5 rounded-3xl space-y-4 mt-5">
          <h3 className="text-md text-gradient-pink font-bold text-gray-400 uppercase mb-4">Daily Progress Overview</h3>
          <Progress label="Skincare Ritual Progress" pct={skincarePct} color="bg-purple-400" />
          <div className="text-center py-1">
            <p className="text-[10px] text-gray-400 uppercase font-bold">Today's Total Glow</p>
            <p className="text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-pink-400 to-purple-400">{totalGlow}%</p>
          </div>
          <Progress label="Habits Checklist Progress" pct={habitsPct} color="bg-teal-400" />
          <Progress label="Water Intake" pct={waterPct} color="bg-blue-400" />
        </div>

        {/* 3. Daily Habits Checklist */}
        <div className="glass-card p-5 rounded-3xl mt-5 flex flex-col">
          <h2 className="font-black text-gray-800 text-sm uppercase tracking-wide mb-1">Daily Habits Checklist</h2>
          <div className="flex flex-col items-center">
            <WaterBottle pct={waterPct} className="w-24 h-40" />
            <p className="text-sm font-bold mt-1">
              {(log.water_ml / 1000).toFixed(1)}L
              <span className="text-gray-400 font-normal"> / {(goalMl / 1000).toFixed(1)}L</span>
            </p>
            <div className="flex items-center justify-center gap-3 mt-2">
              <button onClick={() => addWater(-250)} className="w-9 h-9 rounded-full bg-white/70 shadow text-gray-600 text-lg leading-none">−</button>
              <span className="text-xs text-gray-500">250 ml</span>
              <button onClick={() => addWater(250)} className="w-9 h-9 rounded-full bg-blue-400 text-white shadow text-lg leading-none">+</button>
            </div>
          </div>
          <p className="text-xs text-gray-400 mb-4">
            Water: {(log.water_ml / 1000).toFixed(1)}L / {(goalMl / 1000).toFixed(1)}L
          </p>

          <div className="space-y-2">
            {allHabits.map((h) => {
              const done = !!log.habits[h.key];
              const isCustom = customHabits.some((c) => c.key === h.key);
              return (
                <div key={h.key} className="flex items-center gap-2">
                  <button
                    onClick={() => toggleHabit(h.key)}
                    className={`flex-1 flex items-center gap-3 p-3 rounded-2xl border transition-all text-left
                      ${done ? "bg-teal-50 border-teal-300" : "bg-white/60 border-gray-100"}`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] text-white ${done ? "bg-teal-400" : "bg-gray-200"}`}>
                      {done ? "✓" : ""}
                    </span>
                    <span className={`text-sm ${done ? "text-gray-700 line-through" : "text-gray-600"}`}>{h.label}</span>
                  </button>

                  {isCustom && (
                    <button
                      onClick={() => removeCustomHabit(h.key)}
                      title="Remove"
                      className="w-7 h-7 rounded-full text-gray-300 hover:text-rose-400 hover:bg-rose-50 flex items-center justify-center shrink-0"
                    >
                      ✕
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Add Custom Habit */}
          <div className="flex items-center gap-2 mt-3">
            <input
              type="text"
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCustomHabit()}
              placeholder="Add your own habit..."
              className="flex-1 p-3 rounded-2xl border border-gray-100 bg-white/60 text-sm text-gray-700 outline-none focus:border-teal-300"
            />
            <button
              onClick={addCustomHabit}
              disabled={!newHabit.trim()}
              className="w-10 h-10 rounded-2xl bg-teal-400 text-white text-xl shadow disabled:opacity-40 shrink-0"
            >
              +
            </button>
          </div>
        </div>

        {/* 4. Today's Skin Focus */}
        <div className="glass-card p-5 rounded-3xl mt-5 ">
          <h3 className="text-md text-gradient-pink font-bold text-gray-400 uppercase mb-2">Today's Skin Focus</h3>
          <p className="text-[10px] text-gray-400 mb-3" >Please choose tags to get better recommendations for your skincare routine today</p>
          <div className="flex flex-wrap gap-2">
            {SKIN_CONCERNS.map((f) => {
              const active = log.skin_focus.includes(f);
              return (
                <button
                  key={f}
                  onClick={() => toggleSkinFocus(f)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all
                    ${active
                      ? "bg-pink-500 text-white border-pink-500 shadow"
                      : "bg-pink-50 text-pink-600 border-pink-200 hover:border-pink-300"}`}
                >
                  {f}
                </button>
              );
            })}
          </div>
          {log.skin_focus.length > 0 && (
          <div className="glass-card p-5 rounded-3xl">
            <h2 className="font-black text-gray-800 text-sm uppercase tracking-wide mb-1">Recommended for you</h2>
            <p className="text-xs text-gray-400 mb-3">Based on your skin focus today</p>
            {recommended.length ? (
              <div className="grid grid-cols-2 gap-3">
                {recommended.map((p) => {
                  const owned = closet.includes(p.id);
                  return (
                    <div key={p.id} className="glass-card p-3 rounded-2xl">
                      <p className="text-sm font-bold text-gray-700">{p.name}</p>
                      <p className="text-[10px] text-gray-400 mb-2">{p.category}</p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {p.benefits.map((b) => (
                          <span key={b} className="text-[9px] px-2 py-0.5 rounded-full bg-pink-50 text-pink-500">{b}</span>
                        ))}
                      </div>
                      <button onClick={() => toggleProduct(p.id)}
                        className={`w-full text-xs py-1.5 rounded-full font-bold ${owned ? "bg-emerald-100 text-emerald-600" : "bg-purple-400 text-white"}`}>
                        {owned ? "✓ In closet" : "+ Add"}
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-gray-400">No matches — chọn vài tag focus ở trên nhé.</p>
            )}
          </div>
        )}
        </div>

        {/* 5. Skincare Ritual */}
        <div className="glass-card p-5 rounded-3xl mt-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-black text-gray-800 text-sm uppercase tracking-wide">Skincare Ritual</h2>
            <div className="flex items-center gap-2 text-xs font-bold">
              <span className={period === "am" ? "text-purple-600" : "text-gray-400"}>AM</span>
              <button
                onClick={() => setPeriod(period === "am" ? "pm" : "am")}
                className="relative w-12 h-6 rounded-full bg-purple-200"
              >
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-purple-500 transition-all ${period === "am" ? "left-0.5" : "left-6"}`} />
              </button>
              <span className={period === "pm" ? "text-purple-600" : "text-gray-400"}>PM</span>
            </div>
          </div>

          {(() => {
            const periodConflicts = conflictsForPeriod(closet, period);
            const conflictActives = new Set(periodConflicts.flatMap((c) => [c.a, c.b]));

            return (
              <div className="space-y-2">
                {RITUAL_ORDER[period].map((step, i) => {
                  const key = `${period}_${step}`;
                  const done = !!log.skincare[key];
                  const owned = productsForStep(closet, step, period);
                  const hasConflict = owned.some((p) => p.actives.some((a) => conflictActives.has(a)));
                  const proTip = owned.find((p) => p.proTip)?.proTip;

                  return (
                    <div key={step}
                      className={`flex items-start gap-3 p-3 rounded-2xl border ${done ? "bg-purple-50 border-purple-300" : "bg-white/60 border-gray-100"}`}>
                      <span className="text-xs font-bold text-gray-300 w-4 pt-0.5">{i + 1}</span>
                      <button onClick={() => toggleSkincare(key)}
                        className={`w-5 h-5 mt-0.5 rounded-full flex items-center justify-center text-[11px] text-white shrink-0 ${done ? "bg-purple-400" : "bg-gray-200"}`}>
                        {done ? "✓" : ""}
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className={`text-sm font-semibold ${done ? "text-gray-700" : "text-gray-600"}`}>{step}</p>
                          {proTip && (
                            <span className="text-[8px] font-black px-2 py-0.5 rounded-full bg-purple-500 text-white uppercase">Pro-Tip</span>
                          )}
                          {hasConflict && <span title="Conflict" className="text-amber-500">⚠️</span>}
                        </div>
                        {owned.length > 0 ? (
                          <p className="text-[11px] text-gray-500">{owned.map((p) => p.name).join(" · ")}</p>
                        ) : (
                          <p className="text-[10px] text-gray-300 italic">No product in closet</p>
                        )}
                        {proTip && <p className="text-[10px] text-purple-400 mt-0.5">{proTip}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}

          <button onClick={() => setShowCloset(true)}
            className="mt-4 w-full text-center text-sm font-bold text-purple-600 bg-white/60 border border-purple-200 rounded-full py-2 hover:bg-purple-50">
            Skincare Closet →
          </button>
        </div>
        </div>
        <SkincareCloset open={showCloset} onClose={() => setShowCloset(false)} closet={closet} onToggle={toggleProduct} />
      </div>
    </AppLayout>
  );
}

function Progress({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-gray-600">{label}</span>
        <span className="font-bold text-gray-800">{pct}%</span>
      </div>
      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
        <div className={`${color} h-full rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}