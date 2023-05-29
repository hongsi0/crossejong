import sharedData from "../shared";
import "../fontLoader"; // can use the font as "BR-R"

export default class GameEndScene extends Phaser.Scene {
    constructor() {
        super("GameEndScene");
        //this.playerRank = null;
    }

    init(data){
        this.playerRank = data.playerRank;
    }

    preload() {
        this.load.image("endbackground", "assets/image/gameEndBG.png");
        this.load.image("rank_2p", "assets/image/rank_2p.png");
        this.load.image("rank_3p", "assets/image/rank_3p.png");
        this.load.image("rank_first","assets/image/rank_first_profile.png");
        this.load.image("rank_second","assets/image/rank_second_profile.png");
        this.load.image("rank_third","assets/image/rank_third_profile.png");
        this.load.image("profile1", "assets/profile/profile1.png");
        this.load.image("profile2", "assets/profile/profile2.png");
        this.load.image("profile3", "assets/profile/profile3.png");
        this.load.image("profile4", "assets/profile/profile4.png");
        this.load.image("profile5", "assets/profile/profile5.png");
        this.load.image("profile6", "assets/profile/profile6.png");
        this.load.audio("gameEndbgm", "assets/sound/gameEndbgm.mp3");
    }

    create() {
        const scene = this;
        sharedData.socket.removeAllListeners("gameexit");
        console.log(scene.playerRank);
        const player_num = scene.playerRank.length;

        // console.log(`player_num: ${player_num}`);
        // scene.playerRank.forEach((player) => {
        //     console.log(`key: ${player.key}, nickname: ${player.nickname}, profile: ${player.profile}`);
        // });

        scene.add.image(0, 0, "endbackground").setOrigin(0,0);

        scene.gameEndbgm = scene.sound.add("gameEndbgm",{loop:false});
        scene.gameEndbgm.play();

        let rank = null;
        let rank_profile_bg = [];
        let rank_profile = [];
        let rank_nickname = [];
        let profile_scale = 0.225;
        let rank_wordstyle = {
            font: "50px BR-R",
            fill: "black",
            align: 'center',
            wordWrap: { width: 350, useAdvancedWrap: true },
            lineSpacing: 10
        };
        
        if(player_num == 2) { // 2 players
            rank = scene.add.image(960,1080,"rank_2p").setOrigin(0.5, 1);

            rank_profile_bg.push(scene.add.image(960-192,1080-693,"rank_first").setOrigin(0.5,0.5).setVisible(false));
            rank_profile_bg.push(scene.add.image(960+192,1080-537,"rank_second").setOrigin(0.5,0.5).setVisible(false));

            rank_profile.push(scene.add.image(960-192,1080-693-4,`${scene.playerRank[0].profile}`).setOrigin(0.5,0.5).setVisible(false).setScale(profile_scale));
            rank_profile.push(scene.add.image(960+192,1080-537-4,`${scene.playerRank[1].profile}`).setOrigin(0.5,0.5).setVisible(false).setScale(profile_scale));

            rank_nickname.push(scene.add.text(960-192, 1080-693+223, `1등\n${this.playerRank[0].nickname}`, rank_wordstyle).setOrigin(0.5, 0.5).setVisible(false));
            rank_nickname.push(scene.add.text(960+192, 1080-537+223, `2등\n${this.playerRank[1].nickname}`, rank_wordstyle).setOrigin(0.5, 0.5).setVisible(false));

        } else if (player_num == 1) {
            console.log("playernum = 1");
        } else { // 3 or 4 players
            rank = scene.add.image(960,1080,"rank_3p").setOrigin(0.5, 1);

            rank_profile_bg.push(scene.add.image(960,1080-691,"rank_first").setOrigin(0.5,0.5).setVisible(false));
            rank_profile_bg.push(scene.add.image(960-384,1080-535,"rank_second").setOrigin(0.5,0.5).setVisible(false));
            rank_profile_bg.push(scene.add.image(960+384,1080-472,"rank_third").setOrigin(0.5,0.5).setVisible(false));

            rank_profile.push(scene.add.image(960,1080-691-4,`${scene.playerRank[0].profile}`).setOrigin(0.5,0.5).setVisible(false).setScale(profile_scale));
            rank_profile.push(scene.add.image(960-384,1080-535-4,`${scene.playerRank[1].profile}`).setOrigin(0.5,0.5).setVisible(false).setScale(profile_scale));
            rank_profile.push(scene.add.image(960+384,1080-472-4,`${scene.playerRank[2].profile}`).setOrigin(0.5,0.5).setVisible(false).setScale(profile_scale));
            
            rank_nickname.push(scene.add.text(960, 1080-691+223, `1등\n${this.playerRank[0].nickname}`, rank_wordstyle).setOrigin(0.5, 0.5).setVisible(false));
            rank_nickname.push(scene.add.text(960-384, 1080-535+223, `2등\n${this.playerRank[1].nickname}`, rank_wordstyle).setOrigin(0.5, 0.5).setVisible(false));
            rank_nickname.push(scene.add.text(960+384, 1080-472+223, `3등\n${this.playerRank[2].nickname}`, rank_wordstyle).setOrigin(0.5, 0.5).setVisible(false));
        }
    
        scene.tweens.add({
            targets: rank,
            displayHeight: rank.height,
            duration: 1000,
            ease: 'Linear',
            onStart: function () {
                rank.displayHeight = 0;
            },
            onComplete: function () {
                setTimeout(function () {
                    rank_profile_bg.forEach(image => {
                      image.setVisible(true);
                    });
                    setTimeout(function () {
                        for(let i=0; i<rank_profile.length; i++){
                            rank_profile[i].setVisible(true);
                            rank_nickname[i].setVisible(true);
                        }
                      }, 250);
                }, 250);
                setTimeout(function () {
                    console.log("rank 애니메이션 완료");
                }, 1000);
            }
        });

        // scene.tweens.add({
        //     targets: rank_profile_bg,
        //     displayHeight: rank_profile_bg[0].height,
        //     duration: 500,
        //     delay: 500,
        //     ease: 'Linear',
        //     onStart: function () {
        //         rank_profile_bg.forEach(image => {
        //             image.displayHeight = 0;
        //         }
        //     )},
        //     onComplete: function () {
        //         console.log("rank_profile_bg 애니메이션 완료");
        //     }
        // })

        for (let i = 0; i < scene.playerRank.length; i++) {
            let nickname = scene.playerRank[i];
            console.log(`${i+1}등 : ${nickname}`);
        }

        sharedData.socket.on("gameexit", () => {
            scene.scene.start("GameRoomScene");
        })
    }
    update() {
    }
}