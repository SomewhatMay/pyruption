import { Boot } from "../Boot";

type Grass = {
  x: number;
  y: number;
};

export class GrassService {
  private grassMap: Grass[][] = [];

  constructor(private boot: Boot) {
    // for (let x = 0; x < 32; x++) {
    //   for (let y = 0; y < 32; y++) {
    //     this.grassMap[x][y] = {
    //       x,
    //       y,
    //     };
    //   }
    // }
    // this.boot.load.image("grass", "assets/grass.png");
  }

  create() {
    // this.boot.add.image(128, 128, "grass");
  }
}
