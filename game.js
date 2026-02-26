import startScene from './js/start.js';
import playScene from './js/play.js';

const config = {
    type: Phaser.AUTO,
    width: 1280, 
    height: 720,
    backgroundColor: '#87CEEB',
    parent: 'game-container',
    scale: {
        mode: Phaser.Scale.FIT, // 비율을 유지하며 화면에 맞춤
        autoCenter: Phaser.Scale.CENTER_BOTH, // 중앙 정렬
        width: 1280,
        height: 720
    },
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 0 } }
    },
    antialias: true, // 글자를 부드럽게 만드는 안티앨리어싱 활성화
    pixelArt: false, // 도트가 아니므로 부드러운 출력을 위해 false
    scene: [startScene, playScene]
};

const game = new Phaser.Game(config);