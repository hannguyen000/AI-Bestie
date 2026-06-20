export type Phase = "period" | "soon" | "ovulation" | "normal";

export function getPhase(cycle: { isOnPeriod: boolean; daysUntilNext: number } | null): Phase {
  if (!cycle) return "normal";
  if (cycle.isOnPeriod) return "period";
  if (cycle.daysUntilNext <= 3) return "soon";
  if (cycle.daysUntilNext >= 12 && cycle.daysUntilNext <= 16) return "ovulation";
  return "normal";
}

export const PHASE_TITLES: Record<Phase, string> = {
  period: "Your period is here",
  soon: "Period coming soon",
  ovulation: "Ovulation window",
  normal: "Cycle update",
};

export const AURA_TIPS: Record<string, Record<Phase, string>> = {
  healer: {
    soon: "Your period is around the corner 🌸 Your body might feel a bit tired or extra sensitive right now — stay hydrated, sleep early, and remember it's okay to take things slow.",
    period: "Please be gentle with yourself during these days 🤗 Warm water, comforting meals, and plenty of rest will help you feel much better.",
    ovulation: "This is usually when your energy is at its highest 🌿 Perfect time to embrace your favorite activities and do what you love.",
    normal: "Your body is in a steady, balanced state 🍵 Keeping up with your water intake and getting enough sleep is all you need right now.",
  },
  mentor: {
    soon: "A few days left until your period. Hormones are dropping, which can cause low energy — prioritize crucial tasks and skip the heavy lifting.",
    period: "The menstrual phase impacts your energy and focus. Keep your schedule light, stay warm, and replenish your body with iron-rich foods.",
    ovulation: "You are currently in your peak focus phase — highly ideal for tackling difficult tasks or making big decisions.",
    normal: "Your cycle is stable. Maintaining a consistent daily routine is the best foundation for your overall well-being.",
  },
  sunshine: {
    soon: "Your period is coming soon! 🌻 If your mood dips a little, just grab some yummy snacks and a warm drink, and you'll be good to go!",
    period: "Time to just chill out! 🔥 A heating pad + cozying up in bed + a great movie = the ultimate survival combo!",
    ovulation: "You are at your absolute peak right now ✨ Fully charged, so go out there and live your best life!",
    normal: "Everything is looking amazing and on track 💅 Keep riding this wonderful vibe!",
  },
};

export const SYMPTOMS = [
  { key: "cramps", label: "Cramps", emoji: "🩹", tip: "Apply a heating pad to your lower abdomen, drink warm fluids, and do light stretching to ease cramps." },
  { key: "headache", label: "Headache", emoji: "🤕", tip: "Rest in a quiet, dark room, stay well-hydrated, and limit your screen time." },
  { key: "fatigue", label: "Fatigue", emoji: "😮‍💨", tip: "Get extra sleep, eat iron-rich foods (dark leafy greens, red meat), and don't push yourself too hard." },
  { key: "bloating", label: "Bloating", emoji: "🎈", tip: "Reduce your sodium and sugar intake, drink plenty of water, and try eating more slowly." },
  { key: "mood", label: "Mood swings", emoji: "🌧️", tip: "Allow yourself to take a break, practice deep breathing, or talk to someone you trust." },
  { key: "backpain", label: "Back pain", emoji: "🪑", tip: "Use a warm compress on your lower back, do gentle stretches, and avoid sitting in one position for too long." },
  { key: "cravings", label: "Cravings", emoji: "🍫", tip: "Opt for healthier snack alternatives (dark chocolate, nuts) and eat smaller, frequent meals." },
  { key: "acne", label: "Acne", emoji: "💢", tip: "Keep your skincare routine gentle and clean, avoid popping blemishes, and use soothing products." },
];