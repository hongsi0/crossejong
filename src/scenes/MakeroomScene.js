import Phaser from "phaser";
import sharedData from "../shared";
import '../fontLoader';

function isValidPassword(str) {
  const regex = /^\d{4}$/;
  return regex.test(str);
}

function isValidRoomname(str){
  // 띄어쓰기 포함 8자 이내의 한글
  const regex = /^[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\s]{1,8}$/;
  return regex.test(str);
}

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
    const roomname = scene.makeroomform.getChildByID("user_roomname");
    const password = scene.makeroomform.getChildByID("user_roompw");
    const basicButton = scene.makeroomform.getChildByID("basicButton");
    const normalButton = scene.makeroomform.getChildByID("normalButton");
    const fairyButton = scene.makeroomform.getChildByID("fairyButton");
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
      newButton.style.transform = "scale(0.65)";
      basicButton.appendChild(newButton);

      while (normalButton.firstChild) {
        normalButton.removeChild(normalButton.firstChild);
      }
      const normalimg = document.createElement("img");
      normalimg.src = "assets/image/중급(N).png";
      normalimg.style.transform = "scale(0.65)";
      normalButton.appendChild(normalimg);
      while (hardButton.firstChild) {
        hardButton.removeChild(hardButton.firstChild);
      }
      const hardimg = document.createElement("img");
      hardimg.src = "assets/image/고급(N).png";
      hardimg.style.transform = "scale(0.65)";
      hardButton.appendChild(hardimg);
      while (fairyButton.firstChild) {
        fairyButton.removeChild(fairyButton.firstChild);
      }
      const fairyimg = document.createElement("img");
      fairyimg.src = "assets/image/동화(N).png";
      fairyimg.style.transform = "scale(0.65)";
      fairyButton.appendChild(fairyimg);
    });

    basicButton.addEventListener("mouseover", (event) => {
      if(!isMouseOver && difficulty != "초급"){
        while (basicButton.firstChild) {
          basicButton.removeChild(basicButton.firstChild);
        }
        const newButton = document.createElement("img");
        newButton.src = "assets/image/초급(Y).png";
        newButton.style.transform = "scale(0.65)";
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
        newButton.style.transform = "scale(0.65)";
        basicButton.appendChild(newButton);
        isMouseOver = false;
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
      newButton.style.transform = "scale(0.65)";
      normalButton.appendChild(newButton);

      while (basicButton.firstChild) {
        basicButton.removeChild(basicButton.firstChild);
      }
      const basicimg = document.createElement("img");
      basicimg.src = "assets/image/초급(N).png";
      basicimg.style.transform = "scale(0.65)";
      basicButton.appendChild(basicimg);
      while (hardButton.firstChild) {
        hardButton.removeChild(hardButton.firstChild);
      }
      const hardimg = document.createElement("img");
      hardimg.src = "assets/image/고급(N).png"; 
      hardimg.style.transform = "scale(0.65)";
      hardButton.appendChild(hardimg);
      while (fairyButton.firstChild) {
        fairyButton.removeChild(fairyButton.firstChild);
      }
      const fairyimg = document.createElement("img");
      fairyimg.src = "assets/image/동화(N).png";
      fairyimg.style.transform = "scale(0.65)";
      fairyButton.appendChild(fairyimg);
    });
    
    normalButton.addEventListener("mouseover", (event) => {
      if(!isMouseOver && difficulty != "중급"){
        while (normalButton.firstChild) {
          normalButton.removeChild(normalButton.firstChild);
        }
        const newButton = document.createElement("img");
        newButton.src = "assets/image/중급(Y).png";
        newButton.style.transform = "scale(0.65)";
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
        newButton.style.transform = "scale(0.65)";
        normalButton.appendChild(newButton);
        isMouseOver = false;
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
      newButton.style.transform = "scale(0.65)";
      hardButton.appendChild(newButton);

      while (basicButton.firstChild) {
        basicButton.removeChild(basicButton.firstChild);
      }
      const basicimg = document.createElement("img");
      basicimg.src = "assets/image/초급(N).png";
      basicimg.style.transform = "scale(0.65)";
      basicButton.appendChild(basicimg);
      while (normalButton.firstChild) {
        normalButton.removeChild(normalButton.firstChild);
      }
      const normalimg = document.createElement("img");
      normalimg.src = "assets/image/중급(N).png";
      normalimg.style.transform = "scale(0.65)";
      normalButton.appendChild(normalimg);
      while (fairyButton.firstChild) {
        fairyButton.removeChild(fairyButton.firstChild);
      }
      const fairyimg = document.createElement("img");
      fairyimg.src = "assets/image/동화(N).png";
      fairyimg.style.transform = "scale(0.65)";
      fairyButton.appendChild(fairyimg);
    });

    hardButton.addEventListener("mouseover", (event) => {
      if(!isMouseOver && difficulty != "고급"){
        while (hardButton.firstChild) {
          hardButton.removeChild(hardButton.firstChild);
        }
        const newButton = document.createElement("img");
        newButton.src = "assets/image/고급(Y).png";
        newButton.style.transform = "scale(0.65)";
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
        newButton.style.transform = "scale(0.65)";
        hardButton.appendChild(newButton);
        isMouseOver = false;
      }
    });

    fairyButton.addEventListener("click", (event) => {
      scene.clicksound.play();
      difficulty = "동화";
      while (fairyButton.firstChild) {
        fairyButton.removeChild(fairyButton.firstChild);
      }
      const newButton = document.createElement("img");
      newButton.src = "assets/image/동화(Y).png";
      newButton.style.transform = "scale(0.65)";
      fairyButton.appendChild(newButton);

      while (basicButton.firstChild) {
        basicButton.removeChild(basicButton.firstChild);
      }
      const basicimg = document.createElement("img");
      basicimg.src = "assets/image/초급(N).png";
      basicimg.style.transform = "scale(0.65)";
      basicButton.appendChild(basicimg);
      while (normalButton.firstChild) {
        normalButton.removeChild(normalButton.firstChild);
      }
      const normalimg = document.createElement("img");
      normalimg.src = "assets/image/중급(N).png";
      normalimg.style.transform = "scale(0.65)";
      normalButton.appendChild(normalimg);
      while (hardButton.firstChild) {
        hardButton.removeChild(hardButton.firstChild);
      }
      const hardimg = document.createElement("img");
      hardimg.src = "assets/image/고급(N).png"; 
      hardimg.style.transform = "scale(0.65)";
      hardButton.appendChild(hardimg);
    });

    fairyButton.addEventListener("mouseover", (event) => {
      if(!isMouseOver && difficulty != "동화"){
        while (fairyButton.firstChild) {
          fairyButton.removeChild(fairyButton.firstChild);
        }
        const newButton = document.createElement("img");
        newButton.src = "assets/image/동화(Y).png";
        newButton.style.transform = "scale(0.65)";
        fairyButton.appendChild(newButton);
        isMouseOver = true;
      }
    });
    
    fairyButton.addEventListener("mouseleave", (event) => {
      if (isMouseOver && difficulty != "동화") {
        while (fairyButton.firstChild) {
          fairyButton.removeChild(fairyButton.firstChild);
        }
        const newButton = document.createElement("img");
        newButton.src = "assets/image/동화(N).png";
        newButton.style.transform = "scale(0.65)";
        fairyButton.appendChild(newButton);
        isMouseOver = false;
      }
    });

    makeButton.addEventListener("mouseover", (event) => {
      if(!isMouseOver){
        while (makeButton.firstChild) {
          makeButton.removeChild(makeButton.firstChild);
        }
        const newButton = document.createElement("img");
        newButton.src = "assets/image/방만들기(Y).png";
        newButton.style.transform = "scale(1.27)";
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
        newButton.style.transform = "scale(1.27)";
        makeButton.appendChild(newButton);
        isMouseOver = false
      }
    });

    makeButton.addEventListener("click", (event) => {
      if(difficulty != "" && roomname.value != "" && (password.value === "" || isValidPassword(password.value))){
        sharedData.socket.emit("RoomKeyValid", (roomname.value));
      }
      else{
        if(difficulty == ""){
          console.log("난이도 미설정");
        }
        if(roomname.value == ""){
          console.log("방 이름 미설정");
        }
        if(password.value != "" && !isValidPassword(password.value)){
          console.log("패스워드 형태 문제");
        }
      }
    });

    exitButton.addEventListener("mouseover", (event) => {
      if(!isMouseOver){
        while (exitButton.firstChild) {
          exitButton.removeChild(exitButton.firstChild);
        }
        const newButton = document.createElement("img");
        newButton.src = "assets/image/취소(Y).png";
        newButton.style.transform = "scale(1.27)";
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
        newButton.style.transform = "scale(1.27)";
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
      sharedData.socket.emit("makeroom", {roomKey:roomKey, difficulty:difficulty, password:password.value});
      sharedData.roomKey = roomKey;
      scene.scene.resume("RoomScene");
      scene.scene.sleep("MakeroomScene");
    })
  }
}