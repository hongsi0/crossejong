import sharedData from "../shared";
import "../fontLoader"; // can use the font as "BR-R"

export default class GameEndScene extends Phaser.Scene {
    constructor() {
        super("GameEndScene");
        this.playerRank = [];
    }

    init(data){
        this.playerRank = data.playerRank;
    }

    preload() {
        this.load.image("rankbackground", "assets/image/verificationbackground.png");
        this.load.image("finishButton2", "assets/image/okButton.png");
    }

    create() {
        const scene = this;

        sharedData.socket.removeAllListeners("gameexit")

        console.log(scene.playerRank);
        let bg = scene.add.image(1050, 500, "rankbackground");

        let topText = scene.add.text(0, 140, "순위", {font: "70px BR-R", color: "#523b33"});
        Phaser.Display.Align.In.Center(topText, bg);
        topText.y = 140;

        let text_space_y = 110;
        let text_start_y = 300;
        switch(scene.playerRank.length) {
            case 2:
                text_space_y = 170;
                text_start_y = 390;
                break;
            case 3:
                text_space_y = 125;
                text_start_y = 340;
                break;
        }
          
        let rankStyle = {font: "60px BR-R", color: "#523b33"};
        let texts = [];
        for (let i = 0; i < scene.playerRank.length; i++) {
            let nickname = scene.playerRank[i];
            let text = scene.add.text(750, 0, `${i+1}등 : ${nickname}`, rankStyle);
            text.y = text_start_y + i * text_space_y;
            texts.push(text);
        }

        sharedData.socket.on("gameexit", () => {
            scene.scene.start("GameRoomScene");
        })
    }
    update() {
    }
}