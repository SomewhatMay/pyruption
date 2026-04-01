import { Boot } from "../Boot";

export class GrassService {
  constructor(private boot: Boot) {
    this.boot.load.image("grass", "assets/grass.png");
    console.log("Grass service instantiated");
  }

  create() {
    this.boot.add.image(32, 32, "grass");
    console.log("Grass service created.");
  }
}
