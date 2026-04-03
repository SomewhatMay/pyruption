import { Boot } from "../Boot";

export class ScoreService {
  private gameStartTime: number; // ms

  constructor(private boot: Boot) {}

  restartStartGameTimer() {
    this.gameStartTime = this.boot.time.now;
  }

  /**
   *
   * @returns ms - the time elapsed since the beginning of the game
   */
  getElapsedTime() {
    return this.boot.time.now - this.gameStartTime;
  }

  create() {
    this.restartStartGameTimer();
  }
}
