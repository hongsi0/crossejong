import Phaser from "phaser";
import sharedData from "../shared";
import '../fontLoader';

function isValidPassword(str) {
  const regex = /^\d{4}$/;
  return regex.test(str);
}

export default class RoomScene extends Phaser.Scene {
  constructor() {
    super("RoomScene");
  }
  
  preload() {
    this.load.image("logo", "assets/image/logo.png");
    this.load.image("logo_pic", "assets/image/logo_pic.png");
    this.load.image("reload", "assets/image/reload.png");
    this.load.image("makeroom", "assets/image/makeroom_btn.png");
    this.load.image("makeroom_cur", "assets/image/makeroom_btn_cur.png");
    this.load.image("room_list", "assets/image/room_list.png");
    this.load.html("roomform", "assets/text/roomform.html");
    this.load.html("passwordform", "assets/text/passwordform.html");
    this.load.audio("대기방bgm", "assets/sound/대기방bgm.mp3");
    this.load.audio("click", "assets/sound/놓기.mp3");
    this.load.image("profile1", "assets/profile/profile1.png");
    this.load.image("profile2", "assets/profile/profile2.png");
    this.load.image("profile3", "assets/profile/profile3.png");
    this.load.image("profile4", "assets/profile/profile4.png");
    this.load.image("profile5", "assets/profile/profile5.png");
    this.load.image("profile6", "assets/profile/profile6.png");
    this.load.image("shuffle", "assets/image/shuffle_button.png");
    this.load.image("tutorial_btn", "assets/image/tutorial_btn.png");
    this.load.image("tutorial_btn_cur", "assets/image/tutorial_btn_cur.png");
    this.load.image("crossejong_btn", "assets/image/crossejong_btn.png");
    this.load.image("crossejong_btn_cur", "assets/image/crossejong_btn_cur.png");
    this.load.image("ravnus_btn", "assets/image/ravnus_btn.png");
    this.load.image("ravnus_btn_cur", "assets/image/ravnus_btn_cur.png");
    this.load.image("list_background", "assets/image/room_bg.png");
    this.load.image("out_btn", "assets/image/out_btn.png");
    this.load.image("out_btn_cur", "assets/image/out_btn_cur.png");
    this.load.image("menu", "assets/image/menu.png");
    this.load.image("mute", "assets/image/mute.png");
    this.load.image("unmute", "assets/image/unmute.png");
  }

  create() {
    const scene = this;
    const graphics = scene.add.graphics();
    graphics.fillStyle(0xe3c9ae, 1); // 배경 색상 설정
    graphics.fillRect(0, 0, 1920, 1080); // 사각형 그리기

    //socket event 초기화
    sharedData.socket.removeAllListeners("rooms");
    sharedData.socket.removeAllListeners("keyNotValid");
    sharedData.socket.removeAllListeners("keyIsValid");
    sharedData.socket.removeAllListeners("makeroom");
    
    scene.waitbgm = scene.sound.add("대기방bgm",{loop:true});
    scene.clicksound = scene.sound.add("click",{loop:false});
    
    scene.waitbgm.play();
    
    //LOGO
    scene.add.image(50,30, "logo").setOrigin(0,0).setDepth(10);
    scene.add.image(460,58+10,"logo_pic").setOrigin(0,0).setScale(0.78);

    // sound
    const soundImage = scene.add.image(50+1160+10, 322-170, 'unmute')
    .setOrigin(1, 1)
    .setDepth(10)
    .setInteractive()
    .setScale(0.13)
    .on("pointerup", () => {
      if (soundImage.texture.key === "unmute") {
        scene.waitbgm.pause();
        soundImage.setTexture("mute");
      } else if (soundImage.texture.key === "mute") {
        scene.waitbgm.resume();
        soundImage.setTexture("unmute");
      }
    });


    //makeroom
    const makeroomImage = scene.add.image(50+1183, 322+10, 'makeroom')
    .setOrigin(1,1)
    .setDepth(10)
    .setInteractive()
    .on('pointerover', () => {
      makeroomImage.setTexture("makeroom_cur");
    })
    .on("pointerout", ()=> {
      makeroomImage.setTexture("makeroom");
    })
    .on("pointerup", () => {
      scene.clicksound.play();
      scene.scene.pause("RoomScene");
      scene.scene.launch("MakeroomScene");
    });
    
    //reload
    let reloadBtn = scene.add.image(50+1183-160-20, 320, 'reload')
    .setOrigin(1,1)
    .setDepth(100)
    .setInteractive()
    .setScale(0.5)
    .on('pointerdown', function () {
      // reloadBtn.setTint(0x330000);
      reloadBtn.x += 1;
      reloadBtn.y += 1;

      scene.clicksound.play();
      sharedData.socket.emit("getRooms");
    })
    .on('pointerup', () => {
      // reloadBtn.clearTint();
      reloadBtn.x -= 1;
      reloadBtn.y -= 1;
    });

    // player box
    const player_box = scene.add.graphics();
    player_box.lineStyle(10, 0x3a2a23, 1);
    player_box.fillStyle(0xfbdfc1, 1);
    player_box.strokeRoundedRect(1275, 32, 627-9, 281-9, 15);
    player_box.fillRoundedRect(1275, 32, 627-9, 281-9, 15);

    //profile_image
    scene.add.image(1435, 168, sharedData.socket.profile).setOrigin(0.5,0.5).setScale(0.2).setDepth(1);

    //nickname
    scene.add.text(1700, 130, "별명", {font: "50px BR-R", fill: "#3a2a23"}).setDepth(1).setOrigin(0.5).setFontStyle('bold');
    scene.add.text(1700, 215, sharedData.socket.userNick, {font: "60px BR-R", fill: "#3a2a23"}).setDepth(1).setOrigin(0.5).setFontStyle('bold');

    let button_x = 1584;
    let button_y = 540;
    let button_gap = 145;

    // 안내사항
    scene.add.image(button_x, button_y-button_gap-10, "menu")
    .setOrigin(0.5,0.5)
    .setDepth(10);

    //box_dark
    const box_dark = scene.add.graphics();
    box_dark.fillStyle(0xa5866d, 1);
    box_dark.fillRoundedRect(1584-313.5, 375+49-10, 627, 635+20, 15);

    //box_bright
    const box_bright = scene.add.graphics();
    box_bright.fillStyle(0xfcdfc1, 1);
    box_bright.fillRoundedRect(1584-313.5+20, 375+49+30, 627-40, 460, 15);

    //tutorial
    const tutorialBtn = scene.add.image(button_x, button_y, "tutorial_btn")
    .setOrigin(0.5,0.5)
    .setDepth(100)
    .setInteractive()
    .on("pointerover", () => {
      tutorialBtn.setTexture("tutorial_btn_cur");
    })
    .on("pointerout", () => {
      tutorialBtn.setTexture("tutorial_btn");
    })
    .on("pointerup", () => {
      scene.clicksound.play();
      scene.waitbgm.stop();
      scene.scene.start("TutorialScene");
    });

    //crossejong
    const crossejongBtn = scene.add.image(button_x, button_y+button_gap+3, "crossejong_btn")
    .setOrigin(0.5,0.5)
    .setDepth(100)
    .setInteractive()
    .on("pointerover", () => {
      crossejongBtn.setTexture("crossejong_btn_cur");
    })
    .on("pointerout", () => {
      crossejongBtn.setTexture("crossejong_btn");
    })
    .on("pointerup", () => {
      scene.clicksound.play();
      window.open('https://crossejong.io', '_blank', 'noopener');
    });

    //ravnus
    const ravnusBtn = scene.add.image(button_x, button_y+button_gap*2+3, "ravnus_btn")
    .setOrigin(0.5,0.5)
    .setDepth(100)
    .setInteractive()
    .on("pointerover", () => {
      ravnusBtn.setTexture("ravnus_btn_cur");
    })
    .on("pointerout", () => {
      ravnusBtn.setTexture("ravnus_btn");
    })
    .on("pointerup", () => {
      scene.clicksound.play();
      window.open('https://ravnus.com', '_blank', 'noopener');
    });

    //놀이 종료
    const outBtn = scene.add.image(button_x, button_y+button_gap*3+15, "out_btn")
    .setOrigin(0.5,0.5)
    .setDepth(10)
    .setInteractive()
    .on("pointerover", () => {
      outBtn.setTexture("out_btn_cur");
    })
    .on("pointerout", () => {
      outBtn.setTexture("out_btn");
    })
    .on("pointerup", () => {
      //LoginScene으로 이동
      scene.clicksound.play();
      scene.waitbgm.stop();
      scene.scene.start("LoginScene");
      sharedData.socket.emit("resetprofile");
    });

    //roomlist
    scene.add.image(50,240,"room_list").setOrigin(0,0);
    scene.add.image(50,332,"list_background").setOrigin(0,0).setDepth(1);
    scene.roomform = scene.add.dom(50,332).setOrigin(0,0).createFromCache("roomform");
    const list = scene.roomform.getChildByID("listview");
  
    sharedData.socket.emit("getRooms");
  
    sharedData.socket.on("rooms", (rooms) => {
      console.log("room",rooms);
      // 이전에 추가된 자식 엘리먼트들을 모두 삭제
      while (list.firstChild) {
        list.removeChild(list.firstChild);
      }
      rooms.forEach((room) => {
        const li = document.createElement("li");
        const levelDiv = document.createElement("div");
        levelDiv.setAttribute("class", "levelDiv");
        const roomTitleDiv = document.createElement("div");
        roomTitleDiv.setAttribute("class", "roomTitleDiv");
        const playerNumDiv = document.createElement("div");
        playerNumDiv.setAttribute("class", "playerNumDiv");
        const enterDiv = document.createElement("div");
        enterDiv.setAttribute("class", "enterDiv");

        const roomdifficulty = document.createTextNode(room.difficulty);
        levelDiv.appendChild(roomdifficulty);
        
        if (room.locked) {
          const roomName = document.createTextNode(room.name+ "🔒");
          roomTitleDiv.appendChild(roomName);
        } else {
          const roomName = document.createTextNode(room.name);
          roomTitleDiv.appendChild(roomName);
        }
  
        const roomNum = document.createTextNode(`${room.num}/4`);
        playerNumDiv.appendChild(roomNum);

        const button = document.createElement("button");
        button.setAttribute("class", "enterButton");
        const buttonText = document.createTextNode("입장");
        button.appendChild(buttonText);
        enterDiv.appendChild(button);

        const color = {
          red: "#d73637",
          yellow: "#f39f3b",
          blue: "#09398e",
          green: "#017139"
        };

        switch(room.difficulty) {
          case "초급":
            levelDiv.style.backgroundColor = color.red;
            roomTitleDiv.style.color = color.red;
            playerNumDiv.style.color = color.red;
            button.style.backgroundColor = color.red;
            break
          case "중급":
            levelDiv.style.backgroundColor = color.yellow;
            roomTitleDiv.style.color = color.yellow;
            playerNumDiv.style.color = color.yellow;
            button.style.backgroundColor = color.yellow;
            break
          case "고급":
            levelDiv.style.backgroundColor = color.blue;
            roomTitleDiv.style.color = color.blue;
            playerNumDiv.style.color = color.blue;
            button.style.backgroundColor = color.blue;
            break
          case "동화":
            levelDiv.style.backgroundColor = color.green;
            roomTitleDiv.style.color = color.green;
            playerNumDiv.style.color = color.green;
            button.style.backgroundColor = color.green;
            break
        };

        if(room.playing || room.num === 4) {
          li.style.filter = "brightness(0.6)";
        } else {
          li.style.filter = "brightness(1.0)";
        }
  
        button.addEventListener("click", (event) => {
          event.preventDefault();
          if(room.playing === false) {//방에서 게임을 안하고 있을때
            if(room.num < 4) {
              if(room.locked) {
                scene.passwordform = scene.add.dom(530, 210).setOrigin(0, 0).createFromCache("passwordform");
                let password = scene.passwordform.getChildByID("input-password");
                let accept_btn = scene.passwordform.getChildByID("pw-btn-accept");
                let cancle_btn = scene.passwordform.getChildByID("pw-btn-cancle");
                let pw_text = scene.passwordform.getChildByID("pw-text-below");

                accept_btn.addEventListener("click", (event) => {
                  if(isValidPassword(password.value)) {
                    if(password.value === room.password) {
                      sharedData.socket.emit("isKeyValid", room.name);
                    } else {
                      // 비밀번호 형식엔 맞지만 틀림
                      console.log("비밀번호가 틀립니다.");
                      pw_text.textContent = "비밀번호가 틀립니다.";
                      pw_text.style.color = "red";
                    }
                  } else {
                    console.log("비밀번호는 네 자리 숫자입니다.");
                    pw_text.textContent = "비밀번호는 네 자리 숫자입니다.";
                    pw_text.style.color = "red";
                  }
                });
                cancle_btn.addEventListener("click", (event) => {
                  scene.passwordform.destroy();
                });
              } else {
                sharedData.socket.emit("isKeyValid", room.name); 
              }
            } else{
              console.log("방이 가득찼습니다.");
            }
          }
          else {
            console.log("게임 플레이중입니다.");
          } 
        })

        li.appendChild(levelDiv);
        li.appendChild(roomTitleDiv);
        li.appendChild(playerNumDiv);
        li.appendChild(enterDiv);
  
        list.appendChild(li);
      });
    });
  
    sharedData.socket.on("keyNotValid", (input) => {
      console.log("방이 없습니다.")
    });
  
    sharedData.socket.on("keyIsValid", (input) => {
      sharedData.socket.emit("joinRoom", input);
      sharedData.roomKey = input;
      scene.waitbgm.stop();
      scene.scene.start("GameRoomScene");
    });

    sharedData.socket.on("makeroom", () => {
      scene.waitbgm.stop();
      scene.scene.start("GameRoomScene");
    });
  }
  update() {}
}
