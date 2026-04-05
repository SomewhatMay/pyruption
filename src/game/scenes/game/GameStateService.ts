// game/scenes/game/GameStateService.ts
import { Boot } from "../Boot";
import { arcadeDefaultResized } from "../FontConstants";
import {
  BOTTOM_BAR_HEIGHT,
  GRASS_MAP_X,
  GRASS_MAP_Y,
  TOP_BAR_HEIGHT,
  WIN_HEIGHT,
  WIN_WIDTH,
} from "../LayoutConstants";
import { BrushService } from "./BrushService";
import { GrassService } from "./GrassService";
import { ScoreService } from "./ScoreService";

export class GameStateService {
  public isPaused = true;
  public isGameOver = false;

  constructor(
    private boot: Boot,
    private grassService: GrassService,
    private scoreService: ScoreService,
    private brushService: BrushService
  ) {}

  create() {
    this.boot.input.setDefaultCursor("pointer");
    this.boot.events.on("grass-died", () => this.onGrassDied());
    this.showWelcomeWindow();
  }

  showWelcomeWindow() {
    this.isPaused = true;
    this.boot.input.setDefaultCursor("pointer");

    const welcomeLayer = this.boot.add.layer();
    welcomeLayer.setDepth(15);

    const W_WIDTH = 480;
    const W_HEIGHT = 380;
    const cx = WIN_WIDTH / 2;
    const cy = WIN_HEIGHT / 2;
    const top = cy - W_HEIGHT / 2;

    const onPlay = () => {
      welcomeLayer.destroy();
      this.startGame();
    };

    const tips = [
      {
        title: "FIRE SPREADS!",
        body: "Flames randomly ignite and spread to nearby\ntiles. Don't let the whole field burn down!",
      },
      {
        title: "CLICK & HOLD TO SPRAY",
        body: "Move your cursor over burning tiles and\nhold the mouse button to extinguish fires.",
      },
      {
        title: "WATCH YOUR EXTINGUISHER",
        body: "Spray capacity depletes as you use it.\nDon't let the bar at the bottom run out!",
      },
    ];

    const items: Phaser.GameObjects.GameObject[] = [
      /* Cover shadow */
      this.boot.add
        .rectangle(
          0,
          TOP_BAR_HEIGHT,
          WIN_WIDTH,
          WIN_HEIGHT - TOP_BAR_HEIGHT - BOTTOM_BAR_HEIGHT,
          0x000000,
          0.65
        )
        .setOrigin(0, 0),

      /* Window outer border */
      this.boot.add.rectangle(cx, cy, W_WIDTH + 10, W_HEIGHT + 10, 0x777777),

      /* Window background */
      this.boot.add.rectangle(cx, cy, W_WIDTH, W_HEIGHT, 0x999999),

      /* Title */
      this.boot.add
        .text(cx, top + 18, "HOW TO PLAY", arcadeDefaultResized(24))
        .setOrigin(0.5, 0),

      /* Divider */
      this.boot.add
        .rectangle(cx, top + 52, W_WIDTH - 40, 3, 0x777777)
        .setOrigin(0.5, 0),
    ];

    /* Tips — each 80px apart */
    tips.forEach((tip, i) => {
      const tipY = top + 68 + i * 80;
      items.push(
        this.boot.add
          .text(
            cx - W_WIDTH / 2 + 20,
            tipY,
            tip.title,
            arcadeDefaultResized(13)
          )

          .setOrigin(0, 0),
        this.boot.add
          .text(
            cx - W_WIDTH / 2 + 20,
            tipY + 22,
            tip.body,
            arcadeDefaultResized(10)
          )
          .setLineSpacing(7)
          .updateText()
          .setOrigin(0, 0)
      );
    });

    /* Play button — mirrors game over Restart button pattern */
    const BTN_Y = cy + W_HEIGHT / 2;
    items.push(
      this.boot.add
        .rectangle(cx, BTN_Y - 5, W_WIDTH - 20, 58, 0x888888)
        .setOrigin(0.5, 1)
        .setInteractive()
        .on("pointerdown", () => onPlay()),
      this.boot.add
        .rectangle(cx, BTN_Y - 10, W_WIDTH - 30, 48, 0xaaaaaa)
        .setOrigin(0.5, 1),
      this.boot.add
        .text(cx, BTN_Y - 18, "PLAY GAME", arcadeDefaultResized(30))
        .setOrigin(0.5, 1)
    );

    welcomeLayer.add(items);
  }

  showGameOverWindow() {
    this.boot.input.setDefaultCursor("");

    const gameOverLayer = this.boot.add.layer();
    gameOverLayer.setDepth(15);

    const GO_WINDOW_WIDTH = 360;
    const GO_WINDOW_HEIGHT = 200;

    const onRestart = () => {
      gameOverLayer.destroy();
      this.startGame();
    };

    gameOverLayer.add([
      /* Cover Shadow */
      this.boot.add
        .rectangle(
          0,
          TOP_BAR_HEIGHT,
          WIN_WIDTH,
          WIN_HEIGHT - TOP_BAR_HEIGHT - BOTTOM_BAR_HEIGHT,
          0x000000,
          0.65
        )
        .setOrigin(0, 0),

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
        .text(
          WIN_WIDTH / 2 - GO_WINDOW_WIDTH * 0.25,
          WIN_HEIGHT / 2,
          `${this.scoreService.score}`,
          {
            ...arcadeDefaultResized(25),
            color: "rgb(255,255,0)",
          }
        )
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
        .text(
          WIN_WIDTH / 2 + GO_WINDOW_WIDTH * 0.25,
          WIN_HEIGHT / 2,
          `${(this.scoreService.getElapsedTime() / 1000).toFixed(2)}`,
          {
            ...arcadeDefaultResized(25),
            color: "rgb(255,255,0)",
          }
        )
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

    this.boot.input.setDefaultCursor("none");

    this.scoreService.restartStartGameTimer();
    this.scoreService.resetScore();
    this.grassService.resetAllGrass();
    this.grassService.resetProbabilities();
    this.brushService.resetBrushCapacity();
    this.brushService.setBrushVisible(true);
  }

  onGameOver() {
    this.scoreService.gameEndTime = this.boot.time.now;
    this.brushService.setBrushVisible(false);
    this.isGameOver = true;
    this.showGameOverWindow();
  }

  onGrassDied() {
    if (this.grassService.getDeadCount() === GRASS_MAP_X * GRASS_MAP_Y) {
      this.onGameOver();
    }
  }
}
