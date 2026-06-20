import { useState, useEffect, useMemo } from "react";
import { fetchPexelsImages, fetchOutfitCaption, getWeatherLabel } from "../components/styleHelpers";

interface BoardData {
  weather: any;
  images: string[];
  caption: string;
  title: string;
  loading: boolean;
}

export function useOutfitBoard(
  profile: any,
  wardrobe: { name: string; color?: string }[] = []
) {
  const [boardData, setBoardData] = useState<BoardData>({
    weather: null,
    images: [],
    caption: "Style it your way today! ✨",
    title: "",
    loading: true,
  });

  const wardrobeText = useMemo(
    () => wardrobe.map((w) => `${w.name}${w.color ? ` (${w.color})` : ""}`).join(", "),
    [wardrobe]
  );

  useEffect(() => {
    if (!profile) return;

    async function buildBoard() {
      setBoardData((prev) => ({ ...prev, loading: true }));
      try {
        const pexelsKey = import.meta.env.VITE_PEXELS_ACCESS_KEY;
        const groqKey = import.meta.env.VITE_GROQ_STYLE_HELPER_API_KEY;
        const weatherKey = import.meta.env.VITE_OPENWEATHER_KEY;

        let weatherData = null;
        let weatherLabel = "mild";
        try {
          const pos = await new Promise<GeolocationPosition>((res, rej) =>
            navigator.geolocation.getCurrentPosition(res, rej, { timeout: 5000 })
          );
          const wRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&units=metric&appid=${weatherKey}`);
          weatherData = await wRes.json();
          weatherLabel = getWeatherLabel(weatherData);
        } catch { /* ignore */ }

        const tags: string[] = JSON.parse(profile?.styles ?? "[]");
        const tagLabel = tags.length > 0 ? tags.join(" & ") : "Your Style";

        const [imgs, outfitCaption] = await Promise.all([
          fetchPexelsImages(tags, pexelsKey, profile?.age),
          fetchOutfitCaption(weatherLabel, tags, wardrobeText, groqKey),
        ]);

        setBoardData({
          weather: weatherData,
          images: imgs,
          caption: outfitCaption,
          title: `${tagLabel} · ${weatherLabel}`.toUpperCase(),
          loading: false,
        });
      } catch (e) {
        console.error("Board error:", e);
        setBoardData((prev) => ({ ...prev, loading: false }));
      }
    }

    buildBoard();
  }, [profile, wardrobeText]);

    return boardData;  
}