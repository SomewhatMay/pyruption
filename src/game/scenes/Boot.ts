import { Scene } from "phaser";
import { GrassService } from "./game/GrassService";

export class Boot extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;

  grassService: GrassService;

  constructor() {
    super("Boot");
  }

  preload() {
    //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
    //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

    this.grassService = new GrassService(this);
  }

  create() {
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor("rgba(0,0,0,0)");

    this.grassService.create();
  }

  update() {
    this.grassService.update();
  }
}
