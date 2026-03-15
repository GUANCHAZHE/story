import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

// Using high-quality public domain classical pieces that fit the serene, melancholic fantasy vibe
const MUSIC_TRACKS: Record<string, string> = {
  'coastal_road': 'https://upload.wikimedia.org/wikipedia/commons/4/48/Kevin_MacLeod_-_Gymnopedie_No_1.ogg', // Serene, melancholic
  'ruined_chapel': 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Chopin_Prelude_in_E_minor%2C_Op._28_No._4.ogg', // Somber, ruined
  'crystal_cavern': 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Claude_Debussy_-_Clair_de_lune_%28suite_bergamasque%29.ogg', // Mystical, glowing
  'old_lighthouse': 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Claude_Debussy_-_R%C3%AAverie.ogg', // Dreamy, nostalgic
  'camp': 'https://upload.wikimedia.org/wikipedia/commons/4/48/Kevin_MacLeod_-_Gymnopedie_No_1.ogg', // Calm, resting
  'default': 'https://upload.wikimedia.org/wikipedia/commons/4/48/Kevin_MacLeod_-_Gymnopedie_No_1.ogg'
};

// Map scene IDs to music tracks
const SCENE_MUSIC_MAP: Record<string, string> = {
  's1_coastal_road': MUSIC_TRACKS.coastal_road,
  's2_ruined_chapel': MUSIC_TRACKS.ruined_chapel,
  's3_crystal_cavern': MUSIC_TRACKS.crystal_cavern,
  's4_old_lighthouse': MUSIC_TRACKS.old_lighthouse,
  's5_camp': MUSIC_TRACKS.camp,
  's5_camp_night': MUSIC_TRACKS.camp,
  's6_chronicles': MUSIC_TRACKS.old_lighthouse,
  's7_border_town': MUSIC_TRACKS.coastal_road,
  's8_ending': MUSIC_TRACKS.crystal_cavern,
};

interface Props {
  currentSceneId: string;
}

export function BackgroundMusic({ currentSceneId }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(MUSIC_TRACKS.default);

  useEffect(() => {
    const track = SCENE_MUSIC_MAP[currentSceneId] || MUSIC_TRACKS.default;
    if (track !== currentTrack) {
      setCurrentTrack(track);
    }
  }, [currentSceneId, currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3; // Set a soft background volume
      
      // Attempt to play automatically, but handle browser autoplay policies
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.log("Autoplay prevented by browser. User interaction needed.", error);
            setIsPlaying(false);
          });
      }
    }
  }, [currentTrack]);

  const toggleMute = () => {
    if (audioRef.current) {
      if (!isPlaying && !isMuted) {
        audioRef.current.play();
        setIsPlaying(true);
      } else {
        audioRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
      }
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <audio 
        ref={audioRef} 
        src={currentTrack} 
        loop 
        muted={isMuted}
      />
      <button 
        onClick={toggleMute}
        className="p-3 rounded-full bg-bg-panel border border-ember/30 text-ember/80 hover:text-ember hover:border-ember transition-all shadow-lg backdrop-blur-sm"
        title={isMuted ? "取消静音" : "静音"}
      >
        {isMuted || !isPlaying ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>
    </div>
  );
}
