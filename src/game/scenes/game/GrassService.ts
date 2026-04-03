import { clamp } from "../../../lib/clamp";
import { getRandint } from "../../../lib/get-randint";
import { Boot } from "../Boot";
import { MAX_BRUSH_SPEED } from "./BrushServiceConstants";
import {
  FIRE_PROBABILITY_INCREASE_RATE,
  FIRE_PROBABILITY_MAX,
  Grass,
  GRASS_MAX_HP,
  GRASS_MAP_X,
  GRASS_MAP_Y,
  GRASS_SIZE,
  INITIAL_FIRE_PROBABILITY,
  RECOVER_MIN_HP,
} from "./GrassServiceConstants";

export class GrassService {
  private grassMap: Grass[][];
  private aliveGrass: Grass[];

  private fireProbability = INITIAL_FIRE_PROBABILITY;

  constructor(private boot: Boot) {
    this.grassMap = [];
    this.aliveGrass = [];

    for (let x = 0; x < GRASS_MAP_X; x++) {
      for (let y = 0; y < GRASS_MAP_Y; y++) {
        if (!this.grassMap[x]) {
          this.grassMap[x] = [];
        }

        const newGrass = {
          x,
          y,
          hp: GRASS_MAX_HP,
          state: "alive",
        } satisfies Grass;

        this.grassMap[x][y] = newGrass;
        this.aliveGrass.push(newGrass);
      }
    }

    this.boot.load.image("grass", "assets/grass.png");
    this.boot.load.image("burning-grass", "assets/burning-grass.png");
    this.boot.load.image("dead-grass", "assets/dead-grass.png");
  }

  setFire(grassInfo: Grass, aliveArrayIndex?: number) {
    if (grassInfo.state !== "alive") return;

    grassInfo.image?.destroy();

    grassInfo.state = "burning";
    grassInfo.image = this.boot.add
      .image(
        grassInfo.x * GRASS_SIZE,
        grassInfo.y * GRASS_SIZE,
        "burning-grass"
      )
      .setOrigin(0, 0);

    this.aliveGrass.splice(
      aliveArrayIndex ?? this.aliveGrass.indexOf(grassInfo),
      1
    );
  }

  setDeadTrue(grassInfo: Grass) {
    if (grassInfo.state === "dead") return;

    grassInfo.image?.destroy();

    grassInfo.state = "dead";
    grassInfo.image = this.boot.add
      .image(grassInfo.x * GRASS_SIZE, grassInfo.y * GRASS_SIZE, "dead-grass")
      .setOrigin(0, 0);
  }

  extinguishFire(grassInfo: Grass) {
    if (grassInfo.state !== "burning") return;

    grassInfo.image?.destroy();

    grassInfo.state = "alive";
    grassInfo.image = this.boot.add
      .image(grassInfo.x * GRASS_SIZE, grassInfo.y * GRASS_SIZE, "grass")
      .setOrigin(0, 0);

    this.aliveGrass.push(grassInfo);
    grassInfo.hp = Math.max(grassInfo.hp, RECOVER_MIN_HP);
  }

  getSize() {
    return {
      x: this.grassMap.length,
      y: this.grassMap[0].length,
    };
  }

  getGrassInfo(x: number, y: number) {
    if (
      x < 0 ||
      y < 0 ||
      x > this.grassMap.length ||
      y > this.grassMap[0].length
    ) {
      console.error(
        `Attempted to index grass info outside of bounds (${x}, ${y})`
      );
    }
    return this.grassMap[x][y];
  }

  update(dt: number) {
    if (this.aliveGrass.length > 0 && Math.random() < this.fireProbability) {
      // Pick a random grass block

      const aliveIndex = getRandint(0, this.aliveGrass.length);
      this.setFire(this.aliveGrass[aliveIndex], aliveIndex);

      // Increase the speed at which fire catches
      this.fireProbability = Math.min(
        this.fireProbability * FIRE_PROBABILITY_INCREASE_RATE,
        FIRE_PROBABILITY_MAX
      );
    }

    // Spread fire & reduce hp
    for (let x = 0; x < this.grassMap.length; x++) {
      for (let y = 0; y < this.grassMap[x].length; y++) {
        const grassInfo = this.getGrassInfo(x, y);

        if (grassInfo.state === "burning") {
          grassInfo.hp = clamp(grassInfo.hp - 1 * dt, 0, GRASS_MAX_HP);

          if (grassInfo.hp <= 0) {
            this.setDeadTrue(grassInfo);
          }
        }

        if (Math.random() > this.fireProbability) continue;

        if (grassInfo.state === "burning") {
          for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
              if (Math.random() > this.fireProbability) continue;

              if (dx === 0 && dy === 0) continue; // skip self

              const nx = x + dx;
              const ny = y + dy;

              if (
                nx >= 0 &&
                ny >= 0 &&
                nx < this.grassMap.length &&
                ny < this.grassMap[nx].length
              ) {
                this.setFire(this.getGrassInfo(nx, ny));
              }
            }
          }
        }
      }
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
