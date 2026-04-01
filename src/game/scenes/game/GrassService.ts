import { Boot } from "../Boot";

type GrassState = "alive" | "burning" | "dead";

type Grass = {
  x: number;
  y: number;
  state: GrassState;
};

const GRASS_SIZE = 32; // px, length and width (square)

export class GrassService {
  private grassMap: Grass[][];

  constructor(private boot: Boot) {
    this.grassMap = [];

    for (let x = 0; x < 32; x++) {
      for (let y = 0; y < 32; y++) {
        if (!this.grassMap[x]) {
          this.grassMap[x] = [];
        }

        this.grassMap[x][y] = {
          x,
          y,
          state: "alive",
        };
      }
    }
    this.boot.load.image("grass", "assets/grass.png");
  }

  create() {
    // this.boot.add.image(128, 128, "grass");

    for (let x = 0; x < this.grassMap.length; x++) {
      for (let y = 0; y < this.grassMap[x].length; y++) {
        const grassInfo = this.grassMap[x][y];

        if (grassInfo.state == "alive") {
          this.boot.add
            .image(x * GRASS_SIZE, y * GRASS_SIZE, "grass")
            .setOrigin(0, 0);
        }
      }
    }
  }
}
