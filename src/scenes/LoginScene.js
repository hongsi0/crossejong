import sharedData from "../shared";
import "../fontLoader"; // can use the font as "BR-R"

export default class LoginScene extends Phaser.Scene {
    constructor() {
        super("LoginScene");
    }

    preload() {
        this.load.html("loginform", "assets/text/loginform.html");
        this.load.image("login_background", "assets/image/login_background.png");
        this.load.image("LoginButton(N)", "assets/image/LoginButton.png");
        this.load.image("LoginButton(Y)", "assets/image/LoginButton_clicked.png");
    }

    create() {
        const scene = this;
        

        scene.add.image(0,0, "login_background").setOrigin(0);

        scene.inputElement = scene.add.dom(400,800).createFromCache("loginform");
        //socket event 초기화
        sharedData.socket.removeAllListeners("nickname");
        

        // 자신이 낸 카드를 되돌려받는 button
        const LoginButton = scene.add.sprite(400, 930, "LoginButton(N)")
        .setInteractive()
        .setDepth(1)
        .setScale(0.465)
        .on("pointerup",() => {
          const input = scene.inputElement.getChildByName("name-form");
          if (input === "") {
            console.log("이름을 적어주세요");
          } else {
            console.log(input.value);
            sharedData.socket.userNick = input.value;
            sharedData.socket.emit("nickname", input.value);
            scene.scene.start("RoomScene");
          }
        })
        .on('pointerover', () => {
            LoginButton.setTexture("LoginButton(Y)");
        })
        .on("pointerout", ()=> {
            LoginButton.setTexture("LoginButton(N)");
        })
    }
    update() {
    }
}