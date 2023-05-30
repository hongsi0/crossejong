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
        this.load.image("finishButton_cur", "assets/image/finishButton_cur.png");
        this.load.image("logo", "assets/image/logo.png");
        this.load.image("board", "assets/image/board.png");
        this.load.image("뒷면", "assets/image/뒷면.png");
        this.load.image("okButton", "assets/image/okButton.png");
        this.load.image("rightArrange", "assets/image/rightArrange.png");
        this.load.image("leftArrange", "assets/image/leftArrange.png");
        this.load.image("myturnImage", "assets/image/myturn.png");
        this.load.image("returnButton(N)", "assets/image/return(N).png");
        this.load.image("returnButton(Y)", "assets/image/return(Y).png");
        // 초급
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
        // 중급
        this.load.image("경", "assets/cards/경.png");
        this.load.image("공", "assets/cards/공.png");
        this.load.image("관", "assets/cards/관.png");
        this.load.image("국", "assets/cards/국.png");
        this.load.image("무", "assets/cards/무.png");
        this.load.image("법", "assets/cards/법.png");
        this.load.image("산", "assets/cards/산.png");
        this.load.image("서", "assets/cards/서.png");
        this.load.image("성", "assets/cards/성.png");
        this.load.image("신", "assets/cards/신.png");
        this.load.image("용", "assets/cards/용.png");
        this.load.image("원", "assets/cards/원.png");
        this.load.image("위", "assets/cards/위.png");
        this.load.image("유", "assets/cards/유.png");
        this.load.image("의", "assets/cards/의.png");
        this.load.image("조", "assets/cards/조.png");
        this.load.image("화", "assets/cards/화.png");
        // 고급
        this.load.image("강", "assets/cards/강.png");
        this.load.image("교", "assets/cards/교.png");
        this.load.image("군", "assets/cards/군.png");
        this.load.image("김", "assets/cards/김.png");
        this.load.image("문", "assets/cards/문.png");
        this.load.image("박", "assets/cards/박.png");
        this.load.image("선", "assets/cards/선.png");
        this.load.image("영", "assets/cards/영.png");
        this.load.image("재", "assets/cards/재.png");
        this.load.image("천", "assets/cards/천.png");
        this.load.image("학", "assets/cards/학.png");
        this.load.image("호", "assets/cards/호.png");
        //동화
        this.load.image("물", "assets/cards/물.png");
        this.load.image("방", "assets/cards/방.png");
        this.load.image("왕", "assets/cards/왕.png");
        this.load.image("미", "assets/cards/미.png");
        // 초급 cardRotation
        this.load.image("믄", "assets/cards/믄.png");
        this.load.image("무", "assets/cards/무.png");
        this.load.image("여", "assets/cards/여.png");
        this.load.image("믕", "assets/cards/믕.png");
        this.load.image("으", "assets/cards/으.png");
        // 중급 cardRotation
        this.load.image("운", "assets/cards/운.png");
        this.load.image("논", "assets/cards/논.png");
        this.load.image("융", "assets/cards/융.png");
        this.load.image("야", "assets/cards/야.png");
        // 고급 cardRotation
        this.load.image("곤", "assets/cards/곤.png");
        this.load.image("곰", "assets/cards/곰.png");
        // 동화 cardRotation
        this.load.image("롬", "assets/cards/롬.png");
        this.load.image("므", "assets/cards/므.png");


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
        sharedData.socket.removeAllListeners("pickcard");
        sharedData.socket.removeAllListeners("firstcard");
        sharedData.socket.removeAllListeners("nextTurn");
        sharedData.socket.removeAllListeners("centerCard");
        sharedData.socket.removeAllListeners("firstDrop");
        sharedData.socket.removeAllListeners("cardDrop");
        sharedData.socket.removeAllListeners("turnEnd");
        sharedData.socket.removeAllListeners("currentPlayers");
        sharedData.socket.removeAllListeners("disconnected");
        sharedData.socket.removeAllListeners("currentCardUpdate");
        sharedData.socket.removeAllListeners("gameEnd");
        sharedData.socket.removeAllListeners("returnCard");
        sharedData.socket.removeAllListeners("timeDecrease");
        sharedData.socket.removeAllListeners("addalphacards");
        sharedData.socket.removeAllListeners("launchVerifiScene");
        sharedData.socket.removeAllListeners("verificationresult");      

        scene.myTurn = false; // true면 자신의 turn임을 나타낸다
        scene.word = ""; // 제출하는 단어
        scene.direction = "row"; // 자신의 card drop이 row인지 column인지를 나타낸다
        scene.dropped = false; // drop을 1번 이상 했는지를 나타낸다
        let isMouseOver = false;

        scene.cardClicksound = scene.sound.add("카드클릭",{loop:false});
        scene.cardDropsound = scene.sound.add("카드내려놓기",{loop:false});
        scene.buttonClicksound = scene.sound.add("버튼클릭",{loop:false});
        scene.verificationTruesound = scene.sound.add("이의제기맞음",{loop:false});
        scene.verificationFalsesound = scene.sound.add("이의제기틀림",{loop:false});
        scene.myturnsound = scene.sound.add("내턴",{loop:false});
        scene.gamebgm = scene.sound.add("게임bgm",{loop:true});
      
        scene.players = {
        //   [playerid]: {playerId:, playerNickname:, played:, card:}
        };
        
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
        scene.deckArray =
        // 초급 index 0~48
        ["가", "거", "고", "구", "그", "금", "기", "나", "다", "대",
        "도", "동", "드", "라", "로", "리", "마", "보", "부", "비",
        "사", "상", "생", "소", "수", "스", "시", "식", "아", "안",
        "어", "오", "요", "우", "음", "이", "인", "일", "자", "장",
        "전", "정", "제", "주", "지", "진", "하", "한", "해",
        // 중급 index 49~97
        "가", "경", "고", "공", "관", "구", "국", "기", "대", "도",
        "동", "라", "로", "리", "무", "법", "보", "부", "비", "사",
        "산", "상", "서", "성", "소", "수", "스", "시", "신", "아",
        "안", "용", "원", "위", "유", "의", "이", "인", "일", "자",
        "장", "전", "정", "제", "조", "주", "지", "해", "화",
        // 고급 index 98~146
        "가", "강", "경", "고", "교", "구", "국", "군", "기", "김",
        "대", "도", "동", "리", "무", "문", "박", "보", "부", "사",
        "산", "상", "서", "선", "성", "수", "시", "신", "안", "영",
        "원", "유", "이", "인", "일", "자", "장", "재", "전", "정",
        "제", "조", "주", "지", "진", "천", "학", "호", "화",
        // 초급 cardRotation시에 새로 생기는 index 147~151
        "믄", "무", "여", "믕", "으",
        // 중급 cardRotation시에 새로 생기는 index 152~158
        "운", "논", "마", "우", "융", "야", "으",
        // 고급 cardRotation시에 새로 생기는 index 159~164
        "논", "곤", "마", "곰", "야", "으",
        //동화 index 165~209
        '가', '거', '고', '공', '구', '국', '기', '나', '대', '도',
        '동', '리', '마', '무', '물', '미', '방', '보', '부', '비',
        '사', '상', '생', '성', '소', '수', '시', '식', '신', '아',
        '안', '어', '왕', '의', '이', '인', '일', '자', '장', '전',
        '정', '제', '주', '지', '하',
        // 동화 rotation 210 ~
        "롬" , "므", "우", "오", "으"
        ];
      
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

        // 자신이 낸 카드를 되돌려받는 button
        const returnButton = scene.add.sprite(1815, 640, "returnButton(N)")
        .setInteractive()
        .setDepth(1)
        .setScale(0.35)
        .on("pointerup",() => {
            if(scene.myTurn && scene.dropped) {
                sharedData.socket.emit("returnCard", {roomKey:sharedData.roomKey, id:sharedData.socket.id});
            }
        })
        .on('pointerover', () => {
            returnButton.setTexture("returnButton(Y)");
        })
        .on("pointerout", ()=> {
            returnButton.setTexture("returnButton(N)");
        })
        .on("pointerdown",() => {
            returnButton.setTint(0xAAAAAA);
            returnButton.x += 2;
            returnButton.y += 2;
        })
        .on("pointerup",() => {
            returnButton.clearTint();
            returnButton.x -= 2;
            returnButton.y -= 2;
        });

        scene.finishButtonclick = 0
      
        // 자신의 turn을 끝내는 button
        const finishButton = scene.add.sprite(1815, 750, "finishButton")
        .setInteractive()
        .setScale(0.35)
        .setDepth(1)
        .on("pointerover",() => {
            finishButton.setTexture("finishButton_cur");
        })
        .on("pointerout",() => {
            finishButton.setTexture("finishButton");
        })
        .on("pointerup",() => {
            finishButton.clearTint();
            finishButton.x -= 2;
            finishButton.y -= 2;
            scene.sortWord();
            console.log(scene.alphaCards,scene.SubmitWord())
            if (scene.myTurn && scene.dropped && scene.alphaCards.length>1 && scene.SubmitWord() && scene.finishButtonclick == 0) {
                scene.finishButtonclick = 1;
                sharedData.socket.emit("launchVerifiScene",{roomKey:sharedData.roomKey, id:sharedData.socket.id, word:scene.word});
            };
        })
        .on("pointerdown",() => {
            scene.buttonClicksound.play();
            finishButton.setTint(0xAAAAAA);
            finishButton.x += 2;
            finishButton.y += 2;
        });
      
        // 게임 배경, 로고, 보드, 마지막 단어 바, 마지막 단어
        scene.background = scene.add.sprite(game.config.width / 2, game.config.height / 2, "background");
        scene.logo = scene.add.sprite(200, 120, "logo");
        scene.boardImage = scene.add.sprite(1050, 505, "board").setScale(1.02);
        
        // card를 drop하는 위치에 생기는 preview
        scene.cardPreview = scene.add.sprite(0, 0, "뒷면");
        scene.cardPreview.visible = false;
        scene.cardPreview.alpha = 0.75;
        scene.cardPreview.displayWidth = gameOptions.cardWidth * gameOptions.blankSizeRatio;
        scene.cardPreview.displayHeight = gameOptions.cardHeight * gameOptions.blankSizeRatio;
        scene.cardPreview.setDepth(3);
      
        scene.countArrange = 0;
        // handGroup에 있는 카드 목록을 왼쪽, 오른쪽으로 이동시키는 버튼
        scene.rightArrange = scene.add.sprite(1800, 980, "rightArrange").setInteractive().on("pointerup",() => {
            scene.cardClicksound.play();
            if (scene.handGroup.countActive() - gameOptions.handCardMax > scene.countArrange) {
                scene.handGroup.children.iterate(function(card) {
                    card.x -= gameOptions.betweenCrad;
                    if (card.x >= gameOptions.firstCardX + gameOptions.betweenCrad * gameOptions.handCardMax || card.x < gameOptions.firstCardX) card.visible = false;
                    else card.visible = true;
                });
                scene.countArrange++;
            }
        });
        scene.leftArrange = scene.add.sprite(450, 980, "leftArrange").setInteractive().on("pointerup",() => {
            scene.cardClicksound.play();
            if (scene.countArrange > 0) {
                scene.handGroup.children.iterate(function(card) {
                    card.x += gameOptions.betweenCrad;
                    if (card.x >= gameOptions.firstCardX + gameOptions.betweenCrad * gameOptions.handCardMax || card.x < gameOptions.firstCardX) card.visible = false;
                    else card.visible = true;
                });
                scene.countArrange--;
            }
        });

        // timer font
        let timeStyle = {font: "50px BR-R", fill: "black"};
        //make a text field
        scene.timeText = scene.add.text(1810, 100, "30", timeStyle);
        // center the text
        scene.timeText.setOrigin(0.5, 0.5);

        sharedData.socket.on("timeDecrease", (now_time) => {
            scene.timeText.setText(now_time);
        });

        // sound
        const soundImage = scene.add.image(1850, 240, 'unmute')
        .setOrigin(1, 1)
        .setDepth(10)
        .setInteractive()
        .setScale(0.13)
        .on("pointerup", () => {
            if (soundImage.texture.key === "unmute") {
                scene.gamebgm.pause();
                soundImage.setTexture("mute");
            } else if (soundImage.texture.key === "mute") {
                scene.gamebgm.resume();
                soundImage.setTexture("unmute");
            }
        });

        scene.deckclick = 0
      
        // 게임 시작 시 deck을 생성한다
        let deck = scene.add.sprite(1810, 490, "deck").setInteractive().on("pointerup",() => {
            // 자신의 turn이며 아직 card를 drop하지 않았을 때 작동한다
            if(scene.myTurn && scene.deckclick == 0) {
                scene.deckclick = 1;
                scene.cardClicksound.play();
                // deck을 click하면 card를 1장 생성한다
                sharedData.socket.emit("pickcard", {roomKey:sharedData.roomKey, type:"end"});
            }
        });
        deck.setDepth(1);
      
        scene.inputElement = scene.add.dom(30, 225).createFromCache("playerlistform");
        const player_list = scene.inputElement.getChildByID("player_list");
      
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
            card.i = blank.i;
            card.j = blank.j;
            console.log("valid", scene.validLocation(card.i, card.j, "drop"));
            if (scene.myTurn && scene.validLocation(card.i, card.j, "drop")) {
                scene.cardDropsound.play();
                // If scene is the first card drop, initialize some letiables and emit an event to other players
                if (!scene.dropped) {
                    scene.dropped = true;
                    scene.dropCards = [];
                    sharedData.socket.emit("firstDrop", sharedData.roomKey);
                }
                sharedData.socket.emit("cardDrop", {roomKey:sharedData.roomKey, cardval:card.value, i:card.i, j:card.j});
                sharedData.socket.emit("currentCardUpdate", {roomKey:sharedData.roomKey, id:sharedData.socket.id, number:scene.handGroup.countActive()});
                scene.cardPreview.visible = false;
                card.destroy();
            } else {
                // If it's not the player's turn, move the card back to their hand
                if (!scene.handGroup.contains(card) && !scene.boardGroup.contains(card)) {
                    scene.handGroup.add(card);
                    scene.arrangeCardsInHand();
                }
            }
        });
      
        sharedData.socket.emit("ready", sharedData.roomKey);

        sharedData.socket.on("launchVerifiScene", (data) => {
            scene.scene.launch("VerificationScene", {turnPlayer: data.id, word:data.word, played:scene.players[sharedData.socket.id].played});
        })

        sharedData.socket.on("returnCard", (id) => {
            let dropcardvals = [];
            scene.direction = "row";
            for(let i = 0; i < scene.dropCards.length; i++) {
                // board를 update한다
                scene.board[scene.dropCards[i].j][scene.dropCards[i].i].posval = -1;
                scene.board[scene.dropCards[i].j][scene.dropCards[i].i].cardval = -1;
                // 내턴일때
                dropcardvals.push(scene.dropCards[i].value);
                if(id === sharedData.socket.id) {
                    let coordinates = this.setHandCoordinates(this.handGroup.countActive());
                    scene.tweens.add({
                        targets: scene.dropCards[i],
                        x: coordinates.x,
                        y: coordinates.y,
                        duration: 300,
                        onComplete: function (tween, targets, dropcard) { // 애니메이션이 끝난 후 오브젝트를 삭제함
                            dropcard.destroy();
                        },
                        onCompleteParams: [scene.dropCards[i]]
                    });
                } else {
                    scene.tweens.add({
                        targets: scene.dropCards[i],
                        displayHeight:0,
                        displayWidth: 0,
                        duration: 300,
                        onComplete: function (tween, targets, dropcard) { // 애니메이션이 끝난 후 오브젝트를 삭제함
                            dropcard.destroy();
                        },
                        onCompleteParams: [scene.dropCards[i]]
                    });
                }
            }
            if (id === sharedData.socket.id) {
                for (let i=0; i<scene.dropCards.length;i++){
                    scene.createCard(dropcardvals[i]);
                }
            }
            for (let i = 0; i < scene.alphaCards.length; i++) {
                scene.alphaCards[i].alpha = 1;
                scene.alphaCards[i].canclick = true;
            }
            scene.alphaCards = [];
            scene.graphicGroup.clear(true);
            scene.arrangeCardsInHand();
            scene.dropCards = [];
        });
      
        sharedData.socket.on("pickcard", (data) => {
            scene.cardPreview.x = 1810;
            scene.cardPreview.y = 490;
            scene.cardPreview.visible = true;
            scene.cardPreview.alpha = 1;
            let coordinates = this.setHandCoordinates(this.handGroup.countActive());
            if (coordinates.x > gameOptions.firstCardX + gameOptions.betweenCrad * gameOptions.handCardMax){
                coordinates.x = gameOptions.firstCardX + gameOptions.betweenCrad *  (gameOptions.handCardMax-1);
            }
            scene.tweens.add({
                targets: scene.cardPreview,
                x: coordinates.x,
                y: coordinates.y,
                duration: 500, // 0.5초 동안 애니메이션을 실행함
                onComplete: function (tween, targets, card) { // 애니메이션이 끝난 후 오브젝트를 삭제함
                    card.visible = false;
                    card.alpha = 0.75;
                    scene.createCard(data.cardval);
                    scene.arrangeCardsInHand();
                    sharedData.socket.emit("currentCardUpdate", {roomKey:sharedData.roomKey, id:sharedData.socket.id, number:scene.handGroup.countActive()});
                    if(data.type === "end") {
                        // turn을 종료한다
                        sharedData.socket.emit("turnEnd", {roomKey:sharedData.roomKey, id:sharedData.socket.id, type:"deck"});
                    } else if(data.type === "verification") {
                        sharedData.socket.emit("turnEnd", {roomKey:sharedData.roomKey, id:sharedData.socket.id, type:"finish"})
                    }
                },
                onCompleteParams: [scene.cardPreview]
            });
        });
      
        //게임 시작 후 첫 카드를 받는다
        sharedData.socket.on("firstcard", (cardvals) => {
            for(let i = 0; i < cardvals.length; i ++) {
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
                        scene.createCard(cardvals[i]);
                    },
                    onCompleteParams: [scene.cardPreview]
                });
            }
            scene.arrangeCardsInHand();
            scene.gamebgm.play();
        });
      
        // turn이 시작될때 자신의 turn인지 확인한다
        sharedData.socket.on("nextTurn", () => {
            scene.myturnsound.play();
            scene.myTurn = true;
            scene.dropped = false;
            console.log("My Turn! " + scene.myTurn);

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
        });
      
        // 2명 이상 접속하면 board 중앙에 카드를 생성한다
        sharedData.socket.on("centerCard", (value) => {
            console.log("center card set!");
            let card = scene.add.sprite(gameOptions.firstBlankX + gameOptions.betweenBlank * 8, gameOptions.firstBlankY + gameOptions.betweenBlank * 5, scene.deckArray[value]).setDepth(3).setInteractive().on("pointerdown",() => {
                if(scene.myTurn && card.canclick &&scene.validLocation(card.i, card.j, "click")) {
                    console.log(card.value);
                    sharedData.socket.emit("addalphacards", {roomKey:sharedData.roomKey, val:card.value, i:card.i, j:card.j});
                }
            });
            card.displayWidth = gameOptions.cardWidth * gameOptions.blankSizeRatio;
            card.displayHeight = gameOptions.cardHeight * gameOptions.blankSizeRatio;
            card.value = value;
            card.i = 8;
            card.j = 5;
            card.canclick = true;
            scene.boardGroup.add(card);
            // board를 update한다
            scene.board[card.j][card.i].posval = 3;
            scene.board[card.j][card.i].cardval = value; 
        });
      
        // turn이 부여된 후 1번째 card를 drop하면 objection을 비활성화하고 배열을 초기화한다
        sharedData.socket.on("firstDrop", () => {
            scene.cardDropsound.play();
            scene.dropped = true;
            scene.dropCards = [];
        });
      
        // 다른 유저가 card를 drop하면 자신의 board에 반영한다
        sharedData.socket.on("cardDrop", (cardData) => {
            scene.cardDropsound.play();
            let card = scene.add.sprite(gameOptions.firstBlankX + gameOptions.betweenBlank * cardData.i, gameOptions.firstBlankY + gameOptions.betweenBlank * cardData.j, scene.deckArray[cardData.cardval])
            .setDepth(3)
            .setInteractive()
            .on("pointerdown",() => {
                if(scene.myTurn && card.canclick && scene.validLocation(card.i, card.j, "click")) {
                    console.log(card.value);
                    sharedData.socket.emit("addalphacards", {roomKey:sharedData.roomKey, val:card.value, i:card.i, j:card.j});
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
                    if (scene.myTurn) {
                        sharedData.socket.emit("addalphacards", {roomKey:sharedData.roomKey, cardval:card.value, i:card.i, j:card.j});
                    }
                }
            });
            // 다른 유저가 drop한 card들을 배열에 저장한다
            scene.dropCards.push(card);
            // board를 update한다
            scene.board[cardData.j][cardData.i].posval = 1;
            scene.board[cardData.j][cardData.i].cardval = cardData.cardval;
        });

        sharedData.socket.on("addalphacards", (cardData) => {
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
                        console.log("direction col",scene.alphaCards[0].i, cardData.i)
                        if(scene.alphaCards[0].i === cardData.i) scene.direction = "column";
                    }
                },
                onCompleteParams: [card]
            });   
        })
      
        // 다른 유저의 turn이 끝나면 objection을 활성화한다
        sharedData.socket.on("turnEnd", (data) => {
            if (data.type === "finish") {}
            else if (data.type === "deck") {
                if (scene.dropped) {
                    // drop한 card를 모두 제거한다
                    let dropcardvals = []
                    for(let i = 0; i<scene.dropCards.length; i++) {
                        // board를 update한다
                        scene.board[scene.dropCards[i].j][scene.dropCards[i].i].posval = -1;
                        scene.board[scene.dropCards[i].j][scene.dropCards[i].i].cardval = -1;
                        // 만약 자신이 마지막 유저라면 제거한 card를 모두 hand로 가져온 후 추가로 card를 1장 생성한다
                        dropcardvals.push(scene.dropCards[i].value);
                        scene.dropCards[i].destroy();
                    }
                    if (data.id === sharedData.socket.id) {
                        for (let i=0; i<scene.dropCards.length;i++){
                            scene.createCard(dropcardvals[i]);
                        }
                    }
                    scene.arrangeCardsInHand();
                    scene.dropCards = [];
                }
            }
            else if (data.type === "time") {
                if (scene.dropped) {
                    let dropcardvals = []
                    for(let i = 0; i<scene.dropCards.length; i++) {
                        // board를 update한다
                        scene.board[scene.dropCards[i].j][scene.dropCards[i].i].posval = -1;
                        scene.board[scene.dropCards[i].j][scene.dropCards[i].i].cardval = -1;
                        // 만약 자신이 마지막 유저라면 제거한 card를 모두 hand로 가져온 후 추가로 card를 1장 생성한다
                        dropcardvals.push(scene.dropCards[i].value);
                        scene.dropCards[i].destroy();
                    }
                    if (data.id === sharedData.socket.id) {
                        for (let i=0; i<scene.dropCards.length;i++){
                            scene.createCard(dropcardvals[i]);
                        }
                    }
                    scene.arrangeCardsInHand();
                    scene.dropCards = [];
                }
                if(scene.myTurn) {
                    // card를 1장 생성한다
                    sharedData.socket.emit("pickcard", {roomKey:sharedData.roomKey, type:"time"});
                }
            }
            else if (data.type === "disconnection") {
                if (scene.dropped) {
                    for(let i = 0; i<scene.dropCards.length; i++) {
                        // board를 update한다
                        scene.board[scene.dropCards[i].j][scene.dropCards[i].i].posval = -1;
                        scene.board[scene.dropCards[i].j][scene.dropCards[i].i].cardval = -1;
                        scene.dropCards[i].destroy();
                    }
                    scene.dropCards = [];
                }
            }

            for(let j=0; j<gameOptions.boardyrange; j++) {
                for (let i=0; i<gameOptions.boardxrange; i++){
                    if (scene.board[j][i].posval === 1 || scene.board[j][i].posval === 2)
                        scene.board[j][i].posval += 1;
                }
            }
            for (let i = 0; i < scene.alphaCards.length; i++) {
                scene.alphaCards[i].alpha = 1;
                scene.alphaCards[i].canclick = true;
            }
            scene.alphaCards = [];
            scene.graphicGroup.clear(true);
            if (data.id === sharedData.socket.id) {
                sharedData.socket.emit("nextTurn", sharedData.roomKey);
            }
            scene.myTurn = false;
            scene.dropped = false;
            scene.deckclick = 0;
            scene.finishButtonclick = 0;
        });
      
        sharedData.socket.on("verificationresult", (data) => {
            if(data.result === "true") { //verificationTrue
                scene.verificationTruesound.play();
                // 자신이 이의신청한 유저라면 카드를 1장 생성한다
                if (data.id === sharedData.socket.id) {
                    sharedData.socket.emit("pickcard", {roomKey:sharedData.roomKey, type:"verification"});
                }
            } else if(data.result === "false"){ // verificationFalse
                scene.verificationFalsesound.play();
                let dropcardvals = []
                for(let i = 0; i<scene.dropCards.length; i++) {
                    // board를 update한다
                    scene.board[scene.dropCards[i].j][scene.dropCards[i].i].posval = -1;
                    scene.board[scene.dropCards[i].j][scene.dropCards[i].i].cardval = -1;
                    // 만약 자신이 마지막 유저라면 제거한 card를 모두 hand로 가져온 후 추가로 card를 1장 생성한다
                    dropcardvals.push(scene.dropCards[i].value);
                    if (data.id === sharedData.socket.id) {
                        let coordinates = this.setHandCoordinates(this.handGroup.countActive());
                        scene.tweens.add({
                            targets: scene.dropCards[i],
                            x: coordinates.x,
                            y: coordinates.y,
                            duration: 300,
                            onComplete: function (tween, targets, dropcard) { // 애니메이션이 끝난 후 오브젝트를 삭제함
                                dropcard.destroy();
                            },
                            onCompleteParams: [scene.dropCards[i]]
                        });
                    } else {
                        scene.tweens.add({
                            targets: scene.dropCards[i],
                            displayWidth: 0,
                            displayHeight: 0,
                            duration: 300,
                            onComplete: function (tween, targets, dropcard) { // 애니메이션이 끝난 후 오브젝트를 삭제함
                                dropcard.destroy();
                            },
                            onCompleteParams: [scene.dropCards[i]]
                        });
                    } 
                }
                if (data.id === sharedData.socket.id) {
                    for (let i=0; i<scene.dropCards.length;i++){
                        scene.createCard(dropcardvals[i]);
                    }
                    sharedData.socket.emit("pickcard", {roomKey:sharedData.roomKey, type:"verification"});
                }
                scene.dropCards = [];
            }
        })
      
        function updatePlayerList(players) {
            while (player_list.firstChild) {
              player_list.removeChild(player_list.firstChild);
            }
            scene.players = players;

            Object.keys(scene.players).forEach((playerkey) => {
                if(scene.players[playerkey].myturn) {
                    const playerbox = document.createElement("div");
                    playerbox.setAttribute("class", "myturnbox");
                    const textinbox = document.createElement("p");
                    textinbox.setAttribute("class", "game_nickname");
                    const playerNick = document.createTextNode(scene.players[playerkey].playerNickname);
                    const announce_card_text = document.createTextNode("남아있는 카드수");
                    const num_card = document.createTextNode(scene.players[playerkey].card);
                    const lineBreak1 = document.createElement("br");
                    const lineBreak2 = document.createElement("br");
                    textinbox.appendChild(playerNick);
                    textinbox.appendChild(lineBreak1); // 새로운 줄에 추가
                    textinbox.appendChild(announce_card_text)
                    textinbox.appendChild(lineBreak2); // 새로운 줄에 추가
                    textinbox.appendChild(num_card)
                    playerbox.appendChild(textinbox);
                    player_list.appendChild(playerbox);
                } else {
                    const playerbox = document.createElement("div");
                    playerbox.setAttribute("class", "playerbox");
                    const textinbox = document.createElement("p");
                    textinbox.setAttribute("class", "game_nickname");
                    const playerNick = document.createTextNode(scene.players[playerkey].playerNickname);
                    const announce_card_text = document.createTextNode("남아있는 카드수");
                    const num_card = document.createTextNode(scene.players[playerkey].card);
                    const lineBreak1 = document.createElement("br");
                    const lineBreak2 = document.createElement("br");
                    textinbox.appendChild(playerNick);
                    textinbox.appendChild(lineBreak1); // 새로운 줄에 추가
                    textinbox.appendChild(announce_card_text)
                    textinbox.appendChild(lineBreak2); // 새로운 줄에 추가
                    textinbox.appendChild(num_card)
                    playerbox.appendChild(textinbox);
                    player_list.appendChild(playerbox);
                }
                
            });
        }
          
        sharedData.socket.on("currentPlayers", updatePlayerList);
        sharedData.socket.on("disconnected", updatePlayerList);
        sharedData.socket.on("currentCardUpdate",updatePlayerList);
      
        sharedData.socket.on("gameEnd", (data) => {
            scene.gamebgm.stop();
            scene.scene.stop("GameScene");
            scene.scene.start("GameEndScene", {playerRank:data.playerRank});
        });
    }
    update() {}
 
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
        // 금, 믄
        if(card.value === 5) {
            card.value = 147;
            card.angle += 180;
        }
        else if(card.value === 147) {
            card.value = 5;
            card.angle += 180;
        }
        // 마 무
        else if(card.value === 16) {
            card.value = 148;
            card.angle += 90;
        }
        else if(card.value === 148) {
            card.value = 16;
            card.angle += 270;
        }
        // 아 우
        else if(card.value === 28) {
            card.value = 33;
            card.angle += 90;
        }
        else if(card.value === 33) {
            card.value = 28;
            card.angle += 270;
        }
        // 어 오
        else if(card.value === 30) {
            card.value = 31;
            card.angle += 90;
        }
        else if(card.value === 31) {
            card.value = 30;
            card.angle += 270;
        }
        // 요 여
        else if(card.value === 32) {
            card.value = 149;
            card.angle += 270;
        }
        else if(card.value === 149) {
            card.value = 32;
            card.angle += 90;
        }
        // 음 믕
        else if(card.value === 34) {
            card.value = 150;
            card.angle += 180;
        }
        else if(card.value === 150) {
            card.value = 34;
            card.angle += 180;
        }
        // 이 으
        else if(card.value === 35) {
            card.value = 151;
            card.angle += 90;
        }
        else if(card.value === 151) {
            card.value = 35;
            card.angle += 270;
        }
        // 공 운
        else if(card.value === 52) {
            card.value = 152;
            card.angle += 180;
        }
        else if(card.value === 152) {
            card.value = 52;
            card.angle += 180;
        }
        // 국 논
        else if(card.value === 55) {
            card.value = 153;
            card.angle += 180;
        }
        else if(card.value === 153) {
            card.value = 55;
            card.angle += 180;
        }
        // 무 마
        else if(card.value === 63) {
            card.value = 154;
            card.angle += 270;
        }
        else if(card.value === 154) {
            card.value = 63;
            card.angle += 90;
        }
        // 아 우
        else if(card.value === 78) {
            card.value = 155;
            card.angle += 90;
        }
        else if(card.value === 155) {
            card.value = 78;
            card.angle += 270;
        }
        // 용 융
        else if(card.value === 80) {
            card.value = 156;
            card.angle += 180;
        }
        else if(card.value === 156) {
            card.value = 80;
            card.angle += 180;
        }
        // 유 야
        else if(card.value === 83) {
            card.value = 157;
            card.angle += 270;
        }
        else if(card.value === 157) {
            card.value = 83;
            card.angle += 90;
        }
        // 이 으
        else if(card.value === 85) {
            card.value = 158;
            card.angle += 90;
        }
        else if(card.value === 158) {
            card.value = 85;
            card.angle += 270;
        }
        // 국 논
        else if(card.value === 104) {
            card.value = 159;
            card.angle += 180;
        }
        else if(card.value === 159) {
            card.value = 104;
            card.angle += 180;
        }
        // 군 곤
        else if(card.value === 105) {
            card.value = 160;
            card.angle += 180;
        }
        else if(card.value === 160) {
            card.value = 105;
            card.angle += 180;
        }
        // 무 마
        else if(card.value === 112) {
            card.value = 161;
            card.angle += 270;
        }
        else if(card.value === 161) {
            card.value = 112;
            card.angle += 90;
        }
        // 문 곰
        else if(card.value === 113) {
            card.value = 162;
            card.angle += 180;
        }
        else if(card.value === 162) {
            card.value = 113;
            card.angle += 180;
        }
        // 유 야
        else if(card.value === 129) {
            card.value = 163;
            card.angle += 270;
        }
        else if(card.value === 163) {
            card.value = 129;
            card.angle += 90;
        }
        // 이 으
        else if(card.value === 130) {
            card.value = 164;
            card.angle += 90;
        }
        else if(card.value === 164) {
            card.value = 130;
            card.angle += 270;
        }
        else if(card.value === 177) {
            card.value = 178;
            card.angle += 90;
        }
        else if(card.value === 178) {
            card.value = 177;
            card.angle -= 90;
        }
        else if(card.value === 179) {
            card.value = 210;
            card.angle += 180;
        }
        else if(card.value === 210) {
            card.value = 179;
            card.angle -= 180;
        }
        else if(card.value === 180) {
            card.value = 211;
            card.angle += 90;
        }
        else if(card.value === 211) {
            card.value = 180;
            card.angle -= 90;
        }
        else if(card.value === 194) {
            card.value = 212;
            card.angle += 90;
        }
        else if(card.value === 212) {
            card.value = 194;
            card.angle -= 90;
        }
        else if(card.value === 196) {
            card.value = 213;
            card.angle += 90;
        }
        else if(card.value = 213) {
            card.value = 196;
            card.angle -= 90;
        }
        else if(card.value = 199) {
            card.value = 214;
            card.angle += 90;
        }
        else if(card.value = 214) {
            card.value = 199;
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