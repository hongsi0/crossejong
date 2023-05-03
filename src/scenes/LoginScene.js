import sharedData from "../shared";
import "../fontLoader"; // can use the font as "BR-R"

function getRandProfileNum() {
  let min = Math.ceil(1);
  let max = Math.floor(6);
  return Math.floor(Math.random() * (max - min + 1)) + min; //최댓값도 포함, 최솟값도 포함
}

export default class LoginScene extends Phaser.Scene {
    constructor() {
        super("LoginScene");
    }

    preload() {
        this.load.html("loginform", "assets/text/loginform.html");
        this.load.image("login_background", "assets/image/login_background.png");
        this.load.image("LoginButton(N)", "assets/image/LoginButton.png");
        this.load.image("LoginButton(Y)", "assets/image/LoginButton_clicked.png");
        this.load.image("profile1", "assets/profile/profile1.png");
        this.load.image("profile2", "assets/profile/profile2.png");
        this.load.image("profile3", "assets/profile/profile3.png");
        this.load.image("profile4", "assets/profile/profile4.png");
        this.load.image("profile5", "assets/profile/profile5.png");
        this.load.image("profile6", "assets/profile/profile6.png");
        this.load.image("shuffle", "assets/image/shuffle_icon.png");
    }

    create() {
        const scene = this;

        scene.add.image(0,0, "login_background").setOrigin(0);

        let profile = 'profile' + getRandProfileNum();
        let profile_pic = scene.add.image(100,480, profile).setOrigin(0).setScale(0.23).setInteractive();

        scene.add.image(270,635, "shuffle")
        .setInteractive()
        .setOrigin(0)
        .setScale(1.25)
        .setDepth(5)
        .on('pointerup', () => {
          let new_profile = 'profile' + getRandProfileNum();
          while (new_profile === profile) {
            new_profile = 'profile' + getRandProfileNum();
          }
          profile = new_profile;
          profile_pic.setTexture(profile);
        });

        scene.inputElement = scene.add.dom(400,800).createFromCache("loginform");
        //socket event 초기화
        sharedData.socket.removeAllListeners("nickname");

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
            sharedData.socket.profile = profile;
            sharedData.socket.emit("userinfo", {nickname: input.value, profile: profile});
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