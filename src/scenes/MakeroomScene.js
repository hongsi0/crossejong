import Phaser from "phaser";
import sharedData from "../shared";

export default class MakeroomScene extends Phaser.Scene {
  constructor() {
    super("MakeroomScene");
  }

  preload() {
    this.load.image("createRoom", "assets/image/createRoom.png");
    this.load.image("makeroomN", "assets/image/방만들기(N).png");
    this.load.image("makeroomY", "assets/image/방만들기(Y).png");
    this.load.image("hardN", "assets/image/고급(N).png");
    this.load.image("hardY", "assets/image/고급(Y).png");
    this.load.image("normalN", "assets/image/중급(N).png");
    this.load.image("normalY", "assets/image/중급(Y).png");
    this.load.image("basicN", "assets/image/초급(N).png");
    this.load.image("basicY", "assets/image/초급(Y).png");
    this.load.image("cancelN", "assets/image/취소(N).png");
    this.load.image("cancelY", "assets/image/취소(Y).png");
    this.load.html("Makeroomform", "assets/text/Makeroomform.html");
  }
  create() {
    const scene = this;

    //BACKGROUND
    scene.add.image(520, 250, "createRoom").setOrigin(0);

    //socket event 초기화
    sharedData.socket.removeAllListeners("RoomkeyNotValid");
    sharedData.socket.removeAllListeners("RoomkeyIsValid");
    sharedData.socket.removeAllListeners("createRoomed");
    
    scene.makeroomform = scene.add.dom(530,210).setOrigin(0,0).createFromCache("Makeroomform");

    scene.basiccheck = 0
    scene.normalcheck = 0
    scene.hardcheck = 0

    //basic
    const basicImage = scene.add.image(570, 650, 'basicN')
    .setOrigin(0)
    .setDepth(100)
    .setInteractive()
    .on("pointerdown", () => {
      scene.basiccheck=1;
      basicImage.setTexture("basicY");
      if(scene.normalcheck) {
        scene.normalcheck = 0;
        normalImage.setTexture("normalN");
      } else if(scene.hardcheck) {
        scene.hardcheck = 0;
        hardImage.setTexture("hardN");
      }
    });

    //normal
    const normalImage = scene.add.image(810, 650, 'normalN')
    .setOrigin(0)
    .setDepth(100)
    .setInteractive()
    .on("pointerdown", () => {
      scene.normalcheck=1;
      normalImage.setTexture("normalY");
      if(scene.basiccheck) {
        scene.basiccheck = 0;
        basicImage.setTexture("basicN");
      } else if(scene.hardcheck) {
        scene.hardcheck = 0;
        hardImage.setTexture("hardN");
      }
    });

    //hard
    const hardImage = scene.add.image(1050, 650, 'hardN')
    .setOrigin(0)
    .setDepth(100)
    .setInteractive()
    .on("pointerdown", () => {
      scene.hardcheck=1;
      hardImage.setTexture("hardY");
      if(scene.normalcheck) {
        scene.normalcheck = 0;
        normalImage.setTexture("normalN");
      } else if(scene.basiccheck) {
        scene.basiccheck = 0;
        basicImage.setTexture("basicN");
      }
    });

    //makeroom
    const makeroomImage = scene.add.image(560, 750, 'makeroomN')
    .setOrigin(0)
    .setDepth(100)
    .setInteractive()
    .on('pointerover', () => {
      makeroomImage.setTexture("makeroomY");
    })
    .on("pointerout", ()=> {
      makeroomImage.setTexture("makeroomN");
    })
    .on("pointerdown", () => {
      const input = scene.makeroomform.getChildByID("input_roomname");
      console.log(input.value);
      sharedData.socket.emit("RoomKeyValid", input.value);
    });

    //makeroom
    const cancelImage = scene.add.image(920, 750, 'cancelN')
    .setOrigin(0)
    .setDepth(100)
    .setInteractive()
    .on('pointerover', () => {
      cancelImage.setTexture("cancelY");
    })
    .on("pointerout", ()=> {
      cancelImage.setTexture("cancelN");
    })
    .on("pointerdown", () => {
      scene.scene.stop("MakeroomScene");
    });
    
    sharedData.socket.on("RoomkeyNotValid", function (input) {
      sharedData.socket.emit("createRoom", input);
    });
    sharedData.socket.on("RoomkeyIsValid", function (input) {
      console.log("이미 존재하는 방이름입니다.");
    });
    sharedData.socket.on("createRoomed", (roomKey) =>{
      sharedData.socket.emit("makeroom", roomKey);
      sharedData.roomKey = roomKey;
      scene.scene.stop("MakeroomScene");
      scene.scene.resume("RoomScene");
    })
  }
}
