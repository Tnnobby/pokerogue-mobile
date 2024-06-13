export type PokemonInfo = {
  name: string;
  level: number;
};

export type GameInfo = {
  playTime: number;
  gameMode: "Classic" | "Endless" | "Endless (Spliced)" | "Daily Run" | string;
  biome: string;
  wave: number;
  party: PokemonInfo[];
};
