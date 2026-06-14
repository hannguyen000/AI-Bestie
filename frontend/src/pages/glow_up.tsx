import { useState, useEffect } from "react";
import { supabase } from "../config/supabase";
import AppLayout from "../layouts/appLayout";
import { PASTE_COLORS } from "../config/auraConfig";
import { useDailyLog } from "../hooks/useDailyLog";
import { WaterBottle } from "../components/WaterBottle";

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

const SKIN_FOCUS = ["Acne-Prone", "Dullness", "Dry", "Redness"];

const glowColor = (s: number) =>
  s <= 0 ? "bg-gray-100" : s < 34 ? "bg-teal-200" : s < 67 ? "bg-teal-400" : "bg-teal-600";

export default function GlowUp() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [monthScores, setMonthScores] = useState<Record<string, number>>({});
  const { log, loading: logLoading, addWater, toggleHabit, toggleSkincare, toggleSkinFocus } = useDailyLog();

  const goalMl = profile?.weight ? Math.round(profile.weight * 33) : 2000;

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
        setProfile(data);

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

  if (loading || logLoading)
    return <div className="flex h-full items-center justify-center">Loading...</div>;

  const habitsPct = Math.round((HABITS.filter((h) => log.habits[h.key]).length / HABITS.length) * 100);
  const skincarePct = Math.round((SKINCARE_STEPS.filter((s) => log.skincare[s.key]).length / SKINCARE_STEPS.length) * 100);
  const waterPct = Math.min(100, Math.round((log.water_ml / goalMl) * 100));
  const totalGlow = Math.round((habitsPct + skincarePct + waterPct) / 3);

  const now = new Date();
  const year = now.getFullYear(), month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthLabel = now.toLocaleString("en-US", { month: "long", year: "numeric" });

  return (
    <AppLayout>
      <div
        className="relative min-h-full p-6 space-y-6"
        style={{ backgroundColor: PASTE_COLORS[profile?.aura_id] || PASTE_COLORS.healer }}
      >
        {/* 1. Monthly Glow Map */}
        <div className="glass-card p-5 rounded-3xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-black text-gray-800 text-sm uppercase tracking-wide">Monthly Glow Map</h2>
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
        <div className="glass-card p-5 rounded-3xl space-y-4">
          <h2 className="font-black text-gray-800 text-sm uppercase tracking-wide">Daily Progress Overview</h2>
          <Progress label="Skincare Ritual Progress" pct={skincarePct} color="bg-purple-400" />
          <div className="text-center py-1">
            <p className="text-[10px] text-gray-400 uppercase font-bold">Today's Total Glow</p>
            <p className="text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-pink-400 to-purple-400">{totalGlow}%</p>
          </div>
          <Progress label="Habits Checklist Progress" pct={habitsPct} color="bg-teal-400" />
          <Progress label="Water Intake" pct={waterPct} color="bg-blue-400" />
        </div>

        {/* 3. Daily Habits Checklist */}
        <div className="glass-card p-5 rounded-3xl">
          <h2 className="font-black text-gray-800 text-sm uppercase tracking-wide mb-1">Daily Habits Checklist</h2>
          <p className="text-xs text-gray-400 mb-4">
            Water: {(log.water_ml / 1000).toFixed(1)}L / {(goalMl / 1000).toFixed(1)}L
          </p>
          <div className="space-y-2">
            {HABITS.map((h) => {
              const done = !!log.habits[h.key];
              return (
                <button key={h.key} onClick={() => toggleHabit(h.key)}
                  className={`w-full flex items-center gap-3 p-3 rounded-2xl border transition-all text-left
                    ${done ? "bg-teal-50 border-teal-300" : "bg-white/60 border-gray-100"}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] text-white ${done ? "bg-teal-400" : "bg-gray-200"}`}>{done ? "✓" : ""}</span>
                  <span className={`text-sm ${done ? "text-gray-700 line-through" : "text-gray-600"}`}>{h.label}</span>
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-center gap-3 mt-4">
            <button onClick={() => addWater(-250)} className="w-9 h-9 rounded-full bg-white/70 shadow text-gray-600 text-lg leading-none">−</button>
            <span className="text-xs text-gray-500">+250 ml water</span>
            <button onClick={() => addWater(250)} className="w-9 h-9 rounded-full bg-blue-400 text-white shadow text-lg leading-none">+</button>
          </div>
        </div>

        {/* 4. Today's Skin Focus */}
        <div className="glass-card p-5 rounded-3xl">
          <h2 className="font-black text-gray-800 text-sm uppercase tracking-wide mb-3">Today's Skin Focus</h2>
          <div className="flex flex-wrap gap-2">
            {SKIN_FOCUS.map((f) => {
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
        </div>

        {/* 5. Skincare Ritual */}
        <div className="glass-card p-5 rounded-3xl">
          <h2 className="font-black text-gray-800 text-sm uppercase tracking-wide mb-4">Skincare Ritual</h2>
          <div className="space-y-2">
            {SKINCARE_STEPS.map((s, i) => {
              const done = !!log.skincare[s.key];
              return (
                <button key={s.key} onClick={() => toggleSkincare(s.key)}
                  className={`w-full flex items-center gap-3 p-3 rounded-2xl border transition-all text-left
                    ${done ? "bg-purple-50 border-purple-300" : "bg-white/60 border-gray-100"}`}>
                  <span className="text-xs font-bold text-gray-300 w-4">{i + 1}</span>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] text-white ${done ? "bg-purple-400" : "bg-gray-200"}`}>{done ? "✓" : ""}</span>
                  <div>
                    <p className={`text-sm font-semibold ${done ? "text-gray-700" : "text-gray-600"}`}>{s.label}</p>
                    <p className="text-[10px] text-gray-400">{s.note}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
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