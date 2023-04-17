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
    }

    create() {
        const scene = this;

        sharedData.socket.removeAllListeners("objection");

        let check = false;

        //BACKGROUND
        let bg = scene.add.image(1050, 500, "verificationbackground");

        let Toptext = scene.add.text(0, 140, "이의제기 가능", {font: "70px BR-R", color: "#523b33"});
        let wordText = scene.add.text(0, 300, "scene.word", {font: "70px BR-R", color: "#523b33"});
        let resultText = scene.add.text(0, 430, "10", {font: "60px BR-R", color: "#523b33"});
        let meanText = scene.add.text(0, 600, "단어뜻", {font: "60px BR-R", color: "#523b33"});

        Phaser.Display.Align.In.Center(Toptext, bg);
        Phaser.Display.Align.In.Center(wordText, bg);
        Phaser.Display.Align.In.Center(resultText, bg);
        Phaser.Display.Align.In.Center(meanText, bg);

        Toptext.y = 140;
        wordText.y = 300;
        resultText.y = 430;
        meanText.y = 600;

        // objection을 신청하는 button
        const objectionButton = scene.add.sprite(1050, 620, "objectionButton(N)")
        .setInteractive()
        .setDepth(1)
        .setScale(0.7)
        .on("pointerup",() => {
            sharedData.socket.emit("objection", sharedData.roomKey, sharedData.socket.id);
            check = true;
        })
        .on('pointerover', () => {
            objectionButton.setTexture("objectionButton(Y)");
        })
        .on("pointerout", ()=> {
            objectionButton.setTexture("objectionButton(N)");
        })

        if(check) {

        }
    }
}