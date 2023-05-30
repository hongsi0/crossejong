const https = require('https');
const axios = require('axios');
const convert = require('xml-js');
const { error } = require('console');

const gameRooms = {
  // [roomKey]: {
    // players: {
    //   [playerid]: {playerId: , playerNickname:, played:, card:, myturn:false, playerProfile:,}
    // },
    // startingPlayers: [],
    // numPlayers: 0,
    // playing: false,
    // turnCount: 0,
    // currentTurn: "",
    // deck: [0,1,2 ... 47],
    // difficulty:,
    // time: 30,
    // timeState: "", // "InGame", "Verificate", "Result"
    // playerRank: [ {key:, nickname:, profile:,} ],
    // password:,
    // locked:,
  // }
};

function shuffledeck(difficulty) {
  let deck = []
  if (difficulty === "초급") {
    for (let i=0;i<49;i++){
      deck.push(i);
    }
  }
  else if (difficulty === "중급") {
    for (let i=49;i<98;i++){
      deck.push(i);
    }
  }
  else if (difficulty === "고급") {
    for (let i=98;i<147;i++){
      deck.push(i);
    }
  }
  else if (difficulty === "동화") {
    for (let i=165;i<210;i++){
      deck.push(i)
    }
  }
  deck.sort(() => Math.random() - 0.5);
  return deck;
}

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log(
      `A socket connection to the server has been made: ${socket.id}`
    );

    socket.on("nicknamecheck", (nickname) => {
      // 연결된 소켓들을 가져옵니다.
      const connectedSockets = io.sockets.sockets;
      let check = "False";

      connectedSockets.forEach((user) => {
        if (user['nickname'] && user['nickname'] == nickname){
          check = "True";
        }
      });

      io.to(socket.id).emit("nicknamecheck", (check));
    });

    socket.on("userinfo", (data) => {
      socket['nickname'] = data.nickname;
      socket['profile'] = data.profile;
    });

    socket.on("resetprofile", () => {
      socket['nickname'] = "";
      socket['profile'] = "";
    });

    socket.on("createRoom", (roomKey) => {
      console.log("createRoom");
      const gamestate = {};
      const playerlist = {};
      playerlist[socket.id] = {
        playerId: socket.id,
        playerNickname: socket.nickname,
        played: false,
        myturn: false,
        playerProfile: socket.profile
      }
      gamestate.numPlayers = 1;
      gamestate['players'] = playerlist;
      gameRooms[roomKey] = gamestate;
      io.to(socket.id).emit("createRoomed", (roomKey));
    });

    socket.on("getRooms", () => {
      const roomlist = Object.keys(gameRooms);
      const rooms = roomlist.map(room => ({
        name: room,
        num: gameRooms[room].numPlayers,
        playing: gameRooms[room].playing,
        difficulty: gameRooms[room].difficulty,
        password: gameRooms[room].password,
        locked: gameRooms[room].locked,
      }));
      roomlist.forEach((gameRoom) => {
        console.log(gameRooms[gameRoom]);
      })
      console.log(rooms);
      socket.emit("rooms", (rooms));
    });

    socket.on("GameRoomready", (roomKey) => {
      const roomInfo = gameRooms[roomKey];
      
      // send the players object to the new player
      io.to(roomKey).emit("Playerupdate", roomInfo.players);
    });

    socket.on("chat", (msg,roomKey) => {
      console.log(msg,roomKey);
      const roomInfo = gameRooms[roomKey];
      io.to(roomKey).emit("chat", roomInfo.players[socket.id].playerNickname, msg);
    });

    socket.on("gamestart", (roomKey) => {
      const roomInfo = gameRooms[roomKey];
      roomInfo.playing = true;
      roomInfo.turnCount = 0;
      roomInfo.currentTurn = "";
      roomInfo.deck = shuffledeck(roomInfo.difficulty);
      roomInfo.time = 30;
      roomInfo.timeState = "InGame";
      const playerlist = Object.keys(roomInfo.players);
      roomInfo.startingPlayers = playerlist;
      roomInfo.playerRank = [];
      console.log("first turn: " + playerlist[0]);
      io.to(roomKey).emit("gamestart");
    });

    socket.on("ready", (roomKey) => {
      const roomInfo = gameRooms[roomKey];
      const playerlist = Object.keys(roomInfo.players);

      roomInfo.players[socket.id].played = true;
      let readynum = playerlist.filter(player => roomInfo.players[player].played).length;

      if(readynum === playerlist.length) {
          roomInfo.timeState = "InGame";
          roomInfo.currentTurn = playerlist[0];
          playerlist.forEach((player) => {
            let playercard = [];
            for (let i=0;i<6;i++){
              playercard.push(roomInfo.deck.pop())
            }
            if (player == playerlist[0]) roomInfo.players[player].myturn=true;
            else roomInfo.players[player].myturn=false;
            roomInfo.players[player].card = 6;
            io.to(player).emit("firstcard", playercard);
          });
          io.to(playerlist[0]).emit("nextTurn");
          io.to(roomKey).emit('centerCard', roomInfo.deck.pop());
          io.to(roomKey).emit('currentPlayers', roomInfo.players);
          roomInfo.time = 30;
          console.log("ready");
          console.log(roomInfo.players);
        }
    });

    socket.on("returnCard", (data) => {
      const roomInfo = gameRooms[data.roomKey];
      io.to(data.roomKey).emit("returnCard", data.id)
    })

    socket.on("launchVerifiScene", (data) => {
      const roomInfo = gameRooms[data.roomKey];
      roomInfo.time = 5;
      roomInfo.timeState = "Verificate";
      io.to(data.roomKey).emit("launchVerifiScene", {id:data.id, word:data.word})
    })

    socket.on("pickcard", (data) => {
      console.log("pickcard");
      const roomInfo = gameRooms[data.roomKey];
      if (roomInfo.deck.length === 0) roomInfo.deck = shuffledeck(roomInfo.difficulty);
      io.to(socket.id).emit("pickcard", {cardval:roomInfo.deck.pop(), type:data.type});
    });

    socket.on('nextTurn', (roomKey) => {
      let roomInfo = gameRooms[roomKey];
      let playerlist = Object.keys(roomInfo.players); //방 전체 플레이어
      let playedplayers = []; //끝나지 않은 플레이어
      playerlist.forEach((player) => {
        if(roomInfo.players[player].played) {
          playedplayers.push(player);
        }
      });
      if(playedplayers.length === 1){ //끝나지 않은 플레이어가 1명일 때
        roomInfo.playerRank.push({
          key: playedplayers[0],
          nickname: roomInfo.players[playedplayers[0]].playerNickname,
          profile: roomInfo.players[playedplayers[0]].playerProfile
        });
        io.to(roomKey).emit("gameEnd", {playerRank:roomInfo.playerRank});
        roomInfo.timeState = "Result";
        roomInfo.time = 10;
      } else{ //끝나지 않은 플레이어가 2명 이상일 때
        while(true) {
          roomInfo.turnCount++;
          let nextIndex = roomInfo.turnCount % roomInfo.startingPlayers.length
          if(playedplayers.includes(roomInfo.startingPlayers[nextIndex])) {
            roomInfo.currentTurn = roomInfo.startingPlayers[nextIndex];
            playerlist.forEach((player) => {
              if (player == roomInfo.currentTurn) roomInfo.players[player].myturn=true;
              else roomInfo.players[player].myturn=false;
            });
            io.to(roomInfo.currentTurn).emit('nextTurn');
            io.to(roomKey).emit('currentPlayers', roomInfo.players);
            break;
          }
        }
      }
    });

    socket.on('cardDrop', (data) => {
      io.to(data.roomKey).emit('cardDrop', {cardval:data.cardval, i:data.i, j:data.j});
    });

    socket.on("addalphacards", (data) => {
      io.to(data.roomKey).emit("addalphacards", {cardval:data.cardval, i:data.i, j:data.j})
    });

    socket.on('turnEnd', (data) => {
      const roomInfo = gameRooms[data.roomKey];
      if (roomInfo.players[roomInfo.currentTurn].card === 0) {
        const isPlayerKeyExist = (key) => roomInfo.playerRank.some(player => player.key === key);
        if (!isPlayerKeyExist(roomInfo.currentTurn)) {
          roomInfo.playerRank.push({
              key: roomInfo.currentTurn,
              nickname: roomInfo.players[roomInfo.currentTurn].playerNickname,
              profile: roomInfo.players[roomInfo.currentTurn].playerProfile
          });
        }
        roomInfo.players[roomInfo.currentTurn].played = false;
      }
      roomInfo.time = 30;
      io.to(data.roomKey).emit('turnEnd', {id:data.id, type:data.type});
    });

    socket.on('firstDrop', (roomKey) => {
      socket.broadcast.to(roomKey).emit('firstDrop');
    });

    socket.on("verificationresult", (data) => {
      const roomInfo = gameRooms[data.roomKey];
      io.to(data.roomKey).emit("verificationresult",{result:data.result, id:data.id});
    })

    socket.on('currentCardUpdate', (data) => {
      const roomInfo = gameRooms[data.roomKey];
      roomInfo.players[data.id].card = data.number
      io.to(data.roomKey).emit('currentCardUpdate', roomInfo.players);
    });

    function handleObjection(val, retryCount = 0) {

      const maxRetryCount = 3; 
      const retryDelay = 1000;
      
      const roomInfo = gameRooms[val.roomKey];
      roomInfo.time = 5;
      const url = `https://krdict.korean.go.kr/api/search?certkey_no=4549&key=487E5EEAB2BE2EB3932C7B599847D5DC&type_search=search&part=word&q=${val.word}&sort=dict&advanced=y&method=exact`;
      const options = {
          method: "get",
          httpsAgent: new https.Agent({
              rejectUnauthorized: false, //허가되지 않은 인증을 reject하지 않겠다
          }),
      };
      axios(url, options)
      .then((res) => {
          const result = res.data;
          const strJson = convert.xml2json(result, {compact:true,spaces:4});

          const objJson = JSON.parse(strJson);
          const total = objJson.channel.total._text;

          let word = null;
          let pos = null;
          let def = null;

          let objItem = null;

          if (total === '1') {
              objItem = objJson.channel.item;
          }
          else if (total !== '0'){
              objItem = objJson.channel.item[0];
          }
          if (total !== '0'){
              word = objItem.word._text;
              pos = objItem.pos._text;

              if(objItem.sense.length === undefined){
                  def = objItem.sense.definition._text;
              }
              else{
                  def = objItem.sense[0].definition._text;
              }
          }
          // 존재하지 않는 단어일 때
          if(def === null){
              console.log("존재하지 않는 단어입니다.");
              io.to(val.roomKey).emit('verificationFalse', {id:roomInfo.currentTurn, nick:roomInfo.players[roomInfo.currentTurn].playerNickname});
          }
          // 존재하는 단어일 때
          else {
              console.log(word, pos, def);
              io.to(val.roomKey).emit('verificationTrue', {id:val.id, nick:roomInfo.players[val.id].playerNickname, word:word, pos:pos, def:def});
          }
      })
      .catch((error) => {
        console.log(error);
        if (retryCount < maxRetryCount) {
          console.log(`Retrying... (${retryCount + 1}/${maxRetryCount})`);
          setTimeout(() => handleObjection(val, retryCount + 1), retryDelay);
        } else {
          console.log('Failed after several retries.');
        }
      });
    };

    socket.on('objection', (val) => {
      handleObjection(val);
    });

    socket.on("translate", (val) => {
      const apiKey = 'Pg8G1ze6ON3tNt2Thhg4'; // 발급받은 파파고 API 키
      const clientSecret = 'F775HUSNfs'; // 발급받은 파파고 client secret
      const sourceLang = 'ko'; // 원본 언어
      const targetLang = 'en'; // 번역할 언어
      const textToTranslate = val.text; // 번역할 텍스트

      const translationEndpoint = 'https://openapi.naver.com/v1/papago/n2mt';
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'X-Naver-Client-Id': apiKey,
          'X-Naver-Client-Secret': clientSecret,
        },
        body: `source=${sourceLang}&target=${targetLang}&text=${encodeURIComponent(textToTranslate)}`,
      };

      fetch(translationEndpoint, requestOptions)
        .then(response => response.json())
        .then(data => {
          const translatedText = data.message.result.translatedText;
          console.log("translatedText", translatedText);
          io.to(val.id).emit("translateresult", {origin:val.text, trans:translatedText});
        })
        .catch(error => {
          console.error('Translation error:', error);
        });
    });

    socket.on("outRoom", (roomKey) => {
      console.log("out");
      const roomInfo = gameRooms[roomKey];

      if (roomInfo) {
        console.log("user out: ", socket.id);
        // remove this player from our players object
        delete roomInfo.players[socket.id];
        // update numPlayers
        roomInfo.numPlayers = Object.keys(roomInfo.players).length;
        
        if(roomInfo.numPlayers === 0) {//no people in room
          delete gameRooms[roomKey];
        } else {
          // emit a message to all players to remove this player
          io.to(roomKey).emit("Playerupdate", roomInfo.players);
        }
      }
    });

    socket.on("makeroom", (roomvalue) => {
      socket.join(roomvalue.roomKey);
      const roomInfo = gameRooms[roomvalue.roomKey];
      roomInfo.players[socket.id] = {
        playerId: socket.id,
        playerNickname: socket.nickname,
        playerProfile: socket.profile
      };
      roomInfo.difficulty = roomvalue.difficulty;
      roomInfo.password = roomvalue.password;
      roomInfo.locked = roomvalue.password === "" ? false : true;

      // update number of players
      roomInfo.numPlayers = Object.keys(roomInfo.players).length;
      roomInfo.playing = false;

      io.to(socket.id).emit("makeroom");
      console.log("makeroom");
      console.log("roomInfo", roomInfo);
    });

    socket.on("joinRoom", (roomKey) => {
      socket.join(roomKey);
      const roomInfo = gameRooms[roomKey];
      console.log("joinroom");
      console.log("roomInfo", roomInfo);
      roomInfo.players[socket.id] = {
        playerId: socket.id,
        playerNickname: socket.nickname,
        playerProfile: socket.profile
      };

      // update number of players
      roomInfo.numPlayers = Object.keys(roomInfo.players).length;
      roomInfo.playing = false;
    });

    // when a player disconnects, remove them from our players object
    socket.on("disconnect", () => {
      //find which room they belong to
      let roomKey = 0;
      for (let keys1 in gameRooms) {
        for (let keys2 in gameRooms[keys1]) {
          Object.keys(gameRooms[keys1][keys2]).map((el) => {
            if (el === socket.id) {
              roomKey = keys1;
            }
          });
        }
      }

      const roomInfo = gameRooms[roomKey];

      if (roomInfo) {
        console.log("user disconnected: ", socket.id);
        // remove this player from our players object
        delete roomInfo.players[socket.id];
        // update numPlayers
        roomInfo.numPlayers = Object.keys(roomInfo.players).length;
        let playerlist = Object.keys(roomInfo.players);
        
        if(roomInfo.numPlayers === 0) {//no people in room
          delete gameRooms[roomKey];
        } else {
          // emit a message to all players to remove this player
          io.to(roomKey).emit("disconnected", roomInfo.players);
          io.to(roomKey).emit("Playerupdate", roomInfo.players);
        }

        if (roomInfo.currentTurn === socket.id) {
          console.log("disconnected", roomInfo.players);
          io.to(roomKey).emit("turnEnd", {id: playerlist[0], type:"disconnection"});
        }
      }
    });

    socket.on("isKeyValid", function (input) {
      Object.keys(gameRooms).includes(input)
        ? io.to(socket.id).emit("keyIsValid", input)
        : io.to(socket.id).emit("keyNotValid", input);
    });

    socket.on("RoomKeyValid", function (input) {
      Object.keys(gameRooms).includes(input)
        ? io.to(socket.id).emit("RoomkeyIsValid", input)
        : io.to(socket.id).emit("RoomkeyNotValid", input);
    });

    socket.on('TutorialcardDrop', (data) => {
      console.log("TutorialcardDrop");
      io.to(socket.id).emit('TutorialcardDrop', {cardval:data.cardval, i:data.i, j:data.j});
    });

    socket.on("Tutorialaddalphacards", (data) => {
      io.to(socket.id).emit("Tutorialaddalphacards", {cardval:data.cardval, i:data.i, j:data.j})
    });

    socket.on("TutorialEnd", () => {
      io.to(socket.id).emit("TutorialEnd");
    });

  });
  // 시간을 1초에 -1씩 감소시키는 함수
  function decreaseTime(roomKey) {
    const roomInfo = gameRooms[roomKey];
    if(roomInfo.timeState === "InGame"){
      if (roomInfo.time > 0) {
        io.to(roomKey).emit("timeDecrease", roomInfo.time);
        roomInfo.time -= 1;
      } else {
          roomInfo.time = 30;
          console.log("time over",roomInfo.currentTurn);
          io.to(roomKey).emit("turnEnd", {id: roomInfo.currentTurn, type:"time"});
      }
    }
    else if(roomInfo.timeState === "Verificate"){
      if (roomInfo.time > 0) {
        io.to(roomKey).emit("verTimeDecrease", roomInfo.time);
        roomInfo.time -= 1;
      } else {
          roomInfo.time = 30;
          roomInfo.timeState = "InGame";
          console.log("No verification. Go back to playing.");
          io.to(roomKey).emit("verificationEnd", {id: roomInfo.currentTurn});
      }
    }
    else if(roomInfo.timeState === "Result") {
      if (roomInfo.time > 0) {
        roomInfo.time -= 1;
      } else {
          console.log("result time over. Go back to gameroom.");
          temp_roomInfo = {
            players: roomInfo.players,
            numPlayers: Object.keys(roomInfo.players).length,
            playing: false,
            startingPlayers: roomInfo.startingPlayers,
            timeState: "",
            difficulty: roomInfo.difficulty,
            password : roomInfo.password,
            locked : roomInfo.password === "" ? false : true,
          }
          gameRooms[roomKey] = temp_roomInfo;
          io.to(roomKey).emit("gameexit")
      }
    }
  }

  // 1초 간격으로 decreaseTime 함수를 호출하는 setInterval 함수
  setInterval(function() {
    for (const roomKey in gameRooms) {
      decreaseTime(roomKey);
    }
  }, 1000);
};
