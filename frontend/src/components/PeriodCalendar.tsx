import { useState } from "react";

interface PeriodCalendarProps {
  open: boolean;
  onClose: () => void;
  lastPeriod?: string | null;
  isPeriodDay: (d: Date) => boolean;
  moodByDate: Record<string, number>;
  onSave: (dateStr: string) => void;
}

export const MOOD_BY_VALUE = ["", "😢", "🙁", "😐", "🙂", "😊"];

export default function PeriodCalendar({
  open,
  onClose,
  lastPeriod,
  isPeriodDay,
  moodByDate,
  onSave,
}: PeriodCalendarProps) {
  const [view, setView] = useState(new Date());
  const [selected, setSelected] = useState<string | null>(lastPeriod ?? null);

  if (!open) return null;

  const year = view.getFullYear();
  const month = view.getMonth();
  const monthLabel = view.toLocaleString("en-US", { month: "long" });
  const offset = (new Date(year, month, 1).getDay() + 6) % 7; // Monday-first
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(offset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

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
            <button
              onClick={() => setView(new Date(year, month - 1, 1))}
              className="text-pink-300 text-2xl"
            >
              ‹
            </button>
            <h2 className="font-bold text-gray-800 text-lg">{monthLabel}</h2>
            <button
              onClick={() => setView(new Date(year, month + 1, 1))}
              className="text-pink-300 text-2xl"
            >
              ›
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-gray-400 mb-2">
            {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, idx) => {
              if (!day) return <div key={idx} />;
              const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const period = isPeriodDay(new Date(year, month, day));
              const mood = moodByDate[dateStr];
              const isSel = selected === dateStr;
              return (
                <button
                  key={idx}
                  onClick={() => setSelected(dateStr)}
                  className={`aspect-square rounded-full flex flex-col items-center justify-center
                    ${isSel ? "ring-2 ring-pink-500" : ""} ${period ? "bg-rose-100" : ""}`}
                >
                  <span className={`text-xs ${period ? "text-rose-600 font-bold" : "text-gray-600"}`}>
                    {day}
                  </span>
                  <span className="text-[15px] leading-none h-3">
                    {mood ? MOOD_BY_VALUE[mood] : period ? "🩸" : ""}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="text-center text-xs text-gray-400 mt-5">
            Choose the first day of your period this month, then click "Save".
          </p>
        </div>

        <div className="flex justify-between items-center px-5 py-3 border-t border-gray-100">
          <button onClick={onClose} className="text-gray-500 font-bold text-sm">
            Cancel
          </button>
          <button
            onClick={() => selected && onSave(selected)}
            disabled={!selected}
            className="text-pink-600 font-bold text-sm disabled:opacity-40"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}