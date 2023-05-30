import sharedData from "../shared";
import "../fontLoader"; // can use the font as "BR-R"

export default class VeriTestScene extends Phaser.Scene {
    constructor() {
        super("VeriTestScene");
    }

    init(data){
        // this.turnPlayer = data.turnPlayer;
        // this.word = data.word;
    }

    preload() {
        this.load.image("veri_box", "assets/image/veri_box.png");
        this.load.image("objection_btn", "assets/image/objection_btn.png");
        this.load.image("objection_btn_cur", "assets/image/objection_btn_cur.png");
        this.load.image("translateENGButton", "assets/image/ENG.png");
    }

    create() {
        const scene = this;

        sharedData.socket.removeAllListeners("verificationFalse");
        sharedData.socket.removeAllListeners("verificationTrue");
        sharedData.socket.removeAllListeners("verTimeDecrease");
        sharedData.socket.removeAllListeners("verificationEnd");
        sharedData.socket.removeAllListeners("translateresult");

        let result = "";
        let cardgetplayer = "";
        let objectionButtonClicked = false;

        //BACKGROUND
        let bg = scene.add.image(1050, 500, "veri_box").setScale(0.8);
        let centerX = bg.getCenter().x;

        let Toptext = scene.add.text(centerX, 0, "이의제기 가능", {font: "65px BR-R", color: "#3a2b23"}).setOrigin(0.5, 0.5);
        let wordText = scene.add.text(centerX, 0, "태정태세", {font: "80px BR-R", color: "#3a2b23"}).setFontStyle('bold').setOrigin(0.5, 0.5);
        let engText = scene.add.text(centerX, 0, "", {font: "55px BR-R", color: "#3a2b23"}).setFontStyle('bold').setOrigin(0.5, 0.5);
        let resultText = scene.add.text(centerX, 0, "", {font: "60px BR-R", color: "#3a2b23"}).setOrigin(0.5, 0.5);
        let meanText = scene.add.text(centerX, 0, "", {font: "35px BR-R", color: "#3a2b23"}).setOrigin(0.5, 0.5);
        let playerText = scene.add.text(centerX, 0, "", {font: "35px BR-R", color: "#3a2b23"}).setOrigin(0.5, 0.5);
        let timeText = scene.add.text(centerX, 0, "5초 후에 게임으로 돌아갑니다.", {font: "35px BR-R", color: "#3a2b23"}).setOrigin(0.5, 0.5);

        meanText.setMaxLines(2); // 최대 2줄로 제한
        meanText.setWordWrapWidth(725); // 최대 가로 길이 설정
        meanText.setAlign('center'); // 가운데 정렬 설정

        Toptext.y = 240;
        wordText.y = 450;
        resultText.y = 470;
        meanText.y = 535;
        engText.y = 455;
        playerText.y = 680;
        timeText.y = 775;

        // 번역 button
        const translateENGButton = scene.add.sprite(centerX, 460, "translateENGButton")
        .setInteractive()
        .setDepth(1)
        .setScale(0.75)
        translateENGButton.visible = false;

        // objection을 신청하는 button
        const objectionButton = scene.add.sprite(1050, 670, "objection_btn")
        .setInteractive()
        .setDepth(1)
        .setScale(0.8)
        .on("pointerup",() => {
            objectionButton.clearTint();
            objectionButton.x -= 2;
            objectionButton.y -= 2;
            if (!objectionButtonClicked && this.turnPlayer != sharedData.socket.id){
                objectionButtonClicked = true;
                // sharedData.socket.emit("objection", {roomKey:sharedData.roomKey, id:sharedData.socket.id, word:scene.word});
                wordText.setFontSize(70);
                Toptext.setText("검증 결과");
                playerText.setText(`닉네임이여덟글자님이 카드 한장을 받습니다.`);
                meanText.setText("단어 뜻이 여기에 나옵니다만?");

                wordText.y = 380;

                objectionButton.visible = false;
                translateENGButton.visible = true;

                translateENGButton
                .on("pointerup",() => {
                    translateENGButton.clearTint();
                    translateENGButton.x -= 2;
                    translateENGButton.y -= 2;
                    // sharedData.socket.emit("translate", {text:data.word, id:sharedData.socket.id});
                })
                .on("pointerdown",() => {
                    translateENGButton.visible = false;
                    meanText.setText("단어 뜻이 여기에 나옵니다만? 단어 뜻이 여기에 나옵니다만? 단어 뜻이 여기에 나옵니다만?");
                    engText.setText("English");
                });
            }
        })
        .on("pointerdown", ()=> {
            objectionButton.setTint(0x888888);
            objectionButton.x += 2;
            objectionButton.y += 2;
        })
        .on("pointerover",() => {
            objectionButton.setTexture("objection_btn_cur");
        })
        .on("pointerout", () => {
            objectionButton.setTexture("objection_btn");
        });

        sharedData.socket.on("verificationFalse", (data) => {
            Toptext.setText("검증 결과");
            resultText.setText("존재하지 않는 단어입니다.");
            playerText.setText(`닉네임이여덟글자님이 카드 한장을 받습니다.`);

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

           

            result = "false";
            cardgetplayer = data.id;
            scene.word = "";
        });

        sharedData.socket.on("verificationTrue", (data) => {
            Toptext.setText("검증 결과");
            resultText.setText("");
            translateENGButton.visible = true;
            
            meanText.setText("단어뜻이여기에나옵니다만?");
            playerText.setText(`닉네임이여덟글자님이 카드 한장을 받습니다.`);

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
            // cardgetplayer = data.id;
        });

        sharedData.socket.on("translateresult", (data) => {
            wordText.setText(`${data.origin}(${data.trans})`);
            Phaser.Display.Align.In.Center(wordText, bg);
            wordText.y = 300;
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