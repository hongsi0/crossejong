/** @type {import("../typings/phaser")} */
/* The above loads the phaser.d.ts file so that VSCode has autocomplete for the Phaser API.
If you experience problems with autocomplete, try opening the phaser.d.ts file and scrolling up and down in it.
That may fix the problem -- some weird quirk with VSCode. A new typing file is released with
every new release of Phaser. Make sure it's up-to-date!

At some point, the typings will
be officially added to the official release so that all you'll have to do is do:

npm install @types/phaser

But this hasn't happened yet!
*/

// Bring in all the scenes
import "phaser";
import config from "./config/config";
import RoomScene from "./scenes/RoomScene";
import MakeroomScene from "./scenes/MakeroomScene";
import GameRoomScene from "./scenes/GameRoomScene";
import GameScene from "./scenes/GameScene";
import sharedData from "./shared";
import LoginScene from "./scenes/LoginScene";
import VerificationScene from "./scenes/VerificationScene";
import GameEndScene from "./scenes/GameEndScene";
import TutorialScene from "./scenes/TutorialScene";

export class Game extends Phaser.Game {
  constructor() {
    // Add the config file to the game
    super(config);
    // Add all the scenes
    // << ADD ALL SCENES HERE >>
    this.scene.add("LoginScene", LoginScene);
    this.scene.add("RoomScene", RoomScene);
    this.scene.add("MakeroomScene", MakeroomScene);
    this.scene.add("GameRoomScene", GameRoomScene);
    this.scene.add("GameScene", GameScene);
    this.scene.add("VerificationScene", VerificationScene);
    this.scene.add("GameEndScene", GameEndScene);
    this.scene.add("TutorialScene", TutorialScene);

    this.socket = io();

    // 전역변수로 sharedData 객체 생성
    sharedData.socket = this.socket;
    sharedData.roomKey = "";

    // Start the game with the mainscene
    // << START GAME WITH MAIN SCENE HERE >>
    this.scene.start("LoginScene");
  }
}
// Create new instance of game
window.onload = function () {
  window.game = new Game();
};
