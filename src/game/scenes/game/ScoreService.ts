import { Boot } from "../Boot";
import { GameStateService } from "./GameStateService";
import { GrassService } from "./GrassService";
import {
  FIRE_PROBABILITY_MAX,
  Grass,
  GRASS_MAX_HP,
} from "./GrassServiceConstants";
import { BASE_SCORE_INCREASE } from "./ScoreServiceConstants";

export class ScoreService {
  public gameStartTime: number; // ms
  public gameEndTime: number;

  public score: number;

  private gameStateService: GameStateService;

  constructor(private boot: Boot, private grassService: GrassService) {}

  restartStartGameTimer() {
    this.gameStartTime = this.boot.time.now;
  }

  resetScore() {
    this.score = 0;
  }

  incrementScore(i: number = 1) {
    this.score += i;
  }

  onGrassExtinguished(grassInfo: Grass) {
    // Grass with lower HP produce higher score increases since they are harder to extinguish
    const hpScoreMultiplier = 1 - grassInfo.hp / GRASS_MAX_HP;
    const probabilityScoreMultiplier =
      this.grassService.fireProbability / FIRE_PROBABILITY_MAX;
    this.incrementScore(
      Math.floor(
        BASE_SCORE_INCREASE * hpScoreMultiplier * probabilityScoreMultiplier
      )
    );
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

    this.boot.events.on("grass-extinguished", (grassInfo: Grass) => {
      this.onGrassExtinguished(grassInfo);
    });
  }
}
