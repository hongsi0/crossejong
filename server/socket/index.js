const https = require('https');
const axios = require('axios');
const convert = require('xml-js');

const gameRooms = {
  // [roomKey]: {
    // players: {
    //   [playerid]: {playerId: , playerNickname:, played:, card:}
    // },
    // numPlayers: 0,
    // playing: false,
    // turnCount: 0,
    // lastWord: "",
    // criticalSection: true,
    // lastTurn:  "",
    // currentTurn: 0,
    // deck: [0,1,2 ... 47],
    // difficulty:
  // }
};

function shuffledeck() {
  let deck = []
  for (let i=0;i<48;i++){
    deck.push(i);
  }
  deck.sort(() => Math.random() - 0.5);
  return deck;
}

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log(
      `A socket connection to the server has been made: ${socket.id}`
    );
    socket.on("nickname", (roomInfo) => {
      socket['nickname'] = roomInfo;
      console.log(socket.nickname);
      io.to(socket.id).emit("nickname", socket.nickname);
    });

    socket.on("createRoom", (roomKey) => {
      console.log("createRoom");
      const gamestate = {};
      const playerlist = {};
      playerlist[socket.id] = {
        playerId: socket.id,
        playerNickname: socket.nickname,
        played: false
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
      roomInfo.lastWord = "";
      roomInfo.criticalSection = true;
      roomInfo.lastTurn = "";
      roomInfo.currentTurn = 0;
      roomInfo.deck = shuffledeck();
      console.log(roomInfo.deck);
      const playerlist = Object.keys(roomInfo.players);
      console.log("first turn: " + playerlist[0]);
      io.to(roomKey).emit("gamestart");
    });

    socket.on("ready", (roomKey) => {
      const roomInfo = gameRooms[roomKey];
      const playerlist = Object.keys(roomInfo.players);

      roomInfo.players[socket.id].played = true;
      let readynum = playerlist.filter(player => roomInfo.players[player].played).length;

      if(readynum === playerlist.length) {
          roomInfo.currentTurn = playerlist[0];
          playerlist.forEach((player) => {
            let playercard = [];
            for (let i=0;i<6;i++){
              playercard.push(roomInfo.deck.pop())
            }
            roomInfo.players[player].card = 6
            io.to(player).emit("firstcard", playercard);
          });
          io.to(roomKey).emit("firstTurn", playerlist[0]);
          io.to(roomKey).emit('centerCard', roomInfo.deck.pop());
          io.to(roomKey).emit('currentPlayers', roomInfo.players);
          console.log("ready");
          console.log(roomInfo.players);
        }
    });

    socket.on("pickcard", (roomKey) => {
      console.log("pickcard");
      const roomInfo = gameRooms[roomKey];
      io.to(socket.id).emit("pickcard", roomInfo.deck.pop());
    });

    socket.on("verificationpickcard", (roomKey) => {
      console.log("verificationpickcard");
      const roomInfo = gameRooms[roomKey];
      io.to(socket.id).emit("verificationpickcard", roomInfo.deck.pop());
    })

    socket.on('nextTurn', (roomKey) => {
      let roomInfo = gameRooms[roomKey];
      let playerlist = Object.keys(roomInfo.players); //방 전체 플레이어
      let playedplayers = []; //끝나지 않은 플레이어
      playerlist.forEach((player) => {
        if(roomInfo.players[player].played) {
          playedplayers.push(player);
        }
      });
      if(playedplayers.length === 1){ //끝나지 않은 플레이어가 1명일때
        console.log("gameEnd");
        playerlist.forEach((player) => {
          roomInfo.players[player].played = false;
        }) 
        temp_roomInfo = {
          players: roomInfo.players,
          numPlayers: playerlist.length,
          playing: false
        }
        gameRooms[roomKey] = temp_roomInfo;
        io.to(roomKey).emit("gameEnd");
      } else{
        while(true) {
          roomInfo.turnCount++;
          let next = playerlist[(roomInfo.turnCount % playerlist.length)]
          if(roomInfo.lastTurn != next) {
            roomInfo.currentTurn = next;
            io.to(roomKey).emit('nextTurn', roomInfo.currentTurn);
            io.to(roomKey).emit('currentPlayers', roomInfo.players);
            break;
          }
        }
      }
    });

    socket.on('cardDrop', (roomKey, cardData) => {
      socket.broadcast.to(roomKey).emit('cardDrop', cardData);
    });

    socket.on('turnEnd', (roomKey, id, word, type) => {
      const roomInfo = gameRooms[roomKey];
      const playerlist = Object.keys(roomInfo.players);
      playerlist.forEach((player) => {
        if (player === roomInfo.lastTurn) {
          if (roomInfo.players[roomInfo.lastTurn].card === 0) {
            roomInfo.players[roomInfo.lastTurn].played = false
          }
        }
      })
      roomInfo.lastTurn = id;
      roomInfo.lastWord = word;
      roomInfo.criticalSection = true;
      socket.broadcast.to(roomKey).emit('turnEnd', type, word);
    });

    socket.on('firstDrop', (roomKey) => {
      socket.broadcast.to(roomKey).emit('firstDrop');
    });

    socket.on('currentCardUpdate', (roomKey, id, number) => {
      const roomInfo = gameRooms[roomKey];
      roomInfo.players[id].card = number
      io.to(roomKey).emit('currentCardUpdate', roomInfo.players);
    });

    socket.on('timeOut', (roomKey) => {
      io.to(roomKey).emit('timeOut');
    });

    socket.on('tick', (roomKey, time) => {
      socket.broadcast.to(roomKey).emit('tok', time);
    })

    socket.on('objection', (roomKey, id) => {
      const roomInfo = gameRooms[roomKey];
      io.to(roomKey).emit("objection");
      if (roomInfo.criticalSection)
          roomInfo.criticalSection = false;
      else
          return 0;
      console.log(roomInfo.lastWord);
      const url = `https://krdict.korean.go.kr/api/search?certkey_no=4549&key=487E5EEAB2BE2EB3932C7B599847D5DC&type_search=search&part=word&q=${roomInfo.lastWord}&sort=dict&advanced=y&method=exact`;
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
              io.to(roomKey).emit('verificationFalse', roomInfo.lastTurn);
          }
          // 존재하는 단어일 때
          else {
              console.log(word, pos, def);
              io.to(roomKey).emit('verificationTrue', id, {word, pos, def});
          }
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
        playerNickname: socket.nickname
      };
      roomInfo.difficulty = roomvalue.difficulty;
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
        playerNickname: socket.nickname
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
        
        if(roomInfo.numPlayers === 0) {//no people in room
          delete gameRooms[roomKey];
        } else {
          // emit a message to all players to remove this player
          io.to(roomKey).emit("disconnected", roomInfo.players);
          io.to(roomKey).emit("Playerupdate", roomInfo.players);
        }

        if (roomInfo.currentTurn === socket.id) {
          console.log("disconnected", roomInfo.players);
          io.to(roomKey).emit("turnPlayerDisconnection");
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

  });
};
