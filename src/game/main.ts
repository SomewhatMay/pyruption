import { Boot } from "./scenes/Boot";
import { AUTO, Game } from "phaser";

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Phaser.Types.Core.GameConfig = {
  type: AUTO,

  width: window.innerWidth,
  height: window.innerHeight,
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },

  parent: "game-container",
  backgroundColor: "rgba(0,0,0,0)",
  scene: [Boot],
};

const StartGame = (parent: string) => {
  return new Game({ ...config, parent });
};

export default StartGame;
