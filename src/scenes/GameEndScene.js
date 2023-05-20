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
        this.load.image("rank_2p_first", "assets/image/rank_2p_first.png");
        this.load.image("rank_2p_second", "assets/image/rank_2p_second.png");
        this.load.image("rank_3p_first", "assets/image/rank_3p_first.png");
        this.load.image("rank_3p_second", "assets/image/rank_3p_second.png");
        this.load.image("rank_3p_third", "assets/image/rank_3p_third.png");
    }

    create() {
        const scene = this;
        sharedData.socket.removeAllListeners("gameexit")
        console.log(scene.playerRank);

        scene.add.image(0, 0, "endbackground").setOrigin(0,0);

        let rank_first = scene.add.image(1050, 500, "rank_3p_first").setOrigin(0,0);
        rank_first.displayHeight = 0;

        scene.tweens.add({
            targets: rank_first,
            displayHeight: rank_first.height,
            duration: 2000,
            ease: 'Linear',
            onComplete: function () {
                console.log("애니메이션 완료");
            }
        });

        // let rank_second = scene.add.image(1050, 400, "rank_3p_second");
        // let rank_third = scene.add.image(1050, 600, "rank_3p_third");

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