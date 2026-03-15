import fs from 'fs';

let content = fs.readFileSync('src/gameData.tsx', 'utf-8');

if (!content.includes('AIGeneratedImage')) {
  content = content.replace(
    "import { Flame, Eye, Music, Hexagon } from 'lucide-react';",
    "import { Flame, Eye, Music, Hexagon } from 'lucide-react';\nimport { AIGeneratedImage } from './components/AIGeneratedImage';"
  );
}

const regex = /<img src="https:\/\/image\.pollinations\.ai\/prompt\/([^?]+)\?width=800&height=400&nologo=true" alt="([^"]+)" className="([^"]+)" referrerPolicy="no-referrer" \/>/g;

content = content.replace(regex, (match, p1, p2, p3) => {
  const prompt = decodeURIComponent(p1);
  return `<AIGeneratedImage prompt="${prompt}" alt="${p2}" className="${p3}" />`;
});

fs.writeFileSync('src/gameData.tsx', content);
console.log('Replaced images in gameData.tsx');
