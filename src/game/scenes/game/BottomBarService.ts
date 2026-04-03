import { Boot } from "../Boot";
import { ARCADE_DEFAULT } from "../FontConstants";
import { BOTTOM_BAR_HEIGHT, BOTTOM_BAR_Y, WIN_WIDTH } from "../LayoutConstants";

export class BottomBarService {
  private timeText: Phaser.GameObjects.Text;

  constructor(private boot: Boot) {}

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
        0x777777,
        1
      )
      .setOrigin(0, 0);

    /* Timer Card */
    const TIMER_CARD_WIDTH = 96;
    const TIMER_CARD_HEIGHT = BOTTOM_BAR_HEIGHT * 0.75;
    const TIMER_CARD_Y_PAD = 8;
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
        ARCADE_DEFAULT
      )
      .setOrigin(1, 1);

    /* Score Counter */
  }

  update(now: number) {
    this.timeText.setText(`${(now / 1000).toFixed(2)}`);
  }
}
