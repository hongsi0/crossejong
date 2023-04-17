import sharedData from "../shared";
import "../fontLoader"; // can use the font as "BR-R"

export default class VerificationScene extends Phaser.Scene {
    constructor() {
        super("VerificationScene");
    }

    // init(word){
    //     this.word = word;
    // }

    preload() {
        this.load.image("verificationbackground", "assets/image/verificationbackground.png");
        this.load.image("objectionButton(N)", "assets/image/objectionButton(N).png");
        this.load.image("objectionButton(Y)", "assets/image/objectionButton(Y).png");
        this.load.image("ok(N)", "assets/image/ok(N).png");
        this.load.image("ok(Y)", "assets/image/ok(Y).png");
    }

    create() {
        const scene = this;

        sharedData.socket.removeAllListeners("verificationFalse");
        sharedData.socket.removeAllListeners("verificationTrue");

        let check = false;

        //BACKGROUND
        let bg = scene.add.image(1050, 500, "verificationbackground");

        let Toptext = scene.add.text(0, 0, "이의제기 가능", {font: "70px BR-R", color: "#523b33"});
        let wordText = scene.add.text(0, 0, "scene.word", {font: "70px BR-R", color: "#523b33"});
        let resultText = scene.add.text(0, 0, "10", {font: "60px BR-R", color: "#523b33"});
        let meanText = scene.add.text(0, 0, "단어뜻", {font: "60px BR-R", color: "#523b33"});
        let playerText = scene.add.text(0, 0, "플레이어", {font: "60px BR-R", color: "#523b33"});
        
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

        // // objection을 신청하는 button
        // const objectionButton = scene.add.sprite(1050, 620, "objectionButton(N)")
        // .setInteractive()
        // .setDepth(1)
        // .setScale(0.7)
        // .on("pointerup",() => {
        //     // sharedData.socket.emit("objection", sharedData.roomKey, sharedData.socket.id);
        //     check = true;
        //     console.log(check);
        // })
        // .on('pointerover', () => {
        //     objectionButton.setTexture("objectionButton(Y)");
        // })
        // .on("pointerout", ()=> {
        //     objectionButton.setTexture("objectionButton(N)");
        // });

        const okButton = scene.add.sprite(1050, 830, "ok(N)")
        .setInteractive()
        .setDepth(1)
        .on("pointerup",() => {
            // sharedData.socket.emit("objection", sharedData.roomKey, sharedData.socket.id);
            check = true;
            console.log(check);
        })
        .on('pointerover', () => {
            okButton.setTexture("ok(Y)");
        })
        .on("pointerout", ()=> {
            okButton.setTexture("ok(N)");
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
        });
    }
}