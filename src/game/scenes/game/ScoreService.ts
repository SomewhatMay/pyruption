import { Boot } from "../Boot";
import { GameStateService } from "./GameStateService";

export class ScoreService {
  public gameStartTime: number; // ms
  public gameEndTime: number;

  public score: number;

  private gameStateService: GameStateService;

  constructor(private boot: Boot) {}

  restartStartGameTimer() {
    this.gameStartTime = this.boot.time.now;
  }

  resetScore() {
    this.score = 0;
  }

  /**
   *
   * @returns ms - the time elapsed since the beginning of the game
   */
  getElapsedTime() {
    if (this.gameStateService.isGameOver) {
      return this.gameEndTime - this.gameStartTime;
    }

    return this.boot.time.now - this.gameStartTime;
  }

  create(gameStateService: GameStateService) {
    this.gameStateService = gameStateService;
    this.restartStartGameTimer();
  }
}
