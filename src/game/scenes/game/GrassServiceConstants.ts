export type GrassState = "alive" | "burning" | "dead";

export type Grass = {
  x: number;
  y: number;

  hp: number;
  recoverCount: number;
  state: GrassState;

  image?: Phaser.GameObjects.Image;
};

// --- Fire Probability ---
// Probability is no longer event-driven. Instead it follows a smooth time-based
// curve (smoothstep) so difficulty ramps predictably regardless of lucky/unlucky
// fire cascades.
export const INITIAL_FIRE_PROBABILITY = 0.008; // ~0.5 random fires/sec at 60 fps, a gentle warm-up
export const FIRE_PROBABILITY_MAX = 0.07; // ~4.2 random fires/sec, challenging but human-scale
// Time (ms) over which probability travels from INITIAL → MAX via smoothstep.
// Smoothstep: slow at the edges, fastest in the middle, so the first ~20 s feel
// approachable, 20-70 s escalate noticeably, and 70-90 s level off near the cap.
export const FIRE_PROBABILITY_RAMP_DURATION = 90_000; // 90 seconds

export const GRASS_MAX_HP = 10000; // 1 dmg/ms
export const RECOVER_MIN_HP = GRASS_MAX_HP * 0.1; // When a burnt grass is recovered, its HP is, at minimum, this value

// Grass block critical mode: the state where a block has been recovered too many times.
// The block is still recoverable, but its starting HP is drastically reduced.
export const MAX_RECOVER_COUNT = 1; // recoveries allowed before critical mode kicks in
// 800 ms window, still very hard and demanding, but within human reaction time for a
// deliberate aimed click (was 0.01 = 100 ms, effectively impossible).
export const CRITICAL_MODE_HP = GRASS_MAX_HP * 0.08;
