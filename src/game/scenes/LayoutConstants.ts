export const WIN_WIDTH = 1200;
export const WIN_HEIGHT = 1000;

export const TOP_BAR_HEIGHT = 56;

// The minimum height of the bottom bar. The true height is
// BOTTOM_BAR_MIN_HEIGHT + any remaining space due to rounding
// of the number of grass blocks
const BOTTOM_BAR_MIN_HEIGHT = 50;

export const GRASS_MAP_X = 3;
export const GRASS_SIZE = Math.floor(WIN_WIDTH / GRASS_MAP_X); // px, length and width (square)
export const GRASS_MAP_Y = Math.floor(
  (WIN_HEIGHT - TOP_BAR_HEIGHT - BOTTOM_BAR_MIN_HEIGHT) / GRASS_SIZE
);

export const BOTTOM_BAR_HEIGHT =
  WIN_HEIGHT - TOP_BAR_HEIGHT - GRASS_SIZE * GRASS_MAP_Y;
export const BOTTOM_BAR_Y = TOP_BAR_HEIGHT + GRASS_SIZE * GRASS_MAP_Y;

export const HORIZONTAL_GRASS_PAD =
  (WIN_WIDTH - GRASS_MAP_X * GRASS_SIZE) * 0.5;
