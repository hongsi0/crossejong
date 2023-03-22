import Phaser from "phaser";
import sharedData from "../shared";

export default class RoomScene extends Phaser.Scene {
  constructor() {
    super("RoomScene");
  }
  
  preload() {
    this.load.image("background", "assets/image/background.png");
    this.load.image("logo", "assets/image/logo.png");
    this.load.image("reload", "assets/image/reload.png");
    this.load.image("makeroomN", "assets/image/방만들기(N).png");
    this.load.image("makeroomY", "assets/image/방만들기(Y).png");
    this.load.html("roomform", "assets/text/roomform.html");
    this.load.html("nameform", "assets/text/nameform.html");
  }

  create() {
    const scene = this;

    scene.nickname = undefined;

    //socket event 초기화
    sharedData.socket.removeAllListeners("rooms");
    sharedData.socket.removeAllListeners("keyNotValid");
    sharedData.socket.removeAllListeners("keyIsValid");
    sharedData.socket.removeAllListeners("nickname");
    sharedData.socket.removeAllListeners("makeroom");
    

    let WordStyle = {font: "30px Arial", fill: "black"};

    //BACKGROUND
    scene.add.image(0, 0, "background").setOrigin(0);
    
    //LOGO
    const logo_image = scene.add.image(200,100, "logo").setOrigin(0).setDepth(100);
    logo_image.scale = 1.2; //resize the logo
  
    //makeroom
    const makeroomImage = scene.add.image(950, 130, 'makeroomN')
    .setOrigin(0)
    .setDepth(100)
    .setScale(1.2)
    .setInteractive()
    .on('pointerover', () => {
      makeroomImage.setTexture("makeroomY");
    })
    .on("pointerout", ()=> {
      makeroomImage.setTexture("makeroomN");
    })
    .on("pointerdown", () => {
      if(scene.nickname != undefined || sharedData.userNick != ""){
        console.log("makeroomclick");
        scene.scene.pause("RoomScene");
        scene.scene.launch("MakeroomScene");
      }
    });
    
    //reload
    const reloadImage = scene.add.image(1200, 250, 'reload')
    .setOrigin(0)
    .setDepth(100)
    .setScale(1.2)
    .setInteractive()
    .setScale(0.5)
    .on('pointerdown', function () {
      sharedData.socket.emit("getRooms");
    });
  
    scene.popUp = scene.add.graphics();
    scene.boxes = scene.add.graphics();
  
    // for popup window
    scene.popUp.lineStyle(1, 0xffffff);
    scene.popUp.fillStyle(0xffffff, 0.5);
  
    // for boxes
    scene.boxes.lineStyle(1, 0xffffff);
    scene.boxes.fillStyle(0xa9a9a9, 1);
  
    // popup window
    scene.popUp.strokeRect(100, 60, 1720, 960);
    scene.popUp.fillRect(100, 60, 1720, 960);
  
    //popup
    scene.boxes.strokeRect(150, 380, 1200, 600);
    scene.boxes.fillRect(150, 380, 1200, 600);

    //nickname
    scene.nameform = scene.add.dom(1600, 150).createFromCache("nameform");
    if (sharedData.userNick == "") {
      scene.nameform.addListener("click");
      scene.nameform.addListener("submit");
      scene.nameform.on("click", function (event) {
        event.preventDefault();
        if (event.target.name === "username") {
          const input = scene.nameform.getChildByName("name-form");
          sharedData.socket.emit("nickname", input.value);
          sharedData.userNick = input.value
          input.value = "";
        }
      });
      scene.nameform.on("submit", function (event) {
        event.preventDefault();
        const input = scene.nameform.getChildByName("name-form");
        sharedData.socket.emit("nickname", input.value);
        input.value = "";
      });
    } else{
      scene.nameform.setText(`이름: ${sharedData.userNick}`);
    }
    

    sharedData.socket.on("nickname", (nickname) => {
      //player name
      scene.nameform.setText(`이름: ${nickname}`);
      scene.nickname = nickname;
    });
  
    //roomlist
    scene.roomform = scene.add.dom(230,430).setOrigin(0,0).createFromCache("roomform");
    const list = scene.roomform.getChildByID("listview");
  
    sharedData.socket.emit("getRooms");
  
    sharedData.socket.on("rooms", (rooms) => {
      // 이전에 추가된 자식 엘리먼트들을 모두 삭제
      while (list.firstChild) {
        list.removeChild(list.firstChild);
      }
      rooms.forEach((room) => {
        const li = document.createElement("li");
        const box = document.createElement("div");
        box.setAttribute("class","box");
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
        
        const roomName = document.createTextNode(room.name);
        roomTitleDiv.appendChild(roomName);
  
        const roomNum = document.createTextNode(`${room.num}/4`);
        playerNumDiv.appendChild(roomNum);
  
        const button = document.createElement('button');
        const buttonText = document.createTextNode('입장');
        button.appendChild(buttonText);
        enterDiv.appendChild(button);
  
        button.addEventListener("click", (event) => {
          event.preventDefault();
          if(scene.nickname != undefined || sharedData.userNick != "") {
            if(room.playing === false) {//방에서 게임을 안하고 있을때
              if(room.num < 4) {
                sharedData.socket.emit("isKeyValid", room.name);
              } else{
                console.log("방이 가득찼습니다.");
              }
            }
            else {
              console.log("게임 플레이중입니다.");
            } 
          }
        })
  
        box.appendChild(levelDiv);
        box.appendChild(roomTitleDiv);
        box.appendChild(playerNumDiv);
        box.appendChild(enterDiv);
  
        li.appendChild(box);
  
        list.appendChild(li);
      });
    });
  
    sharedData.socket.on("keyNotValid", (input) => {
      console.log("방이 없습니다.")
    });
  
    sharedData.socket.on("keyIsValid", (input) => {
      sharedData.socket.emit("joinRoom", input);
      sharedData.roomKey = input;
      scene.scene.start("GameRoomScene");
    });

    sharedData.socket.on("makeroom", () => {
      scene.scene.start("GameRoomScene");
    });
  }
  update() {}
}
