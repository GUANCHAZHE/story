import { get, set } from 'idb-keyval';
import { generateImage } from './ai';

export const SCENE_PROMPTS = [
  "ancient stone ruins covered in moss, quiet forest",
  "fading sunset over a vast grassy plain, solitary tree",
  "abandoned campfire with glowing embers, dark night",
  "crumbling statue of a forgotten goddess, overgrown vines",
  "misty mountain pass, snow-capped peaks in the distance",
  "quiet village street at twilight, warm light from windows",
  "mysterious glowing blue crystals in a dark cave",
  "old wooden signpost at a crossroads, foggy weather",
  "peaceful lake reflecting a starry night sky, calm water",
  "ancient library ruins, scattered books, shafts of light"
];

const POOL_KEY_PREFIX = 'img_pool_';

export async function preloadImagePool() {
  // Run in background without blocking
  SCENE_PROMPTS.forEach(async (prompt, index) => {
    const key = `${POOL_KEY_PREFIX}${index}`;
    try {
      const cached = await get(key);
      if (!cached) {
        const base64 = await generateImage(prompt);
        if (base64) {
          await set(key, base64);
        }
      }
    } catch (e) {
      console.error(`Failed to preload image ${index}:`, e);
    }
  });
}

export async function getRandomImageFromPool(): Promise<string | null> {
  const index = Math.floor(Math.random() * SCENE_PROMPTS.length);
  const key = `${POOL_KEY_PREFIX}${index}`;
  const prompt = SCENE_PROMPTS[index];
  
  try {
    let base64 = await get(key);
    if (!base64) {
      // If not preloaded yet, generate on the fly
      base64 = await generateImage(prompt);
      if (base64) {
        await set(key, base64);
      }
    }
    return base64;
  } catch (e) {
    console.error("Failed to get random image:", e);
    return null;
  }
}
