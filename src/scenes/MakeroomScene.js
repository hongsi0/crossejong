import Phaser from "phaser";
import sharedData from "../shared";

export default class MakeroomScene extends Phaser.Scene {
  constructor() {
    super("MakeroomScene");
  }

  preload() {
    this.load.html("Makeroomform", "assets/text/Makeroomform.html");
    this.load.audio("click", "assets/sound/놓기.mp3");
  }
  create() {
    const scene = this;

    //socket event 초기화
    sharedData.socket.removeAllListeners("RoomkeyNotValid");
    sharedData.socket.removeAllListeners("RoomkeyIsValid");
    sharedData.socket.removeAllListeners("createRoomed");
    
    scene.clicksound = scene.sound.add("click",{loop:false});

    let difficulty = "";
    let isMouseOver = false;

    scene.makeroomform = scene.add.dom(530, 210).setOrigin(0, 0).createFromCache("Makeroomform");
    const input = scene.makeroomform.getChildByID("input_roomname");
    const basicButton = scene.makeroomform.getChildByID("basicButton");
    const normalButton = scene.makeroomform.getChildByID("normalButton");
    const hardButton = scene.makeroomform.getChildByID("hardButton");
    const makeButton = scene.makeroomform.getChildByID("makeButton");
    const exitButton = scene.makeroomform.getChildByID("exitButton");

    basicButton.addEventListener("click", (event) => {
      scene.clicksound.play();
      difficulty = "초급";
      while (basicButton.firstChild) {
        basicButton.removeChild(basicButton.firstChild);
      }
      const newButton = document.createElement("img");
      newButton.src = "assets/image/초급(Y).png";
      basicButton.appendChild(newButton);

      while (normalButton.firstChild) {
        normalButton.removeChild(normalButton.firstChild);
      }
      const normalimg = document.createElement("img");
      normalimg.src = "assets/image/중급(N).png";
      normalButton.appendChild(normalimg);
      while (hardButton.firstChild) {
        hardButton.removeChild(hardButton.firstChild);
      }
      const hardimg = document.createElement("img");
      hardimg.src = "assets/image/고급(N).png";
      hardButton.appendChild(hardimg);
    });

    basicButton.addEventListener("mouseover", (event) => {
      if(!isMouseOver && difficulty != "초급"){
        while (basicButton.firstChild) {
          basicButton.removeChild(basicButton.firstChild);
        }
        const newButton = document.createElement("img");
        newButton.src = "assets/image/초급(Y).png";
        basicButton.appendChild(newButton);
        isMouseOver = true;
      }
    });
    
    basicButton.addEventListener("mouseleave", (event) => {
      if (isMouseOver && difficulty != "초급") {
        while (basicButton.firstChild) {
          basicButton.removeChild(basicButton.firstChild);
        }
        const newButton = document.createElement("img");
        newButton.src = "assets/image/초급(N).png";
        basicButton.appendChild(newButton);
        isMouseOver = false
      }
    });

    normalButton.addEventListener("click", (event) => {
      scene.clicksound.play();
      difficulty = "중급";
      while (normalButton.firstChild) {
        normalButton.removeChild(normalButton.firstChild);
      }
      const newButton = document.createElement("img");
      newButton.src = "assets/image/중급(Y).png";
      normalButton.appendChild(newButton);

      while (basicButton.firstChild) {
        basicButton.removeChild(basicButton.firstChild);
      }
      const basicimg = document.createElement("img");
      basicimg.src = "assets/image/초급(N).png";
      basicButton.appendChild(basicimg);

      while (hardButton.firstChild) {
        hardButton.removeChild(hardButton.firstChild);
      }
      const hardimg = document.createElement("img");
      hardimg.src = "assets/image/고급(N).png"; 
      hardButton.appendChild(hardimg);
    });
    
    normalButton.addEventListener("mouseover", (event) => {
      if(!isMouseOver && difficulty != "중급"){
        while (normalButton.firstChild) {
          normalButton.removeChild(normalButton.firstChild);
        }
        const newButton = document.createElement("img");
        newButton.src = "assets/image/중급(Y).png";
        normalButton.appendChild(newButton);
        isMouseOver = true;
      }
    });
    
    normalButton.addEventListener("mouseleave", (event) => {
      if (isMouseOver && difficulty != "중급") {
        while (normalButton.firstChild) {
          normalButton.removeChild(normalButton.firstChild);
        }
        const newButton = document.createElement("img");
        newButton.src = "assets/image/중급(N).png";
        normalButton.appendChild(newButton);
        isMouseOver = false
      }
    });

    hardButton.addEventListener("click", (event) => {
      scene.clicksound.play();
      difficulty = "고급";
      while (hardButton.firstChild) {
        hardButton.removeChild(hardButton.firstChild);
      }
      const newButton = document.createElement("img");
      newButton.src = "assets/image/고급(Y).png";
      hardButton.appendChild(newButton);

      while (basicButton.firstChild) {
        basicButton.removeChild(basicButton.firstChild);
      }
      const basicimg = document.createElement("img");
      basicimg.src = "assets/image/초급(N).png";
      basicButton.appendChild(basicimg);
      while (normalButton.firstChild) {
        normalButton.removeChild(normalButton.firstChild);
      }
      const normalimg = document.createElement("img");
      normalimg.src = "assets/image/중급(N).png";
      normalButton.appendChild(normalimg);
    });

    hardButton.addEventListener("mouseover", (event) => {
      if(!isMouseOver && difficulty != "고급"){
        while (hardButton.firstChild) {
          hardButton.removeChild(hardButton.firstChild);
        }
        const newButton = document.createElement("img");
        newButton.src = "assets/image/고급(Y).png";
        hardButton.appendChild(newButton);
        isMouseOver = true;
      }
    });
    
    hardButton.addEventListener("mouseleave", (event) => {
      if (isMouseOver && difficulty != "고급") {
        while (hardButton.firstChild) {
          hardButton.removeChild(hardButton.firstChild);
        }
        const newButton = document.createElement("img");
        newButton.src = "assets/image/고급(N).png";
        hardButton.appendChild(newButton);
        isMouseOver = false
      }
    });

    makeButton.addEventListener("mouseover", (event) => {
      if(!isMouseOver){
        while (makeButton.firstChild) {
          makeButton.removeChild(makeButton.firstChild);
        }
        const newButton = document.createElement("img");
        newButton.src = "assets/image/방만들기(Y).png";
        makeButton.appendChild(newButton);
        isMouseOver = true;
      }
    });
    
    makeButton.addEventListener("mouseleave", (event) => {
      if (isMouseOver) {
        while (makeButton.firstChild) {
          makeButton.removeChild(makeButton.firstChild);
        }
        const newButton = document.createElement("img");
        newButton.src = "assets/image/방만들기(N).png";
        makeButton.appendChild(newButton);
        isMouseOver = false
      }
    });

    makeButton.addEventListener("click", (event) => {
      if(difficulty != "" && input.value != ""){
        scene.clicksound.play();
        sharedData.socket.emit("RoomKeyValid", (input.value));
      }
    });

    exitButton.addEventListener("mouseover", (event) => {
      if(!isMouseOver){
        while (exitButton.firstChild) {
          exitButton.removeChild(exitButton.firstChild);
        }
        const newButton = document.createElement("img");
        newButton.src = "assets/image/취소(Y).png";
        exitButton.appendChild(newButton);
        isMouseOver = true;
      }
    });
    
    exitButton.addEventListener("mouseleave", (event) => {
      if (isMouseOver) {
        while (exitButton.firstChild) {
          exitButton.removeChild(exitButton.firstChild);
        }
        const newButton = document.createElement("img");
        newButton.src = "assets/image/취소(N).png";
        exitButton.appendChild(newButton);
        isMouseOver = false
      }
    });
    
    exitButton.addEventListener("click", (event) => {
      scene.clicksound.play();
      scene.scene.resume("RoomScene");
      scene.scene.sleep("MakeroomScene");
    });

    sharedData.socket.on("RoomkeyNotValid", function (input) {
      sharedData.socket.emit("createRoom", input);
    });
    sharedData.socket.on("RoomkeyIsValid", function (input) {
      console.log("이미 존재하는 방이름입니다.");
    });
    sharedData.socket.on("createRoomed", (roomKey) =>{
      sharedData.socket.emit("makeroom", {roomKey:roomKey, difficulty:difficulty});
      sharedData.roomKey = roomKey;
      scene.scene.resume("RoomScene");
      scene.scene.sleep("MakeroomScene");
    })
  }
}