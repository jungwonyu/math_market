export default class playScene extends Phaser.Scene {
  constructor() {
    super('playScene');
    
    // --- 레벨 데이터 ---
    this.levelData = {
      1: { budget: 10000, goal: 2, desc: "쉬운 덧셈: 2개를 골라보세요!", speed: 300 },
      2: { budget: 15000, goal: 3, desc: "세 개를 골라야 해요!", speed: 300 },
      3: { budget: 20000, goal: 4, desc: "시장이 조금 넓어졌어요!", speed: 280 },
      4: { budget: 12000, goal: 3, desc: "가격이 500원 단위로 바뀌었어요!", speed: 280 },
      5: { budget: 25000, goal: 5, desc: "깜짝 세일 품목이 숨어있어요!", speed: 260 },
      6: { budget: 18000, goal: 3, desc: "1+1 상품을 잘 활용해보세요!", speed: 260 },
      7: { budget: 30000, goal: 6, desc: "물건이 아주 많아졌네요!", speed: 240 },
      8: { budget: 15500, goal: 4, desc: "10원 단위까지 꼼꼼히 계산하세요!", speed: 240 },
      9: { budget: 50000, goal: 8, desc: "대량 구매 미션! 예산을 지키세요.", speed: 220 },
      10: { budget: 100000, goal: 10, desc: "최종 단계: 시장의 달인에 도전하세요!", speed: 200 }
    };

    // --- 초기 상태 변수 ---
    this.currentLevel = 1;
    this.inventory = [];
    this.currentTotal = 0;
    this.totalCoins = 0;
    this.purchasedItems = [];
    this.currentEquip = { hat: null, glasses: null };
    this.itemContainers = [];
    this.arrowRemoved = false;
  }

  preload() {
    // 이미지 로드
    this.load.image('background', 'assets/images/background.png');

    this.load.image('dog', 'assets/images/player_dog.png');
    this.load.image('redHat', 'assets/images/item_hat.png');
    this.load.image('glass', 'assets/images/item_glasses.png');

    this.load.image('return', 'assets/images/place_return.png');
    this.load.image('return_h', 'assets/images/place_return_h.png');
    this.load.image('check', 'assets/images/place_check.png');
    this.load.image('check_h', 'assets/images/place_check_h.png');
    this.load.image('shop', 'assets/images/place_shop.png');
    this.load.image('shop_h', 'assets/images/place_shop_h.png');

    this.load.image('item_1', 'assets/images/item_1.png');
    this.load.image('item_2', 'assets/images/item_2.png');
    this.load.image('item_3', 'assets/images/item_3.png');
    this.load.image('item_4', 'assets/images/item_4.png');
    this.load.image('item_5', 'assets/images/item_5.png');
    this.load.image('item_6', 'assets/images/item_6.png');
    this.load.image('item_7', 'assets/images/item_7.png');
    this.load.image('item_8', 'assets/images/item_8.png');

    this.load.image('popup', 'assets/images/popup.png');
  }

  create() {
    this.bg = this.add.image(640, 360, 'background');
    this.bg.setDisplaySize(1280, 720);
    this.bg.setDepth(-100);

    // 입력 설정
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // UI 상단 바 설정
    this.levelText = this.add.text(230, 25, '', { fontSize: '24px', fill: '#0f0', fontFamily: 'MapleStoryBold' }).setDepth(6);
    this.uiText = this.add.text(630, 25, '', { fontSize: '24px', fill: '#0f0', fontFamily: 'MapleStoryBold' }).setDepth(6);

    // 특수 구역 (비우기, 상점, 계산대)
    this.placeReturn = this.add.image(850, 300, 'return');
    this.placeReturn.setDisplaySize(this.placeReturn.width * 0.25, this.placeReturn.height * 0.25);

    this.placeShop = this.add.image(175, 250, 'shop');
    this.placeShop.setDisplaySize(this.placeShop.width * 0.5, this.placeShop.height * 0.5);

    this.placeCheck = this.add.image(1130, 240, 'check');
    this.placeCheck.setDisplaySize(this.placeCheck.width * 0.5, this.placeCheck.height * 0.5);
    
    this.physics.add.existing(this.placeReturn, true);
    this.physics.add.existing(this.placeShop, true);
    this.physics.add.existing(this.placeCheck, true);

    // 플레이어 생성
    // 플레이어 위에 화살표 만들어 주기
    this.player = this.add.sprite(640, 500, 'dog').setDepth(5);
    this.arrow = this.add.text(605, 390, "⬇️", { fontSize: '40px', fill: '#fff', fontFamily: 'MapleStoryBold' });
    this.arrowTween = this.tweens.add({
      targets: this.arrow,
      alpha: { from: 1, to: 0.6 },
      duration: 800,
      yoyo: true,               
      repeat: -1                
    });

    this.player.setDisplaySize(this.player.width * 0.5, this.player.height * 0.5); 
    this.physics.add.existing(this.player);
    this.player.body.setCollideWorldBounds(true);

    // 상호작용 안내 문구
    this.interactionText = this.add.text(0, 0, '', { fontSize: '20px', backgroundColor: '#333', padding: 5, fontFamily: 'MapleStoryBold' }).setOrigin(0.5).setDepth(10).setVisible(false);

    // UI 생성 메서드 호출
    this.createPopupUI();
    this.createShopUI();
    
    // 첫 레벨 시작
    this.startLevel(this.currentLevel);
  }

  // --- 커스텀 메서드 (Class Methods) ---
  startLevel(lv) {
    this.inventory = [];
    this.currentTotal = 0;
    this.itemContainers.forEach(c => c.destroy());
    this.itemContainers = [];

    const data = this.levelData[lv];
    this.levelText.setText(`Lv.${lv} | 예산: ${data.budget}원`);
    this.updateUI();

    const startX = 250, startY = 420, spacingX = 250, spacingY = 180;
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

      let txt = this.add.text(62, 54, `${price}원`, { fontSize: '18px', fill: '#000', fontFamily: 'MapleStoryBold' }).setOrigin(0.5).setAngle(24);
      
      container.add([rect, txt]);
      this.itemContainers.push(container);
    }
  }

  updateUI() {
    const data = this.levelData[this.currentLevel];
    this.uiText.setText(`장바구니: ${this.inventory.length}/${data.goal} | 총액: ${this.currentTotal}원 | 코인: ${this.totalCoins}`);
    this.uiText.setStyle({ fill: this.currentTotal > data.budget ? '#ff0000' : '#00ff00' });
  }

  createPopupUI() {
    // 딤 (팝업 뒤, 화면 전체)
    this.popupDim = this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.55)
      .setDepth(99)
      .setVisible(false)
      .setInteractive();

    this.popupGroup = this.add.container(640, 360).setDepth(100).setVisible(false);

    let bg = this.add.image(0, 0, 'popup').setDisplaySize(550, 350);
    this.popupText = this.add.text(0, -40, '', {
      fontSize: '26px',
      fill: '#000',
      align: 'center',
      wordWrap: { width: 500 },
      fontFamily: 'MapleStoryBold'
    }).setOrigin(0.5);

    let btn = this.add.text(0, 100, "[ 확인 ]", {
      fontSize: '30px',
      fill: '#fff',
      backgroundColor: '#00aa00',
      padding: 10,
      fontFamily: 'MapleStoryBold'
    }).setOrigin(0.5).setInteractive().on('pointerdown', () => this.hidePopup());

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
    this.shopGroup = this.add.container(640, 360).setDepth(50).setVisible(false);
    let bg = this.add.rectangle(0, 0, 500, 400, 0x000000, 0.85);
    let t = this.add.text(0, -150, "--- 코인 상점 ---", { fontSize: '32px', fontFamily: 'MapleStoryBold' }).setOrigin(0.5);
    let i1 = this.add.text(0, -50, "빨간 모자 (100코인)", { fontSize: '24px', fill: '#ff4444', fontFamily: 'MapleStoryBold' }).setOrigin(0.5).setInteractive().on('pointerdown', () => this.buyItem('redHat', 100, 0xff0000));
    let i2 = this.add.text(0, 30, "멋진 안경 (200코인)", { fontSize: '24px', fill: '#00ffff', fontFamily: 'MapleStoryBold' }).setOrigin(0.5).setInteractive().on('pointerdown', () => this.buyItem('glass', 200, 0x00ffff));
    let c = this.add.text(0, 150, "[ 닫기 ]", { fontSize: '24px', backgroundColor: '#555', padding: 5 }).setOrigin(0.5).setInteractive().on('pointerdown', () => this.toggleShop());
    this.shopGroup.add([bg, t, i1, i2, c]);
  }

  toggleShop() {
    const v = !this.shopGroup.visible;
    this.shopGroup.setVisible(v);
    if (v) this.physics.pause(); else this.physics.resume();
  }

  buyItem(id, price, color) {
    if (this.totalCoins < price && !this.purchasedItems.includes(id)) return this.showPopup("코인이 부족해요!");
    if (!this.purchasedItems.includes(id)) { this.totalCoins -= price; this.purchasedItems.push(id); this.showPopup("구매 완료!"); }
    
    if (id === 'redHat') {
        if (this.currentEquip.hat) this.currentEquip.hat.destroy();
        this.currentEquip.hat = this.add.image(0, 0, 'redHat').setDepth(this.player.depth + 1);
        this.currentEquip.hat.setDisplaySize(this.currentEquip.hat.width * 0.5, this.currentEquip.hat.height * 0.5); // 모자 크기 조절
    } else {
        if (this.currentEquip.glasses) this.currentEquip.glasses.destroy();
        this.currentEquip.glasses = this.add.image(0, 0, 'glass').setDepth(this.player.depth + 1);
        this.currentEquip.glasses.setDisplaySize(this.currentEquip.glasses.width * 0.5, this.currentEquip.glasses.height * 0.5); // 안경 크기 조절
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

    const speed = this.levelData[this.currentLevel] ? this.levelData[this.currentLevel].speed : 250;

    if (this.cursors.left.isDown) this.player.body.setVelocityX(-speed);
    else if (this.cursors.right.isDown) this.player.body.setVelocityX(speed);
    if (this.cursors.up.isDown) this.player.body.setVelocityY(-speed);
    else if (this.cursors.down.isDown) this.player.body.setVelocityY(speed);

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

    // 장착 아이템 위치 동기화
    if (this.currentEquip.hat) this.currentEquip.hat.setPosition(this.player.x - 5, this.player.y - 60);
    if (this.currentEquip.glasses) this.currentEquip.glasses.setPosition(this.player.x - 16, this.player.y - 25);

    let targetAction = null;
    let minDist = 110;

    // 특수 구역 체크
    const specialAreas = [
      { obj: this.placeReturn, action: () => { this.inventory=[]; this.currentTotal=0; this.startLevel(this.currentLevel); this.showPopup("장바구니를 비웠습니다!"); }, label: "장바구니 비우기" },
      { obj: this.placeShop, action: () => this.toggleShop(), label: "상점 열기" },
      { obj: this.placeCheck, action: () => this.checkResult(), label: "계산하기" }
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
            targetAction = { action: () => this.purchaseItem(c), label: "물건 담기", obj: c };
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
      this.interactionText.setText(`Space: ${targetAction.label}`).setPosition(this.player.x, this.player.y - 80).setVisible(true);
      
      if (Phaser.Input.Keyboard.JustDown(this.spaceBar)) {
        targetAction.action();
        this.interactionText.setVisible(false);
      }
    } else {
      this.interactionText.setVisible(false);
    }
  }
}