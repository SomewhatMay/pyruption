import { clamp } from "../../../lib/clamp";
import { Boot } from "../Boot";
import {
  CURSOR_DEFAULT_SIZE,
  CURSOR_PX_MULT,
  MAX_BRUSH_SPEED,
} from "./BrushServiceConstants";
import { GrassService } from "./GrassService";
import { GRASS_SIZE } from "./GrassServiceConstants";

export class BrushService {
  private cursorPreview: Phaser.GameObjects.Ellipse;

  private pointerDown = false;
  private lastBrushUse = 0;

  private cursorRadius = CURSOR_DEFAULT_SIZE;

  constructor(private boot: Boot, private grassService: GrassService) {}

  onPointerDown(mouseX: number, mouseY: number) {
    // Create bounding box
    const cx = Math.floor(mouseX / GRASS_SIZE);
    const cy = Math.floor(mouseY / GRASS_SIZE);

    const boundingRadius = Math.floor(this.cursorRadius * 1.5);

    for (
      let x = clamp(cx - boundingRadius, 0, this.grassService.getSize().x - 1);
      x <= clamp(cx + boundingRadius, 0, this.grassService.getSize().x - 1);
      x++
    ) {
      for (
        let y = clamp(
          cy - boundingRadius,
          0,
          this.grassService.getSize().y - 1
        );
        y <= clamp(cy + boundingRadius, 0, this.grassService.getSize().y - 1);
        y++
      ) {
        if (
          Math.sqrt(
            Math.pow(x * GRASS_SIZE + GRASS_SIZE / 2 - mouseX, 2) +
              Math.pow(y * GRASS_SIZE + GRASS_SIZE / 2 - mouseY, 2)
          ) >
          this.cursorRadius * GRASS_SIZE
        )
          continue;

        this.grassService.extinguishFire(this.grassService.getGrassInfo(x, y));
      }
    }
  }

  create() {
    this.boot.input.setDefaultCursor("none");

    this.cursorPreview = this.boot.add
      .ellipse(
        100,
        100,
        this.cursorRadius * CURSOR_PX_MULT * 2,
        this.cursorRadius * CURSOR_PX_MULT * 2,
        0xffffff,
        0.5
      )
      .setDepth(10);

    // Have mouse preview follow cursor
    this.boot.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      this.cursorPreview.setPosition(pointer.x, pointer.y);
    });

    // Click to extinguish fire
    this.boot.input.on("pointerdown", () => (this.pointerDown = true));
    this.boot.input.on("pointerup", () => (this.pointerDown = false));
  }

  update() {
    if (
      this.pointerDown &&
      this.boot.time.now - this.lastBrushUse > MAX_BRUSH_SPEED
    ) {
      this.onPointerDown(
        this.boot.input.mousePointer.x,
        this.boot.input.mousePointer.y
      );

      this.lastBrushUse = this.boot.time.now;
    }
  }
}
