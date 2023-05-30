import sharedData from "../shared";
import '../fontLoader';

let gameOptions = {
    cardWidth: 90,
    cardHeight: 90,
    handSizeRatio: 1,
    blankSizeRatio: 0.7,
    firstBlankX: 500,
    firstBlankY: 155,
    betweenBlank: 70,
    firstCardX: 600,
    firstCardY: 980,
    betweenCrad: 130,
    handCardMax: 9,
    boardxrange: 17,
    boardyrange: 11
}

let directions = [[0,1],[0,-1],[-1,0],[1,0]] //상하좌우
let xrange = [];
let yrange = [];
for (let i=0;i<gameOptions.boardxrange;i++){
    xrange.push(gameOptions.firstBlankX + gameOptions.betweenBlank*i);
}
for (let i=0;i<gameOptions.boardyrange;i++){
    yrange.push(gameOptions.firstBlankY + gameOptions.betweenBlank*i);
}


export default class TutorialScene extends Phaser.Scene {
    constructor() {
        super("TutorialScene");
    }

    preload() {
        this.load.html("playerlistform", "assets/text/playerlistform.html");
        this.load.image("background", "assets/image/background.png");
        this.load.image("blank", "assets/image/blank.png");
        this.load.image("deck", "assets/image/deck.png");
        this.load.image("finishButton", "assets/image/finishButton.png");
        this.load.image("logo", "assets/image/logo.png");
        this.load.image("board", "assets/image/board.png");
        this.load.image("뒷면", "assets/image/뒷면.png");
        this.load.image("okButton", "assets/image/okButton.png");
        this.load.image("rightArrange", "assets/image/rightArrange.png");
        this.load.image("leftArrange", "assets/image/leftArrange.png");
        this.load.image("returnButton(N)", "assets/image/return(N).png");
        this.load.image("returnButton(Y)", "assets/image/return(Y).png");
        // 초급
        this.load.image("대", "assets/cards/대.png");
        this.load.image("마", "assets/cards/마.png");
        // 초급 cardRotation
        this.load.image("무", "assets/cards/무.png");

        this.load.audio("카드클릭", "assets/sound/딸깍.mp3");
        this.load.audio("카드내려놓기", "assets/sound/놓기.mp3");
        this.load.audio("버튼클릭", "assets/sound/클릭.mp3");
        this.load.audio("이의제기맞음", "assets/sound/맞음.mp3");
        this.load.audio("이의제기틀림", "assets/sound/틀림.mp3");
        this.load.audio("내턴", "assets/sound/내턴.mp3");
        this.load.audio("게임bgm", "assets/sound/게임bgm.mp3");
        this.load.image("mute", "assets/image/mute.png");
        this.load.image("unmute", "assets/image/unmute.png");
    }
    create() {
        const scene = this;

        //socket event 초기화
        sharedData.socket.removeAllListeners("TutorialcardDrop");
        sharedData.socket.removeAllListeners("Tutorialaddalphacards");     
        sharedData.socket.removeAllListeners("TutorialEnd");

        scene.word = ""; // 제출하는 단어
        scene.direction = "row"; // 자신의 card drop이 row인지 column인지를 나타낸다
        scene.dropped = false; // drop을 1번 이상 했는지를 나타낸다
        let isMouseOver = false;

        scene.cardClicksound = scene.sound.add("카드클릭",{loop:false});
        scene.cardDropsound = scene.sound.add("카드내려놓기",{loop:false});
        scene.buttonClicksound = scene.sound.add("버튼클릭",{loop:false});
        scene.gamebgm = scene.sound.add("게임bgm",{loop:true});
        
        // 자신 및 다른 유저가 drop한 card들을 저장하는 배열과 그 수를 세는 변수
        scene.dropCards = [];
        // 자신이 drop한 card와 click한 card들을 저장하는 배열
        scene.alphaCards = [];
      
        scene.board = []; //카드가 없을때 -1, 이번턴에 낸 카드 1, 전턴에 낸 카드 2, 움직이지 못하는 카드 3
        // 현재 board의 상황을 2차원 배열로 표현
        for(let j = 0; j < gameOptions.boardyrange; j++) {
            scene.board.push([]);
            for (let i=0; i<gameOptions.boardxrange; i++) {
                scene.board[j].push({posval:-1, cardval:-1});
            }
        };
      
        // 게임에서 사용하는 deck
        scene.deckArray = ["대", "마", "무"];
      
        // board에 drop된 card들을 저장하는 group
        scene.boardGroup = new Phaser.GameObjects.Group(scene);
        // hand에 있는 card들을 저장하는 group
        scene.handGroup = new Phaser.GameObjects.Group(scene);
        // 게임 시작 시 board에 blank를 생성한다
        scene.zoneGroup = new Phaser.GameObjects.Group(scene);
        for(let i = 0; i < gameOptions.boardxrange; i++) {
            for(let j = 0; j < gameOptions.boardyrange; j++) {
                scene.createBlank(i, j, scene.zoneGroup); // 새로운 group을 인수로 전달합니다.
            }
        }
        scene.zoneGroup.setDepth(2);
        //alphacards 선택할때 생긴 선 저장하는 group
        scene.graphicGroup = new Phaser.GameObjects.Group(scene);

        // sound
        const soundImage = scene.add.image(1880, 330, 'unmute')
        .setOrigin(1, 1)
        .setDepth(10)
        .setInteractive()
        .setScale(0.2)
        .on("pointerup", () => {
            if (soundImage.texture.key === "unmute") {
                scene.gamebgm.pause();
                soundImage.setTexture("mute");
            } else if (soundImage.texture.key === "mute") {
                scene.gamebgm.resume();
                soundImage.setTexture("unmute");
            }
        });

        // 자신이 낸 카드를 되돌려받는 button
        const returnButton = scene.add.sprite(1815, 640, "returnButton(N)")
        .setInteractive()
        .setDepth(1)
        .setScale(0.35)
        .on('pointerover', () => {
            returnButton.setTexture("returnButton(Y)");
        })
        .on("pointerout", ()=> {
            returnButton.setTexture("returnButton(N)");
        });
      
        // 자신의 turn을 끝내는 button
        const finishButton = scene.add.sprite(1815, 750, "finishButton")
        .setInteractive()
        .setDepth(1)
        .on("pointerup",() => {
            scene.buttonClicksound.play();
            scene.sortWord();
            console.log(scene.alphaCards,scene.SubmitWord())
            if (scene.dropped && scene.alphaCards.length>1 && scene.SubmitWord()) {
                scene.scene.launch("TutorialVerificationScene", scene.word);
            };
        });
      
        // 게임 배경, 로고, 보드, 마지막 단어 바, 마지막 단어
        scene.background = scene.add.sprite(game.config.width / 2, game.config.height / 2, "background");
        scene.logo = scene.add.sprite(200, 120, "logo");
        scene.boardImage = scene.add.sprite(1050, 505, "board").setScale(1.02);

        let fontStyle = {font: "50px BR-R", color: '#d73637', align: 'center'};

        let textBox = this.add.text(600, 200, '가지고 있는 글자를 우클릭해 회전시킬 수 있어요', fontStyle).setOrigin(0,0);
        
        // card를 drop하는 위치에 생기는 preview
        scene.cardPreview = scene.add.sprite(0, 0, "뒷면");
        scene.cardPreview.visible = false;
        scene.cardPreview.alpha = 0.75;
        scene.cardPreview.displayWidth = gameOptions.cardWidth * gameOptions.blankSizeRatio;
        scene.cardPreview.displayHeight = gameOptions.cardHeight * gameOptions.blankSizeRatio;
        scene.cardPreview.setDepth(3);
      
        // 게임 시작 시 deck을 생성한다
        let deck = scene.add.sprite(1810, 490, "deck").setInteractive().on("pointerup",() => {
        });
        deck.setDepth(1);
      
        scene.input.on("dragover", (dropZone) => {
            // show card preview
            if(!isMouseOver) {
                let temp = gameOptions.cardWidth * gameOptions.blankSizeRatio * 1 / 2;
                let xpos = 0
                for(let i=0;i<xrange.length;i++){
                    if (dropZone.x >= (xrange[i] - temp) && dropZone.x <= xrange[i]+ gameOptions.cardWidth * gameOptions.blankSizeRatio - temp){
                        xpos = xrange[i];
                    }
                }
                let ypos = 0
                for(let i=0;i<yrange.length;i++){
                    if (dropZone.y >= (yrange[i] - temp) && dropZone.y <= yrange[i]+ gameOptions.cardHeight * gameOptions.blankSizeRatio - temp){
                        ypos = yrange[i];
                    }
                }
                if (xpos != 0 && ypos != 0){
                    scene.cardPreview.visible = true;
                    scene.cardPreview.x = xpos;
                    scene.cardPreview.y = ypos;
                }
                isMouseOver = true;
            }
        });
      
        scene.input.on("dragleave", () => {
            // hide card preview
            scene.cardPreview.visible = false;
            isMouseOver = false;
        });
      
        // card를 drag하면 pointer를 따라다니도록 한다
        scene.input.on("dragstart", (pointer, card) => {
            // card가 hand에 있는지 검사한다
            if(scene.handGroup.contains(card)) {
                scene.cardClicksound.play();
                // card의 기준점을 angle을 반영하여 pointer에 위치하게 변경한다
                scene.setCardOrigin(card);
                // hand에서 card를 제거한다
                scene.handGroup.remove(card);
                // hand에 있는 card들을 재정렬한다
                scene.arrangeCardsInHand();
                // card가 pointer를 따라다니도록 한다
                scene.tweens.add({
                    targets: card,
                    x: pointer.x,
                    y: pointer.y,
                    duration: 150
                });
            }
        });
      
        // // card를 drag하면 pointer를 따라다니도록 한다
        scene.input.on("drag", (pointer, card) => {
            // card가 hand에 있거나 board에 있는지를 검사한다
            if(!scene.handGroup.contains(card) && !scene.boardGroup.contains(card)) {
                // card가 pointer를 따라다니도록 한다
                card.x = pointer.x;
                card.y = pointer.y;
            }
        });
      
        // drop하지 않고 drag가 끝나면 card를 다시 hand에 추가한다
        scene.input.on("dragend", (pointer, card, dropped) => {
            // card의 기준점을 다시 중심으로 변경한다
            card.setOrigin(0.5, 0.5);
            // hide card preview
            scene.cardPreview.visible = false;
            // card가 hand에 있거나 board에 있는지를 검사한다
            if(!scene.handGroup.contains(card) && !scene.boardGroup.contains(card) && !dropped) {
                // card를 다시 hand에 추가한다
                scene.handGroup.add(card);
                // hand에 있는 card들을 재정렬한다
                scene.arrangeCardsInHand();
            }
        });
      
        scene.input.on("drop", (pointer, card, blank) => {
            console.log("card",card);
            card.i = blank.i;
            card.j = blank.j;
            console.log("drop", card.i, card.j)
            if (card.i == 7 && card.j == 5){
                if (scene.validLocation(card.i, card.j, "drop")) {
                    scene.cardDropsound.play();
                    // If scene is the first card drop, initialize some letiables and emit an event to other players
                    if (!scene.dropped) {
                        scene.dropped = true;
                        scene.dropCards = [];
                    }
                    sharedData.socket.emit("TutorialcardDrop", {cardval:card.value, i:card.i, j:card.j});
                    scene.cardPreview.visible = false;
                    card.destroy();
                    textBox.setText("대를 클릭후 완료버튼을 눌러주세요");
                    textBox.x = 700;
                } else {
                    // If it's not the player's turn, move the card back to their hand
                    if (!scene.handGroup.contains(card) && !scene.boardGroup.contains(card)) {
                        scene.handGroup.add(card);
                        scene.arrangeCardsInHand();
                    }
                }
            } else {
                scene.handGroup.add(card);
                scene.arrangeCardsInHand();
            }
        });

        //보드 가운데 카드를 둔다.
        let centercard = scene.add.sprite(gameOptions.firstBlankX + gameOptions.betweenBlank * 8, gameOptions.firstBlankY + gameOptions.betweenBlank * 5, scene.deckArray[0]).setDepth(3).setInteractive().on("pointerdown",() => {
            if(centercard.canclick && scene.validLocation(centercard.i, centercard.j, "click")) {
                sharedData.socket.emit("Tutorialaddalphacards", {val:centercard.value, i:centercard.i, j:centercard.j});
            }
        });
        centercard.displayWidth = gameOptions.cardWidth * gameOptions.blankSizeRatio;
        centercard.displayHeight = gameOptions.cardHeight * gameOptions.blankSizeRatio;
        centercard.value = 0;
        centercard.i = 8;
        centercard.j = 5;
        centercard.canclick = true;
        scene.boardGroup.add(centercard);
        // board를 update한다
        scene.board[centercard.j][centercard.i].posval = 2;
        scene.board[centercard.j][centercard.i].cardval = 0;
      
        //게임 시작 후 첫 카드를 받는다
        scene.cardPreview.x = 1810;
        scene.cardPreview.y = 490;
        scene.cardPreview.visible = true;
        scene.cardPreview.alpha = 1;
        let coordinates = this.setHandCoordinates(this.handGroup.countActive());
        if (coordinates.x > gameOptions.firstCardX + gameOptions.betweenCrad * gameOptions.handCardMax){
            coordinates.x = gameOptions.firstCardX + gameOptions.betweenCrad * (gameOptions.handCardMax-1);
        }
        scene.tweens.add({
            targets: scene.cardPreview,
            x: coordinates.x,
            y: coordinates.y,
            duration: 300, // 1초 동안 애니메이션을 실행함
            onComplete: function (tween, targets, card) { // 애니메이션이 끝난 후 오브젝트를 삭제함
                card.visible = false;
                card.alpha = 0.75;
                scene.createCard(2);
            },
            onCompleteParams: [scene.cardPreview]
        });
        scene.arrangeCardsInHand();
        scene.gamebgm.play();
      
        // 다른 유저가 card를 drop하면 자신의 board에 반영한다
        sharedData.socket.on("TutorialcardDrop", (cardData) => {
            console.log("tutorialdrop");
            scene.cardDropsound.play();
            let card = scene.add.sprite(gameOptions.firstBlankX + gameOptions.betweenBlank * cardData.i, gameOptions.firstBlankY + gameOptions.betweenBlank * cardData.j, scene.deckArray[cardData.cardval])
            .setDepth(3)
            .setInteractive()
            .on("pointerdown",() => {
                if(card.canclick && scene.validLocation(card.i, card.j, "click")) {
                    console.log(card.value);
                    sharedData.socket.emit("Tutorialaddalphacards", {val:card.value, i:card.i, j:card.j});
                }
            });
            card.value = cardData.cardval;
            card.i = cardData.i;
            card.j = cardData.j;
            card.canclick = true;
            card.displayWidth = gameOptions.cardWidth * (gameOptions.blankSizeRatio+0.3);
            card.displayHeight =  gameOptions.cardHeight * (gameOptions.blankSizeRatio+0.3);
            scene.boardGroup.add(card);
            scene.tweens.add({
                targets: card,
                x: card.x,
                y: card.y,
                displayWidth: gameOptions.cardWidth * gameOptions.blankSizeRatio,
                displayHeight: gameOptions.cardHeight * gameOptions.blankSizeRatio,
                duration: 150,
                ease: 'easeInOut',
                onComplete: function() {
                    sharedData.socket.emit("Tutorialaddalphacards", {cardval:card.value, i:card.i, j:card.j});
                }
            });
            // 다른 유저가 drop한 card들을 배열에 저장한다
            scene.dropCards.push(card);
            // board를 update한다
            scene.board[cardData.j][cardData.i].posval = 1;
            scene.board[cardData.j][cardData.i].cardval = cardData.cardval;
        });

        sharedData.socket.on("Tutorialaddalphacards", (cardData) => {
            let card;
            scene.boardGroup.getChildren().forEach((boardcard) => {
                // console.log(boardcard.i,cardData.i,boardcard.j,cardData.j)
                if (boardcard.i == cardData.i && boardcard.j == cardData.j){
                    card = boardcard;
                }
            });
            scene.tweens.add({
                targets: card,
                alpha: 0.5,
                duration: 200,
                onComplete: function (tween, targets, card) { // 애니메이션이 끝난 후 오브젝트를 삭제함
                    // 그래픽 생성
                    const graphics = scene.add.graphics();
                    graphics.lineStyle(6, 0x66FFFF, 1); // 두께, 색상, 투명도
                    graphics.strokeRect(card.x - gameOptions.cardWidth / 2 * gameOptions.blankSizeRatio - 2.5, card.y - gameOptions.cardHeight / 2 * gameOptions.blankSizeRatio - 2.5, gameOptions.cardWidth * gameOptions.blankSizeRatio + 5, gameOptions.cardHeight * gameOptions.blankSizeRatio + 5);
                    scene.graphicGroup.add(graphics);
                    card.canclick = false;
                    scene.alphaCards.push(card);
                    if(scene.alphaCards.length >= 2) {
                        if(scene.alphaCards[0].i === cardData.i) scene.direction = "column";
                    }
                },
                onCompleteParams: [card]
            });   
        })
          
        sharedData.socket.on("TutorialEnd", (data) => {
            scene.gamebgm.stop();
            scene.scene.start("RoomScene");
        });
    }
 
    // card value값을 받아서 해당 값을 가지는 card를 생성한다
    createCard(n) {
        let coordinates = this.setHandCoordinates(this.handGroup.countActive());
        let card = this.add.sprite(coordinates.x, coordinates.y, this.deckArray[n]).on("pointerdown",(pointer) => {
            if(pointer.rightButtonDown()) {
                if(this.handGroup.contains(card)) {
                    this.cardRotation(card);
                }
            }
        })
        .on("pointerover", () => {
            this.tweens.add({
                targets: card,
                displayWidth: gameOptions.cardWidth * 1.1,
                displayHeight: gameOptions.cardHeight * 1.1,
                y: gameOptions.firstCardY - 50,
                duration: 150,
            })
        })
        .on("pointerout", () => {
            this.tweens.add({
                targets: card,
                displayWidth: gameOptions.cardWidth,
                displayHeight: gameOptions.cardHeight,
                y: gameOptions.firstCardY,
                duration: 150,
            })
        });
        card.setOrigin(0.5, 0.5);
        card.handPosition = this.handGroup.countActive();
        card.setInteractive({
            draggable: true
        });
        card.displayWidth = gameOptions.cardWidth;
        card.displayHeight = gameOptions.cardHeight;
        card.value = n;
        card.i = 0;
        card.j = 0;
        card.setDepth(4);
        card.canclick = true;
        this.handGroup.add(card);
    }
    
    setHandCoordinates(n) {
        let xPosition = gameOptions.firstCardX + gameOptions.betweenCrad * n;
        let yPosition = gameOptions.firstCardY;
        return {
            x: xPosition,
            y: yPosition
        }
    }
    
    // 보유중인 card를 알맞게 위치시킨다
    arrangeCardsInHand() {
        this.countArrange = 0;
        this.handGroup.children.iterate(function(card, i) {
            let coordinates = this.setHandCoordinates(i);
            this.tweens.add({
                targets: card,
                x: coordinates.x,
                y: coordinates.y,
                displayWidth: gameOptions.cardWidth,
                displayHeight: gameOptions.cardHeight,
                duration: 250,
                onComplete: function(){
                    if (card.x >= gameOptions.firstCardX + gameOptions.betweenCrad * gameOptions.handCardMax || card.x < gameOptions.firstCardX) {
                        card.visible = false;
                    }
                    else {
                        card.visible = true;
                    }
                }
            });
        }, this);
    }

    // card를 drop할 수 있는 공간인 blank를 생성한다
    createBlank(i, j) {
        let blank = this.add.sprite(gameOptions.firstBlankX + gameOptions.betweenBlank * i, gameOptions.firstBlankY + gameOptions.betweenBlank * j, "blank").setInteractive();
        blank.input.dropZone = true;
        blank.i = i;
        blank.j = j;
        blank.displayWidth = gameOptions.cardWidth * gameOptions.blankSizeRatio;
        blank.displayHeight = gameOptions.cardHeight * gameOptions.blankSizeRatio;
        blank.alpha = 0.001;
        this.zoneGroup.add(blank);
    }

    // 제출할 단어를 만들기 위해 배열을 정렬한다
    sortWord() {
        this.alphaCards.sort((a, b) => {
            if (a.x === b.x) {
              return a.y - b.y;
            }
            return a.x - b.x;
        });
    }

    SubmitWord() {
        this.word = "";
        this.alphaCards.forEach((val) => {
          this.word += this.deckArray[val.value];
        });
      
        let check = true;
      
        for (let i = 0; i < this.alphaCards.length; i++) {
          const currentCard = this.alphaCards[i];
          const nextCard = this.alphaCards[i + 1];
      
          if (nextCard) {
            console.log("card",currentCard,nextCard);
            if (currentCard.i === nextCard.i) {
              if ((nextCard.j - currentCard.j) !== 1) {
                check = false;
                break;
              }
            } else if (currentCard.j === nextCard.j) {
              if ((nextCard.i - currentCard.i) !== 1) {
                check = false;
                break;
              }
            } else {
              check = false;
              break;
            }
          }
        }
        return check;
      }
      

    validLocation(x, y, type) {
        console.log("valid", type, this.direction);
        if (this.alphaCards.length >= 1) {
            if(this.alphaCards[0].j != y && this.alphaCards[0].i != x) return false;
        }
        if (this.alphaCards.length > 1) {
            if (this.direction === "row" && this.alphaCards[0].j != y) return false;
            else if (this.direction === "column" && this.alphaCards[0].i != x) return false;
        }
        if (type === "drop") {
            if(this.board[y][x].posval == -1){
                for (let i=0;i<directions.length;i++){
                    let ny = y-directions[i][1]
                    let nx = x-directions[i][0]
                    if (0<= nx && nx < gameOptions.boardxrange && 0<= ny && ny < gameOptions.boardyrange && this.board[ny][nx].posval >= 1) return true;
                }
            }
        } else if (type === "click") {
            if(this.alphaCards.length >= 1) {
                if(this.board[y][x].posval >= 1 && this.alphaCards[0].i === x) {
                    this.direction = "column"
                    return true
                } else if (this.board[y][x].posval >= 1 && this.alphaCards[0].j === y) {
                    this.direction = "row"
                    return true
                }
            }
        }
        return false
    }

    cardRotation(card) {
        // 마 무
        if(card.value === 1) {
            card.value = 2;
            card.angle += 90;
        } else if(card.value === 2) {
            card.value = 1;
            card.angle -= 90;
        }
    }

    setCardOrigin(card) {
        if (card.angle == 0) {
            card.setOrigin(0.5, 1);
        }
        else if (card.angle == 90) {
            card.setOrigin(1, 0.5);
        }
        else if (card.angle == 180) {
            card.setOrigin(0.5, 0);
        }
        else if (card.angle == 270) {
            card.setOrigin(0, 0.5);
        }
        else if (card.angle == -270) {
            card.setOrigin(1, 0.5);
        }
        else if (card.angle == -180) {
            card.setOrigin(0.5, 0);
        }
        else if (card.angle == -90) {
            card.setOrigin(0, 0.5);
        }
    }
}