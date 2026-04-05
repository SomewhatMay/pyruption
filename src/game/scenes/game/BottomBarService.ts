import { lerpHSV } from "../../../lib/lerp-hsv";
import { Boot } from "../Boot";
import { ARCADE_DEFAULT, arcadeDefaultResized } from "../FontConstants";
import { BOTTOM_BAR_HEIGHT, BOTTOM_BAR_Y, WIN_WIDTH } from "../LayoutConstants";
import { BrushService } from "./BrushService";
import { MAX_BRUSH_CAPACITY } from "./BrushServiceConstants";
import { ScoreService } from "./ScoreService";

type BrushCapacityUIInfo = {
  rect: Phaser.GameObjects.Rectangle;
  maxWidth: number; // px

  text: Phaser.GameObjects.Text;
};

export class BottomBarService {
  private timeText: Phaser.GameObjects.Text;
  private scoreText: Phaser.GameObjects.Text;

  private brushCapacityUIInfo: BrushCapacityUIInfo;

  constructor(
    private boot: Boot,
    private scoreService: ScoreService,
    private brushService: BrushService
  ) {}

  create() {
    const commonPad = BOTTOM_BAR_HEIGHT * 0.125;
    const bottomBarWidth = WIN_WIDTH;

    /* Bottom bar background */
    this.boot.add
      .rectangle(
        0,
        BOTTOM_BAR_Y,
        bottomBarWidth,
        BOTTOM_BAR_HEIGHT,
        0x555555,
        1
      )
      .setOrigin(0, 0);

    /* Timer Card */
    const TIMER_CARD_WIDTH = 100;
    const TIMER_CARD_HEIGHT = BOTTOM_BAR_HEIGHT * 0.75;
    const TIMER_CARD_Y_PAD = 8;

    this.boot.add
      .rectangle(
        bottomBarWidth - commonPad + 4,
        BOTTOM_BAR_Y + BOTTOM_BAR_HEIGHT / 2,
        TIMER_CARD_WIDTH + 8,
        TIMER_CARD_HEIGHT + 8,
        0x777777
      )
      .setOrigin(1, 0.5);

    this.boot.add
      .rectangle(
        bottomBarWidth - commonPad,
        BOTTOM_BAR_Y + BOTTOM_BAR_HEIGHT / 2,
        TIMER_CARD_WIDTH,
        TIMER_CARD_HEIGHT,
        0x999999
      )
      .setOrigin(1, 0.5);

    this.boot.add
      .text(
        bottomBarWidth - 2 * commonPad,
        BOTTOM_BAR_Y + commonPad + TIMER_CARD_Y_PAD,
        "Time",
        ARCADE_DEFAULT
      )
      .setOrigin(1, 0);

    this.timeText = this.boot.add
      .text(
        bottomBarWidth - 2 * commonPad,
        BOTTOM_BAR_Y + commonPad + TIMER_CARD_HEIGHT - TIMER_CARD_Y_PAD,
        "0",
        arcadeDefaultResized(16)
      )
      .setOrigin(1, 1);

    /* Score Card */
    const SCORE_CARD_WIDTH = 200;
    const SCORE_CARD_HEIGHT = BOTTOM_BAR_HEIGHT * 0.75;
    const SCORE_CARD_Y_PAD = 8;

    this.boot.add
      .rectangle(
        bottomBarWidth - TIMER_CARD_WIDTH - commonPad * 2,
        BOTTOM_BAR_Y + BOTTOM_BAR_HEIGHT / 2,
        SCORE_CARD_WIDTH + 8,
        SCORE_CARD_HEIGHT + 8,
        0x777777
      )
      .setOrigin(1, 0.5);

    this.boot.add
      .rectangle(
        bottomBarWidth - TIMER_CARD_WIDTH - commonPad * 2 - 4,
        BOTTOM_BAR_Y + BOTTOM_BAR_HEIGHT / 2,
        SCORE_CARD_WIDTH,
        SCORE_CARD_HEIGHT,
        0x999999
      )
      .setOrigin(1, 0.5);

    this.boot.add
      .text(
        bottomBarWidth - TIMER_CARD_WIDTH - commonPad * 3 - 4,
        BOTTOM_BAR_Y + commonPad + SCORE_CARD_Y_PAD,
        "Score",
        ARCADE_DEFAULT
      )
      .setOrigin(1, 0);

    this.scoreText = this.boot.add
      .text(
        bottomBarWidth - TIMER_CARD_WIDTH - commonPad * 3 - 4,
        BOTTOM_BAR_Y + commonPad + SCORE_CARD_HEIGHT - SCORE_CARD_Y_PAD,
        "0",
        arcadeDefaultResized(16)
      )
      .setOrigin(1, 1);

    /* Brush Capacity Bar */
    const BRUSH_CAPACITY_CARD_WIDTH =
      bottomBarWidth -
      (TIMER_CARD_WIDTH + 8) -
      (SCORE_CARD_WIDTH + 8) -
      commonPad * 3;
    const BRUSH_CAPACITY_CARD_HEIGHT = BOTTOM_BAR_HEIGHT * 0.75;
    const BRUSH_CAPACITY_CARD_Y_PAD = 8;

    this.boot.add
      .rectangle(
        commonPad,
        BOTTOM_BAR_Y + BOTTOM_BAR_HEIGHT / 2,
        BRUSH_CAPACITY_CARD_WIDTH,
        BRUSH_CAPACITY_CARD_HEIGHT + 8,
        0x777777
      )
      .setOrigin(0, 0.5);

    // Under status bar
    this.boot.add
      .rectangle(
        commonPad + 4,
        BOTTOM_BAR_Y + BOTTOM_BAR_HEIGHT / 2,
        BRUSH_CAPACITY_CARD_WIDTH - 8,
        BRUSH_CAPACITY_CARD_HEIGHT,
        0x999999
      )
      .setOrigin(0, 0.5);

    // Main dynamic status bar
    const brushCapacityStatusBar = this.boot.add
      .rectangle(
        commonPad + 4,
        BOTTOM_BAR_Y + BOTTOM_BAR_HEIGHT / 2,
        BRUSH_CAPACITY_CARD_WIDTH - 8,
        BRUSH_CAPACITY_CARD_HEIGHT,
        0xdddddd
      )
      .setOrigin(0, 0.5);

    const brushCapacityPercentageText = this.boot.add
      .text(
        BRUSH_CAPACITY_CARD_WIDTH - 4,
        BOTTOM_BAR_Y + BOTTOM_BAR_HEIGHT * 0.5,
        "100%",
        {
          ...arcadeDefaultResized(32),
          color: "rgb(255,255,255)",
          stroke: "rgba(0,0,0)",
          strokeThickness: 4,
        }
      )
      .setOrigin(1, 0.5);

    this.boot.add
      .text(
        commonPad * 2 + 4,
        BOTTOM_BAR_Y + commonPad + BRUSH_CAPACITY_CARD_Y_PAD,
        "Fire Extinguisher Capacity",
        {
          ...arcadeDefaultResized(16),
          color: "rgb(255,255,255)",
          stroke: "rgba(0,0,0)",
          strokeThickness: 4,
        }
      )
      .setOrigin(0, 0);

    this.brushCapacityUIInfo = {
      rect: brushCapacityStatusBar,
      maxWidth: brushCapacityStatusBar.width,
      text: brushCapacityPercentageText,
    };
  }

  update() {
    this.timeText.setText(
      `${(this.scoreService.getElapsedTime() / 1000).toFixed(2)}`
    );

    this.scoreText.setText(`${this.scoreService.score}`);

    const t = this.brushService.brushCapacity / MAX_BRUSH_CAPACITY;
    this.brushCapacityUIInfo.rect.setSize(
      this.brushCapacityUIInfo.maxWidth * t,
      this.brushCapacityUIInfo.rect.height
    );

    this.brushCapacityUIInfo.text.setColor(
      Phaser.Display.Color.IntegerToColor(lerpHSV(0xffffff, 0xff0000, 1 - t))
        .rgba
    );

    this.brushCapacityUIInfo.text.setText(`${(t * 100).toFixed(0)}%`);
  }
}
