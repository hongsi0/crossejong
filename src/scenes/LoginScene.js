import sharedData from "../shared";
import "../fontLoader"; // can use the font as "BR-R"

function getRandProfileNum() {
  let min = Math.ceil(1);
  let max = Math.floor(6);
  return Math.floor(Math.random() * (max - min + 1)) + min; //최댓값도 포함, 최솟값도 포함
}

function isValidNickname(str) {
  // 6글자 이내 한글 혹은 숫자 (띄어쓰기 불가)
  const regex = /^[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A30-9]{1,6}$/;
  return regex.test(str);
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
        this.load.image("shuffle", "assets/image/shuffle_button.png");
    }

    create() {
        const scene = this;

        //socket event제거
        sharedData.socket.removeAllListeners("nicknamecheck");

        scene.add.image(0,0, "login_background").setOrigin(0);

        let profile = 'profile' + getRandProfileNum();
        let profile_pic = scene.add.image(100,480, profile).setOrigin(0).setScale(0.23).setInteractive();

        const shuffle_btn = scene.add.image(270,635, "shuffle")
        .setInteractive()
        .setOrigin(0)
        .setScale(0.15)
        .setDepth(5)
        .on('pointerup', () => {
          shuffle_btn.clearTint();
          shuffle_btn.x -= 2;
          shuffle_btn.y -= 2;
          let new_profile = 'profile' + getRandProfileNum();
          while (new_profile === profile) {
            new_profile = 'profile' + getRandProfileNum();
          }
          profile = new_profile;
          profile_pic.setTexture(profile);
        })
        .on('pointerdown', () => {
          shuffle_btn.setTint(0x888888);
          shuffle_btn.x += 2;
          shuffle_btn.y += 2;
        });

        scene.inputElement = scene.add.dom(400,810).createFromCache("loginform");
        //socket event 초기화
        sharedData.socket.removeAllListeners("nickname");

        let input = scene.inputElement.getChildByName("name-form");
        scene.nicknameTextElement = scene.inputElement.getChildByID("nickname-text");

        input.addEventListener("input", function () {
          const nicknameText = scene.nicknameTextElement;
          if (input.value === "") {
            nicknameText.innerHTML = "한글과 숫자만 사용 가능합니다.";
            nicknameText.classList = "";
            nicknameText.classList.add("origin");
          } else if (isValidNickname(input.value)) {
            nicknameText.innerHTML = "사용 가능한 별명입니다!";
            nicknameText.classList = "";
            nicknameText.classList.add("valid");
          } else {
            if(input.value.length > 6) {
              nicknameText.innerHTML = "별명은 6자 이내여야 합니다!";
            } else {
              nicknameText.innerHTML = "한글과 숫자만 사용 가능합니다!";
            }
            nicknameText.classList = "";
            nicknameText.classList.add("invalid");
          }
        });
        
        const LoginButton = scene.add.sprite(400, 940, "LoginButton(N)")
        .setInteractive()
        .setDepth(1)
        .setScale(0.465)
        .on("pointerup",() => {
          if (input === "") {
            console.log("별명을 적어주세요");
          } else {
            console.log(input.value);
            if(isValidNickname(input.value)) {
              sharedData.socket.emit("nicknamecheck", input.value);
            } else {
              input.value = "";
            }
          }
        })
        .on('pointerover', () => {
            LoginButton.setTexture("LoginButton(Y)");
        })
        .on("pointerout", ()=> {
            LoginButton.setTexture("LoginButton(N)");
        })

        sharedData.socket.on("nicknamecheck", (result) => {
          const nicknameText = scene.nicknameTextElement;
          if(result == "False") {
            sharedData.socket.emit("userinfo", {nickname: input.value, profile: profile});
            sharedData.socket.userNick = input.value;
            sharedData.socket.profile = profile;
            scene.scene.start("RoomScene");
          } else {
            input.value = "";
            nicknameText.innerHTML = "이미 사용중인 별명입니다.";
            nicknameText.classList = "";
            nicknameText.classList.add("invalid");
          }
        });
    }
    update() {
    }
}