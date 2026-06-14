// hooks/outfitBoard.ts
import { useState, useEffect } from "react";
import { fetchPexelsImages, fetchOutfitCaption, getWeatherLabel } from "../components/styleHelpers";

// 1. Define the shape of your board state
interface BoardData {
  weather: any;
  images: string[]; // Explicitly tell TS this is an array of strings
  caption: string;
  title: string;
  loading: boolean;
}

export function useOutfitBoard(profile: any) {
  // 2. Pass the interface to useState
  const [boardData, setBoardData] = useState<BoardData>({
    weather: null,
    images: [], 
    caption: "Style it your way today! ✨",
    title: "",
    loading: true
  });

  useEffect(() => {
    if (!profile) return;

    async function buildBoard() {
      setBoardData(prev => ({ ...prev, loading: true }));
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
        } catch { /* Handle error */ }

        const tags: string[] = JSON.parse(profile?.styles ?? "[]");
        const tagLabel = tags.length > 0 ? tags.join(" & ") : "Your Style";

        const [imgs, outfitCaption] = await Promise.all([
          fetchPexelsImages(tags, pexelsKey, profile?.age),
          fetchOutfitCaption(weatherLabel, tags, groqKey)
        ]);

        // Now TypeScript will accept this because it matches BoardData
        setBoardData({
          weather: weatherData,
          images: imgs,
          caption: outfitCaption,
          title: `${tagLabel} · ${weatherLabel}`.toUpperCase(),
          loading: false
        });
      } catch (e) {
        console.error("Board error:", e);
        setBoardData(prev => ({ ...prev, loading: false }));
      }
    }

    buildBoard();
  }, [profile]);

  return boardData;
}