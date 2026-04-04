import { Boot } from "../Boot";
import { arcadeDefaultResized } from "../FontConstants";
import {
  GRASS_MAP_X,
  GRASS_MAP_Y,
  WIN_HEIGHT,
  WIN_WIDTH,
} from "../LayoutConstants";
import { GrassService } from "./GrassService";
import { ScoreService } from "./ScoreService";

export class GameStateService {
  private isPaused = true;
  private isGameOver = false;

  constructor(
    private boot: Boot,
    private grassService: GrassService,
    private scoreService: ScoreService
  ) {}

  create() {
    this.boot.input.setDefaultCursor("pointer");

    this.boot.events.on("grass-died", () => this.onGrassDied());

    this.showGameOverWindow();
  }

  showGameOverWindow() {
    this.boot.input.setDefaultCursor("");

    const gameOverLayer = this.boot.add.layer();
    gameOverLayer.setDepth(15);

    const GO_WINDOW_WIDTH = 360;
    const GO_WINDOW_HEIGHT = 200;

    const onRestart = () => {
      // Clean up all UI elements

      gameOverLayer.destroy();
      this.boot.input.setDefaultCursor("none");

      this.startGame();
    };

    gameOverLayer.add([
      /* Background */
      this.boot.add.rectangle(
        WIN_WIDTH / 2,
        WIN_HEIGHT / 2,
        GO_WINDOW_WIDTH + 10,
        GO_WINDOW_HEIGHT + 10,
        0x777777
      ),
      this.boot.add.rectangle(
        WIN_WIDTH / 2,
        WIN_HEIGHT / 2,
        GO_WINDOW_WIDTH,
        GO_WINDOW_HEIGHT,
        0x999999
      ),

      /* Title */
      this.boot.add
        .text(
          WIN_WIDTH / 2,
          WIN_HEIGHT / 2 - GO_WINDOW_HEIGHT / 2 + 15,
          "GAME OVER",
          arcadeDefaultResized(30)
        )
        .setOrigin(0.5, 0),

      /* Score */
      this.boot.add
        .text(
          WIN_WIDTH / 2 - GO_WINDOW_WIDTH * 0.25,
          WIN_HEIGHT / 2 - GO_WINDOW_HEIGHT * 0.25 + 10,
          "score",
          arcadeDefaultResized(10)
        )
        .setOrigin(0.5, 0),

      this.boot.add
        .text(WIN_WIDTH / 2 - GO_WINDOW_WIDTH * 0.25, WIN_HEIGHT / 2, "10000", {
          ...arcadeDefaultResized(25),
          color: "rgb(255,255,0)",
        })
        .setOrigin(0.5, 0.5),

      /* Time */
      this.boot.add
        .text(
          WIN_WIDTH / 2 + GO_WINDOW_WIDTH * 0.25,
          WIN_HEIGHT / 2 - GO_WINDOW_HEIGHT * 0.25 + 10,
          "time",
          arcadeDefaultResized(10)
        )
        .setOrigin(0.5, 0),

      this.boot.add
        .text(WIN_WIDTH / 2 + GO_WINDOW_WIDTH * 0.25, WIN_HEIGHT / 2, "100", {
          ...arcadeDefaultResized(25),
          color: "rgb(255,255,0)",
        })
        .setOrigin(0.5, 0.5),

      /* Restart Button */
      this.boot.add
        .rectangle(
          WIN_WIDTH / 2,
          WIN_HEIGHT / 2 + GO_WINDOW_HEIGHT / 2 - 5,
          GO_WINDOW_WIDTH - 20,
          GO_WINDOW_HEIGHT * 0.38 - 10,
          0x888888
        )
        .setOrigin(0.5, 1)
        .setInteractive()
        .on("pointerdown", () => onRestart()),

      this.boot.add
        .rectangle(
          WIN_WIDTH / 2,
          WIN_HEIGHT / 2 + GO_WINDOW_HEIGHT / 2 - 10,
          GO_WINDOW_WIDTH - 30,
          GO_WINDOW_HEIGHT * 0.38 - 20,
          0xaaaaaa
        )
        .setOrigin(0.5, 1),

      this.boot.add
        .text(
          WIN_WIDTH / 2,
          WIN_HEIGHT / 2 + GO_WINDOW_HEIGHT / 2 - 20,
          "RESTART",
          arcadeDefaultResized(30)
        )
        .setOrigin(0.5, 1),
    ]);
  }

  startGame() {
    this.isGameOver = false;
    this.isPaused = false;

    this.scoreService.restartStartGameTimer();
    this.grassService.resetAllGrass();
    this.grassService.resetProbabilities();
  }

  onGameOver() {
    this.isGameOver = true;
    this.showGameOverWindow();
  }

  onGrassDied() {
    if (this.grassService.getDeadCount() === GRASS_MAP_X * GRASS_MAP_Y) {
      this.onGameOver();
    }
  }
}
