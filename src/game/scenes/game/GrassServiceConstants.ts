export type GrassState = "alive" | "burning" | "dead";

export type Grass = {
  x: number;
  y: number;

  hp: number;
  state: GrassState;

  image?: Phaser.GameObjects.Image;
};

export const GRASS_SIZE = 32; // px, length and width (square)

export const GRASS_MAP_X = 32;
export const GRASS_MAP_Y = 16;

export const INITIAL_FIRE_PROBABILITY = 0.01;
export const FIRE_PROBABILITY_INCREASE_RATE = 1.05;
export const FIRE_PROBABILITY_MAX = 0.1;

export const GRASS_MAX_HP = 1000; // 1 dmg/ms
export const RECOVER_MIN_HP = GRASS_MAX_HP * 0.1; // When a burnt grass is recovered, its HP is, at minimum, this value
