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

    this.load.image("grass", "assets/grass.png");
    this.load.image("background", "assets/bg.png");
    // this.grassService = new GrassService(this);

    this.load.on("filecomplete", (key: string) => {
      console.log("loaded:", key);
    });

    this.load.on("loaderror", (file: Phaser.Loader.File) => {
      console.error("failed:", file.key, file.src);
    });
  }

  create() {
    // this.camera = this.cameras.main;
    // this.camera.setBackgroundColor("rgba(0,0,0,0)");

    // this.grassService.create();

    this.add.image(512, 384, "background");

    this.add.image(0, 0, "grass").setOrigin(0, 0);
  }
}
