import { Boot } from "./scenes/Boot";
import { AUTO, Game } from "phaser";
import { WIN_HEIGHT } from "./scenes/LayoutConstants";
import { WIN_WIDTH } from "./scenes/LayoutConstants";

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Phaser.Types.Core.GameConfig = {
  type: AUTO,

  width: WIN_WIDTH,
  height: WIN_HEIGHT,

  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },

  title: "Pyruption",
  parent: "game-container",
  backgroundColor: "rgba(0,0,0,0)",
  scene: [Boot],
};

const StartGame = (parent: string) => {
  return new Game({ ...config, parent });
};

export default StartGame;
