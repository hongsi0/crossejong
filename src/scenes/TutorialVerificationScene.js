import sharedData from "../shared";
import "../fontLoader"; // can use the font as "BR-R"

export default class TutorialVerificationScene extends Phaser.Scene {
    constructor() {
        super("TutorialVerificationScene");
    }

    init(word){
        this.word = word;
    }

    preload() {
        this.load.image("verificationbackground", "assets/image/verificationbackground.png");
        this.load.image("objectionButton(N)", "assets/image/objectionButton(N).png");
        this.load.image("objectionButton(Y)", "assets/image/objectionButton(Y).png");
        this.load.image("translateENGButton", "assets/image/ENG.png");
        this.load.image("okButton", "assets/image/ok(N).png");
    }

    create() {
        const scene = this;

        let objectionButtonClicked = false;

        //BACKGROUND
        let bg = scene.add.image(1050, 500, "verificationbackground");

        let Toptext = scene.add.text(0, 0, "이의제기 가능", {font: "70px BR-R", color: "#523b33"});
        let wordText = scene.add.text(0, 0, scene.word, {font: "70px BR-R", color: "#523b33"});
        let resultText = scene.add.text(0, 0, "이의제기 버튼을 보세요", {font: "60px BR-R", color: "#523b33"});
        let meanText = scene.add.text(0, 0, "", {font: "30px BR-R", color: "#523b33"});
        let playerText = scene.add.text(0, 0, "", {font: "60px BR-R", color: "#523b33"});
        
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

        // 번역 button
        const translateENGButton = scene.add.sprite(0, 1000, "translateENGButton")
        .setInteractive()
        .setDepth(1)
        .setScale(0.35)
        Phaser.Display.Align.In.Center(translateENGButton, bg);
        translateENGButton.visible = false;

        // objection을 신청하는 button
        const objectionButton = scene.add.sprite(1050, 620, "objectionButton(N)")
        .setInteractive()
        .setDepth(1)
        .setScale(0.7)
        .on("pointerup",() => {
            if (!objectionButtonClicked){
                objectionButtonClicked = true;
                objectionButton.visible = false;

                Toptext.setText("검증 결과");
                resultText.setText("번역 버튼을 눌러보세요");
                translateENGButton.visible = true;
                Phaser.Display.Align.In.Center(translateENGButton, bg);
                translateENGButton.y = 620;
                translateENGButton
                .on("pointerdown",() => {
                    translateENGButton.setTint(0x888888);
                    translateENGButton.x += 2;
                    translateENGButton.y += 2;
                })
                .on("pointerup",() => {
                    translateENGButton.clearTint();
                    translateENGButton.x -= 2;
                    translateENGButton.y -= 2;

                    resultText.setText("확인 버튼을 눌러 나갈수 있습니다.")
                    if (scene.word === "무대"){
                        wordText.setText(`${scene.word}(stage)`);
                    } else{
                        wordText.setText(`${scene.word}(burlap bag, gunny)`);
                    }
                    Phaser.Display.Align.In.Center(wordText, bg);
                    Phaser.Display.Align.In.Center(resultText, bg);
                    wordText.y = 300;
                    resultText.y = 430;

                    const okButton = scene.add.sprite(1050, 830, "okButton")
                    .setInteractive()
                    .setDepth(1)
                    .setScale(1.4)
                    .on("pointerup", () => {
                        scene.scene.stop("TutorialVerificationScene");
                        sharedData.socket.emit("TutorialEnd");
                    });
                });

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
            }
        })
        .on('pointerover', () => {
            objectionButton.setTexture("objectionButton(Y)");
        })
        .on("pointerout", ()=> {
            objectionButton.setTexture("objectionButton(N)");
        });
    }
}