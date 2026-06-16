import { useState, useEffect } from 'react';
import { useLang } from '../context/LangContext';

// ─── Tipos de datos de wttr.in ───────────────────────────────────────
interface WeatherCondition {
  temp_C: string;
  temp_F: string;
  FeelsLikeC: string;
  FeelsLikeF: string;
  humidity: string;
  windspeedKmph: string;
  winddir16Point: string;
  pressure: string;
  visibility: string;
  cloudcover: string;
  uvIndex: string;
  weatherDesc: { value: string }[];
}

interface HourlyData {
  time: string;
  tempC: string;
  tempF: string;
  weatherDesc: { value: string }[];
  windspeedKmph: string;
  winddir16Point: string;
  humidity: string;
  chanceofrain: string;
}

interface DayForecast {
  date: string;
  maxtempC: string;
  maxtempF: string;
  mintempC: string;
  mintempF: string;
  avgtempC: string;
  avgtempF: string;
  astronomy: { sunrise: string; sunset: string; moon_phase: string }[];
  hourly: HourlyData[];
}

interface WeatherData {
  current_condition: WeatherCondition[];
  weather: DayForecast[];
}

// ─── Mapeo de clima → emoji ─────────────────────────────────────────
const weatherEmoji: Record<string, string> = {
  'sunny': '☀️',
  'clear': '🌙',
  'partly cloudy': '⛅',
  'cloudy': '☁️',
  'overcast': '☁️',
  'mist': '🌫️',
  'fog': '🌫️',
  'patchy rain': '🌦️',
  'patchy rain nearby': '🌦️',
  'light rain': '🌧️',
  'patchy light rain': '🌧️',
  'moderate rain': '🌧️',
  'heavy rain': '⛈️',
  'thunder': '⛈️',
  'patchy light drizzle': '🌦️',
  'light drizzle': '🌦️',
  'patchy snow': '🌨️',
  'snow': '❄️',
  'blizzard': '🌨️',
};

function getEmoji(desc: string): string {
  const lower = desc.toLowerCase();
  for (const [key, emoji] of Object.entries(weatherEmoji)) {
    if (lower.includes(key)) return emoji;
  }
  return '🌤️';
}

// ─── Formateo de fecha ───────────────────────────────────────────────
function formatDate(dateStr: string, lang: 'es' | 'en'): string {
  const date = new Date(dateStr + 'T00:00:00');
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  };
  return date.toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', options);
}

// ─── Icono de viento ─────────────────────────────────────────────────
function WindArrow({ direction }: { direction: string }) {
  const arrows: Record<string, string> = {
    N: '↑', NNE: '↗', NE: '↗', ENE: '↗',
    E: '→', ESE: '↘', SE: '↘', SSE: '↘',
    S: '↓', SSW: '↙', SW: '↙', WSW: '↙',
    W: '←', WNW: '↖', NW: '↖', NNW: '↖',
  };
  return <span className="inline-block">{arrows[direction] || '●'}</span>;
}

// ─── Skeleton de carga ───────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="h-6 bg-gray-700 rounded w-1/3" />
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-gray-700/50 rounded-xl p-4 space-y-2">
            <div className="h-4 bg-gray-600 rounded w-2/3" />
            <div className="h-8 bg-gray-600 rounded w-1/2" />
            <div className="h-3 bg-gray-600 rounded w-full" />
            <div className="h-3 bg-gray-600 rounded w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Componente principal ────────────────────────────────────────────
export default function WeatherDashboard() {
  const { lang } = useLang();
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<'C' | 'F'>('C');
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  const isEs = lang === 'es';

  useEffect(() => {
    let cancelled = false;
    async function fetchWeather() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('https://wttr.in/Caracas?format=j1');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!cancelled) setData(json);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Error desconocido');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchWeather();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <Skeleton />;

  if (error || !data) {
    return (
      <div className="text-center py-6 text-gray-400">
        <p className="text-lg mb-2">⚠️</p>
        <p className="text-sm">
          {isEs ? 'No se pudo cargar el clima. Verifica tu conexión.' : 'Could not load weather. Check your connection.'}
        </p>
        <button
          onClick={() => { setLoading(true); setError(null); window.location.reload(); }}
          className="mt-3 px-4 py-1.5 text-xs bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-colors"
        >
          {isEs ? 'Reintentar' : 'Retry'}
        </button>
      </div>
    );
  }

  const current = data.current_condition[0];
  const forecast = data.weather.slice(0, 3);

  const temp = (c: string, f: string) => unit === 'C' ? `${c}°C` : `${f}°F`;

  return (
    <div className="space-y-4">
      {/* ─── Cabecera ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-sm font-bold text-violet-300 flex items-center gap-2">
            🌤️ {isEs ? 'Clima en Vivo' : 'Live Weather'} — Caracas, Venezuela
          </h3>
          <p className="text-[11px] text-gray-500 mt-0.5">
            {isEs ? 'Datos de wttr.in · Se actualiza al recargar' : 'Data from wttr.in · Updates on reload'}
          </p>
        </div>
        {/* Toggle °C / °F */}
        <div className="flex bg-gray-700 rounded-lg p-0.5">
          <button
            onClick={() => setUnit('C')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              unit === 'C' ? 'bg-violet-600 text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            °C
          </button>
          <button
            onClick={() => setUnit('F')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              unit === 'F' ? 'bg-violet-600 text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            °F
          </button>
        </div>
      </div>

      {/* ─── Clima actual ──────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-violet-900/40 to-purple-900/30 rounded-2xl p-5 border border-violet-700/30">
        <div className="flex items-center gap-4">
          <span className="text-5xl">{getEmoji(current.weatherDesc[0].value)}</span>
          <div>
            <div className="text-3xl font-bold text-white">
              {temp(current.temp_C, current.temp_F)}
            </div>
            <div className="text-sm text-violet-300">
              {current.weatherDesc[0].value}
            </div>
            <div className="text-[11px] text-gray-400 mt-0.5">
              {isEs ? 'Sensación' : 'Feels like'} {temp(current.FeelsLikeC, current.FeelsLikeF)}
            </div>
          </div>
          <div className="ml-auto grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-gray-300">
            <span>💧 {current.humidity}%</span>
            <span>💨 {current.windspeedKmph} km/h</span>
            <span><WindArrow direction={current.winddir16Point} /> {current.winddir16Point}</span>
            <span>☁️ {current.cloudcover}%</span>
            <span>🔽 {current.pressure} mb</span>
            <span>☀️ UV {current.uvIndex}</span>
          </div>
        </div>
      </div>

      {/* ─── Pronóstico 3 días ─────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3">
        {forecast.map((day, i) => {
          const isExpanded = expandedDay === i;
          return (
            <button
              key={day.date}
              onClick={() => setExpandedDay(isExpanded ? null : i)}
              className={`text-left rounded-xl p-4 border transition-all duration-200 cursor-pointer bg-gray-800/80 hover:bg-gray-750 hover:border-violet-500/50
                ${isExpanded ? 'border-violet-500 ring-1 ring-violet-500/50 col-span-3' : 'border-gray-700'}`}
            >
              {/* Vista compacta */}
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{getEmoji(day.hourly[4]?.weatherDesc[0]?.value || '')}</span>
                <span className="text-xs font-semibold text-gray-300">
                  {formatDate(day.date, lang)}
                </span>
                {!isExpanded && (
                  <span className="ml-auto text-[10px] text-gray-500">
                    {isEs ? 'Click para detalle' : 'Click for detail'}
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-white">
                  {temp(day.maxtempC, day.maxtempF)}
                </span>
                <span className="text-xs text-gray-500">
                  {temp(day.mintempC, day.mintempF)}
                </span>
              </div>

              {/* Barra de temperatura visual */}
              <div className="mt-2 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-amber-500"
                  style={{
                    width: `${Math.min(100, Math.max(10, (parseInt(day.avgtempC) / 40) * 100))}%`,
                  }}
                />
              </div>

              {/* Vista expandida: horas del día */}
              {isExpanded && (
                <div className="mt-4 pt-3 border-t border-gray-700">
                  <div className="flex items-center gap-3 text-[11px] text-gray-400 mb-3">
                    <span>🌅 {day.astronomy[0].sunrise}</span>
                    <span>🌇 {day.astronomy[0].sunset}</span>
                    <span>🌙 {day.astronomy[0].moon_phase}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {day.hourly.filter((_, i) => i % 3 === 0).map(h => (
                      <div
                        key={h.time}
                        className="bg-gray-700/50 rounded-lg p-2 text-center"
                      >
                        <div className="text-[10px] text-gray-400">
                          {h.time.padStart(4, '0').replace(/(\d{2})(\d{2})/, '$1:$2')}
                        </div>
                        <div className="text-base my-1">{getEmoji(h.weatherDesc[0].value)}</div>
                        <div className="text-xs font-semibold text-white">
                          {temp(h.tempC, h.tempF)}
                        </div>
                        <div className="text-[10px] text-gray-500 mt-0.5">
                          <WindArrow direction={h.winddir16Point} /> {h.windspeedKmph}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* ─── Footer ────────────────────────────────────────────── */}
      <p className="text-[10px] text-gray-600 text-center">
        {isEs ? 'Dashboard creado con datos en tiempo real de ' : 'Live weather dashboard powered by '}
        <a href="https://wttr.in" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">wttr.in</a>
        {' · '}{isEs ? 'Hecho en React + TypeScript' : 'Built with React + TypeScript'}
      </p>
    </div>
  );
}
