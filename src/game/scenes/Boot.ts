import { Scene } from "phaser";
import { GrassService } from "./game/GrassService";
import { BrushService } from "./game/BrushService";
import { TopBarService } from "./game/TopBarService";
import { BottomBarService } from "./game/BottomBarService";
import { BackgroundService } from "./game/BackgroundService";
import { ScoreService } from "./game/ScoreService";

export class Boot extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;

  grassService: GrassService;
  brushService: BrushService;
  topBarService: TopBarService;
  bottomBarService: BottomBarService;
  backgroundService: BackgroundService;
  scoreService: ScoreService;

  constructor() {
    super("Boot");
  }

  preload() {
    //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
    //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

    this.grassService = new GrassService(this);
    this.brushService = new BrushService(this, this.grassService);
    this.topBarService = new TopBarService(this);
    this.scoreService = new ScoreService(this);
    this.bottomBarService = new BottomBarService(this, this.scoreService);
    this.backgroundService = new BackgroundService(this);
  }

  create() {
    this.scale.refresh();
    this.game.canvas.style.imageRendering = "pixelated";

    this.camera = this.cameras.main;
    this.camera.setBackgroundColor("rgba(0,0,0,0)");

    this.backgroundService.create();
    this.grassService.create();
    this.brushService.create();
    this.topBarService.create();
    this.bottomBarService.create();
    this.scoreService.create();
  }

  update(now: number, dt: number) {
    this.grassService.update(dt);
    this.brushService.update();
    this.bottomBarService.update();
  }
}
