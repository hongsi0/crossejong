import Phaser from "phaser";
import sharedData from "../shared";


export default class GameRoomScene extends Phaser.Scene {
  constructor() {
    super("GameRoomScene");
  }

  preload() {
    this.load.image("background", "assets/image/background.png");
    this.load.image("logo", "assets/image/logo.png");
    this.load.image("startbutton", "assets/image/okButton.png");
    this.load.image("outbutton", "assets/image/okButton.png");
    this.load.html("playerlistform", "assets/text/playerlistform.html");
    this.load.html("chatform", "assets/text/chatform.html");
  }
  create() {
    const scene = this;

    //socket event 초기화
    sharedData.socket.removeAllListeners("Playerupdate");
    sharedData.socket.removeAllListeners("gamestart");
    sharedData.socket.removeAllListeners("chat");
    
    scene.players = [];
  
    //BACKGROUND
    scene.add.image(0, 0, "background").setOrigin(0);
  
    //LOGO
    scene.logo = scene.add.sprite(200, 120, "logo");
  
    const outbuttonImage = scene.add.image(1550, 800, 'outbutton')
    .setOrigin(0)
    .setDepth(100)
    .setScale(1.2)
    .setInteractive()
    .on('pointerdown', function () {
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
        const startbuttonImage = scene.add.image(1550, 600, 'startbutton')
        .setOrigin(0)
        .setDepth(100)
        .setScale(1.2)
        .setInteractive()
        .on('pointerdown', function () {
          console.log("startclick");
          sharedData.socket.emit("gamestart", sharedData.roomKey);
        });
      };
    });
  
    sharedData.socket.on("gamestart", () => {
      scene.scene.start("GameScene");
    });
  
    //chat
    scene.inputElement = scene.add.dom(940, 620).createFromCache("chatform");
    const chatlist = scene.inputElement.getChildByID("chat-messages");
  
    scene.inputElement.addListener("click");
    scene.inputElement.addListener("submit");
    scene.inputElement.on("click", function (event) {
      console.log("click");
      event.preventDefault();
      if (event.target.id === "sendchat") {
        const input = scene.inputElement.getChildByID("chat-input");
        sharedData.socket.emit("chat", input.value, sharedData.roomKey);
        input.value = "";
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
