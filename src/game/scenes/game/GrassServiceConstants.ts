export type GrassState = "alive" | "burning" | "dead";

export type Grass = {
  x: number;
  y: number;

  hp: number;
  recoverCount: number;
  state: GrassState;

  image?: Phaser.GameObjects.Image;
};

export const INITIAL_FIRE_PROBABILITY = 0.01;
export const FIRE_PROBABILITY_INCREASE_RATE = 1.05;
export const FIRE_PROBABILITY_MAX = 0.1;

export const GRASS_MAX_HP = 10000; // 1 dmg/ms
export const RECOVER_MIN_HP = GRASS_MAX_HP * 0.1; // When a burnt grass is recovered, its HP is, at minimum, this value

// Grass block critical mode: the state where a block has been recovered too many times.
// The block is still recoverable, but from now on, the next HP is an extremely low value
// that requires insane precision to keep alive. This will increase skill ceiling while
// making it difficult to spam the last block forever
export const MAX_RECOVER_COUNT = 1; // The maximum number of times a singular grass block can be recovered before it's in critical mode
export const CRITICAL_MODE_HP = GRASS_MAX_HP * 0.01;
