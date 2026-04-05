import { clamp } from "../../../lib/clamp";
import { randInt } from "../../../lib/randint";
import { Boot } from "../Boot";
import {
  FIRE_PROBABILITY_MAX,
  FIRE_PROBABILITY_RAMP_DURATION,
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
  private burningGrass: Grass[];
  private deadGrass: Grass[];

  public fireProbability = INITIAL_FIRE_PROBABILITY;

  // Tracks how long the current round has been running (ms).
  // Used to drive the time-based probability ramp.
  private elapsedTime = 0;

  public readonly grassCanvasOffset = {
    x: HORIZONTAL_GRASS_PAD,
    y: TOP_BAR_HEIGHT,
  }; // px

  constructor(private boot: Boot) {
    this.grassMap = [];
    this.aliveGrass = [];
    this.burningGrass = [];
    this.deadGrass = [];

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

  removeGrassFromStateArray(grassInfo: Grass) {
    let array: Grass[] | null = null;

    switch (grassInfo.state) {
      case "alive":
        array = this.aliveGrass;
        break;
      case "burning":
        array = this.burningGrass;
        break;
      case "dead":
        array = this.deadGrass;
        break;
      default:
        console.error(
          `Grass state '${grassInfo.state}' is not valid when removing from state array`
        );
        return;
    }

    array.splice(array.indexOf(grassInfo), 1);
  }

  setGrassState(grassInfo: Grass, newState: Grass["state"]) {
    let array: Grass[] | null = null;

    switch (newState) {
      case "alive":
        array = this.aliveGrass;
        break;
      case "burning":
        array = this.burningGrass;
        break;
      case "dead":
        array = this.deadGrass;
        break;
      default:
        console.error(
          `Cannot update grass state - '${grassInfo.state}' is not a valid state`
        );
        return;
    }

    this.removeGrassFromStateArray(grassInfo);

    grassInfo.state = newState;
    array.push(grassInfo);
  }

  setFire(grassInfo: Grass) {
    if (grassInfo.state !== "alive") return;

    grassInfo.image?.destroy();

    this.setGrassState(grassInfo, "burning");

    grassInfo.image = this.boot.add
      .image(
        grassInfo.x * GRASS_SIZE + this.grassCanvasOffset.x,
        grassInfo.y * GRASS_SIZE + this.grassCanvasOffset.y,
        "burning-grass"
      )
      .setOrigin(0, 0)
      .setDisplaySize(GRASS_SIZE, GRASS_SIZE);
  }

  setDeadTrue(grassInfo: Grass) {
    if (grassInfo.state === "dead") return;

    grassInfo.image?.destroy();

    this.setGrassState(grassInfo, "dead");

    grassInfo.image = this.boot.add
      .image(
        grassInfo.x * GRASS_SIZE + this.grassCanvasOffset.x,
        grassInfo.y * GRASS_SIZE + this.grassCanvasOffset.y,
        "dead-grass"
      )
      .setOrigin(0, 0)
      .setDisplaySize(GRASS_SIZE, GRASS_SIZE);

    this.boot.events.emit("grass-died", grassInfo);
  }

  extinguishFire(grassInfo: Grass) {
    if (grassInfo.state !== "burning") return;

    grassInfo.image?.destroy();

    this.setGrassState(grassInfo, "alive");

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

    this.boot.events.emit("grass-extinguished", grassInfo);
  }

  resetGrass(grassInfo: Grass) {
    // Only create a new image object if necessary
    if (grassInfo) {
      grassInfo.image?.destroy();
      grassInfo.image = this.boot.add
        .image(
          grassInfo.x * GRASS_SIZE + this.grassCanvasOffset.x,
          grassInfo.y * GRASS_SIZE + this.grassCanvasOffset.y,
          "grass"
        )
        .setOrigin(0, 0)
        .setDisplaySize(GRASS_SIZE, GRASS_SIZE);
    }

    this.setGrassState(grassInfo, "alive");
    grassInfo.recoverCount = 0;
    grassInfo.hp = GRASS_MAX_HP;
  }

  public resetAllGrass() {
    for (let x = 0; x < GRASS_MAP_X; x++) {
      for (let y = 0; y < GRASS_MAP_Y; y++) {
        this.resetGrass(this.getGrassInfo(x, y));
      }
    }
  }

  public resetProbabilities() {
    this.fireProbability = INITIAL_FIRE_PROBABILITY;
    this.elapsedTime = 0;
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

  getDeadCount() {
    return this.deadGrass.length;
  }

  update(dt: number) {
    // Time-based probability ramp
    // Probability follows a smoothstep curve: 3t^2-2t^2 where t = elapsed/duration.
    // This gives a forgiving warm-up, a noticeable mid-game ramp, and a soft
    // plateau near the cap, all independent of fire cascades.
    //
    //   t=0   (  0 s) → p ~= 0.008  (~0.5 fires/s at 60 fps)
    //   t=0.5 ( 45 s) → p ~= 0.039  (~2.3 fires/s)
    //   t=1.0 ( 90 s) → p = 0.070  (~4.2 fires/s: cap)
    this.elapsedTime += dt;
    const t = Math.min(this.elapsedTime / FIRE_PROBABILITY_RAMP_DURATION, 1);
    const smoothT = t * t * (3 - 2 * t); // smoothstep
    this.fireProbability =
      INITIAL_FIRE_PROBABILITY +
      (FIRE_PROBABILITY_MAX - INITIAL_FIRE_PROBABILITY) * smoothT;

    // ── Random ignition ────────────────────────────────────────────────────────
    if (this.aliveGrass.length > 0 && Math.random() < this.fireProbability) {
      const aliveIndex = randInt(0, this.aliveGrass.length);
      const grassInfo = this.aliveGrass[aliveIndex];

      // If the block has been recovered too many times, give it a very low HP
      // so the player must act quickly, but still within human reaction time.
      if (grassInfo.recoverCount > MAX_RECOVER_COUNT) {
        grassInfo.hp = CRITICAL_MODE_HP;
      }

      this.setFire(grassInfo);
    }

    // ── Spread fire & reduce HP ────────────────────────────────────────────────
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
    // Generate all grass images
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
