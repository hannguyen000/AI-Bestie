import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabase";

export default function PeriodSetup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    last_period_date: "",
    cycle_length: "28",
    period_length: "5",
  });

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("last_period_date, cycle_length, period_length")
        .eq("id", user.id)
        .single();
      if (data) {
        setForm({
          last_period_date: data.last_period_date ?? "",
          cycle_length: data.cycle_length != null ? String(data.cycle_length) : "28",
          period_length: data.period_length != null ? String(data.period_length) : "5",
        });
      }
    })();
  }, []);

  const handleSave = async () => {
    setError(null);
    if (!form.last_period_date) {
      setError("Please select your last period start date.");
      return;
    }
    const cycle = parseInt(form.cycle_length, 10);
    const period = parseInt(form.period_length, 10);
    if (!cycle || cycle < 15 || cycle > 60) {
      setError("Cycle length should be 15–60 days.");
      return;
    }
    if (!period || period < 1 || period > 14) {
      setError("Period length should be 1–14 days.");
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setError("Please log in to continue"); return; }

      const { error } = await supabase
        .from("profiles")
        .update({
          last_period_date: form.last_period_date,
          cycle_length: cycle,
          period_length: period,
        })
        .eq("id", user.id);
      if (error) throw error;

      navigate("/home");
    } catch (e) {
      console.error(e);
      setError("Something went wrong. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col h-full overflow-y-auto overflow-x-hidden p-6 bg-linear-to-br from-[#FFF7FA] to-[#F1F9FD]">
      <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full opacity-50 bg-[radial-gradient(circle,#F7C5D8,transparent_70%)] animate-float" />

      <div className="relative z-10 flex flex-col flex-1">
        <div className="text-center mb-6">
          <h2 className="font-display font-black text-3xl text-aura-pink-dark mb-1">Cycle Setup</h2>
          <p className="text-sm text-gray-500">Let's track your period 🌸</p>
        </div>

        <div className="glass-card p-5 rounded-3xl mb-5">
          <p className="text-sm font-semibold text-gray-600 mb-2">First day of your last period</p>
          <input
            type="date"
            max={new Date().toISOString().split("T")[0]}
            value={form.last_period_date}
            onChange={(e) => setForm({ ...form, last_period_date: e.target.value })}
            className=" w-60 p-3 rounded-2xl border border-pink-100 bg-white/70 text-gray-800 outline-none focus:border-pink-300"
          />
        </div>

        <NumberStepper label="Cycle length" unit="days"
          value={form.cycle_length} min={15} max={60}
          onChange={(v) => setForm({ ...form, cycle_length: v })} />

        <NumberStepper label="Period length" unit="days"
          value={form.period_length} min={1} max={14}
          onChange={(v) => setForm({ ...form, period_length: v })} />

        {error && <p className="text-rose-500 text-sm text-center mt-2">{error}</p>}

        <button onClick={handleSave} disabled={loading}
          className="btn-primary w-full py-4 mt-6 disabled:opacity-70">
          {loading ? "Saving..." : "Save & Continue"}
        </button>
      </div>
    </div>
  );
}

function NumberStepper({ label, unit, value, onChange, min, max }: {
  label: string; unit: string; value: string;
  onChange: (v: string) => void; min: number; max: number;
}) {
  const num = parseInt(value || "0", 10);
  const adjust = (delta: number) =>
    onChange(String(Math.min(max, Math.max(min, (isNaN(num) ? min : num) + delta))));

  return (
    <div className="glass-card p-4 rounded-3xl mb-5 flex items-center justify-between">
      <div>
        <p className="text-sm font-semibold text-gray-600">{label}</p>
        <p className="text-xs text-gray-400">{unit}</p>
      </div>
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => adjust(-1)}
          className="w-8 h-8 rounded-full bg-white/70 hover:bg-white text-gray-600 shadow">−</button>
        <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-pink-300 to-purple-400 w-10 text-center">
          {value || "0"}
        </span>
        <button type="button" onClick={() => adjust(1)}
          className="w-8 h-8 rounded-full bg-white/70 hover:bg-white text-gray-600 shadow">+</button>
      </div>
    </div>
  );
}