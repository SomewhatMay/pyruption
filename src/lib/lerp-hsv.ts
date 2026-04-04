export function lerpHSV(colorA: number, colorB: number, t: number): number {
  const a = Phaser.Display.Color.IntegerToRGB(colorA);
  const b = Phaser.Display.Color.IntegerToRGB(colorB);

  const hsvA = Phaser.Display.Color.RGBToHSV(a.r, a.g, a.b);
  const hsvB = Phaser.Display.Color.RGBToHSV(b.r, b.g, b.b);

  // shortest hue interpolation
  let h1 = hsvA.h;
  let h2 = hsvB.h;
  if (Math.abs(h2 - h1) > 0.5) {
    if (h1 > h2) h2 += 1;
    else h1 += 1;
  }

  const h = Phaser.Math.Linear(h1, h2, t) % 1;
  const s = Phaser.Math.Linear(hsvA.s, hsvB.s, t);
  const v = Phaser.Math.Linear(hsvA.v, hsvB.v, t);

  const rgb = Phaser.Display.Color.HSVToRGB(h, s, v);
  return rgb.color;
}
