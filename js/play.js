// 색상 변수
const colors = {
  brown_1: '#442e1c',
  brown_2: '#ad8361'
}

export default class playScene extends Phaser.Scene {
  constructor() {
    super('playScene');
    
    // --- 레벨 데이터 ---
    this.levelData = {
      1: { budget: 10000, goal: 2, desc: "사과와 당근? 2개를 골라보세요!" }, 
      2: { budget: 15000, goal: 2, desc: "조금 비싼 걸 담아볼까요?" }, 
      3: { budget: 12000, goal: 3, desc: "세 개를 담으려면 계산이 필요해요!" }, 
      4: { budget: 20000, goal: 3, desc: "예산이 넉넉할 때 비싼 걸 사세요!" }, 
      5: { budget: 15000, goal: 4, desc: "천 원짜리를 잘 찾아보세요!" }, 
      6: { budget: 25000, goal: 4, desc: "중간 가격대 물건들을 공략해요!" }, 
      7: { budget: 20000, goal: 5, desc: "5개나? 아주 알뜰해야겠네요!" }, 
      8: { budget: 35000, goal: 6, desc: "슬슬 장바구니가 무거워져요!" }, 
      9: { budget: 30000, goal: 7, desc: "거의 다 왔어요! 7개를 담으세요." }, 
      10: { budget: 45000, goal: 8, desc: "시장의 달인! 모든 물건을 싹쓸이!" }
    };

    // --- 초기 상태 변수 ---
    this.currentLevel = 1;
    this.inventory = [];
    this.currentTotal = 0;
    this.totalCoins = 0;
    this.purchasedItems = [];
    this.currentEquip = { redHat: null, brownHat: null, glasses: null, flower: null, ribbon: null, bag: null };
    this.itemContainers = [];
    this.arrowRemoved = false;
  }

  preload() {
    // 이미지 로드
    this.load.image('background', 'assets/images/background.png');

    // equips
    this.load.image('redhat_1', 'assets/images/equips/redhat_1.png');
    this.load.image('redhat_2', 'assets/images/equips/redhat_2.png');
    this.load.image('redhat_3', 'assets/images/equips/redhat_3.png');
    this.load.image('redhat_4', 'assets/images/equips/redhat_4.png');

    this.load.image('brownhat_1', 'assets/images/equips/brownhat_1.png');
    this.load.image('brownhat_2', 'assets/images/equips/brownhat_2.png');
    this.load.image('brownhat_3', 'assets/images/equips/brownhat_3.png');
    this.load.image('brownhat_4', 'assets/images/equips/brownhat_4.png');

    this.load.image('glasses_1', 'assets/images/equips/glasses_1.png');
    this.load.image('glasses_2', 'assets/images/equips/glasses_2.png');
    this.load.image('glasses_3', 'assets/images/equips/glasses_3.png');
    this.load.image('glasses_4', 'assets/images/equips/glasses_4.png');

    this.load.image('flower_1', 'assets/images/equips/flower_1.png');
    this.load.image('flower_2', 'assets/images/equips/flower_2.png');
    this.load.image('flower_3', 'assets/images/equips/flower_3.png');
    this.load.image('flower_4', 'assets/images/equips/flower_4.png');

    this.load.image('bag_1', 'assets/images/equips/bag_1.png');
    this.load.image('bag_3', 'assets/images/equips/bag_3.png');

    this.load.image('ribbon_1', 'assets/images/equips/ribbon_1.png');
    this.load.image('ribbon_2', 'assets/images/equips/ribbon_2.png');
    this.load.image('ribbon_3', 'assets/images/equips/ribbon_3.png');
    this.load.image('ribbon_4', 'assets/images/equips/ribbon_4.png');

    // pops
    this.load.image('popup', 'assets/images/pops/pop_default.png');
    this.load.image('pop_shop', 'assets/images/pops/pop_shop.png');

    // buttons
    this.load.image('btn_close', 'assets/images/btns/btn_close.png');
    this.load.image('btn_buy', 'assets/images/btns/btn_buy.png');

    // players
    this.load.spritesheet('player_1', 'assets/images/player_1.png', { frameWidth: 110, frameHeight: 147 }); // down
    this.load.spritesheet('player_2', 'assets/images/player_2.png', { frameWidth: 110, frameHeight: 147 }); // up
    this.load.spritesheet('player_3', 'assets/images/player_3.png', { frameWidth: 110, frameHeight: 147 }); // left
    this.load.spritesheet('player_4', 'assets/images/player_4.png', { frameWidth: 110, frameHeight: 147 }); // right

    // places
    this.load.image('return', 'assets/images/place_return.png');
    this.load.image('return_h', 'assets/images/place_return_h.png');
    this.load.image('check', 'assets/images/place_check.png');
    this.load.image('check_h', 'assets/images/place_check_h.png');
    this.load.image('shop', 'assets/images/place_shop.png');
    this.load.image('shop_h', 'assets/images/place_shop_h.png');

    // items
    this.load.image('item_1', 'assets/images/item_1.png');
    this.load.image('item_2', 'assets/images/item_2.png');
    this.load.image('item_3', 'assets/images/item_3.png');
    this.load.image('item_4', 'assets/images/item_4.png');
    this.load.image('item_5', 'assets/images/item_5.png');
    this.load.image('item_6', 'assets/images/item_6.png');
    this.load.image('item_7', 'assets/images/item_7.png');
    this.load.image('item_8', 'assets/images/item_8.png');

    // bubbles
    this.load.image('bubble_1', 'assets/images/bubble_1.png'); // 상점
    this.load.image('bubble_2', 'assets/images/bubble_2.png'); // 담기
    this.load.image('bubble_3', 'assets/images/bubble_3.png'); // 비우기
    this.load.image('bubble_4', 'assets/images/bubble_4.png'); // 계산하기

    // 기타
    this.load.image('ui_box', 'assets/images/ui_box.png');
    this.load.image('arrow', 'assets/images/arrow.png');

    // 오디오
    this.load.audio('en_bgm', 'assets/audio/market_en_bgm.mp3');
    this.load.audio('kr_bgm', 'assets/audio/market_kr_bgm.mp3');
  }

  create() {
    this.bg = this.add.image(640, 360, 'background').setDisplaySize(1280, 720).setDepth(-100);

    // 입력 설정
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // UI 상단 바 설정
    this.uiBox = this.add.image(640, 60, 'ui_box').setDepth(6);
    this.uiBox.setDisplaySize(this.uiBox.width * 0.9, this.uiBox.height * 0.9);
    this.levelText = this.add.text(300, 30, '', { fontSize: '24px', fill: colors.brown_2, stroke: colors.brown_1, strokeThickness: 2, fontFamily: 'MapleStoryBold' }).setDepth(6);
    this.uiText = this.add.text(600, 30, '', { fontSize: '24px', fill: colors.brown_2, stroke: colors.brown_1, strokeThickness: 2, fontFamily: 'MapleStoryBold' }).setDepth(6);

    // 특수 구역 (비우기, 상점, 계산대)
    this.placeReturn = this.add.image(870, 280, 'return');
    this.placeReturn.setDisplaySize(this.placeReturn.width * 0.25, this.placeReturn.height * 0.25);

    this.placeShop = this.add.image(175, 250, 'shop');
    this.placeShop.setDisplaySize(this.placeShop.width * 0.5, this.placeShop.height * 0.5);

    this.placeCheck = this.add.image(1130, 240, 'check');
    this.placeCheck.setDisplaySize(this.placeCheck.width * 0.5, this.placeCheck.height * 0.5);
    
    this.physics.add.existing(this.placeReturn, true);
    this.physics.add.existing(this.placeShop, true);
    this.physics.add.existing(this.placeCheck, true);

    // 플레이어 생성
    this.player = this.add.sprite(640, 500, 'player_1').setDepth(5);
    this.arrow = this.add.image(640, 390, 'arrow').setScale(0.7);
    this.arrowTween = this.tweens.add({ targets: this.arrow, alpha: { from: 1, to: 0.6 }, duration: 500, yoyo: true, repeat: -1 });

    // 플레이어 애니메이션 생성
    this.anims.create({ key: 'down', frames: this.anims.generateFrameNumbers('player_1', { start: 0, end: 3 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'up', frames: this.anims.generateFrameNumbers('player_2', { start: 0, end: 3 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'left', frames: this.anims.generateFrameNumbers('player_3', { start: 0, end: 3 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'right', frames: this.anims.generateFrameNumbers('player_4', { start: 0, end: 3 }), frameRate: 10, repeat: -1 });

    this.physics.add.existing(this.player);
    this.player.body.setCollideWorldBounds(true);

    // 상호작용 안내 문구
    this.interactionImage = this.add.image(0, 0, 'bubble_1').setOrigin(0.5).setDepth(10).setVisible(false);
    this.interactionImage.setDisplaySize(this.interactionImage.width * 0.5, this.interactionImage.height * 0.5);

    // UI 생성 메서드 호출
    this.createPopupUI();
    this.createShopUI();
    
    // 첫 레벨 시작
    this.startLevel(this.currentLevel);

    // 비지엠
    // let bgm = this.sound.add('marketBGM');
    // bgm.play({ loop: true });

    const enBGM = this.sound.add('en_bgm'); 
    const krBGM = this.sound.add('kr_bgm'); 
    enBGM.on('complete', () => { krBGM.play(); });
    krBGM.on('complete', () => { enBGM.play(); });
    enBGM.play();
  }

  // --- 커스텀 메서드 (Class Methods) ---
  startLevel(lv) {
    this.inventory = [];
    this.currentTotal = 0;
    this.itemContainers.forEach(c => c.destroy());
    this.itemContainers = [];

    const data = this.levelData[lv];
    this.levelText.setText(`Lv.${lv}   예산 : ${data.budget}원`);
    this.updateUI();

    const startX = 250, startY = 440, spacingX = 250, spacingY = 180;
    const numbers = Array.from({ length: 8 }, (_, i) => i + 1);
    numbers.sort(() => Math.random() - 0.5);

    for (let i = 0; i < 8; i++) {
      const col = i % 4, row = Math.floor(i / 4);
      const x = startX + (col * spacingX), y = startY + (row * spacingY);
      
      let price = (lv < 4) ? Phaser.Math.Between(1, 9) * 1000 : Phaser.Math.Between(10, 90) * 100;
      if (lv >= 8) price += Phaser.Math.Between(1, 9) * 10;

      let container = this.add.container(x, y);
      let rect = this.add.image(0, 0, `item_${numbers[i]}`);
      rect.setDisplaySize(rect.width * 0.6, rect.height * 0.6);

      container.setData('price', price);

      let txt = this.add.text(63, 55, `${price}원`, { fontSize: '18px', fill: '#000', fontFamily: 'MapleStoryBold' }).setOrigin(0.5).setAngle(24);
      
      container.add([rect, txt]);
      this.itemContainers.push(container);
    }
  }

  updateUI() {
    const data = this.levelData[this.currentLevel];

    this.uiText.setText(`장바구니 : ${this.inventory.length}/${data.goal}   총액 : ${this.currentTotal}원   코인 : ${this.totalCoins}`);
    this.uiText.setStyle({ fill: this.currentTotal > data.budget ? '#ff0000' : colors.brown_2 });
  }

  createPopupUI() {
    this.popupDim = this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.55).setDepth(99).setVisible(false).setInteractive();

    this.popupGroup = this.add.container(640, 360).setDepth(100).setVisible(false);

    let bg = this.add.image(0, 0, 'popup').setScale(1.1);
    this.popupText = this.add.text(0, -30, '', { fontSize: '22px', fontFamily: 'MapleStoryBold', fill: colors.brown_1, align: 'center', wordWrap: { width: 500 } }).setOrigin(0.5);
    let btn = this.add.image(0, 100, 'btn_close').setOrigin(0.5).setScale(0.5).setInteractive().on('pointerdown', () => this.hidePopup());

    this.popupGroup.add([bg, this.popupText, btn]);
  }

  showPopup(msg) {
    this.popupText.setText(msg);
    this.popupDim.setVisible(true);
    this.popupGroup.setVisible(true);
    this.physics.pause();
  }

  hidePopup() {
    this.popupDim.setVisible(false);
    this.popupGroup.setVisible(false);
    this.physics.resume();
  }

  createShopUI() {
    this.shopDim = this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.55).setDepth(49).setVisible(false).setInteractive();
    this.shopGroup = this.add.container(640, 360).setDepth(50).setVisible(false);
    
    let bg = this.add.image(0, 0, 'pop_shop').setScale(0.8);
    let closeBtn = this.add.image(0, 180, 'btn_close').setOrigin(0.5).setScale(0.5).setInteractive().on('pointerdown', () => this.toggleShop());

    let item1 = this.add.image(-155, -100, 'redhat_1').setScale(0.7).setInteractive().on('pointerdown', () => this.buyItem('redHat', 70));
    let item1Coin = this.add.text(-140, -40, '70', { fontSize: '20px', fontFamily: 'MapleStoryBold', fill: colors.brown_1 }).setOrigin(0.5).setInteractive().on('pointerdown', () => this.buyItem('redHat', 70));
    
    let item2 = this.add.image(3, -95, 'glasses_1').setScale(0.6).setInteractive().on('pointerdown', () => this.buyItem('glass', 60));
    let item2Coin = this.add.text(15, -40, '60', { fontSize: '20px', fontFamily: 'MapleStoryBold', fill: colors.brown_1 }).setOrigin(0.5).setInteractive().on('pointerdown', () => this.buyItem('glass', 60));

    let item3 = this.add.image(160, -95, 'brownhat_1').setScale(0.6).setInteractive().on('pointerdown', () => this.buyItem('brownHat', 80));
    let item3Coin = this.add.text(175, -40, '80', { fontSize: '20px', fontFamily: 'MapleStoryBold', fill: colors.brown_1 }).setOrigin(0.5).setInteractive().on('pointerdown', () => this.buyItem('brownHat', 80));

    let item4 = this.add.image(-155, 65, 'flower_1').setScale(0.8).setInteractive().on('pointerdown', () => this.buyItem('flower', 20));
    let item4Coin = this.add.text(-140, 120, '20', { fontSize: '20px', fontFamily: 'MapleStoryBold', fill: colors.brown_1 }).setOrigin(0.5).setInteractive().on('pointerdown', () => this.buyItem('flower', 20));

    let item5 = this.add.image(3, 65, 'bag_1').setScale(0.8).setInteractive().on('pointerdown', () => this.buyItem('bag', 50));
    let item5Coin = this.add.text(15, 120, '50', { fontSize: '20px', fontFamily: 'MapleStoryBold', fill: colors.brown_1 }).setOrigin(0.5).setInteractive().on('pointerdown', () => this.buyItem('bag', 50));

    let item6 = this.add.image(160, 65, 'ribbon_1').setScale(0.5).setInteractive().on('pointerdown', () => this.buyItem('ribbon', 30));
    let item6Coin = this.add.text(175, 120, '30', { fontSize: '20px', fontFamily: 'MapleStoryBold', fill: colors.brown_1 }).setOrigin(0.5).setInteractive().on('pointerdown', () => this.buyItem('ribbon', 30));

    this.shopGroup.add([bg, item1, item1Coin, item2, item2Coin, item3, item3Coin, item4, item4Coin, item5, item5Coin, item6, item6Coin, closeBtn]);
  }

  toggleShop() {
    const v = !this.shopGroup.visible;
    this.shopDim.setVisible(v);
    this.shopGroup.setVisible(v);

    if (v) this.physics.pause();
    else this.physics.resume();
  }

  buyItem(id, price, color) {
    if (this.totalCoins < price && !this.purchasedItems.includes(id)) return this.showPopup("코인이 부족해요!");
    if (!this.purchasedItems.includes(id)) { this.totalCoins -= price; this.purchasedItems.push(id); this.showPopup("구매 완료!"); }
    
    if (id === 'redHat') {
        if (this.currentEquip.redHat) this.currentEquip.redHat.destroy();
        this.currentEquip.redHat = this.add.image(0, 0, 'redhat_1').setDepth(this.player.depth + 1);
        this.currentEquip.redHat.setDisplaySize(this.currentEquip.redHat.width * 0.6, this.currentEquip.redHat.height * 0.6);
    } else if (id === 'brownHat') {
        if (this.currentEquip.brownHat) this.currentEquip.brownHat.destroy();
        this.currentEquip.brownHat = this.add.image(0, 0, 'brownhat_1').setDepth(this.player.depth + 1);
        this.currentEquip.brownHat.setDisplaySize(this.currentEquip.brownHat.width * 0.6, this.currentEquip.brownHat.height * 0.6);
    } else if (id === 'glass') {
      if (this.currentEquip.glasses) this.currentEquip.glasses.destroy();
        this.currentEquip.glasses = this.add.image(0, 0, 'glasses_1').setDepth(this.player.depth + 1);
        this.currentEquip.glasses.setDisplaySize(this.currentEquip.glasses.width * 0.5, this.currentEquip.glasses.height * 0.5);
    } else if (id === 'flower') {
      if (this.currentEquip.flower) this.currentEquip.flower.destroy();
      this.currentEquip.flower = this.add.image(0, 0, 'flower_1').setDepth(this.player.depth + 1);
      this.currentEquip.flower.setDisplaySize(this.currentEquip.flower.width * 0.5, this.currentEquip.flower.height * 0.5);
    } else if (id === 'bag') {
      if (this.currentEquip.bag) this.currentEquip.bag.destroy();
      this.currentEquip.bag = this.add.image(0, 0, 'bag_1').setDepth(this.player.depth + 1);
      this.currentEquip.bag.setDisplaySize(this.currentEquip.bag.width * 0.6, this.currentEquip.bag.height * 0.6);
    } else if (id === 'ribbon') {
      if (this.currentEquip.ribbon) this.currentEquip.ribbon.destroy();
      this.currentEquip.ribbon = this.add.image(0, 0, 'ribbon_1').setDepth(this.player.depth + 1);
      this.currentEquip.ribbon.setDisplaySize(this.currentEquip.ribbon.width * 0.4, this.currentEquip.ribbon.height * 0.4);
    }
    this.updateUI();
  }

  checkResult() {
    const data = this.levelData[this.currentLevel];
    if (this.currentTotal > data.budget) return this.showPopup("예산 초과! 물건을 줄여보세요.");
    if (this.inventory.length < data.goal) return this.showPopup(`물건을 ${data.goal}개 채워야 해요!`);

    const diff = data.budget - this.currentTotal;
    let earned = diff === 0 ? 100 : (diff <= 1000 ? 50 : 20);
    let medal = diff === 0 ? "🥇 금메달" : (diff <= 1000 ? "🥈 은메달" : "🥉 동메달");
    
    this.totalCoins += earned;
    this.showPopup(`${medal} 획득!\n보상: ${earned}코인을 받았습니다.`);
    
    this.currentLevel++;
    if (this.currentLevel <= 10) this.startLevel(this.currentLevel);
    else this.showPopup("🏆 모든 미션 클리어!\n당신은 시장의 달인입니다!");
  }

  purchaseItem(container) {
    const data = this.levelData[this.currentLevel];
    if (this.inventory.length >= data.goal) return this.showPopup("장바구니가 꽉 찼어요!");

    let price = container.getData('price');

    // 세일 로직
    if (this.currentLevel >= 5 && Math.random() < 0.15) {
      price /= 2;
      this.showPopup(`깜짝 세일! ${price*2}원 -> ${price}원`);
    }

    this.inventory.push(price);
    this.currentTotal += price;
    container.setVisible(false);
    this.updateUI(); 
  }

  // --- 메인 루프 (Update) ---
  update() {
    this.player.body.setVelocity(0);

    const speed = 500;

    // 장착 아이템 위치 동기화
    if (this.currentEquip.redHat) this.currentEquip.redHat.setPosition(this.player.x - 3, this.player.y - 65); // 빨간 모자
    if (this.currentEquip.brownHat) this.currentEquip.brownHat.setPosition(this.player.x - 3, this.player.y - 65); // 빨간 모자
    if (this.currentEquip.glasses) this.currentEquip.glasses.setPosition(this.player.x - 3, this.player.y - 35); // 선글라스
    if (this.currentEquip.flower) this.currentEquip.flower.setPosition(this.player.x + 20, this.player.y - 60); // 꽃
    if (this.currentEquip.bag) this.currentEquip.bag.setPosition(this.player.x + 30, this.player.y + 40); // 가방
    if (this.currentEquip.ribbon) this.currentEquip.ribbon.setPosition(this.player.x - 3, this.player.y); // 리본

    if (this.cursors.left.isDown) { 
      this.player.anims.play('left', true); 
      this.player.body.setVelocityX(-speed);
      if (this.currentEquip.redHat) {
        this.currentEquip.redHat.setTexture('redhat_3');
        this.currentEquip.redHat.setPosition(this.player.x - 16, this.player.y - 65);
      }
      if (this.currentEquip.brownHat) {
        this.currentEquip.brownHat.setTexture('brownhat_3');
        this.currentEquip.brownHat.setPosition(this.player.x - 16, this.player.y - 65);
      }
      if (this.currentEquip.glasses) {
        this.currentEquip.glasses.setTexture('glasses_3');
        this.currentEquip.glasses.setPosition(this.player.x - 16, this.player.y - 35);
      }
      if (this.currentEquip.flower) {
        this.currentEquip.flower.setTexture('flower_3');
        this.currentEquip.flower.setPosition(this.player.x, this.player.y - 60);
      }
      if (this.currentEquip.bag) {
        this.currentEquip.bag.setTexture('bag_3');
        this.currentEquip.bag.setPosition(this.player.x, this.player.y + 40);
      }
      if (this.currentEquip.ribbon) {
        this.currentEquip.ribbon.setTexture('ribbon_3');
        this.currentEquip.ribbon.setPosition(this.player.x - 16, this.player.y);
      }
    } else if (this.cursors.right.isDown) { 
      this.player.anims.play('right', true); 
      this.player.body.setVelocityX(speed);
      if (this.currentEquip.redHat) {
        this.currentEquip.redHat.setTexture('redhat_4');
        this.currentEquip.redHat.setPosition(this.player.x + 16, this.player.y - 65);
      }
      if (this.currentEquip.brownHat) {
        this.currentEquip.brownHat.setTexture('brownhat_4');
        this.currentEquip.brownHat.setPosition(this.player.x + 16, this.player.y - 65);
      }
      if (this.currentEquip.glasses) {
        this.currentEquip.glasses.setTexture('glasses_4');
        this.currentEquip.glasses.setPosition(this.player.x + 16, this.player.y - 35);
      }
      if (this.currentEquip.flower) {
        this.currentEquip.flower.setTexture('flower_4');
        this.currentEquip.flower.setPosition(this.player.x, this.player.y - 60);
      }
      if (this.currentEquip.bag) {
        this.currentEquip.bag.setTexture('bag_3');
        this.currentEquip.bag.setPosition(this.player.x, this.player.y + 40);
      }
      if (this.currentEquip.ribbon) {
        this.currentEquip.ribbon.setTexture('ribbon_4');
        this.currentEquip.ribbon.setPosition(this.player.x + 16, this.player.y);
      }
    } else if (this.cursors.up.isDown) { 
      this.player.anims.play('up', true); 
      this.player.body.setVelocityY(-speed);
      if (this.currentEquip.redHat) {
        this.currentEquip.redHat.setTexture('redhat_2');
      }
      if (this.currentEquip.brownHat) {
        this.currentEquip.brownHat.setTexture('brownhat_2');
      }
      if (this.currentEquip.glasses) {
        this.currentEquip.glasses.setTexture('glasses_2');
      }
      if (this.currentEquip.flower) {
        this.currentEquip.flower.setTexture('flower_2').setDepth(this.player.depth - 1);
      }
      if (this.currentEquip.bag) {
        this.currentEquip.bag.setTexture('bag_1').setDepth(this.player.depth - 1);
      }
      if (this.currentEquip.ribbon) {
        this.currentEquip.ribbon.setTexture('ribbon_2');
      }
    } else if (this.cursors.down.isDown) { 
      this.player.anims.play('down', true); 
      this.player.body.setVelocityY(speed);
      if (this.currentEquip.redHat) {
        this.currentEquip.redHat.setTexture('redhat_1');
      }
      if (this.currentEquip.brownHat) {
        this.currentEquip.brownHat.setTexture('brownhat_1');
      }
      if (this.currentEquip.glasses) {
        this.currentEquip.glasses.setTexture('glasses_1');
      }
      if (this.currentEquip.flower) {
        this.currentEquip.flower.setTexture('flower_1');
      }
      if (this.currentEquip.bag) {
        this.currentEquip.bag.setTexture('bag_1');
      }
      if (this.currentEquip.ribbon) {
        this.currentEquip.ribbon.setTexture('ribbon_1');
      }
    } else {
      this.player.anims.stop();
      this.player.anims.play('down', true);
      if (this.currentEquip.redHat) {
        this.currentEquip.redHat.setTexture('redhat_1');
      }
      if (this.currentEquip.brownHat) {
        this.currentEquip.brownHat.setTexture('brownhat_1');
      }
      if (this.currentEquip.glasses) {
        this.currentEquip.glasses.setTexture('glasses_1');
      }
      if (this.currentEquip.flower) {
        this.currentEquip.flower.setTexture('flower_1').setDepth(this.player.depth + 1);
      }
      if (this.currentEquip.bag) {
        this.currentEquip.bag.setTexture('bag_1').setDepth(this.player.depth + 1);
      }
      if (this.currentEquip.ribbon) {
        this.currentEquip.ribbon.setTexture('ribbon_1').setDepth(this.player.depth + 1);
      }
    }

    const moved = this.player.body.velocity.x !== 0 || this.player.body.velocity.y !== 0;

    if (moved && !this.arrowRemoved && this.arrow) {
      if (this.arrowTween) {
        this.arrowTween.stop();
        this.arrowTween.remove();   // 트윈 제거
        this.arrowTween = null;
      }
      this.arrow.destroy();
      this.arrow = null;
      this.arrowRemoved = true;
    }



    let targetAction = null;
    let minDist = 110;

    // 특수 구역 체크
    const specialAreas = [
      { obj: this.placeReturn, action: () => { this.inventory=[]; this.currentTotal=0; this.startLevel(this.currentLevel); this.showPopup("장바구니를 비웠습니다!"); }, label: 3 },
      { obj: this.placeShop, action: () => this.toggleShop(), label: 1 },
      { obj: this.placeCheck, action: () => this.checkResult(), label: 4 }
    ];

    specialAreas.forEach(a => {
      let d = Phaser.Math.Distance.Between(this.player.x, this.player.y, a.obj.x, a.obj.y);
      if (d < minDist) { minDist = d; targetAction = a; }
      if (a.obj === this.placeReturn) a.obj.setTexture('return');
      if (a.obj === this.placeShop) a.obj.setTexture('shop');
      if (a.obj === this.placeCheck) a.obj.setTexture('check');
    });

    // 일반 물건 체크
    if (!targetAction) {
      this.itemContainers.forEach(c => {
        if (c.visible) {
          let d = Phaser.Math.Distance.Between(this.player.x, this.player.y, c.x, c.y);
          if (d < minDist) {
            minDist = d;
            targetAction = { action: () => this.purchaseItem(c), label: 2, obj: c };
          }
        }
      });
    }

    this.itemContainers.forEach(c => c.setAlpha(1));
    if (targetAction) {
      if (targetAction.obj) {
        targetAction.obj.setAlpha(0.7);

        if (targetAction?.obj === this.placeShop) {
          targetAction.obj.setAlpha(1);
          this.placeShop.setTexture('shop_h');
        }
        if (targetAction?.obj === this.placeCheck) {
          targetAction.obj.setAlpha(1);
          this.placeCheck.setTexture('check_h');
        }
        if (targetAction?.obj === this.placeReturn) {
          targetAction.obj.setAlpha(1);
          this.placeReturn.setTexture('return_h');
        }
      }
      // 라벨에 따라 상호작용 이미지 변경
      this.interactionImage.setTexture(`bubble_${targetAction.label}`).setPosition(this.player.x + 60, this.player.y - 80).setVisible(true);

      if (Phaser.Input.Keyboard.JustDown(this.spaceBar)) {
        targetAction.action();
        this.interactionImage.setVisible(false);
      }
    } else {
      this.interactionImage.setVisible(false);
    }
  }
}