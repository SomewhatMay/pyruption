/**
 *
 * @param min The minimum integer (inclusive)
 * @param max The maximum integer (exclusive)
 * @returns Random integer in the interval [min, max)
 */
export function getRandint(min: number, max: number) {
  return Math.floor(min + Math.random() * (max - min));
}
