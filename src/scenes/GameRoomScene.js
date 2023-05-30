import Phaser from "phaser";
import sharedData from "../shared";
import '../fontLoader';


export default class GameRoomScene extends Phaser.Scene {
  constructor() {
    super("GameRoomScene");
  }

  preload() {
    this.load.image("background", "assets/image/background.png");
    this.load.image("logo", "assets/image/logo.png");
    this.load.image("startbutton", "assets/image/startButton.png");
    this.load.image("outbutton(N)", "assets/image/out(N).png");
    this.load.image("outbutton(Y)", "assets/image/out(Y).png");
    this.load.image("roomnameBar", "assets/image/roomNameBar.png");
    this.load.html("playerlistform", "assets/text/playerlistform.html");
    this.load.html("chatform", "assets/text/chatform.html");
    this.load.audio("대기방bgm", "assets/sound/대기방bgm.mp3");
    this.load.audio("click", "assets/sound/놓기.mp3");
    this.load.image("mute", "assets/image/mute.png");
    this.load.image("unmute", "assets/image/unmute.png");
  }
  create() {
    const scene = this;

    scene.waitbgm = scene.sound.add("대기방bgm",{loop:true});
    scene.clicksound = scene.sound.add("click",{loop:false});

    scene.waitbgm.play();

    let isMouseOver = false;

    //socket event 초기화
    sharedData.socket.removeAllListeners("Playerupdate");
    sharedData.socket.removeAllListeners("gamestart");
    sharedData.socket.removeAllListeners("chat");
    
    scene.players = [];
    let WordStyle = {font: "50px BR-R", fill: "black"};
  
    //BACKGROUND
    scene.add.image(0, 0, "background").setOrigin(0);
  
    //LOGO
    scene.logo = scene.add.sprite(200, 120, "logo");
    scene.roomnameBar = scene.add.sprite(990, 85, "roomnameBar");
    scene.roomname = scene.add.text(490, 60, `방 ${sharedData.roomKey}`, WordStyle).setOrigin(0,0);

    // sound
    const soundImage = scene.add.image(1850, 120, 'unmute')
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
  
    const outbuttonImage = scene.add.image(1600, 800, 'outbutton(N)')
    .setOrigin(0)
    .setDepth(100)
    .setScale(0.6)
    .setInteractive()
    .on('pointerover', () => {
      outbuttonImage.setTexture("outbutton(Y)");
    })
    .on('pointerout', () =>{
      outbuttonImage.setTexture("outbutton(N)");
    })
    .on('pointerup', () => {
      scene.clicksound.play();
      scene.waitbgm.stop();
      console.log("click");
      sharedData.socket.emit("outRoom", sharedData.roomKey);
      scene.scene.start('RoomScene');
      sharedData.roomKey = "";
    });
  
    sharedData.socket.emit("GameRoomready", (sharedData.roomKey));
  
    scene.inputElement = scene.add.dom(30, 225).createFromCache("playerlistform");
    const player_list = scene.inputElement.getChildByID("player_list");
  
    //userlist
    sharedData.socket.on("Playerupdate", (players) => {
      scene.players = players;
      // 이전에 추가된 자식 엘리먼트들을 모두 삭제
      while (player_list.firstChild) {
        player_list.removeChild(player_list.firstChild);
      }
      Object.keys(scene.players).forEach((playerkey) => {
        const playerbox = document.createElement("div");
        playerbox.setAttribute("class", "playerbox");
        const textinbox = document.createElement("p");
        textinbox.setAttribute("class", "room_nickname");
        const playerNick = document.createTextNode(scene.players[playerkey].playerNickname);
        textinbox.appendChild(playerNick);
        playerbox.appendChild(textinbox);
        player_list.appendChild(playerbox);
      });
      if(Object.keys(scene.players).length >= 2) {
        const startbuttonImage = scene.add.image(1600, 400, 'startbutton')
        .setOrigin(0)
        .setDepth(100)
        .setScale(0.7)
        .setInteractive()
        .on('pointerdown', function () {
          scene.clicksound.play();
          console.log("startclick");
          sharedData.socket.emit("gamestart", sharedData.roomKey);
        });
      };
    });
  
    sharedData.socket.on("gamestart", () => {
      scene.waitbgm.stop();
      scene.scene.start("GameScene");
    });
  
    //chat
    scene.inputElement = scene.add.dom(940, 560).createFromCache("chatform");
    const chatlist = scene.inputElement.getChildByID("chat-messages");
  
    scene.inputElement.addListener("click");
    scene.inputElement.addListener("submit");
    scene.inputElement.on("click", function (event) {
      console.log("click");
      event.preventDefault();
      // scene.clicksound.play();
      if (event.target.id === "sendchat") {
        scene.clicksound.play();
        const input = scene.inputElement.getChildByID("chat-input");
        if(input.value != "") {
          sharedData.socket.emit("chat", input.value, sharedData.roomKey);
          input.value = "";
        }
      }
    });
    scene.inputElement.on("submit", function (event) {
      console.log("submit");
      event.preventDefault();
      const input = scene.inputElement.getChildByID("chat-input");
      sharedData.socket.emit("chat", input.value, sharedData.roomKey);
      input.value = "";
    });
  
    sharedData.socket.on("chat", (nickname, msg) => {
      console.log(msg);
      const li = document.createElement("li");
      li.innerText = `${nickname}: ${msg}`;
      chatlist.appendChild(li);
    });
  }
}
