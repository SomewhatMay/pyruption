// game/scenes/Boot.ts
import { Scene } from "phaser";
import { GrassService } from "./game/GrassService";
import { BrushService } from "./game/BrushService";
import { TopBarService } from "./game/TopBarService";
import { BottomBarService } from "./game/BottomBarService";
import { BackgroundService } from "./game/BackgroundService";
import { ScoreService } from "./game/ScoreService";
import { GameStateService } from "./game/GameStateService";

export class Boot extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;

  grassService: GrassService;
  brushService: BrushService;
  topBarService: TopBarService;
  bottomBarService: BottomBarService;
  backgroundService: BackgroundService;
  scoreService: ScoreService;
  gameStateService: GameStateService;

  constructor() {
    super("Boot");
  }

  preload() {
    this.grassService = new GrassService(this);
    this.brushService = new BrushService(this, this.grassService);
    this.topBarService = new TopBarService(this);
    this.scoreService = new ScoreService(this, this.grassService);
    this.bottomBarService = new BottomBarService(
      this,
      this.scoreService,
      this.brushService
    );
    this.backgroundService = new BackgroundService(this);
    this.gameStateService = new GameStateService(
      this,
      this.grassService,
      this.scoreService,
      this.brushService
    );
  }

  create() {
    this.scale.refresh();
    this.game.canvas.style.imageRendering = "pixelated";

    this.camera = this.cameras.main;
    this.camera.setBackgroundColor("rgba(0,0,0,0)");

    this.backgroundService.create();
    this.grassService.create();
    this.brushService.create(this.gameStateService);
    this.topBarService.create();
    this.bottomBarService.create();
    this.gameStateService.create();
    this.scoreService.create(this.gameStateService);
  }

  update(_now: number, dt: number) {
    // While paused (e.g. welcome screen), freeze all gameplay systems so
    // fires don't spread and the HUD doesn't show stale values.
    if (!this.gameStateService.isPaused) {
      this.grassService.update(dt);
      this.brushService.update(dt);
      this.bottomBarService.update();
    }
  }
}
