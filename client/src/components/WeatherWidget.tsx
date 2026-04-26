import { useEffect, useState } from "react";
import { Cloud, CloudRain, Sun, CloudLightning, Loader2 } from "lucide-react";

interface WeatherData {
  temp: number;
  isDay: boolean;
  weathercode: number;
}

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    // Update time every minute
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = { 
        timeZone: "Africa/Addis_Ababa",
        hour: "numeric",
        minute: "2-digit",
        hour12: true
      };
      setTime(new Intl.DateTimeFormat('en-US', options).format(now));
    };
    
    updateTime();
    const timeInterval = setInterval(updateTime, 60000);

    // Fetch weather data for Addis Ababa
    const fetchWeather = async () => {
      try {
        const res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=9.0054&longitude=38.7893&current_weather=true");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setWeather({
          temp: Math.round(data.current_weather.temperature),
          isDay: data.current_weather.is_day === 1,
          weathercode: data.current_weather.weathercode,
        });
      } catch (error) {
        console.error("Error fetching weather:", error);
      }
    };

    fetchWeather();
    // Refresh weather every 30 mins
    const weatherInterval = setInterval(fetchWeather, 30 * 60 * 1000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(weatherInterval);
    };
  }, []);

  // Simple icon mapper based on WMO weather code
  const getWeatherIcon = (code: number) => {
    if (code === 0 || code === 1) return <Sun size={14} className="text-accent" />;
    if (code >= 2 && code <= 45) return <Cloud size={14} className="text-muted-foreground" />;
    if (code >= 51 && code <= 67) return <CloudRain size={14} className="text-primary/70" />;
    if (code >= 95) return <CloudLightning size={14} className="text-accent" />;
    return <Sun size={14} className="text-accent" />;
  };

  return (
    <div className="hidden lg:flex items-center gap-4 text-[10px] tracking-[0.2em] uppercase font-semibold text-foreground/80">
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        <span>Addis Ababa</span>
      </div>
      <span className="text-border">|</span>
      <span>{time || "..."}</span>
      <span className="text-border">|</span>
      {weather ? (
        <div className="flex items-center gap-1.5">
          {getWeatherIcon(weather.weathercode)}
          <span>{weather.temp}°C</span>
        </div>
      ) : (
        <Loader2 size={12} className="animate-spin text-muted-foreground" />
      )}
    </div>
  );
}
