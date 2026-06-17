import { useState, useEffect } from "react";
import { supabase } from "../config/supabase";
import AppLayout from "../layouts/appLayout";
import { PASTE_COLORS } from "../config/auraConfig";
import { getCycleInfo } from "../components/cycle";
import { useDailyLog } from "../hooks/useDailyLog";

const MOODS = [
  { v: 5, e: "😊" }, { v: 4, e: "🙂" }, { v: 3, e: "😐" }, { v: 2, e: "🙁" }, { v: 1, e: "😢" },
];
const MOOD_BY_VALUE = ["", "😢", "🙁", "😐", "🙂", "😊"];

export default function Health() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [moodByDate, setMoodByDate] = useState<Record<string, number>>({});
  const [showCalendar, setShowCalendar] = useState(false);
  const { log, setMood } = useDailyLog();

  const fetchMonth = async (uid: string) => {
    const now = new Date();
    const first = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
    const last = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0];
    const { data } = await supabase
      .from("daily_logs").select("log_date, mood")
      .eq("user_id", uid).gte("log_date", first).lte("log_date", last);
    const m: Record<string, number> = {};
    (data ?? []).forEach((l: any) => { if (l.mood) m[l.log_date] = l.mood; });
    setMoodByDate(m);
  };

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
        setProfile(data);
        await fetchMonth(user.id);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="flex h-full items-center justify-center">Loading...</div>;

  const cycle = getCycleInfo(profile?.last_period_date, profile?.cycle_length, profile?.period_length);

  const isPeriodDay = (d: Date) => {
    if (!profile?.last_period_date) return false;
    const cl = profile.cycle_length || 28, pl = profile.period_length || 5;
    const start = new Date(profile.last_period_date); start.setHours(0, 0, 0, 0);
    const day = new Date(d); day.setHours(0, 0, 0, 0);
    const diff = Math.floor((day.getTime() - start.getTime()) / 86400000);
    if (diff < 0) return false;
    return (((diff % cl) + cl) % cl) < pl;
  };

  const savePeriod = async (dateStr: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("profiles").update({ last_period_date: dateStr }).eq("id", user.id);
      setProfile({ ...profile, last_period_date: dateStr });
    }
    setShowCalendar(false);
  };

  const now = new Date();
  const moodCount = Object.keys(moodByDate).length;

  return (
    <AppLayout>
      <div
        className="relative h-full w-full overflow-y-auto pb-20 md:pb-0 space-y-6"
        style={{ backgroundColor: PASTE_COLORS[profile?.aura_id] || PASTE_COLORS.healer }}
      >
        <div className="max-w-3xl mx-auto p-2 overflow-y-auto">
        {/* 1. Monthly Insight */}
        <div className="glass-card p-5 rounded-3xl bg-white/40 mt-5">
          <p className="text-[11px] text-gray-500 items-center py-2 mb-3">
            {moodCount > 2
              ? "This month your emotion and period cycle look stable overall."
              : "Log your mood daily to unlock monthly insights."}
          </p>
          <h2 className="font-black text-gray-800 text-lg mb-2">Monthly Insight</h2>
          <MoodChart moodByDate={moodByDate} isPeriodDay={isPeriodDay} year={now.getFullYear()} month={now.getMonth()} />
          <button onClick={() => setShowCalendar(true)}
            className="mt-6 w-full flex items-center justify-center gap-2 bg-linear-to-r from-pink-400 to-purple-400 text-white font-bold text-sm py-2 rounded-full shadow-lg shadow-pink-200 hover:scale-[1.02] active:scale-95 transition-transform">
            <span className="text-base"></span>
            Log period & view mood history
          </button>
        </div>

        {/* 2. Period Tracker */}
        <div className="glass-card p-5 rounded-3xl bg-white/40 text-center mt-5">
          <h3 className="text-sm text-gray-500 font-medium">Period tracker</h3>
          {cycle ? (
            cycle.isOnPeriod ? (
              <p className="text-2xl font-black text-rose-500 my-1">On period · Day {cycle.cycleDay}</p>
            ) : (
              <>
                <p className="text-xs text-gray-400 mt-1">Next cycle in</p>
                <p className="text-3xl font-black text-gray-800">{cycle.daysUntilNext} days</p>
              </>
            )
          ) : (
            <p className="text-sm text-gray-400 my-2">No cycle data yet</p>
          )}
        </div>

        {/* 3. Mood Tracker */}
        <div className="glass-card p-5 rounded-3xl bg-white/40 mb-5 mt-5">
          <h3 className="text-sm text-gray-500 font-medium mb-3">Mood tracker · Today</h3>
          <div className="flex justify-between items-center gap-2">
            {MOODS.map((m) => (
              <button key={m.v} onClick={() => setMood(m.v)}
                className={`text-2xl transition-transform ${log.mood === m.v ? "scale-125" : "opacity-60 hover:scale-110"}`}>
                {m.e}
              </button>
            ))}
          </div>
          {log.mood && <p className="text-[11px] text-gray-400 text-center mt-3 mb-10">Saved for today ✓</p>}
        </div>
      </div>

      <PeriodCalendar
        open={showCalendar}
        onClose={() => setShowCalendar(false)}
        lastPeriod={profile?.last_period_date}
        isPeriodDay={isPeriodDay}
        moodByDate={moodByDate}
        onSave={savePeriod}
      />
      </div>
    </AppLayout>
  );
}

/* ---- Mood line chart (SVG, no deps) ---- */
function MoodChart({ moodByDate, isPeriodDay, year, month }: {
  moodByDate: Record<string, number>;
  isPeriodDay: (d: Date) => boolean;
  year: number; month: number;
}) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const W = 320, H = 150, padL = 10, padR = 10, padT = 22, padB = 34;
  const innerW = W - padL - padR, innerH = H - padT - padB;
  const x = (day: number) => padL + ((day - 1) / (daysInMonth - 1)) * innerW;
  const y = (mood: number) => padT + (1 - (mood - 1) / 4) * innerH;

  const moodDays = Object.keys(moodByDate)
    .map((d) => ({ day: Number(d.split("-")[2]), mood: moodByDate[d] }))
    .sort((a, b) => a.day - b.day);
  const poly = moodDays.map((p) => `${x(p.day)},${y(p.mood)}`).join(" ");

  const todayD = new Date();
  const todayDay = todayD.getFullYear() === year && todayD.getMonth() === month ? todayD.getDate() : null;
  const periodDays = Array.from({ length: daysInMonth }, (_, i) => i + 1)
    .filter((d) => isPeriodDay(new Date(year, month, d)));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      <rect x="0" y="0" width={W} height={H} rx="14" fill="#ffffff" opacity="0.7" />

      {todayDay && <>
        <line x1={x(todayDay)} y1={padT - 6} x2={x(todayDay)} y2={H - padB} stroke="#cbd5e1" strokeDasharray="3 3" />
        <text x={x(todayDay)} y={padT - 9} fontSize="6" textAnchor="middle" fill="#94a3b8">today</text>
      </>}

      {moodDays.length > 1 && <polyline points={poly} fill="none" stroke="#b9c4dd" strokeWidth="2" />}

      {moodDays.map((p) => (
        <text key={p.day} x={x(p.day)} y={y(p.mood) + 5} fontSize="10" textAnchor="middle">
          {MOOD_BY_VALUE[p.mood]}
        </text>
      ))}

      {periodDays.map((d) => <text key={d} x={x(d)} y={H - padB + 16} fontSize="9" textAnchor="middle">🩸</text>)}

      <text x={padL} y={H - 4} fontSize="6" fill="#8b9dc3">● mood</text>
      <text x={padL + 30} y={H - 4} fontSize="6" fill="#e11d48">🩸 period</text>
    </svg>
  );
}

/* ---- Period log calendar---- */
function PeriodCalendar({ open, onClose, lastPeriod, isPeriodDay, moodByDate, onSave }: {
  open: boolean;
  onClose: () => void;
  lastPeriod?: string | null;
  isPeriodDay: (d: Date) => boolean;
  moodByDate: Record<string, number>;
  onSave: (dateStr: string) => void;
}) {
  const [view, setView] = useState(new Date());
  const [selected, setSelected] = useState<string | null>(lastPeriod ?? null);
  if (!open) return null;

  const year = view.getFullYear(), month = view.getMonth();
  const monthLabel = view.toLocaleString("en-US", { month: "long" });
  const offset = (new Date(year, month, 1).getDay() + 6) % 7; // Monday-first
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(offset).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 max-h-[70vh] overflow-y-auto">
          <div className="flex items-center justify-center gap-8 mb-5">
            <button onClick={() => setView(new Date(year, month - 1, 1))} className="text-pink-300 text-2xl">‹</button>
            <h2 className="font-bold text-gray-800 text-lg">{monthLabel}</h2>
            <button onClick={() => setView(new Date(year, month + 1, 1))} className="text-pink-300 text-2xl">›</button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-gray-400 mb-2">
            {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => <div key={d}>{d}</div>)}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, idx) => {
              if (!day) return <div key={idx} />;
              const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const period = isPeriodDay(new Date(year, month, day));
              const mood = moodByDate[dateStr];
              const isSel = selected === dateStr;
              return (
                <button key={idx} onClick={() => setSelected(dateStr)}
                  className={`aspect-square rounded-full flex flex-col items-center justify-center
                    ${isSel ? "ring-2 ring-pink-500" : ""} ${period ? "bg-rose-100" : ""}`}>
                  <span className={`text-xs ${period ? "text-rose-600 font-bold" : "text-gray-600"}`}>{day}</span>
                  <span className="text-[15px] leading-none h-3">{mood ? MOOD_BY_VALUE[mood] : period ? "🩸" : ""}</span>
                </button>
              );
            })}
          </div>

          <p className="text-center text-xs text-gray-400 mt-5">
            Choose the first day of your period this month, then click "Save".
          </p>
        </div>

        <div className="flex justify-between items-center px-5 py-3 border-t border-gray-100">
          <button onClick={onClose} className="text-gray-500 font-bold text-sm">Cancel</button>
          <button onClick={() => selected && onSave(selected)} disabled={!selected}
            className="text-pink-600 font-bold text-sm disabled:opacity-40">Save</button>
        </div>
      </div>
    </div>
  );
}