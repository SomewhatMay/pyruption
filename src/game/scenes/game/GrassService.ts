import { clamp } from "../../../lib/clamp";
import { randInt } from "../../../lib/randint";
import { Boot } from "../Boot";
import {
  FIRE_PROBABILITY_INCREASE_RATE,
  FIRE_PROBABILITY_MAX,
  Grass,
  GRASS_MAX_HP,
  INITIAL_FIRE_PROBABILITY,
  RECOVER_MIN_HP,
  MAX_RECOVER_COUNT,
  CRITICAL_MODE_HP,
} from "./GrassServiceConstants";
import {
  GRASS_MAP_X,
  GRASS_MAP_Y,
  GRASS_SIZE,
  HORIZONTAL_GRASS_PAD,
} from "../LayoutConstants";
import { TOP_BAR_HEIGHT } from "../LayoutConstants";

export class GrassService {
  private grassMap: Grass[][];
  private aliveGrass: Grass[];

  private fireProbability = INITIAL_FIRE_PROBABILITY;

  public readonly grassCanvasOffset = {
    x: HORIZONTAL_GRASS_PAD,
    y: TOP_BAR_HEIGHT,
  }; // px

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
          recoverCount: 0,
          state: "alive",
        } satisfies Grass;

        this.grassMap[x][y] = newGrass;
        this.aliveGrass.push(newGrass);
      }
    }

    this.boot.load.image("grass", "assets/sprites/grass.png");
    this.boot.load.image("burning-grass", "assets/sprites/burning-grass.png");
    this.boot.load.image("dead-grass", "assets/sprites/dead-grass.png");
  }

  setFire(grassInfo: Grass, aliveArrayIndex?: number) {
    if (grassInfo.state !== "alive") return;

    grassInfo.image?.destroy();

    grassInfo.state = "burning";
    grassInfo.image = this.boot.add
      .image(
        grassInfo.x * GRASS_SIZE + this.grassCanvasOffset.x,
        grassInfo.y * GRASS_SIZE + this.grassCanvasOffset.y,
        "burning-grass"
      )
      .setOrigin(0, 0)
      .setDisplaySize(GRASS_SIZE, GRASS_SIZE);

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
      .image(
        grassInfo.x * GRASS_SIZE + this.grassCanvasOffset.x,
        grassInfo.y * GRASS_SIZE + this.grassCanvasOffset.y,
        "dead-grass"
      )
      .setOrigin(0, 0)
      .setDisplaySize(GRASS_SIZE, GRASS_SIZE);
  }

  extinguishFire(grassInfo: Grass) {
    if (grassInfo.state !== "burning") return;

    grassInfo.image?.destroy();

    grassInfo.state = "alive";
    grassInfo.image = this.boot.add
      .image(
        grassInfo.x * GRASS_SIZE + this.grassCanvasOffset.x,
        grassInfo.y * GRASS_SIZE + this.grassCanvasOffset.y,
        "grass"
      )
      .setOrigin(0, 0)
      .setDisplaySize(GRASS_SIZE, GRASS_SIZE);

    grassInfo.recoverCount++;
    grassInfo.hp = Math.max(grassInfo.hp, RECOVER_MIN_HP);
    this.aliveGrass.push(grassInfo);
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
      const aliveIndex = randInt(0, this.aliveGrass.length);
      const grassInfo = this.aliveGrass[aliveIndex];

      // If the block has been recovered too many times, provide a near-impossible
      // opportunity to recover the block (through a really low HP)
      if (grassInfo.recoverCount > MAX_RECOVER_COUNT) {
        grassInfo.hp = CRITICAL_MODE_HP;
      }

      this.setFire(grassInfo, aliveIndex);

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
            .image(
              x * GRASS_SIZE + this.grassCanvasOffset.x,
              y * GRASS_SIZE + this.grassCanvasOffset.y,
              "grass"
            )
            .setOrigin(0, 0)
            .setDisplaySize(GRASS_SIZE, GRASS_SIZE);

          grassInfo.image = image;
        }
      }
    }
  }
}
