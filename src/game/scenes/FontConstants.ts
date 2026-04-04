export const ARCADE_DEFAULT = {
  fontFamily: "Arcade",
  resolution: 1,
  fontSize: "12px",
};

/**
 *
 * @param fontSize pixels
 */
export const arcadeDefaultResized = (
  fontSize: number
): typeof ARCADE_DEFAULT => {
  return { ...ARCADE_DEFAULT, fontSize: `${fontSize}px` };
};
