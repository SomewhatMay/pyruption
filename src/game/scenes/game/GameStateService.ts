import { Boot } from "../Boot";
import { GrassService } from "./GrassService";

export class GameStateService {
  private isPaused = true;
  private isGameOver = false;

  constructor(private boot: Boot, private grassService: GrassService) {}

  create() {
    this.isPaused = false;
    this.isGameOver = false;

    this.boot.events.on("grass-died", () => this.onGrassDied());
  }

  startGame() {}

  onGameOver() {
    this.isGameOver = true;
  }

  onGrassDied() {
    if (this.grassService.getAliveCount() == 0) {
      this.onGameOver();
    }
  }
}
