export default class startScene extends Phaser.Scene {
  constructor() {
    super('startScene');
  }

  preload() {
    this.load.image('start_background', 'assets/images/start/start_background.png');
    this.load.image('title', 'assets/images/start/title.png');
    this.load.image('btn_start', 'assets/images/btns/btn_start.png');
  }

  create() {
    // 배경
    this.bg = this.add.image(640, 360, 'start_background').setDisplaySize(1280, 720);
    
    // 타이틀
    this.title = this.add.image(640, 160, 'title').setScale(0.8);
    this.tweens.add({ targets: this.title, alpha: { from: 0, to: 1 }, duration: 2000 });

    // 시작 버튼
    this.startBtn = this.add.image(640, 650, 'btn_start').setScale(0.5);
    this.startBtn.setInteractive({ useHandCursor: true });
    this.startBtn.on('pointerdown', () => this.scene.start('playScene'));
  }
}