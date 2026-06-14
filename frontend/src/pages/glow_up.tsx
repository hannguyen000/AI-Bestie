import { useState, useEffect } from "react";
import { supabase } from "../config/supabase";
import AppLayout from "../layouts/appLayout"; 
import { PASTE_COLORS } from "../config/auraConfig";

export default function GlowUp() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  function ProgressItem({ label, percentage, color }: { label: string, percentage: number, color: string }) {
    return (
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="font-medium text-gray-600">{label}</span>
          <span className="font-bold text-gray-800">{percentage}%</span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div className={`${color} h-full rounded-full`} style={{ width: `${percentage}%` }} />
        </div>
      </div>
    );
  }

  return (
    <AppLayout>
      <div
        className="relative min-h-full p-6"
        style={{ backgroundColor: PASTE_COLORS[profile?.aura_id] || PASTE_COLORS.healer }}
      >
        {/* 1. Monthly Glow Map */}
        <div className="glass-card p-5 rounded-3xl mb-6">
          <div className="flex justify-between mb-4">
            <h2 className="font-bold text-gray-800">MONTHLY GLOW MAP</h2>
            <span className="text-sm text-gray-400">&lt; April 2026 &gt;</span>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {[...Array(28)].map((_, i) => (
              <div key={i} className="h-6 w-full rounded-md bg-teal-700/80" />
            ))}
          </div>
        </div>

        {/* 2. Daily Progress Overview */}
        <div className="glass-card p-5 rounded-3xl space-y-4 mb-6">
          <h2 className="font-bold text-gray-800">DAILY PROGRESS OVERVIEW</h2>
          
          <ProgressItem label="Skincare Ritual Progress" percentage={70} color="bg-purple-400" />
          <ProgressItem label="Habits Checklist Progress" percentage={50} color="bg-teal-400" />
        </div>

        {/* 3. Daily Rituals Shortcut */}
        <div className="glass-card p-5 rounded-3xl">
          <h2 className="font-bold text-gray-800 mb-4">DAILY RITUALS</h2>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">💧</div>
            <div>
              <p className="font-bold">Hydration: 1.2L of 2.0L</p>
              <div className="w-32 h-2 bg-gray-200 rounded-full mt-1">
                 <div className="w-[60%] h-full bg-blue-400 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
