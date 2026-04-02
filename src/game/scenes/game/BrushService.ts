import { clamp } from "../../../lib/clamp";
import { Boot } from "../Boot";
import { CURSOR_DEFAULT_SIZE, CURSOR_PX_MULT } from "./BrushServiceConstants";
import { GrassService } from "./GrassService";
import { GRASS_SIZE } from "./GrassServiceConstants";

export class BrushService {
  private cursorPreview: Phaser.GameObjects.Ellipse;

  private cursorRadius = CURSOR_DEFAULT_SIZE;

  constructor(private boot: Boot, private grassService: GrassService) {}

  onPointerDown(pointer: Phaser.Input.Pointer) {
    // Create bounding box
    const cx = Math.floor(pointer.x / GRASS_SIZE);
    const cy = Math.floor(pointer.y / GRASS_SIZE);

    this.grassService.extingwishFire(this.grassService.getGrassInfo(cx, cy));

    const boundingRadius = Math.floor(this.cursorRadius * 1.5);
    for (
      let x = clamp(cx - boundingRadius, 0, this.grassService.getSize().x);
      x <= clamp(cx + boundingRadius, 0, this.grassService.getSize().x);
      x++
    ) {
      for (
        let y = clamp(cy - boundingRadius, 0, this.grassService.getSize().y);
        y <= clamp(cy + boundingRadius, 0, this.grassService.getSize().y);
        y++
      ) {
        if (x == cx && y == cy) continue;

        if (
          Math.sqrt(
            Math.pow(x * GRASS_SIZE + GRASS_SIZE / 2 - pointer.x, 2) +
              Math.pow(y * GRASS_SIZE + GRASS_SIZE / 2 - pointer.y, 2)
          ) >
          this.cursorRadius * GRASS_SIZE
        )
          continue;

        // console.log(`Extingwishing ${x} ${y}`);

        this.grassService.extingwishFire(this.grassService.getGrassInfo(x, y));
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

    // Have mose preview follow cursor
    this.boot.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      this.cursorPreview.setPosition(pointer.x, pointer.y);
    });

    // Click to extingwish fire
    this.boot.input.on("pointerdown", (pointer: Phaser.Input.Pointer) =>
      this.onPointerDown(pointer)
    );
  }
}
