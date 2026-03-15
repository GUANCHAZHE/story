import React, { useState, useEffect } from 'react';
import { get, set } from 'idb-keyval';
import { generateImage } from '../services/ai';
import { Loader2, Image as ImageIcon } from 'lucide-react';

interface Props {
  prompt: string;
  alt: string;
  className?: string;
  variations?: number;
}

export function AIGeneratedImage({ prompt, alt, className, variations = 10 }: Props) {
  const [src, setSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    // Randomly select one of the variations
    const variationIndex = Math.floor(Math.random() * variations) + 1;
    const cacheKey = `img_${prompt}_var_${variationIndex}`;
    // Append variation index to the prompt to ensure the AI generates a distinct image
    const variationPrompt = `${prompt}, variation ${variationIndex}`;

    async function fetchImage() {
      try {
        setLoading(true);
        setError(false);
        
        const cached = await get(cacheKey);
        if (cached) {
          if (isMounted) {
            setSrc(cached);
            setLoading(false);
          }
          return;
        }

        const base64 = await generateImage(variationPrompt);
        if (base64 && isMounted) {
          setSrc(base64);
          await set(cacheKey, base64);
          setLoading(false);
        } else if (isMounted) {
          setError(true);
          setLoading(false);
        }
      } catch (e) {
        console.error(e);
        if (isMounted) {
          setError(true);
          setLoading(false);
        }
      }
    }

    fetchImage();
    return () => { isMounted = false; };
  }, [prompt, variations]);

  if (loading) {
    return (
      <div className={`flex flex-col items-center justify-center bg-bg-panel border border-ember/20 text-ember/50 ${className}`}>
        <Loader2 className="w-8 h-8 animate-spin mb-2" />
        <span className="text-xs tracking-widest">正在编织现实...</span>
      </div>
    );
  }

  if (error || !src) {
    return (
      <div className={`flex flex-col items-center justify-center bg-bg-panel border border-red-900/30 text-red-500/50 ${className}`}>
        <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
        <span className="text-xs tracking-widest">现实编织失败</span>
      </div>
    );
  }

  return <img src={src} alt={alt} className={className} referrerPolicy="no-referrer" />;
}
