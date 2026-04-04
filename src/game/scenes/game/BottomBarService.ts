import { Boot } from "../Boot";
import { ARCADE_DEFAULT, arcadeDefaultResized } from "../FontConstants";
import { BOTTOM_BAR_HEIGHT, BOTTOM_BAR_Y, WIN_WIDTH } from "../LayoutConstants";
import { ScoreService } from "./ScoreService";

export class BottomBarService {
  private timeText: Phaser.GameObjects.Text;

  constructor(private boot: Boot, private scoreService: ScoreService) {}

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

    this.boot.add
      .text(
        bottomBarWidth - TIMER_CARD_WIDTH - commonPad * 3 - 4,
        BOTTOM_BAR_Y + commonPad + SCORE_CARD_HEIGHT - SCORE_CARD_Y_PAD,
        "0",
        arcadeDefaultResized(16)
      )
      .setOrigin(1, 1);
  }

  update() {
    this.timeText.setText(
      `${(this.scoreService.getElapsedTime() / 1000).toFixed(2)}`
    );
  }
}
