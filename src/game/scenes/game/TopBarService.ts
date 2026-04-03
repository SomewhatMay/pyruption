import { Boot } from "../Boot";
import { GRASS_MAP_X, GRASS_SIZE } from "./GrassServiceConstants";
import { TOP_BAR_HEIGHT } from "./TopBarServiceConstants";

export class TopBarService {
  constructor(private boot: Boot) {}

  create() {
    const topBarWidth = GRASS_SIZE * GRASS_MAP_X;

    // Create general header
    this.boot.add
      .rectangle(0, 0, topBarWidth, TOP_BAR_HEIGHT, 0x999999, 1)
      .setOrigin(0, 0);

    this.boot.add
      .text(topBarWidth / 2, TOP_BAR_HEIGHT / 2, "Pyruption")
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
