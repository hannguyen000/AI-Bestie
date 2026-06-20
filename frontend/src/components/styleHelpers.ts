export function getWeatherLabel(weather: any): string {
  if (!weather) return "mild";
  const temp = weather.main?.temp ?? 25;
  const desc = (weather.weather?.[0]?.main ?? "").toLowerCase();
  if (desc.includes("rain") || desc.includes("drizzle")) return "rainy";
  if (desc.includes("snow")) return "snowy";
  if (desc.includes("cloud")) return temp < 20 ? "cool and cloudy" : "warm and cloudy";
  if (temp >= 32) return "hot";
  if (temp >= 25) return "warm and sunny";
  if (temp >= 18) return "pleasant";
  return "cool";
}

export async function fetchOutfitCaption(
  weatherLabel: string,
  tags: string[],
  wardrobeText: string,
  groqKey: string
): Promise<string> {
  const styleText = tags.length ? tags.join(", ") : "phong cách của bạn";
  const owns = wardrobeText
    ? `The user has these items available in their closet: ${wardrobeText}. Prioritize styling suggestions using strictly these items.`
    : "";

  const prompt = `You are a friendlz stylist. Suggest EXACTLY ONE short, fashionable caption/outfit idea (maximum 20 words) that fits the current weather (${weatherLabel}) and the style: ${styleText}. ${owns} Respond in natural English, no emojis.`;
  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${groqKey}` },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 80,
        temperature: 0.8,
      }),
    });
    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || "Style it your way today!";
  } catch {
    return "Style it your way today!";
  }
}

export const STYLE_QUERY_MAP: Record<string, string> = {
  Cute:        "full outfit idea korean cute girl ootd",
  Trendy:      "full outfit idea korean trendy street style ootd",
  Sporty:      "full outfit idea korean sporty chic ootd",
  Office:      "full outfit idea korean office fashion women elegant",
  Street:      "full outfit idea korean streetwear urban style ootd",
  Harmonious:  "full outfit idea korean soft aesthetic pastel fashion",
  Minimalist:  "full outfit idea korean minimalist clean aesthetic fashion",
  Y2K:         "full outfit idea korean y2k fashion aesthetic",
  Boho:        "full outfit idea korean boho chic aesthetic",
  Vintage:     "full outfit idea korean vintage retro aesthetic",
};

export function getAgeGroup(age: number): string {
  if (age < 18) return "teen girl";
  if (age < 25) return "young woman";
  if (age < 35) return "woman";
  if (age < 50) return "midlife woman";
  return "mature woman";
}

export async function fetchPexelsImages(
  tags: string[],
  pexelsKey: string,
  age?: number          
): Promise<string[]> {
  if (!tags?.length) return [];

  const ageGroup = age ? getAgeGroup(age) : "woman";
  const selectedTags = tags.slice(0, 2);
  const allImages: string[] = [];

  for (const tag of selectedTags) {
    const baseQuery = STYLE_QUERY_MAP[tag] ?? `${tag} fashion outfit aesthetic ootd`;
    // Kết hợp age group vào query
    const query = `${ageGroup} ${baseQuery}`;
    const perPage = selectedTags.length === 1 ? 3 : 2;
    const randomPage = Math.floor(Math.random() * 5) + 1;

    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}&page=${randomPage}&orientation=portrait&size=medium`,
      { headers: { Authorization: pexelsKey } }
    );
    const data = await res.json();
    if (data.photos?.length) {
      const shuffled = data.photos.sort(() => Math.random() - 0.5);
      allImages.push(...shuffled.map((p: any) => p.src.large2x));
    }
  }

  const unique = [...new Map(allImages.map(url => [url, url])).values()];
  return unique.slice(0, 3);
}