import { Boot } from "../Boot";
import { ARCADE_DEFAULT } from "../FontConstants";
import { WIN_WIDTH } from "../LayoutConstants";
import { TOP_BAR_HEIGHT } from "../LayoutConstants";

export class TopBarService {
  constructor(private boot: Boot) {}

  create() {
    const topBarWidth = WIN_WIDTH;

    // Create general header
    this.boot.add
      .rectangle(0, 0, topBarWidth, TOP_BAR_HEIGHT, 0x555555, 1)
      .setOrigin(0, 0);

    this.boot.add
      .text(topBarWidth / 2, TOP_BAR_HEIGHT / 2, "Pyruption", ARCADE_DEFAULT)
      .setOrigin(0.5, 0.5);

    this.boot.add
      .rectangle(0, TOP_BAR_HEIGHT / 2, topBarWidth * 0.45, 5, 0xff0000, 1)
      .setOrigin(0, 0.5);

    this.boot.add
      .rectangle(
        topBarWidth,
        TOP_BAR_HEIGHT / 2,
        topBarWidth * 0.45,
        5,
        0xff0000,
        1
      )
      .setOrigin(1, 0.5);
  }
}
