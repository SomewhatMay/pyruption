import { Boot } from "../Boot";
import {
  GRASS_MAP_Y,
  GRASS_SIZE,
  TOP_BAR_HEIGHT,
  WIN_WIDTH,
} from "../LayoutConstants";

export class BackgroundService {
  constructor(private boot: Boot) {}

  create() {
    this.boot.add
      .rectangle(
        0,
        TOP_BAR_HEIGHT,
        WIN_WIDTH,
        GRASS_MAP_Y * GRASS_SIZE,
        0x777777
      )
      .setOrigin(0, 0);
  }
}
