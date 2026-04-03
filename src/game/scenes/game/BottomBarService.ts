import { Boot } from "../Boot";
import { BOTTOM_BAR_HEIGHT, BOTTOM_BAR_Y } from "./BottomBarServiceConstants";
import { GRASS_MAP_X, GRASS_SIZE } from "./GrassServiceConstants";

export class BottomBarService {
  constructor(private boot: Boot) {}

  create() {
    const commonPad = BOTTOM_BAR_HEIGHT * 0.125;
    const bottomBarWidth = GRASS_SIZE * GRASS_MAP_X;
    // Bottom bar background

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

    // Timer card

    this.boot.add
      .rectangle(
        bottomBarWidth - commonPad,
        BOTTOM_BAR_Y + BOTTOM_BAR_HEIGHT / 2,
        96,
        BOTTOM_BAR_HEIGHT * 0.75,
        0x999999
      )
      .setOrigin(1, 0.5);

    this.boot.add
      .text(
        bottomBarWidth - commonPad - 96 + commonPad,
        BOTTOM_BAR_Y + BOTTOM_BAR_HEIGHT / 2,
        "0"
      )
      .setOrigin(0, 0.5);
  }
}
