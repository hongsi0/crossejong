import sharedData from "../shared";
import "../fontLoader"; // can use the font as "BR-R"

export default class GameEndScene extends Phaser.Scene {
    constructor() {
        super("GameEndScene");
        //this.playerRank = null;
    }

    init(data){
        this.playerRank = data.playerRank;
    }

    preload() {
        this.load.image("endbackground", "assets/image/gameEndBG.png");
        this.load.image("rank_2p", "assets/image/rank_2p.png");
        this.load.image("rank_3p", "assets/image/rank_3p.png");
        this.load.audio("gameEndbgm", "assets/sound/gameEndbgm.mp3");
    }

    create() {
        const scene = this;
        sharedData.socket.removeAllListeners("gameexit");
        console.log(scene.playerRank);
        const player_num = scene.playerRank.length;

        scene.add.image(0, 0, "endbackground").setOrigin(0,0);

        scene.gameEndbgm = scene.sound.add("gameEndbgm",{loop:false});
        scene.gameEndbgm.play();

        let rank;
        if(player_num == 2) { // 2 players
            rank = scene.add.image(960,1080,"rank_2p").setOrigin(0.5, 1);
        } else { // 3 or 4 players
            rank = scene.add.image(960,1080,"rank_3p").setOrigin(0.5, 1);
        }
        rank.displayHeight = 0;

        scene.tweens.add({
            targets: rank,
            displayHeight: rank.height,
            duration: 1000,
            ease: 'Linear',
            onComplete: function () {
              console.log("rank 애니메이션 완료");
            }
          });

        for (let i = 0; i < scene.playerRank.length; i++) {
            let nickname = scene.playerRank[i];
            console.log(`${i+1}등 : ${nickname}`);
        }

        sharedData.socket.on("gameexit", () => {
            scene.scene.start("GameRoomScene");
        })
    }
    update() {
    }
}