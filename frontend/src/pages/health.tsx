import { useState, useEffect } from "react";
import { supabase } from "../config/supabase";
import AppLayout from "../layouts/appLayout";
import { PASTE_COLORS } from "../config/auraConfig";
import { useDailyLog } from "../hooks/useDailyLog";
import PeriodCalendar from "../components/PeriodCalendar";
import { MOOD_BY_VALUE } from "../components/PeriodCalendar";
import { getCycleInfo, isPeriodDay as isPeriodDayBase, savePeriodDate } from "../components/cycle";
import { CHARACTER_IMAGES_WITHOUT_BG } from "../config/auraConfig";
import { getPhase, PHASE_TITLES, AURA_TIPS, SYMPTOMS } from "../config/cycleTips";

const MOODS = [
  { v: 5, e: "😊" }, { v: 4, e: "🙂" }, { v: 3, e: "😐" }, { v: 2, e: "🙁" }, { v: 1, e: "😢" },
];

export default function Health() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [moodByDate, setMoodByDate] = useState<Record<string, number>>({});
  const [showCalendar, setShowCalendar] = useState(false);
  const { log, setMood, toggleSymptom } = useDailyLog();

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

  const phase = getPhase(cycle);
  const auraId = profile?.aura_id || "healer";

  const isPeriodDay = (d: Date) =>
    isPeriodDayBase(d, profile?.last_period_date, profile?.cycle_length, profile?.period_length);

  const savePeriod = async (dateStr: string) => {
    await savePeriodDate(dateStr);
    setProfile((p: any) => ({ ...p, last_period_date: dateStr }));
    setShowCalendar(false);
  };

  const todayStr = new Date().toISOString().split("T")[0];

  const handleMood = (v: number) => {
    setMood(v);                                        
    setMoodByDate((prev) => ({ ...prev, [todayStr]: v })); 
  };

  const now = new Date();
  const moodCount = Object.keys(moodByDate).length;

  return (
    <AppLayout>
      <div
        className="relative h-full w-full overflow-y-auto pb-20 md:pb-0 space-y-6"
        style={{ backgroundColor: PASTE_COLORS[profile?.aura_id] || PASTE_COLORS.healer }}
      >
        <div className="max-w-5xl mx-auto p-2 overflow-y-auto">

        {/* Mood Tracker */}
        <div className="glass-card p-5 rounded-3xl bg-white/40 mb-5 mt-5">
          <h3 className="text-sm text-gray-500 font-medium mb-3">Mood tracker · Today</h3>
          <div className="flex justify-between items-center gap-2">
            {MOODS.map((m) => (
              <button key={m.v} onClick={() => handleMood(m.v)}
                className={`text-2xl transition-transform ${log.mood === m.v ? "scale-125" : "opacity-60 hover:scale-110"}`}>
                {m.e}
              </button>
            ))}
          </div>
          {log.mood && <p className="text-[11px] text-gray-400 text-center mt-3">Saved for today ✓</p>}
        </div>

        {/* Monthly Insight */}
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

        {/* Period Tracker */}
        <div className="glass-card p-5 rounded-3xl bg-white/40 text-center mt-5 mb-15">
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
          {/* Period Tips */}
          {cycle && phase !== "normal" && (
          <div className="glass-card p-5 rounded-3xl bg-white/40 mt-5">
            <div className="flex items-center gap-3 mb-3">
              <img
                src={CHARACTER_IMAGES_WITHOUT_BG[auraId] || CHARACTER_IMAGES_WITHOUT_BG.healer}
                className="w-12 h-20 object-contain drop-shadow"
                alt=""
              />
              <div className="text-sm text-gray-600 leading-relaxed">
                <p>
                  <span className="text-[11px] font-black text-gray-400 uppercase mr-2 tracking-wider">
                    {PHASE_TITLES[phase]}:
                  </span>
                  
                  <span className="text-[11px]">
                    {(AURA_TIPS[auraId] || AURA_TIPS.healer)[phase]}
                  </span>
                </p>
                {phase === "soon"}
                {phase === "period"}
                {phase === "ovulation"}
              </div>
            </div>
          </div>
        )}
          {/* Period Symtoms */}
          {cycle?.isOnPeriod && (
            <div className="glass-card p-5 rounded-3xl bg-white/40 mt-5">
              <h3 className="text-sm text-gray-500 font-medium mb-3">How are you feeling today?</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {SYMPTOMS.map((s) => {
                  const active = (log.symptoms ?? []).includes(s.key);
                  return (
                    <button key={s.key} onClick={() => toggleSymptom(s.key)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all flex items-center gap-1
                        ${active ? "bg-rose-500 text-white border-rose-500" : "bg-white/60 text-gray-600 border-gray-200"}`}>
                      <span>{s.emoji}</span>{s.label}
                    </button>
                  );
                })}
              </div>

              {(log.symptoms ?? []).length > 0 && (
                <div className="space-y-2">
                  {SYMPTOMS.filter((s) => log.symptoms?.includes(s.key)).map((s) => (
                    <div key={s.key} className="bg-rose-50 rounded-2xl p-3">
                      <p className="text-xs font-bold text-rose-600 mb-0.5">{s.emoji} {s.label}</p>
                      <p className="text-[11px] text-gray-600 leading-snug">{s.tip}</p>
                    </div>
                  ))}
                  <p className="text-[10px] text-gray-400 text-center mt-2">
                  General tips only. Please consult a doctor if you experience severe or persistent pain.                  </p>
                </div>
              )}
            </div>
          )}
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
