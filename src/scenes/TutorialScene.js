import sharedData from "../shared";
import "../fontLoader"; // can use the font as "BR-R"

export default class TutorialScene extends Phaser.Scene {
    constructor() {
        super("TutorialScene");
    }

    preload() {
        this.load.image("up", "assets/image/up.png");
        this.load.image("down", "assets/image/down.png");
        this.load.image("right", "assets/image/rightArrange.png");
        this.load.image("left", "assets/image/leftArrange.png");
    }

    create() {
        const scene = this;

        let WordStyle = {font: "100px BR-R", fill: "black"};

        // 백그라운드 생성
        const graphics = scene.add.graphics();
        graphics.x = 400; // x 좌표 조절
        graphics.y = 120; // y 좌표 조절
        const width = 1120; // 사각형의 너비
        const height = 840; // 사각형의 높이
        const radius = 10; // 사각형의 둥근 모서리 반지름

        // 사각형 그리기
        graphics.lineStyle(2, 0xffffff); // 외곽선 스타일 설정
        graphics.fillStyle(0xffffff, 0.5); // 내부 색상과 투명도 설정
        graphics.fillRoundedRect(0, 0, width, height, radius); // 둥근 사각형 그리기
        graphics.strokeRoundedRect(0, 0, width, height, radius); // 외곽선 그리기

        scene.add.text(780, 130, "게임 설명", WordStyle);


        const images = ["up", "down"];

        scene.imagenum = 0;

        scene.img = scene.add.sprite(960, 580, "up").setInteractive();

        scene.rightArrange = scene.add.sprite(1430, 550, "right").setInteractive().on("pointerup",() => {
            scene.imagenum += 1;
            let nextImg = images[scene.imagenum];
            if (nextImg){
                scene.img.setTexture(nextImg);
            }
        });
        scene.leftArrange = scene.add.sprite(500, 550, "left").setInteractive().on("pointerup",() => {
            scene.imagenum -= 1;
            let nextImg = images[scene.imagenum];
            if (nextImg){
                scene.img.setTexture(nextImg);
            }
        });

    }
}