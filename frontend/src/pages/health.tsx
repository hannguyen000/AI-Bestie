import { useState, useEffect } from "react";
import { supabase } from "../config/supabase";
import AppLayout from "../layouts/appLayout"; 
import { PASTE_COLORS } from "../config/auraConfig";

export default function Health() {
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

return (
    <AppLayout>
      {/* Background */}
      <div
        className="relative min-h-full p-6"
        style={{ backgroundColor: PASTE_COLORS[profile?.aura_id] || PASTE_COLORS.healer }}
      >
      <div className="p-6 space-y-6">
        {/* 1. Graphical Monthly Insight */}
        <div className="glass-card p-5 rounded-3xl h-64 bg-white/40">
          <h2 className="font-bold text-gray-800 mb-2">Monthly Insight</h2>
          <div className="w-full h-40 bg-gray-50/50 rounded-xl border border-white/50" />
        </div>

        {/* 2. Period Tracker */}
        <div className="glass-card p-5 rounded-3xl bg-white/40">
          <h3 className="text-sm text-gray-500 font-medium">Period tracker</h3>
          <p className="text-lg font-bold text-gray-800 my-1">Next cycle in 15 days</p>
          <button className="flex items-center gap-2 mt-2 bg-pink-100 text-pink-700 px-4 py-2 rounded-full text-sm font-bold">
            <span>+</span> Log period
          </button>
        </div>

        {/* 3. Mood Tracker */}
        <div className="glass-card p-5 rounded-3xl bg-white/40">
          <h3 className="text-sm text-gray-500 font-medium mb-3">Mood tracker</h3>
          <div className="flex justify-between items-center">
            {/* List emoticons */}
            <div className="flex gap-2">
              {['😊', '🙂', '😐', '🙁', '😢'].map((mood) => (
                <button key={mood} className="text-2xl hover:scale-125 transition-transform">{mood}</button>
              ))}
            </div>
            <button className="bg-white/60 px-4 py-1 rounded-full text-xs font-bold border border-white">Save</button>
          </div>
          <a href="#" className="block text-right text-xs text-gray-400 mt-3 underline">History &gt;</a>
        </div>
      </div>
    </div>
    </AppLayout>
  );
}
