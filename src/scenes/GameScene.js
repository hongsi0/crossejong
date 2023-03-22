import sharedData from "../shared";

let gameOptions = {
    cardWidth: 100,
    cardHeight: 100,
    handSizeRatio: 1,
    blankSizeRatio: 0.7,
    firstBlankX: 708,
    firstBlankY: 158,
    betweenBlank: 76,
    firstCardX: 600,
    firstCardY: 980,
    betweenCrad: 130,
    handCardMax: 9
}

export default class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
    }

    preload() {
        this.load.html("playerlistform", "assets/text/playerlistform.html");
        this.load.image("background", "assets/image/background.png");
        this.load.image("blank", "assets/image/blank.png");
        this.load.image("deck", "assets/image/deck.png");
        this.load.image("finishButton", "assets/image/finishButton.png");
        this.load.image("objectionButton", "assets/image/objectionButton.png");
        this.load.image("logo", "assets/image/logo.png");
        this.load.image("lastWordBar", "assets/image/lastWordBar.png");
        this.load.image("board", "assets/image/board.png");
        this.load.image("뒷면", "assets/image/뒷면.png");
        this.load.image("okButton", "assets/image/okButton.png");
        this.load.image("verificationTrueBox", "assets/image/verificationTrueBox.png");
        this.load.image("verificationFalseBox", "assets/image/verificationFalseBox.png");
        this.load.image("rightArrange", "assets/image/rightArrange.png");
        this.load.image("leftArrange", "assets/image/leftArrange.png");
        this.load.image("myturnImage", "assets/image/myturn.png");
        this.load.image("가", "assets/cards/가.png");
        this.load.image("거", "assets/cards/거.png");
        this.load.image("고", "assets/cards/고.png");
        this.load.image("구", "assets/cards/구.png");
        this.load.image("그", "assets/cards/그.png");
        this.load.image("금", "assets/cards/금.png");
        this.load.image("기", "assets/cards/기.png");
        this.load.image("나", "assets/cards/나.png");
        this.load.image("다", "assets/cards/다.png");
        this.load.image("대", "assets/cards/대.png");
        this.load.image("도", "assets/cards/도.png");
        this.load.image("동", "assets/cards/동.png");
        this.load.image("드", "assets/cards/드.png");
        this.load.image("라", "assets/cards/라.png");
        this.load.image("로", "assets/cards/로.png");
        this.load.image("리", "assets/cards/리.png");
        this.load.image("마", "assets/cards/마.png");
        this.load.image("보", "assets/cards/보.png");
        this.load.image("부", "assets/cards/부.png");
        this.load.image("비", "assets/cards/비.png");
        this.load.image("사", "assets/cards/사.png");
        this.load.image("상", "assets/cards/상.png");
        this.load.image("생", "assets/cards/생.png");
        this.load.image("소", "assets/cards/소.png");
        this.load.image("수", "assets/cards/수.png");
        this.load.image("스", "assets/cards/스.png");
        this.load.image("시", "assets/cards/시.png");
        this.load.image("식", "assets/cards/식.png");
        this.load.image("아", "assets/cards/아.png");
        this.load.image("안", "assets/cards/안.png");
        this.load.image("어", "assets/cards/어.png");
        this.load.image("오", "assets/cards/오.png");
        this.load.image("요", "assets/cards/요.png");
        this.load.image("우", "assets/cards/우.png");
        this.load.image("음", "assets/cards/음.png");
        this.load.image("이", "assets/cards/이.png");
        this.load.image("인", "assets/cards/인.png");
        this.load.image("일", "assets/cards/일.png");
        this.load.image("자", "assets/cards/자.png");
        this.load.image("장", "assets/cards/장.png");
        this.load.image("전", "assets/cards/전.png");
        this.load.image("정", "assets/cards/정.png");
        this.load.image("제", "assets/cards/제.png");
        this.load.image("주", "assets/cards/주.png");
        this.load.image("지", "assets/cards/지.png");
        this.load.image("진", "assets/cards/진.png");
        this.load.image("하", "assets/cards/하.png");
        this.load.image("한", "assets/cards/한.png");
        this.load.image("해", "assets/cards/해.png");
        this.load.image("믄", "assets/cards/믄.png");
        this.load.image("무", "assets/cards/무.png");
        this.load.image("여", "assets/cards/여.png");
        this.load.image("믕", "assets/cards/믕.png");
        this.load.image("으", "assets/cards/으.png");
    }
    create() {
        const scene = this;

        //socket event 초기화
        sharedData.socket.removeAllListeners("pickcard");
        sharedData.socket.removeAllListeners("firstcard");
        sharedData.socket.removeAllListeners("firstTurn");
        sharedData.socket.removeAllListeners("nextTurn");
        sharedData.socket.removeAllListeners("centerCard");
        sharedData.socket.removeAllListeners("firstDrop");
        sharedData.socket.removeAllListeners("cardDrop");
        sharedData.socket.removeAllListeners("turnEnd");
        sharedData.socket.removeAllListeners("verificationFalse");
        sharedData.socket.removeAllListeners("verificationTrue");
        sharedData.socket.removeAllListeners("verificationpickcard");
        sharedData.socket.removeAllListeners("timeOut");
        sharedData.socket.removeAllListeners("turnPlayerDisconnection");
        sharedData.socket.removeAllListeners("currentPlayers");
        sharedData.socket.removeAllListeners("disconnected");
        sharedData.socket.removeAllListeners("currentCardUpdate");
        sharedData.socket.removeAllListeners("tok");
        sharedData.socket.removeAllListeners("gameEnd");

        scene.myTurn = false; // true면 자신의 turn임을 나타낸다
        scene.curruntTurn = "";
        scene.whetherObjection = false; // objection의 가능 여부를 나타낸다
        scene.word = ""; // 제출하는 단어
        scene.direction = "row"; // 자신의 card drop이 row인지 column인지를 나타낸다
        scene.dropped = false; // drop을 1번 이상 했는지를 나타낸다
        scene.clicked = false; // board에서 1번 이상 click을 했는지를 나타낸다
        scene.x; // 자신의 턴에서 처음으로 drop한 위치의 x좌표를 나타낸다
        scene.y; // 자신의 턴에서 처음으로 drop한 위치의 y좌표를 나타낸다
        scene.lastCardData = null;
        scene.recentlyVerification = true;
        scene.recentlyTimeOut = true;
        scene.recentlyTurnPlayerDisconnection = true;
        let lastWordStyle = {font: "60px Arial", fill: "black"};
      
        scene.players = {
        //   [playerid]: {playerId:, playerNickname:, played:, card:}
        }
        
        // 자신 및 다른 유저가 drop한 card들을 저장하는 배열과 그 수를 세는 변수
        scene.dropCard = [
            [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
        ];
        scene.dropCount = 0;
      
        // 자신이 drop한 card와 click한 card들을 저장하는 배열
        scene.alphaCard = [];
      
        // 현재 board의 상황을 2차원 배열로 표현
        scene.board = [
            [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        ];
      
        // 게임에서 사용하는 deck
        scene.deckArray = ["가", "거", "고", "구", "그", "금", "기", "나", "다", "대",
        "도", "동", "드", "라", "로", "리", "마", "보", "부", "비",
        "사", "상", "생", "소", "수", "스", "시", "식", "아", "안",
        "어", "오", "요", "우", "음", "이", "인", "일", "자", "장",
        "전", "정", "제", "주", "지", "진", "하", "한", "해"];
      
        // drop된 card와 해당 위치의 blank를 whetherObjection이 바뀔 때까지 저장하는 group
        scene.waitBlankGroup = scene.add.group();
        scene.waitCardGroup = scene.physics.add.group();
      
        // 자신의 turn을 끝내는 button
        const finishButton = scene.add.sprite(1815, 750, "finishButton").setInteractive().on("pointerup",() => {
            if (scene.myTurn & scene.dropped & scene.clicked & scene.sortWord()) {
                sharedData.socket.emit("turnEnd", sharedData.roomKey, sharedData.socket.id, scene.word, "drop");
                sharedData.socket.emit("nextTurn", sharedData.roomKey);
                scene.myTurn = false;
                console.log("Turn End! " + scene.myTurn);
                scene.whetherObjection = false;
                console.log("whetherObjection: " + scene.whetherObjection);
                scene.lastWord.setStyle(lastWordStyle);
                scene.lastWord.setText(scene.word);
                scene.timer.paused = true;
      
                for (let i = 0; i < scene.alphaCard.length; i++) {
                    scene.alphaCard[i].alpha = 1;
                    scene.alphaCard[i].activate = false;
                }
                scene.alphaCard = [];
      
                // board에서 내가 select한 card를 update한다
                for (let i = 0; i < 10; i++) {
                    for (let j = 0; j < 10; j++) {
                        if (scene.board[i][j] === 1) {
                            scene.board[i][j] = 2;
                        }
                    }
                }
            };
        });
        finishButton.setDepth(1);
      
        // objection을 신청하는 button
        const objectionButton = scene.add.sprite(1815, 860, "objectionButton").setInteractive().on("pointerup",() => {
            if(scene.whetherObjection) {
                sharedData.socket.emit("objection", sharedData.roomKey, sharedData.socket.id);
            }
        });
        objectionButton.setDepth(1);
      
        // board에 drop된 card들을 저장하는 group
        scene.boardGroup = scene.add.group();
      
        // hand에 있는 card들을 저장하는 group
        scene.handGroup = scene.add.group();
      
        // 게임 배경, 로고, 보드, 마지막 단어 바, 마지막 단어
        scene.background = scene.add.sprite(game.config.width / 2, game.config.height / 2, "background");
        scene.logo = scene.add.sprite(200, 120, "logo");
        scene.boardImage = scene.add.sprite(1050, 500, "board");
        scene.lastWordBar = scene.add.sprite(1050, 60, "lastWordBar");
        scene.lastWord = scene.add.text(1050, 60, "", lastWordStyle);
        scene.lastWord.setOrigin(0.5, 0.5);
        
        // card를 drop하는 위치에 생기는 preview
        scene.cardPreview = scene.add.sprite(200, 200, "뒷면");
        scene.cardPreview.visible = false;
        scene.cardPreview.alpha = 0.75;
        scene.cardPreview.displayWidth = gameOptions.cardWidth * gameOptions.blankSizeRatio;
        scene.cardPreview.displayHeight = gameOptions.cardHeight * gameOptions.blankSizeRatio;
        scene.cardPreview.setDepth(3);
      
        // 이의신청 결과에 따른 안내 메시지 박스와 확인 버튼
        scene.verificationTrueBox = scene.add.sprite(1050, 500, "verificationTrueBox");
        scene.verificationTrueBox.setDepth(5);
        scene.verificationTrueBox.visible = false;
        scene.verificationFalseBox = scene.add.sprite(1050, 500, "verificationFalseBox");
        scene.verificationFalseBox.setDepth(5);
        scene.verificationFalseBox.visible = false;
        scene.okButton = scene.add.sprite(1050, 500 + 220, "okButton").setInteractive().on("pointerup",() => {
            scene.verificationTrueBox.visible = false;
            scene.verificationFalseBox.visible = false;
            scene.okButton.visible = false;
        });
        scene.okButton.visible = false;
        scene.okButton.setDepth(6);
      
        scene.countArrange = 0;
        // handGroup에 있는 카드 목록을 왼쪽, 오른쪽으로 이동시키는 버튼
        scene.rightArrange = scene.add.sprite(1800, 980, "rightArrange").setInteractive().on("pointerup",() => {
            if (scene.handGroup.countActive() - gameOptions.handCardMax > scene.countArrange) {
                scene.handGroup.children.iterate(function(card) {
                    card.x -= gameOptions.betweenCrad;
                    if (card.x >= gameOptions.firstCardX + gameOptions.betweenCrad * 9 || card.x < gameOptions.firstCardX) {
                        card.visible = false;
                    }
                    else {
                        card.visible = true;
                    }
                });
                scene.countArrange++;
            }
        });
        scene.leftArrange = scene.add.sprite(450, 980, "leftArrange").setInteractive().on("pointerup",() => {
            if (scene.countArrange > 0) {
                scene.handGroup.children.iterate(function(card) {
                    card.x += gameOptions.betweenCrad;
                    if (card.x >= gameOptions.firstCardX + gameOptions.betweenCrad * 9 || card.x < gameOptions.firstCardX) {
                        card.visible = false;
                    }
                    else {
                        card.visible = true;
                    }
                });
                scene.countArrange--;
            }
        });
      
        // total time until trigger
        scene.timeInSeconds = 30;
        // timer font
        let timeStyle = {font: "50px Arial", fill: "black"};
        //make a text field
        scene.timeText = scene.add.text(1810, 100, "30", timeStyle);
        // center the text
        scene.timeText.setOrigin(0.5, 0.5);
        // set up a loop timer
        scene.timer = scene.time.addEvent({ delay: 1000, callback: scene.tick, callbackScope: scene, loop: true });
        scene.timer.paused = true;
      
        // 게임 시작 시 board에 blank를 생성한다
        scene.zoneGroup = scene.physics.add.group();
        for(let i = 0; i < 10; i++) {
            for(let j = 0; j < 10; j++) {
                scene.createBlank(i, j);
            }
        }
        scene.zoneGroup.setDepth(2);
      
        // drop된 카드가 위치한 자리의 blank는 비활성화한다
        scene.physics.add.overlap(scene.zoneGroup, scene.waitCardGroup, scene.setBlank, null, scene);
      
        // 게임 시작 시 deck을 생성한다
        let deck = scene.add.sprite(1810, 490, "deck").setInteractive().on("pointerup",() => {
            // 자신의 turn이며 아직 card를 drop하지 않았을 때 작동한다
            if(scene.myTurn & !(scene.dropped)) {
                // deck을 click하면 card를 1장 생성한다
                console.log("pickcard");
                sharedData.socket.emit("pickcard", (sharedData.roomKey));
            }
        });
        deck.setDepth(1);
      
        scene.inputElement = scene.add.dom(30, 225).createFromCache("playerlistform");
        const player_list = scene.inputElement.getChildByID("player_list");
      
        scene.input.on("dragenter", (dropZone) => {
            // show card preview
            let previewPosition = scene.setPreviewCoordinates(dropZone);
            scene.cardPreview.visible = true;
            scene.cardPreview.x = previewPosition.x;
            scene.cardPreview.y = previewPosition.y;
        });
      
        scene.input.on("dragleave", () => {
            // hide card preview
            scene.cardPreview.visible = false;
        });
      
        // card를 drag하면 pointer를 따라다니도록 한다
        scene.input.on("dragstart", (pointer, card) => {
            // card가 hand에 있는지 검사한다
            if(scene.handGroup.contains(card)) {
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
            };
        });
      
        // card를 drag하면 pointer를 따라다니도록 한다
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
            if(!scene.handGroup.contains(card) && !scene.boardGroup.contains(card)) {
                if(!dropped) {
                    // card를 다시 hand에 추가한다
                    scene.handGroup.add(card);
                    // hand에 있는 card들을 재정렬한다
                    scene.arrangeCardsInHand();
                }
            }
        });
      
        scene.input.on("drop", (pointer, card, blank) => {
            card.i = blank.i;
            card.j = blank.j;
            const validDrop = scene.myTurn && scene.validLocation(card.i, card.j, "drop");
      
            if (validDrop) {
                // If scene is the first card drop, initialize some letiables and emit an event to other players
                if (!scene.dropped) {
                    scene.dropped = true;
                    scene.whetherObjection = false;
                    sharedData.socket.emit("firstDrop", sharedData.roomKey, null);
                    console.log("whetherObjection: " + scene.whetherObjection);
                    scene.waitBlankGroup = scene.add.group();
                    scene.waitCardGroup = scene.add.group();
                    scene.dropCard = [[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1], [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1], [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]];
                    scene.dropCount = 0;
                    scene.x = card.i;
                    scene.y = card.j;
                }
      
                card.setDepth(3).setOrigin(0.5, 0.5).setAlpha(0.5).setInteractive(false);
                blank.input.dropZone = false;
      
                scene.alphaCard.push(card);
                scene.dropCard[0][scene.dropCount] = blank.i;
                scene.dropCard[1][scene.dropCount] = blank.j;
                scene.dropCard[2][scene.dropCount] = card.value;
                scene.dropCount++;
                scene.board[blank.i][blank.j] = 1;
      
                scene.tweens.add({
                    targets: card,
                    x: blank.x,
                    y: blank.y,
                    displayWidth: gameOptions.cardWidth * gameOptions.blankSizeRatio,
                    displayHeight: gameOptions.cardHeight * gameOptions.blankSizeRatio,
                    duration: 150,
                    onComplete: function() {
                        scene.boardGroup.add(card);
                        scene.waitBlankGroup.add(blank);
                        scene.waitCardGroup.add(card);
                        sharedData.socket.emit("cardDrop", sharedData.roomKey, {value: card.value, x: blank.i, y: blank.j});
                        console.log("123");
                        sharedData.socket.emit("currentCardUpdate", sharedData.roomKey, sharedData.socket.id, scene.handGroup.countActive());
                    }
                });
            } else {
                // If it's not the player's turn, move the card back to their hand
                if (!scene.handGroup.contains(card) && !scene.boardGroup.contains(card)) {
                    scene.handGroup.add(card);
                    scene.arrangeCardsInHand();
                    scene.tweens.add({
                        targets: scene.background,
                        alpha: 1,
                        duration: 150
                    });
                }
            }
        });
      
        sharedData.socket.emit("ready", sharedData.roomKey);
      
        sharedData.socket.on("pickcard", (card) => {
            scene.createCard(scene.deckArray[card]),
            scene.arrangeCardsInHand()
            // turn을 종료한다
            sharedData.socket.emit("turnEnd", sharedData.roomKey, sharedData.socket.id, scene.word, "deck");
            sharedData.socket.emit("nextTurn", sharedData.roomKey);
            scene.myTurn = false;
            console.log("Turn End! " + scene.myTurn);
            scene.whetherObjection = false;
            console.log("whetherObjection: " + scene.whetherObjection);
            // 현재 카드 수를 플레이어에게 알린다
            sharedData.socket.emit("currentCardUpdate", sharedData.roomKey, sharedData.socket.id, scene.handGroup.countActive());
            // scene.timer.paused = true;
        });
      
        //게임 시작 후 첫 카드를 받는다
        sharedData.socket.on("firstcard", (cards) => {
            for(let i = 0; i < cards.length; i ++) {
                scene.createCard(scene.deckArray[cards[i]]);
                scene.arrangeCardsInHand()
            }
        });
      
        // 게임 시작 후 1번째 turn을 부여받는다
        sharedData.socket.on("firstTurn", (id) => {
            scene.curruntTurn = id;
            console.log("firstTurn");
            if (id === sharedData.socket.id) {
                scene.myTurn = true;
                console.log("My Turn! " + scene.myTurn);
                scene.whetherObjection = true;
                // timer를 재설정한다
                scene.timeInSeconds = 30;
                scene.timer.paused = false;
                // Phaser 오브젝트 생성
                let myturnImage = this.add.sprite(1050, 500, 'myturnImage');
                myturnImage.setDepth(555);
                // Tween 애니메이션 적용
                scene.tweens.add({
                targets: myturnImage,
                alpha: 0, // 투명도를 0으로 조절하여 오브젝트가 서서히 사라지도록 함
                duration: 3000, // 1초 동안 애니메이션을 실행함
                onComplete: function (tween, targets, myturnImage) { // 애니메이션이 끝난 후 오브젝트를 삭제함
                    myturnImage.destroy();
                },
                onCompleteParams: [myturnImage]
                });
            }
        });
      
        // 2번째 turn부터 자신의 turn인지 확인한다
        sharedData.socket.on("nextTurn", (id) => {
            scene.curruntTurn = id;
            if (id === sharedData.socket.id) {
                scene.myTurn = true;
                scene.dropped = false;
                scene.clicked = false;
                console.log("My Turn! " + scene.myTurn);
                // timer를 재설정한다
                scene.timeInSeconds = 30;
                scene.timer.paused = false;
                // Phaser 오브젝트 생성
                let myturnImage = this.add.sprite(1050, 500, 'myturnImage');
                myturnImage.setDepth(555);
                // Tween 애니메이션 적용
                scene.tweens.add({
                targets: myturnImage,
                alpha: 0, // 투명도를 0으로 조절하여 오브젝트가 서서히 사라지도록 함
                duration: 3000, // 1초 동안 애니메이션을 실행함
                onComplete: function (tween, targets, myturnImage) { // 애니메이션이 끝난 후 오브젝트를 삭제함
                    myturnImage.destroy();
                },
                onCompleteParams: [myturnImage]
                });
            }

        });
      
        // 2명 이상 접속하면 board 중앙에 카드를 생성한다
        sharedData.socket.on("centerCard", (value) => {
            console.log("center card set!");
            let card = scene.add.sprite(gameOptions.firstBlankX + gameOptions.betweenBlank * 4, gameOptions.firstBlankY + gameOptions.betweenBlank * 4, scene.deckArray[value]).setDepth(3).setInteractive().on("pointerdown",() => {
                if(scene.boardGroup.contains(card) & !card.activate & scene.myTurn & scene.dropped & scene.validLocation(card.i, card.j, "click")) {
                    console.log("카드 선택");
                    card.alpha = 0.5;
                    card.activate = true;
                    scene.alphaCard.push(card);
                    scene.clicked = true;
                    scene.board[card.i][card.j] = 1;
                }
            });
            card.displayWidth = gameOptions.cardWidth * gameOptions.blankSizeRatio;
            card.displayHeight = gameOptions.cardHeight * gameOptions.blankSizeRatio;
            card.value = scene.deckArray[value];
            card.i = 4;
            card.j = 4;
            scene.boardGroup.add(card);
            // board를 update한다
            scene.board[4][4] = 2; 
        });
      
        // turn이 부여된 후 1번째 card를 drop하면 objection을 비활성화하고 배열을 초기화한다
        sharedData.socket.on("firstDrop", () => {
            scene.whetherObjection = false;
            console.log("whetherObjection: " + scene.whetherObjection);
            scene.waitBlankGroup = scene.add.group();
            scene.waitCardGroup = scene.add.group();
            scene.dropCard = [
                [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
            ];
            scene.dropCount = 0;
        });
      
        // 다른 유저가 card를 drop하면 자신의 board에 반영한다
        sharedData.socket.on("cardDrop", (cardData) => {
            if (scene.lastCardData != cardData) {
                scene.lastCardData = cardData
                console.log("Other player: card Drop!");
                let card = scene.add.sprite(gameOptions.firstBlankX + gameOptions.betweenBlank * cardData.x, gameOptions.firstBlankY + gameOptions.betweenBlank * cardData.y, cardData.value).setDepth(3).setInteractive().on("pointerdown",() => {
                    if(scene.boardGroup.contains(card) & !card.activate & scene.myTurn & scene.dropped & scene.validLocation(card.i, card.j, "click")) {
                        console.log("카드 선택");
                        card.alpha = 0.5;
                        card.activate = true;
                        scene.alphaCard.push(card);
                        scene.clicked = true;
                        scene.board[card.i][card.j] = 1;
                    }
                });
                card.displayWidth = gameOptions.cardWidth * gameOptions.blankSizeRatio;
                card.displayHeight = gameOptions.cardHeight * gameOptions.blankSizeRatio;
                card.value = cardData.value;
                card.i = cardData.x;
                card.j = cardData.y;
      
                // 다른 유저가 drop한 card들을 배열에 저장한다
                scene.dropCard[0][scene.dropCount] = cardData.x;
                scene.dropCard[1][scene.dropCount] = cardData.y;
                scene.dropCard[2][scene.dropCount] = cardData.value;
                scene.dropCount++;
                scene.boardGroup.add(card);
                scene.waitCardGroup.add(card);
                // board를 update한다
                scene.board[cardData.x][cardData.y] = 2;
            }
        });
      
        // 다른 유저의 turn이 끝나면 objection을 활성화한다
        sharedData.socket.on("turnEnd", (type, lastWord) => {
            scene.recentlyVerification = true;
            scene.recentlyTimeOut = true;
            scene.recentlyTurnPlayerDisconnection = true;
            if (type === "drop") {
                console.log("turnEnd!");
                scene.whetherObjection = true;
                console.log("whetherObjection: " + scene.whetherObjection);
                let lastWordStyle = {font: "60px Arial", fill: "black"};
                scene.lastWord.setStyle(lastWordStyle);
                scene.lastWord.setText(lastWord);
            }
            else if (type === "deck") {
                console.log("turnEnd!");
                scene.whetherObjection = false;
                console.log("whetherObjection: " + scene.whetherObjection);
            }
            else if (type === "time") {
                console.log("turnEnd!");
            }
            else if (type === "disconnection") {
                console.log("turnEnd!");
            }
        });
      
        function cleardropCards() {
            // 배열을 초기화한다
            scene.dropCard = [
                [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
            ];
            scene.dropCount = 0;
            scene.whetherObjection = false;
            console.log("whetherObjection: " + scene.whetherObjection);
        }
      
        // 마지막 유저가 제출한 단어에 대해 objection을 신청한 결과로 존재하지 않는 단어일 때
        sharedData.socket.on("verificationFalse", (id) => {
            if (scene.recentlyVerification) {
                scene.recentlyVerification = false;
                console.log("objection!");
                // 마지막 유저가 drop한 card를 모두 제거한다
                scene.waitBlankGroup.clear(true);
                scene.waitCardGroup.clear(true);
                for(let i = 0; i < 10; i++) {
                    if(scene.dropCard[0][i] != -1) {
                        scene.createBlank(scene.dropCard[0][i], scene.dropCard[1][i]);
                        // board를 update한다
                        scene.board[scene.dropCard[0][i]][scene.dropCard[1][i]] = -1;
                    }
                    // 만약 자신이 마지막 유저라면 제거한 card를 모두 hand로 가져온 후 추가로 card를 1장 생성한다
                    if (id === sharedData.socket.id) {
                        if(scene.dropCard[0][i] != -1) {
                            scene.createCard(scene.dropCard[2][i]);
                        }
                        if (i === 9) {
                            sharedData.socket.emit("verificationpickcard", sharedData.roomKey);
                        }
                    }
                }
                cleardropCards();
                // 존재하지 않는 단어라는 메시지 박스를 띄운다
                scene.verificationFalseBox.visible = true;
                scene.okButton.visible = true;
            }
        });
      
        // 마지막 유저가 제출한 단어에 대해 objection을 신청한 결과로 존재하는 단어일 때
        sharedData.socket.on("verificationTrue", (id, meaning) => {
            if (scene.recentlyVerification) {
                scene.recentlyVerification = false;
                let meaningStyle = {font: "30px Arial", fill: "black"};
                // 자신이 이의신청한 유저라면 카드를 1장 생성한다
                if (id === sharedData.socket.id) {
                    console.log("존재하는 단어입니다.");
                    scene.whetherObjection = false;
                    console.log("whetherObjection: " + scene.whetherObjection);
                    sharedData.socket.emit("verificationpickcard", sharedData.roomKey);
                }
                // 단어를 설명한다
                scene.lastWord.setStyle(meaningStyle);
                scene.lastWord.setText(meaning.word + " " + meaning.pos + " " + meaning.def);
                // 존재하는 단어라는 메시지 박스를 띄운다
                scene.verificationTrueBox.visible = true;
                scene.okButton.visible = true;
            }
        });
      
        sharedData.socket.on("verificationpickcard", (card) => {
            scene.createCard(scene.deckArray[card]);
            scene.arrangeCardsInHand();
            // 현재 카드 수를 플레이어에게 알린다
            sharedData.socket.emit("currentCardUpdate", sharedData.roomKey, sharedData.socket.id, scene.handGroup.countActive());
        })
      
        // 플레이어가 제한시간동안 단어를 완성하지 못한 경우
        sharedData.socket.on("timeOut", () => {
            if (scene.recentlyTimeOut) {
                scene.recentlyTimeOut = false;
                console.log("time out!");
      
                // 만약 자신의 turn이라면 선택한 카드들을 모두 선택 해제한다
                if (scene.myTurn) {
                    for (let i = 0; i < scene.alphaCard.length; i++) {
                        scene.alphaCard[i].alpha = 1;
                        scene.alphaCard[i].activate = false;
                    }
                    scene.alphaCard = [];
                }    
      
                // drop한 card를 모두 제거한다
                scene.waitBlankGroup.clear(true);
                scene.waitCardGroup.clear(true);
                for(let i = 0; i < 10; i++) {
                    if(scene.dropCard[0][i] != -1) {
                        scene.createBlank(scene.dropCard[0][i], scene.dropCard[1][i]);
                        // board를 update한다
                        scene.board[scene.dropCard[0][i]][scene.dropCard[1][i]] = -1;
                    }
                    // 만약 자신의 turn이라면 제거한 card를 모두 hand로 가져온다
                    if (scene.myTurn) {
                        if(scene.dropCard[0][i] != -1) {
                            scene.createCard(scene.dropCard[2][i]);
                        }
                    }
                }
                scene.arrangeCardsInHand();
                cleardropCards();
      
                if(scene.myTurn) {
                    // card를 1장 생성한다
                    sharedData.socket.emit("pickcard", (sharedData.roomKey));
                }
            }
        })
      
        sharedData.socket.on("turnPlayerDisconnection", () => {
            if (scene.recentlyTurnPlayerDisconnection && !scene.myTurn) {
                scene.recentlyTurnPlayerDisconnection = false;
                // drop한 card를 모두 제거한다
                scene.waitBlankGroup.clear(true);
                scene.waitCardGroup.clear(true);
                for(let i = 0; i < 10; i++) {
                    if(scene.dropCard[0][i] != -1) {
                        scene.createBlank(scene.dropCard[0][i], scene.dropCard[1][i]);
                        // board를 update한다
                        scene.board[scene.dropCard[0][i]][scene.dropCard[1][i]] = -1;
                    }
                }
                scene.arrangeCardsInHand();
                cleardropCards();
            }
        });
      
        function updatePlayerList(players) {
            while (player_list.firstChild) {
              player_list.removeChild(player_list.firstChild);
            }
          
            scene.players = players;
          
            Object.keys(scene.players).forEach((playerkey) => {
                const playerbox = document.createElement("div");
                if(scene.curruntTurn === playerkey) {
                    playerbox.setAttribute("class", "playerbox_myturn");
                } else {
                    playerbox.setAttribute("class", "playerbox");
                }
                const textinbox = document.createElement("p");
                textinbox.setAttribute("class", "game_nickname");
                const playerNick = document.createTextNode(scene.players[playerkey].playerNickname);
                playerNick.textContent = scene.players[playerkey].playerNickname;
                const announce_card_text = document.createTextNode("남아있는 카드수");
                const num_card = document.createTextNode(scene.players[playerkey].card);
                const lineBreak1 = document.createElement("br");
                const lineBreak2 = document.createElement("br");
                textinbox.appendChild(playerNick);
                textinbox.appendChild(lineBreak1); // 새로운 줄에 추가
                textinbox.appendChild(announce_card_text);
                textinbox.appendChild(lineBreak2); // 새로운 줄에 추가
                textinbox.appendChild(num_card);
                playerbox.appendChild(textinbox);
                player_list.appendChild(playerbox);
            });
        }
          
        sharedData.socket.on("currentPlayers", updatePlayerList);
        sharedData.socket.on("disconnected", (players) => {
            if (Object.keys(players).length == 1){
                sharedData.socket.emit("nextTurn", sharedData.roomKey);
            }
            updatePlayerList(players)
        });
        sharedData.socket.on("currentCardUpdate",updatePlayerList);
      
        sharedData.socket.on("tok", (time) => {
            let seconds = time;
            //make a string showing the time
            let timeString = scene.addZeros(seconds);
            //display the string in the text field
            scene.timeText.text = timeString;
        });
      
        sharedData.socket.on("gameEnd", () => {
            console.log("gameEnd");
            scene.scene.start("GameRoomScene");
        });
      }
    update() {
    }
 
    // card value값을 받아서 해당 값을 가지는 card를 생성한다
    createCard(n) {
        let coordinates = this.setHandCoordinates(this.handGroup.countActive());
        let card = this.add.sprite(coordinates.x, coordinates.y, n).on("pointerdown",(pointer) => {
            if(pointer.rightButtonDown()) {
                if(this.handGroup.contains(card)) {
                    this.cardRotation(card);
                }
            }
            else {
                if(this.boardGroup.contains(card) & !card.activate & this.myTurn & this.dropped & this.validLocation(card.i, card.j, "click")) {
                    console.log("카드 선택");
                    card.alpha = 0.5;
                    card.activate = true;
                    this.alphaCard.push(card);
                    this.clicked = true;
                    this.board[card.i][card.j] = 1;
                }
            }
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
        card.activate = false;
        this.handGroup.add(card);
        card.visible = false;
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
                duration: 150,
                onComplete: function(){
                    if (card.x >= gameOptions.firstCardX + gameOptions.betweenCrad * 9 || card.x < gameOptions.firstCardX) {
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
        if(!(i == 4 && j == 4)) {
            blank.input.dropZone = true;
        }
        blank.i = i;
        blank.j = j;
        blank.displayWidth = gameOptions.cardWidth * gameOptions.blankSizeRatio;
        blank.displayHeight = gameOptions.cardHeight * gameOptions.blankSizeRatio;
        blank.alpha = 0.001;
        this.zoneGroup.add(blank);
    }

    // board에 있는 card의 위치에 존재하는 blank의 input을 비활성화한다
    setBlank(blank, card) {
        blank.input.dropZone = false;
        this.waitBlankGroup.add(blank);
    }

    // 제출할 단어를 만들기 위해 배열을 정렬한다
    sortWord() {
        this.word = "";
        let array = [[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1]];

        if (this.direction === "row") {
            for (let i = 0; i < this.alphaCard.length; i++) {
                array[0][i] = this.alphaCard[i].i;
                array[1][i] = this.alphaCard[i].value;
            }
            for (let i = 0; i < this.alphaCard.length - 1; i++) {
                for (let j = 0; j < this.alphaCard.length - 1; j++) {
                    if (array[0][j] > array[0][j + 1]) {
                        let temp = array[0][j];
                        array[0][j] = array[0][j + 1];
                        array[0][j + 1] = temp;
    
                        let temp2 = array[1][j];
                        array[1][j] = array[1][j + 1];
                        array[1][j + 1] = temp2;
                    }
                }
            }
            for (let i = 0; i < this.alphaCard.length; i++) {
                if (array[1][i] != -1) {
                    this.word += array[1][i];
                }
            }
        }
        else if (this.direction === "column") {
            for (let i = 0; i < this.alphaCard.length; i++) {
                array[0][i] = this.alphaCard[i].j;
                array[1][i] = this.alphaCard[i].value;
            }
            for (let i = 0; i < this.alphaCard.length - 1; i++) {
                for (let j = 0; j < this.alphaCard.length - 1; j++) {
                    if (array[0][j] > array[0][j + 1]) {
                        let temp = array[0][j];
                        array[0][j] = array[0][j + 1];
                        array[0][j + 1] = temp;
    
                        let temp2 = array[1][j];
                        array[1][j] = array[1][j + 1];
                        array[1][j + 1] = temp2;
                    }
                }
            }
            for (let i = 0; i < this.alphaCard.length; i++) {
                if (array[1][i] != -1) {
                    this.word += array[1][i];
                }
            }
        }

        for (let i = 0; i < this.alphaCard.length - 1; i++) {
            if (array[0][i + 1] - array[0][i] != 1) {
                return false;
            }
        }
        return true;
    }

    validLocation(x, y, type) {
        let proper = false;
        if (type === "drop") {
            if (x < 9)
                if (this.board[x + 1][y] != -1)
                    proper = true;
            if (y < 9)
                if (this.board[x][y + 1] != -1)
                    proper = true;
            if (x > 0)
                if (this.board[x - 1][y] != -1)
                    proper = true;
            if (y > 0)
                if (this.board[x][y - 1] != -1)
                    proper = true;
        }
        else if (type === "click") {
            if (x < 9)
                if (this.board[x + 1][y] === 1)
                    proper = true;
            if (y < 9)
                if (this.board[x][y + 1] === 1)
                    proper = true;
            if (x > 0)
                if (this.board[x - 1][y] === 1)
                    proper = true;
            if (y > 0)
                if (this.board[x][y - 1] === 1)
                    proper = true;
        } 

        if (!proper)
            return false;
        
        if (this.alphaCard.length === 1) {
            if (this.x === x)
                this.direction = "column";
            else if (this.y === y)
                this.direction = "row";
            else
                return false;
        }

        
        if (this.alphaCard.length > 1) {
            if (this.direction === "row") {
                if (this.y === y)
                    return true;
                else
                    return false;
            }
            else if (this.direction === "column") {
                if (this.x === x)
                    return true;
                else
                    return false;
            }
        }

        return true;
    }

    cardRotation(card) {
        if(card.value === "금") {
            card.value = "믄";
            card.angle += 180;
        }
        else if(card.value === "믄") {
            card.value = "금";
            card.angle += 180;
        }
        else if(card.value === "마") {
            card.value = "무";
            card.angle += 90;
        }
        else if(card.value === "무") {
            card.value = "마";
            card.angle += 270;
        }
        else if(card.value === "아") {
            card.value = "우";
            card.angle += 90;
        }
        else if(card.value === "우") {
            card.value = "아";
            card.angle += 270;
        }
        else if(card.value === "어") {
            card.value = "오";
            card.angle += 90;
        }
        else if(card.value === "오") {
            card.value = "어";
            card.angle += 270;
        }
        else if(card.value === "요") {
            card.value = "여";
            card.angle += 270;
        }
        else if(card.value === "여") {
            card.value = "요";
            card.angle += 90;
        }
        else if(card.value === "음") {
            card.value = "믕";
            card.angle += 180;
        }
        else if(card.value === "믕") {
            card.value = "음";
            card.angle += 180;
        }
        else if(card.value === "이") {
            card.value = "으";
            card.angle += 90;
        }
        else if(card.value === "으") {
            card.value = "이";
            card.angle += 270;
        }
        console.log(card.angle);
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

    setPreviewCoordinates(dropZone) {
        let xPosition = dropZone.x - gameOptions.firstBlankX - gameOptions.cardWidth * gameOptions.blankSizeRatio / 2;
        let yPosition = dropZone.y - gameOptions.firstBlankY - gameOptions.cardHeight * gameOptions.blankSizeRatio / 2;

        let count = 0;
        while (xPosition >= 0) {
            xPosition -= gameOptions.betweenBlank;
            count++;
        }
        xPosition = gameOptions.firstBlankX + count * gameOptions.betweenBlank;

        count = 0;
        while (yPosition >= 0) {
            yPosition -= gameOptions.betweenBlank;
            count++;
        }
        yPosition = gameOptions.firstBlankY + count * gameOptions.betweenBlank;

        return {
            x: xPosition,
            y: yPosition
        }
    }

    tick() {
        //subtract a second
        this.timeInSeconds--;
        let seconds = this.timeInSeconds;
        //make a string showing the time
        let timeString = this.addZeros(seconds);
        //display the string in the text field
        this.timeText.text = timeString;
        sharedData.socket.emit("tick", sharedData.roomKey, seconds);
        //check if the time is up
        if (this.timeInSeconds === 0 && this.myTurn) {
            this.timer.paused = true;
            sharedData.socket.emit("timeOut", sharedData.roomKey, null);
        }
    }

    addZeros(number) {
        if (number < 10) {
            number = "0" + number;
        }
        return number;
    }
}