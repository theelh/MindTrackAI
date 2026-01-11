import { useRef, useState, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

export default function SpotifyAudioPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);

  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.4);
  const [muted, setMuted] = useState(false);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const next = !muted;
    audioRef.current.muted = next;
    setMuted(next);
  };

  const handleVolume = (value: number) => {
    if (!audioRef.current) return;
    audioRef.current.volume = value;
    audioRef.current.muted = value === 0;
    setMuted(value === 0);
    setVolume(value);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, []);

  return (
    <div className="w-full rounded-xl bg-black p-4 text-white">
      <div className="flex items-center gap-4">
        {/* Play / Pause */}
        <button
          onClick={togglePlay}
          className="h-12 w-12 rounded-full bg-green-500 text-black flex items-center justify-center"
        >
          {playing ? <Pause /> : <Play />}
        </button>

        {/* Progress */}
        <input
          type="range"
          min={0}
          max={duration}
          value={time}
          onChange={(e) => {
            if (!audioRef.current) return;
            audioRef.current.currentTime = Number(e.target.value);
            setTime(Number(e.target.value));
          }}
          className="w-full accent-green-500"
        />

        {/* Volume */}
        <div className="flex items-center gap-2">
          <button onClick={toggleMute}>
            {muted || volume === 0 ? (
              <VolumeX size={18} />
            ) : (
              <Volume2 size={18} />
            )}
          </button>

          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={muted ? 0 : volume}
            onChange={(e) => handleVolume(Number(e.target.value))}
            className="w-20 accent-green-500"
          />
        </div>
      </div>

      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onTimeUpdate={() => {
          if (audioRef.current) {
            setTime(audioRef.current.currentTime);
          }
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration);
          }
        }}
        onEnded={() => setPlaying(false)}
      />
    </div>
  );
}