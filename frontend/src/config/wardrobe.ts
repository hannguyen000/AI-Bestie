export type ClosetItem = {
  id: string;
  name: string;
  category: string;
  color?: string;   // hex
  season?: string;
};

export const WARDROBE_CATEGORIES = [
  { key: "tops", label: "Tops", emoji: "👕", suggestions: ["T-shirt", "Baby tee", "Blouse", "Shirt", "Sweater", "Hoodie", "Camisole", "Crop top", "Polo"] },
  { key: "bottoms", label: "Bottoms", emoji: "👖", suggestions: ["Skinny jeans", "Wide-leg jeans", "Flare jeans", "Cargo pants", "Trousers", "Shorts", "Mini skirt", "Midi skirt", "Leggings"] },
  { key: "dresses", label: "Dresses & Jumpsuits", emoji: "👗", suggestions: ["Mini dress", "Midi dress", "Maxi dress", "Slip dress", "Jumpsuit", "Romper"] },
  { key: "outerwear", label: "Outerwear", emoji: "🧥", suggestions: ["Denim jacket", "Blazer", "Cardigan", "Coat", "Trench coat", "Puffer", "Leather jacket"] },
  { key: "footwear", label: "Footwear", emoji: "👟", suggestions: ["Sneakers", "Boots", "Heels", "Sandals", "Loafers", "Flats", "Mary Janes"] },
  { key: "accessories", label: "Accessories", emoji: "👜", suggestions: ["Tote bag", "Mini backpack", "Bucket hat", "Cap", "Sunglasses", "Necklace", "Earrings", "Scarf", "Belt"] },
] as const;

export const WARDROBE_COLORS = [
  { name: "Black", hex: "#111827" }, { name: "White", hex: "#f3f4f6" }, { name: "Gray", hex: "#9ca3af" },
  { name: "Beige", hex: "#e7d8c2" }, { name: "Brown", hex: "#92633b" }, { name: "Pink", hex: "#f8a8c2" },
  { name: "Red", hex: "#ef4444" }, { name: "Orange", hex: "#fb923c" }, { name: "Yellow", hex: "#facc15" },
  { name: "Green", hex: "#4ade80" }, { name: "Blue", hex: "#60a5fa" }, { name: "Navy", hex: "#1e3a8a" },
  { name: "Purple", hex: "#a78bfa" },
];

export const SEASONS = ["Spring", "Summer", "Fall", "Winter"];