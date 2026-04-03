import { Scene } from "phaser";
import { GrassService } from "./game/GrassService";
import { BrushService } from "./game/BrushService";

export class Boot extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;

  grassService: GrassService;
  brushService: BrushService;

  constructor() {
    super("Boot");
  }

  preload() {
    //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
    //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

    this.grassService = new GrassService(this);
    this.brushService = new BrushService(this, this.grassService);
  }

  create() {
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor("rgba(0,0,0,0)");

    this.grassService.create();
    this.brushService.create();
  }

  update(_: number, dt: number) {
    this.grassService.update(dt);
    this.brushService.update();
  }
}
