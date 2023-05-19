import sharedData from "../shared";
import "../fontLoader"; // can use the font as "BR-R"

export default class VerificationScene extends Phaser.Scene {
    constructor() {
        super("VerificationScene");
    }

    init(data){
        this.turnPlayer = data.turnPlayer;
        this.word = data.word;
    }

    preload() {
        this.load.image("verificationbackground", "assets/image/verificationbackground.png");
        this.load.image("objectionButton(N)", "assets/image/objectionButton(N).png");
        this.load.image("objectionButton(Y)", "assets/image/objectionButton(Y).png");
    }

    create() {
        const scene = this;

        sharedData.socket.removeAllListeners("verificationFalse");
        sharedData.socket.removeAllListeners("verificationTrue");
        sharedData.socket.removeAllListeners("verTimeDecrease");
        sharedData.socket.removeAllListeners("verificationEnd");

        let result = "";
        let cardgetplayer = "";
        let objectionButtonClicked = false;

        //BACKGROUND
        let bg = scene.add.image(1050, 500, "verificationbackground");

        let Toptext = scene.add.text(0, 0, "이의제기 가능", {font: "70px BR-R", color: "#523b33"});
        let wordText = scene.add.text(0, 0, scene.word, {font: "70px BR-R", color: "#523b33"});
        let resultText = scene.add.text(0, 0, "", {font: "60px BR-R", color: "#523b33"});
        let meanText = scene.add.text(0, 0, "", {font: "30px BR-R", color: "#523b33"});
        let playerText = scene.add.text(0, 0, "", {font: "60px BR-R", color: "#523b33"});
        let timeText = scene.add.text(0, 0, "7초 후에 게임으로 돌아갑니다.", {font: "60px BR-R", color: "#523b33"});
        
        Phaser.Display.Align.In.Center(Toptext, bg);
        Phaser.Display.Align.In.Center(wordText, bg);
        Phaser.Display.Align.In.Center(resultText, bg);
        Phaser.Display.Align.In.Center(meanText, bg);
        Phaser.Display.Align.In.Center(playerText, bg);
        Phaser.Display.Align.In.Center(timeText, bg);

        Toptext.y = 140;
        wordText.y = 300;
        resultText.y = 430;
        meanText.y = 550;
        playerText.y = 650;
        timeText.y = 800;

        // objection을 신청하는 button
        const objectionButton = scene.add.sprite(1050, 620, "objectionButton(N)")
        .setInteractive()
        .setDepth(1)
        .setScale(0.7)
        .on("pointerup",() => {
            if (!objectionButtonClicked && this.turnPlayer != sharedData.socket.id){
                objectionButtonClicked = true;
                sharedData.socket.emit("objection", {roomKey:sharedData.roomKey, id:sharedData.socket.id, word:scene.word});
            }
        })
        .on('pointerover', () => {
            objectionButton.setTexture("objectionButton(Y)");
        })
        .on("pointerout", ()=> {
            objectionButton.setTexture("objectionButton(N)");
        });

        sharedData.socket.on("verificationFalse", (data) => {
            Toptext.setText("검증 결과");
            resultText.setText("존재하지 않는 단어입니다.");
            playerText.setText(`${data.nick}님이 카드 한장을 받습니다.`);

            Phaser.Display.Align.In.Center(Toptext, bg);
            Phaser.Display.Align.In.Center(wordText, bg);
            Phaser.Display.Align.In.Center(resultText, bg);
            Phaser.Display.Align.In.Center(meanText, bg);
            Phaser.Display.Align.In.Center(playerText, bg);

            Toptext.y = 140;
            wordText.y = 300;
            resultText.y = 430;
            meanText.y = 550;
            playerText.y = 650;

            objectionButton.visible = false;

            result = "false";
            cardgetplayer = data.id;
            scene.word = "";
        });

        sharedData.socket.on("verificationTrue", (data) => {
            Toptext.setText("검증 결과");
            resultText.setText(`${data.word} (${data.pos})`);
            meanText.setText(data.def);
            playerText.setText(`${data.nick}님이 카드 한장을 받습니다.`);

            Phaser.Display.Align.In.Center(Toptext, bg);
            Phaser.Display.Align.In.Center(wordText, bg);
            Phaser.Display.Align.In.Center(resultText, bg);
            Phaser.Display.Align.In.Center(meanText, bg);
            Phaser.Display.Align.In.Center(playerText, bg);

            Toptext.y = 140;
            wordText.y = 300;
            resultText.y = 430;
            meanText.y = 550;
            playerText.y = 650;

            objectionButton.visible = false;

            result = "true";
            cardgetplayer = data.id;
        });

        sharedData.socket.on("verTimeDecrease", (timer) => {
            timeText.setText(`${timer}초 후에 게임으로 돌아갑니다.`);
            Phaser.Display.Align.In.Center(timeText, bg);
            timeText.y = 800;
        });

        sharedData.socket.on("verificationEnd", (data) => {
            scene.scene.stop("VerificationScene");
            if (data.id === sharedData.socket.id) {
                if(result === ""){
                    sharedData.socket.emit("turnEnd", {roomKey:sharedData.roomKey, id:sharedData.socket.id, type:"finish"});
                } else {
                    sharedData.socket.emit("verificationresult", {roomKey:sharedData.roomKey, result:result, id:cardgetplayer});
                }
            }
        });
    }
}