import { useState, useEffect, useCallback } from "react";
import { supabase } from "../config/supabase";

const today = () => new Date().toISOString().split("T")[0];

export type DailyLog = {
  water_ml: number;
  habits: Record<string, boolean>;
  skincare: Record<string, boolean>;
  skin_focus: string[];
  last_drank_at?: string | null;   
};

export function useDailyLog() {
  const [userId, setUserId] = useState<string | null>(null);
  const [log, setLog] = useState<DailyLog>({ water_ml: 0, habits: {}, skincare: {}, skin_focus: [], last_drank_at: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      setUserId(user.id);

      const { data } = await supabase
        .from("daily_logs")
        .select("water_ml, habits, skincare, skin_focus, last_drank_at")
        .eq("user_id", user.id)
        .eq("log_date", today())
        .maybeSingle();

      if (data) {
        setLog({
          water_ml: data.water_ml ?? 0,
          habits: data.habits ?? {},
          skincare: data.skincare ?? {},
          skin_focus: data.skin_focus ?? [],
          last_drank_at: data.last_drank_at ?? null,
        });
      }
      setLoading(false);
    })();
  }, []);

  const persist = useCallback((next: DailyLog) => {
    if (!userId) return;
    supabase.from("daily_logs").upsert(
      { user_id: userId, log_date: today(), ...next },
      { onConflict: "user_id,log_date" }
    ).then(({ error }) => { if (error) console.error("daily_logs:", error); });
  }, [userId]);

    const addWater = (ml: number) =>
    setLog((prev) => {
        const water_ml = Math.max(0, prev.water_ml + ml);
        const next = {
        ...prev,
        water_ml,
        ...(ml > 0 ? { last_drank_at: new Date().toISOString() } : {}),
        };
        persist(next);
        return next;
    });

  const toggleHabit = (key: string) =>
    setLog((prev) => {
      const next = { ...prev, habits: { ...prev.habits, [key]: !prev.habits[key] } };
      persist(next); return next;
    });

  const toggleSkincare = (key: string) =>
    setLog((prev) => {
      const next = { ...prev, skincare: { ...prev.skincare, [key]: !prev.skincare[key] } };
      persist(next); return next;
    });

    const toggleSkinFocus = (name: string) =>
    setLog((prev) => {
        const has = prev.skin_focus.includes(name);
        const next = {
        ...prev,
        skin_focus: has ? prev.skin_focus.filter((f) => f !== name) : [...prev.skin_focus, name],
        };
        persist(next);
        return next;
    });


  return { log, loading, addWater, toggleHabit, toggleSkincare, toggleSkinFocus };
}