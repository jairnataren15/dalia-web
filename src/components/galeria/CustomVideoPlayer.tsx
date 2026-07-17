"use client";

import { useRef, useState } from "react";

function formatTime(s: number): string {
  if (!Number.isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, "0")}`;
}

export default function CustomVideoPlayer({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    const pct = Number(e.target.value);
    v.currentTime = (pct / 100) * v.duration;
    setProgress(pct);
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const toggleFullscreen = () => {
    const container = videoRef.current?.parentElement;
    if (!container) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      container.requestFullscreen();
    }
  };

  return (
    <div className="group relative h-full w-full bg-black" onClick={togglePlay}>
      <video
        ref={videoRef}
        src={src}
        playsInline
        className="h-full w-full object-contain"
        onTimeUpdate={(e) => {
          const v = e.currentTarget;
          if (!v.duration) return;
          setProgress((v.currentTime / v.duration) * 100);
          setCurrent(v.currentTime);
        }}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />

      {!playing && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/25">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-rose/90 text-xl text-base">
            ▶
          </span>
        </div>
      )}

      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gradient-to-t from-black/85 to-transparent px-2 pb-2 pt-6 opacity-0 transition-opacity group-hover:opacity-100"
      >
        <button
          type="button"
          onClick={togglePlay}
          className="shrink-0 text-sm font-bold text-white"
          aria-label={playing ? "Pausar" : "Reproducir"}
        >
          {playing ? "⏸" : "▶"}
        </button>
        <span className="tnum shrink-0 text-[10px] text-white/80">{formatTime(current)}</span>
        <input
          type="range"
          min={0}
          max={100}
          step={0.1}
          value={progress}
          onChange={onSeek}
          className="h-1 flex-1 cursor-pointer accent-[#ff4d7d]"
          aria-label="Progreso del video"
        />
        <span className="tnum shrink-0 text-[10px] text-white/80">{formatTime(duration)}</span>
        <button
          type="button"
          onClick={toggleMute}
          className="shrink-0 text-sm text-white"
          aria-label={muted ? "Activar sonido" : "Silenciar"}
        >
          {muted ? "🔇" : "🔊"}
        </button>
        <button
          type="button"
          onClick={toggleFullscreen}
          className="shrink-0 text-sm text-white"
          aria-label="Pantalla completa"
        >
          ⛶
        </button>
      </div>
    </div>
  );
}
