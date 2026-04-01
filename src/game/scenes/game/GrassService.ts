import { Boot } from "../Boot";

type GrassState = "alive" | "burning" | "dead";

type Grass = {
  x: number;
  y: number;
  state: GrassState;
  image?: Phaser.GameObjects.Image;
};

const GRASS_SIZE = 32; // px, length and width (square)

const INITIAL_FIRE_PROBABILITY = 0.1;
const FIRE_PROBABILITY_INCREASE_RATE = 1.1;

export class GrassService {
  private grassMap: Grass[][];
  private fireProbability = INITIAL_FIRE_PROBABILITY;

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
    this.boot.load.image("burning-grass", "assets/burning-grass.png");
  }

  setFire(grassInfo: Grass) {
    if (grassInfo.image) {
      grassInfo.image.destroy();
    }

    grassInfo.image = this.boot.add
      .image(
        grassInfo.x * GRASS_SIZE,
        grassInfo.y * GRASS_SIZE,
        "burning-grass"
      )
      .setOrigin(0, 0);
  }

  update() {
    if (Math.random() > this.fireProbability) {
      // Start a fire!
    }
  }

  create() {
    // this.boot.add.image(128, 128, "grass");

    // Generate all grass objects
    for (let x = 0; x < this.grassMap.length; x++) {
      for (let y = 0; y < this.grassMap[x].length; y++) {
        const grassInfo = this.grassMap[x][y];

        if (grassInfo.state == "alive") {
          const image = this.boot.add
            .image(x * GRASS_SIZE, y * GRASS_SIZE, "grass")
            .setOrigin(0, 0);

          grassInfo.image = image;
        }
      }
    }
  }
}
