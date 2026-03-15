export type Faction = 'human' | 'demon' | null;

export interface GameState {
  hp: number;
  maxHp: number;
  faith: number;
  lore: number;
  rel: number;
  faction: Faction;
  scene: string;
  cards: string[];
  items: string[];
  companions: string[];
  voices: {
    ember: number;
    rift: number;
    song: number;
    rune: number;
  };
  flags: Record<string, any>;
  seen: Record<string, boolean>;
  dynamicEvents: Record<string, { action: string; text: string; image: string }[]>;
}
