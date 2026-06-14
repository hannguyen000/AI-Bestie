export const STYLES = [
  { name: "Classic", emoji: "🏛️", bg: "bg-[#FDF6E3]", text: "text-[#A08852]" },
  { name: "Colorful", emoji: "🎨", bg: "bg-[#E3F2FD]", text: "text-[#1976D2]" },
  { name: "Y2K", emoji: "🕹️", bg: "bg-[#E0F7FA]", text: "text-[#00ACC1]" },
  { name: "Cute", emoji: "🎀", bg: "bg-[#FFF0F5]", text: "text-[#DB7093]" },
  { name: "Sporty", emoji: "⚽", bg: "bg-[#E8F5E9]", text: "text-[#43A047]" },
  { name: "Office", emoji: "💼", bg: "bg-[#ECEFF1]", text: "text-[#546E7A]" },
  { name: "Trendy", emoji: "✨", bg: "bg-[#F3E5F5]", text: "text-[#8E24AA]" },
  { name: "Street", emoji: "🏙️", bg: "bg-[#EFEBE9]", text: "text-[#6D4C41]" },
  { name: "Pastel", emoji: "🎨", bg: "bg-[#FFFDE7]", text: "text-[#FBC02D]" },
  { name: "Harmonious", emoji: "🎵", bg: "bg-[#FBE9E7]", text: "text-[#F4511E]" },
  { name: "Elegant", emoji: "👗", bg: "bg-[#F3E5F5]", text: "text-[#7B1FA2]" },
  { name: "Bold", emoji: "💥", bg: "bg-[#FFEBEE]", text: "text-[#D32F2F]" },
  { name: "Minimalist", emoji: "★", bg: "bg-[#FAFAFA]", text: "text-[#212121]" },
  { name: "Vintage", emoji: "🕰️", bg: "bg-[#EFEBE9]", text: "text-[#5D4037]" },
  { name: "Bohemian", emoji: "🎸", bg: "bg-[#FFF3E0]", text: "text-[#E64A19]" },
  { name: "Chic", emoji: "👠", bg: "bg-[#F1F8E9]", text: "text-[#388E3C]" },
  { name: "Preppy", emoji: "🎒", bg: "bg-[#E3F2FD]", text: "text-[#1976D2]" },
  { name: "Gothic", emoji: "💀", bg: "bg-[#212121]", text: "text-[#FFFFFF]" },
];

export const getStyle = (name: string) =>
  STYLES.find((s) => s.name === name);