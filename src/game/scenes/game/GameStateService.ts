import { Boot } from "../Boot";
import { GRASS_MAP_X, GRASS_MAP_Y } from "../LayoutConstants";
import { GrassService } from "./GrassService";
import { ScoreService } from "./ScoreService";

export class GameStateService {
  private isPaused = true;
  private isGameOver = false;

  constructor(
    private boot: Boot,
    private grassService: GrassService,
    private scoreService: ScoreService
  ) {}

  create() {
    this.boot.events.on("grass-died", () => this.onGrassDied());
  }

  startGame() {
    this.isGameOver = false;
    this.isPaused = false;

    this.scoreService.restartStartGameTimer();
    this.grassService.resetAllGrass();
    this.grassService.resetProbabilities();
  }

  onGameOver() {
    this.isGameOver = true;
    this.startGame();
  }

  onGrassDied() {
    if (this.grassService.getDeadCount() === GRASS_MAP_X * GRASS_MAP_Y) {
      this.onGameOver();
    }
  }
}
