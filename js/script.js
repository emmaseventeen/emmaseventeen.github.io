// @ts-nocheck
/* global THREE */

/* =========================================================
   第零幕邏輯：開始遊戲按鈕點擊轉場至第一幕
   ========================================================= */
const sceneStart = document.getElementById("sceneStart");
const startBtn = document.getElementById("startBtn");
const startVideo = document.getElementById("startVideo");

let isGameStarted = false;

startBtn.addEventListener("click", () => {
  if (isGameStarted) return;
  isGameStarted = true;

  if (startVideo && !startVideo.paused) {
    startVideo.pause();
  }

  document.body.style.backgroundColor = "#faf4dc";
  sceneStart.classList.add("hidden");
  sceneOne.classList.remove("hidden");

  isSceneOneActive = true;
  resizeFlowerCanvas();
  createFlowers();
  animateFlowers();
  showIntroMessage(0);
});

/* =========================================================
   第一幕邏輯：花花一二行交錯排列由上往下動 + 點擊或 3 秒換字
   ========================================================= */
const introMessages = [
  "紅燈亮起時警察會臨檢！千萬小心，不要做任何動作！趕緊躲避!!",
  "依照客人需求將食材及裝飾品拖曳至冰淇淋上，不要讓客人發現任何異樣",
  "記得把客人的需求記好!!!才不會被客人識破",
];

const sceneOne = document.getElementById("sceneOne");
const introText = document.getElementById("introText");
const timerBar = document.getElementById("timerBar");
const flowerCanvas = document.getElementById("flowerCanvas");
const flowerCtx = flowerCanvas.getContext("2d");

let introIndex = 0;
let autoNextTimeout = null;
let flowerAnimId = null;
let isSceneOneActive = false;
const AUTO_DELAY = 3000;

let flowers = [];
let totalGridHeight = 0;
const FLOWER_RADIUS = 32;
const COL_SPACING = 230;
const ROW_SPACING = 175;
const FALL_SPEED = 0.65;

function resizeFlowerCanvas() {
  flowerCanvas.width = window.innerWidth;
  flowerCanvas.height = window.innerHeight;
}

function createFlowers() {
  flowers = [];
  const cols = Math.ceil(flowerCanvas.width / COL_SPACING) + 2;
  const rows = Math.ceil(flowerCanvas.height / ROW_SPACING) + 2;
  totalGridHeight = rows * ROW_SPACING;

  for (let r = 0; r < rows; r++) {
    const rowOffsetX = r % 2 === 1 ? COL_SPACING / 2 : 0;

    for (let c = -1; c < cols; c++) {
      flowers.push({
        x: c * COL_SPACING + rowOffsetX,
        y: r * ROW_SPACING - ROW_SPACING,
        radius: FLOWER_RADIUS,
        rotation: r % 2 === 0 ? -0.18 : 0.22,
      });
    }
  }
}

function drawFlower(f) {
  flowerCtx.save();
  flowerCtx.translate(f.x, f.y);
  flowerCtx.rotate(f.rotation);

  const petals = 5;
  const petalDist = f.radius * 0.58;
  const petalRadius = f.radius * 0.48;

  flowerCtx.fillStyle = "#fffdf5";
  flowerCtx.strokeStyle = "#dcc670";
  flowerCtx.lineWidth = 2.2;

  flowerCtx.beginPath();
  for (let i = 0; i < petals; i++) {
    const angle = (i * 2 * Math.PI) / petals;
    const px = Math.cos(angle) * petalDist;
    const py = Math.sin(angle) * petalDist;
    flowerCtx.moveTo(px + petalRadius, py);
    flowerCtx.arc(px, py, petalRadius, 0, Math.PI * 2);
  }
  flowerCtx.stroke();

  flowerCtx.beginPath();
  for (let i = 0; i < petals; i++) {
    const angle = (i * 2 * Math.PI) / petals;
    const px = Math.cos(angle) * petalDist;
    const py = Math.sin(angle) * petalDist;
    flowerCtx.moveTo(px + petalRadius - 0.8, py);
    flowerCtx.arc(px, py, petalRadius - 0.8, 0, Math.PI * 2);
  }
  flowerCtx.fill();

  flowerCtx.beginPath();
  flowerCtx.arc(0, 0, f.radius * 0.55, 0, Math.PI * 2);
  flowerCtx.fill();

  flowerCtx.beginPath();
  flowerCtx.arc(0, 0, f.radius * 0.26, 0, Math.PI * 2);
  flowerCtx.strokeStyle = "#dcc670";
  flowerCtx.lineWidth = 2;
  flowerCtx.stroke();

  flowerCtx.restore();
}

function animateFlowers() {
  if (!isSceneOneActive) return;

  flowerCtx.clearRect(0, 0, flowerCanvas.width, flowerCanvas.height);

  for (const f of flowers) {
    f.y += FALL_SPEED;

    if (f.y > totalGridHeight - ROW_SPACING) {
      f.y -= totalGridHeight;
    }

    drawFlower(f);
  }

  flowerAnimId = requestAnimationFrame(animateFlowers);
}

function resetTimerBar() {
  timerBar.style.transition = "none";
  timerBar.style.transform = "scaleX(1)";
  void timerBar.offsetWidth;
  timerBar.style.transition = `transform ${AUTO_DELAY}ms linear`;
  timerBar.style.transform = "scaleX(0)";
}

function showIntroMessage(index) {
  clearTimeout(autoNextTimeout);

  introText.style.opacity = "0";
  setTimeout(() => {
    introText.textContent = introMessages[index];
    introText.style.opacity = "1";
  }, 120);

  resetTimerBar();

  autoNextTimeout = setTimeout(() => {
    advanceIntro();
  }, AUTO_DELAY);
}

function advanceIntro() {
  if (!isSceneOneActive) return;
  clearTimeout(autoNextTimeout);

  introIndex++;
  if (introIndex < introMessages.length) {
    showIntroMessage(introIndex);
  } else {
    transitionToSceneTwo();
  }
}

sceneOne.addEventListener("click", () => {
  advanceIntro();
});

/* =========================================================
   轉場與第二幕邏輯：丘丘鈴劇本對話
   ========================================================= */
const dialogues = [
  { name: "丘丘鈴", text: "運氣好差，今天撿垃圾又沒有收穫......" },
  { name: "丘丘鈴", text: "怎麼辦...沒有錢買晚餐了......" },
  { name: "", text: "......？" },
  { name: "丘丘鈴", text: "疑...？前面有一間冰淇淋店？...是以前就有的嗎" },
  { name: "丘丘鈴", text: "(走進去看看...)" },
  { name: "丘丘鈴", text: "沒有店員嗎???" },
  { name: "丘丘鈴", text: "......如果我偷拿一點點現金...應該不會被發現吧..." },
  { name: "", text: "(叮咚）糟糕怎麼突然有客人!?!?!?絕對不能被他發現我是小偷" },
];

const sceneTwo = document.getElementById("sceneTwo");
const speakerName = document.getElementById("speakerName");
const dialogueText = document.getElementById("dialogueText");
const nextIndicator = document.getElementById("nextIndicator");

let currentIndex = 0;
let charIndex = 0;
let isTyping = false;
let isFinished = false;
let typingTimer = null;
const typingSpeed = 60;

function transitionToSceneTwo() {
  isSceneOneActive = false;
  clearTimeout(autoNextTimeout);
  cancelAnimationFrame(flowerAnimId);

  document.body.style.backgroundColor = "#000000";
  sceneTwo.classList.remove("hidden");
  sceneOne.classList.add("hidden");

  setTimeout(() => {
    typeDialogue(currentIndex);
  }, 350);
}

function typeDialogue(index) {
  const currentLine = dialogues[index];

  if (currentLine.name && currentLine.name.trim() !== "") {
    speakerName.textContent = currentLine.name;
    speakerName.style.visibility = "visible";
  } else {
    speakerName.style.visibility = "hidden";
  }

  dialogueText.textContent = "";
  nextIndicator.classList.remove("show");

  charIndex = 0;
  isTyping = true;

  typingTimer = setInterval(() => {
    dialogueText.textContent += currentLine.text.charAt(charIndex);
    charIndex++;

    if (charIndex >= currentLine.text.length) {
      finishTyping();
    }
  }, typingSpeed);
}

function finishTyping() {
  clearInterval(typingTimer);
  dialogueText.textContent = dialogues[currentIndex].text;
  isTyping = false;
  nextIndicator.classList.add("show");
}

sceneTwo.addEventListener("click", () => {
  if (isFinished) return;

  if (isTyping) {
    finishTyping();
  } else {
    currentIndex++;
    if (currentIndex < dialogues.length) {
      typeDialogue(currentIndex);
    } else {
      isFinished = true;
      transitionToSceneThree();
    }
  }
});

/* =========================================================
   第三幕邏輯：開門動畫 + 客人點餐打字機對話 -> 串接擠冰淇淋
   ========================================================= */
const customerOrderSets = [
  {
    flavor: "matcha",
    dialogue: "給我一個抹茶冰淇淋吧...\n配料?\n三個幽靈、三個游泳圈、兩片藍莓",
    toppings: "三個幽靈、三個游泳圈、兩片藍莓",
  },
  {
    flavor: "strawberry",
    dialogue:
      "給我一個草莓冰淇淋吧...\n配料?\n四片奇異果、兩顆星星糖、兩片紅色火龍果",
    toppings: "四片奇異果、兩顆星星糖、兩片紅色火龍果",
  },
  {
    flavor: "chocolate",
    dialogue:
      "給我一個巧克力冰淇淋吧...\n配料?\n一個貓爪軟糖、五片白色火龍果、兩片香蕉",
    toppings: "一個貓爪軟糖、五片白色火龍果、兩片香蕉",
  },
];

let selectedCustomerOrderIndex = -1;

function chooseCustomerOrder() {
  const availableOrders = customerOrderSets
    .map((_, index) => index)
    .filter((index) => index !== selectedCustomerOrderIndex);
  selectedCustomerOrderIndex =
    availableOrders[Math.floor(Math.random() * availableOrders.length)];
}

function getCustomerOrders() {
  return [
    "老闆您好......\n嗯......你也覺得我看起來很憔悴嗎？\n早上也有人這樣說",
    "我昨天失戀了\n聽說吃甜食可以讓心情變好......\n你有推薦的冰淇淋嗎...",
    "......\n喔......連你都不跟我說話......\n沒關係啊...大家都這樣對我啊......",
    customerOrderSets[selectedCustomerOrderIndex].dialogue,
  ];
}

const sceneThree = document.getElementById("sceneThree");
const doorOverlay = document.getElementById("doorOverlay");
const customerSpeechWrapper = document.getElementById("customerSpeechWrapper");
const orderDialogueText = document.getElementById("orderDialogueText");
const orderNextIndicator = document.getElementById("orderNextIndicator");

let orderIndex = 0;
let orderCharIndex = 0;
let isOrderTyping = false;
let isOrderReady = false;
let isOrderFinished = false;
let orderTypingTimer = null;
const orderTypingSpeed = 55;

function transitionToSceneThree() {
  chooseCustomerOrder();
  sceneThree.classList.remove("hidden");

  setTimeout(() => {
    sceneTwo.classList.add("hidden");
    doorOverlay.classList.add("open");

    setTimeout(() => {
      customerSpeechWrapper.classList.remove("hidden");
      isOrderReady = true;
      typeOrderDialogue(0);
    }, 950);
  }, 450);
}

function typeOrderDialogue(index) {
  const text = getCustomerOrders()[index];
  orderDialogueText.textContent = "";
  orderNextIndicator.classList.remove("show");

  orderCharIndex = 0;
  isOrderTyping = true;

  orderTypingTimer = setInterval(() => {
    orderDialogueText.textContent += text.charAt(orderCharIndex);
    orderCharIndex++;

    if (orderCharIndex >= text.length) {
      finishOrderTyping();
    }
  }, orderTypingSpeed);
}

function finishOrderTyping() {
  clearInterval(orderTypingTimer);
  orderDialogueText.textContent = getCustomerOrders()[orderIndex];
  isOrderTyping = false;
  orderNextIndicator.classList.add("show");
}

sceneThree.addEventListener("click", () => {
  if (!isOrderReady || isOrderFinished) return;

  if (isOrderTyping) {
    finishOrderTyping();
  } else {
    orderIndex++;
    if (orderIndex < getCustomerOrders().length) {
      typeOrderDialogue(orderIndex);
    } else {
      isOrderFinished = true;
      orderNextIndicator.classList.remove("show");
      sceneThree.style.cursor = "default";
      transitionToIceCreamRules();
    }
  }
});

function transitionToIceCreamRules() {
  document.body.style.backgroundColor = "#fdfbe4";
  sceneThree.classList.add("hidden");
  showScreen(rulesScreen);
}

/* =========================================================
   第四幕～第七幕：擠冰淇淋 3D 小遊戲邏輯
   ========================================================= */
const FOLDER_PATH = "./models/";

const MODEL_PATHS = {
  machineNozzle: FOLDER_PATH + "machine_nozzle.glb",

  chocolate: {
    excellent: FOLDER_PATH + "chocolate_excellent.glb",
    good: FOLDER_PATH + "chocolate_good.glb",
    poor: FOLDER_PATH + "chocolate_poor.glb",
  },
  mango: {
    excellent: FOLDER_PATH + "mango_excellent.glb",
    good: FOLDER_PATH + "mango_good.glb",
    poor: FOLDER_PATH + "mango_poor.glb",
  },
  matcha: {
    excellent: FOLDER_PATH + "matcha_excellent.glb",
    good: FOLDER_PATH + "matcha_good.glb",
    poor: FOLDER_PATH + "matcha_poor.glb",
  },
  strawberry: {
    excellent: FOLDER_PATH + "strawberry_excellent.glb",
    good: FOLDER_PATH + "strawberry_good.glb",
    poor: FOLDER_PATH + "strawberry_poor.glb",
  },

  toppings: {
    flowermarshmallow: FOLDER_PATH + "花花棉花糖.glb",
    cookie: FOLDER_PATH + "曲奇餅乾.glb",
    greengrape: FOLDER_PATH + "綠葡萄.glb",
    dragonfruit: FOLDER_PATH + "火龍果.glb",
    pineapple: FOLDER_PATH + "鳳梨.glb",

    strawberry: FOLDER_PATH + "草莓.glb",
    catpaw: FOLDER_PATH + "貓爪.glb",
    blueberry: FOLDER_PATH + "藍莓.glb",
    sandwich: FOLDER_PATH + "夾心餅乾.glb",
    beargummy: FOLDER_PATH + "小熊軟糖.glb",

    chocostick: FOLDER_PATH + "脆迪酥.glb",
    heartgummy: FOLDER_PATH + "愛心軟糖.glb",
    yychoco: [
      FOLDER_PATH + "yy巧克力_紫色.glb",
      FOLDER_PATH + "yy巧克力_黃色.glb",
      FOLDER_PATH + "yy巧克力_綠色.glb",
      FOLDER_PATH + "yy巧克力_橘色.glb",
      FOLDER_PATH + "yy巧克力_藍色.glb",
    ],
    ghost: FOLDER_PATH + "小幽靈.glb",
    starcandy: FOLDER_PATH + "星星糖.glb",

    banana: FOLDER_PATH + "banana.glb",
    melon: FOLDER_PATH + "哈密瓜.glb",
    kiwi: FOLDER_PATH + "奇異果.glb",
    cherry: FOLDER_PATH + "櫻桃.glb",
    swimring: FOLDER_PATH + "游泳圈.glb",
  },
};

const CLIP_SETTINGS = {
  cupTopY: -0.78,
  layer1TopY: -0.15,
  layer2TopY: 0.48,
};
const DECORATE_LAYER_EXTRA_LEFT_PX = 10;
const DECORATE_CUP_RIGHT_OFFSET_PX = 5;
const FLAVORS = {
  matcha: { name: "抹茶", fallbackColor: 0x6b8e67 },
  chocolate: { name: "巧克力", fallbackColor: 0x6d4c4c },
  strawberry: { name: "草莓", fallbackColor: 0xeda8e2 },
  mango: { name: "芒果", fallbackColor: 0xffd54f },
};

const ICE_CREAM_MATERIAL_BRIGHTNESS = 1.0;
const TOPPING_MATERIAL_BRIGHTNESS = 0.72;

const GAME_TIME_LIMIT = 30.0;
const ZONE_SCALE_THRESHOLDS = { blue: 0.653, pink: 0.479 };
const ICE_CREAM_BOTTOM_CUT_LIFT_PX = 20;

const state = {
  round: 1,
  maxRounds: 3,
  targetFlavor: "matcha",
  selectedFlavor: null,
  isFlavorLocked: false,
  isPlayingRound: false,
  isGameActive: false,
  timeLeft: GAME_TIME_LIMIT,
  starScale: 1.0,
  clickFlashAlpha: 0,
  phaseOffset: 0,
  results: [],
};

const rulesScreen = document.getElementById("rules-screen");
const gameScreen = document.getElementById("game-screen");
const completionScreen = document.getElementById("completion-screen");
const decorateScreen = document.getElementById("decorate-screen");
const startIceCreamBtn = document.getElementById("start-icecream-btn");
const nextStageBtn = document.getElementById("next-stage-btn");
const playArea = document.getElementById("play-area");
const roundIndicator = document.getElementById("round-indicator");
const judgmentPopup = document.getElementById("judgment-popup");
const flavorBtns = document.querySelectorAll(".flavor-btn");
const timeFillEl = document.getElementById("time-fill");
const timeTextEl = document.getElementById("time-text");
const starCanvas = document.getElementById("star-canvas");
const ctx = starCanvas.getContext("2d");

function showScreen(screenEl) {
  document
    .querySelectorAll(".screen")
    .forEach((s) => s.classList.remove("active"));
  screenEl.classList.add("active");
}

startIceCreamBtn.addEventListener("click", () => {
  showScreen(gameScreen);
  resizeStarCanvas();
  if (!scene && typeof THREE !== "undefined") {
    initThreeJS();
  }
  const orderIdx =
    selectedCustomerOrderIndex >= 0 ? selectedCustomerOrderIndex : 0;
  resetGame(customerOrderSets[orderIdx].flavor);
});

nextStageBtn.addEventListener("click", () => {
  enterDecorateScreen();
});

// =========================================================================
// Three.js 3D 場景與 GLB 載入
// =========================================================================
let scene = null;
let camera = null;
let renderer = null;
const loadedModels = {
  machineNozzle: null,
  chocolate: {},
  mango: {},
  matcha: {},
  strawberry: {},
};
const activeLayers = [];
let staticCupMesh = null;
let nozzleMesh = null;
let iceCreamGroup = null;
let loadedCount = 0;
let sceneVerticalOffset = 0;
let iceCreamVerticalOffset = 0;
const CUP_SPRITE_HEIGHT = 1.5;

function initThreeJS() {
  const container = document.getElementById("three-container");
  scene = new THREE.Scene();

  iceCreamGroup = new THREE.Group();
  scene.add(iceCreamGroup);
  createStaticCup();

  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    100,
  );
  camera.position.set(0, 1.2, 7.5);
  camera.lookAt(0, 0.2, 0);

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.localClippingEnabled = true;
  container.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
  scene.add(ambientLight);
  const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
  dirLight.position.set(3, 8, 5);
  scene.add(dirLight);

  preloadAllModels();
  preloadToppingModels();
}

function normalizeModel(gltfScene, isNozzle) {
  gltfScene.updateMatrixWorld(true);

  const box = new THREE.Box3().setFromObject(gltfScene);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z) || 1;
  const scale = (isNozzle ? 2.2 : 3.4) / maxDim;

  const wrapper = new THREE.Group();
  gltfScene.scale.setScalar(scale);
  gltfScene.position.set(
    -center.x * scale,
    -center.y * scale,
    -center.z * scale,
  );
  wrapper.add(gltfScene);
  return wrapper;
}

function loadSingleGLB(path, isNozzle, onLoaded) {
  if (typeof THREE === "undefined" || typeof THREE.GLTFLoader === "undefined") {
    return;
  }
  const loader = new THREE.GLTFLoader();

  loader.load(
    path,
    (gltf) => {
      loadedCount++;
      const wrapper = normalizeModel(gltf.scene, isNozzle);
      onLoaded(wrapper);
    },
    undefined,
    (err) => {
      console.error("載入失敗: " + path, err);
    },
  );
}

function preloadAllModels() {
  loadSingleGLB(MODEL_PATHS.machineNozzle, true, (wrapper) => {
    loadedModels.machineNozzle = wrapper;
    nozzleMesh = wrapper.clone();
    nozzleMesh.position.set(0, 2.7, 0);
    scene.add(nozzleMesh);
  });

  const flavorKeys = Object.keys(FLAVORS);
  const grades = ["excellent", "good", "poor"];

  flavorKeys.forEach((flavor) => {
    grades.forEach((grade) => {
      const path = MODEL_PATHS[flavor][grade];
      loadSingleGLB(path, false, (wrapper) => {
        loadedModels[flavor][grade] = wrapper;
      });
    });
  });
}

function applyMaterialBrightness(material, brightness) {
  if (material.color) {
    material.color.multiplyScalar(brightness);
  }
  if (material.emissive) {
    material.emissive.multiplyScalar(brightness);
  }
}

function createStaticCup() {
  const cupImage = new Image();

  cupImage.onload = () => {
    const sourceCanvas = document.createElement("canvas");
    sourceCanvas.width = cupImage.naturalWidth;
    sourceCanvas.height = cupImage.naturalHeight;
    const sourceContext = sourceCanvas.getContext("2d", {
      willReadFrequently: true,
    });
    sourceContext.drawImage(cupImage, 0, 0);

    const pixels = sourceContext.getImageData(
      0,
      0,
      sourceCanvas.width,
      sourceCanvas.height,
    ).data;
    let minX = sourceCanvas.width;
    let minY = sourceCanvas.height;
    let maxX = -1;
    let maxY = -1;

    for (let y = 0; y < sourceCanvas.height; y++) {
      for (let x = 0; x < sourceCanvas.width; x++) {
        if (pixels[(y * sourceCanvas.width + x) * 4 + 3] <= 8) continue;
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }

    if (maxX < minX || maxY < minY) {
      console.error("杯子圖片沒有可見內容：./img/cup.png");
      return;
    }

    const cropWidth = maxX - minX + 1;
    const cropHeight = maxY - minY + 1;
    const croppedCanvas = document.createElement("canvas");
    croppedCanvas.width = cropWidth;
    croppedCanvas.height = cropHeight;
    croppedCanvas
      .getContext("2d")
      .drawImage(
        cupImage,
        minX,
        minY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight,
      );

    const cupTexture = new THREE.CanvasTexture(croppedCanvas);
    cupTexture.encoding = THREE.sRGBEncoding;
    const cupMaterial = new THREE.SpriteMaterial({
      map: cupTexture,
      alphaTest: 0.5,
      depthTest: true,
      depthWrite: false,
    });

    staticCupMesh = new THREE.Sprite(cupMaterial);
    const cupAspect = cropWidth / cropHeight;
    staticCupMesh.scale.set(
      CUP_SPRITE_HEIGHT * cupAspect,
      CUP_SPRITE_HEIGHT,
      1,
    );
    staticCupMesh.renderOrder = 0;
    updateCupVerticalPosition();
    iceCreamGroup.add(staticCupMesh);
  };

  cupImage.onerror = () => {
    console.error("杯子圖片載入失敗：./img/cup.png");
  };
  cupImage.src = "./img/cup.png";
}

function getLoadedIceCreamTemplate(flavorKey, grade) {
  if (loadedModels[flavorKey] && loadedModels[flavorKey][grade]) {
    return loadedModels[flavorKey][grade];
  }
  return null;
}

function dropIceCreamLayer(flavorKey, grade, roundNum) {
  const activeFlavor = flavorKey || state.targetFlavor;
  let template = getLoadedIceCreamTemplate(activeFlavor, grade);
  let useFallbackColor = false;

  if (!template) {
    template =
      getLoadedIceCreamTemplate("strawberry", grade) ||
      getLoadedIceCreamTemplate("chocolate", grade) ||
      getLoadedIceCreamTemplate("matcha", grade) ||
      getLoadedIceCreamTemplate("mango", grade);
    useFallbackColor = true;
  }

  if (!iceCreamGroup || !template) return;

  const layerObj = template.clone();
  renderer.localClippingEnabled = true;
  const verticalOffset = getIceCreamVerticalOffset();

  const clipPlanes = [];
  if (roundNum === 1) {
    clipPlanes.push(
      new THREE.Plane(
        new THREE.Vector3(0, 1, 0),
        -(
          CLIP_SETTINGS.cupTopY +
          verticalOffset +
          ICE_CREAM_BOTTOM_CUT_LIFT_PX * getWorldUnitsPerPixel()
        ),
      ),
    );
    clipPlanes.push(
      new THREE.Plane(
        new THREE.Vector3(0, -1, 0),
        CLIP_SETTINGS.layer1TopY + verticalOffset,
      ),
    );
  } else if (roundNum === 2) {
    clipPlanes.push(
      new THREE.Plane(
        new THREE.Vector3(0, 1, 0),
        -(CLIP_SETTINGS.layer1TopY + verticalOffset),
      ),
    );
    clipPlanes.push(
      new THREE.Plane(
        new THREE.Vector3(0, -1, 0),
        CLIP_SETTINGS.layer2TopY + verticalOffset,
      ),
    );
  } else {
    clipPlanes.push(
      new THREE.Plane(
        new THREE.Vector3(0, 1, 0),
        -(CLIP_SETTINGS.layer2TopY + verticalOffset),
      ),
    );
  }

  layerObj.traverse((child) => {
    if (child.isMesh && child.material) {
      const wasArray = Array.isArray(child.material);
      const materials = wasArray ? child.material : [child.material];
      const adjustedMaterials = materials.map((sourceMaterial) => {
        const material = sourceMaterial.clone();
        material.clippingPlanes = clipPlanes;
        material.clipShadows = true;

        if (useFallbackColor) {
          material.map = null;
          material.color.setHex(FLAVORS[activeFlavor].fallbackColor);
        }
        applyMaterialBrightness(material, ICE_CREAM_MATERIAL_BRIGHTNESS);
        return material;
      });
      child.material = wasArray ? adjustedMaterials : adjustedMaterials[0];
    }
  });

  const targetY = -0.5 + verticalOffset;
  layerObj.position.set(0, 2.2, 0);
  layerObj.userData = {
    targetY,
    isFalling: true,
    verticalClipPlanes: clipPlanes,
  };

  layerObj.traverse((child) => {
    if (child.isMesh) child.renderOrder = 1;
  });

  iceCreamGroup.add(layerObj);
  activeLayers.push(layerObj);
}

// =========================================================================
// Canvas 2D 廚師帽輪廓發光指示線
// =========================================================================
function resizeStarCanvas() {
  starCanvas.width = window.innerWidth;
  starCanvas.height = window.innerHeight;
  if (renderer && camera) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  updateCupVerticalPosition();
}

function getWorldUnitsPerPixel() {
  if (!camera || !starCanvas.height) return 0;
  const baseY = -0.5;
  const cameraDistance = camera.position.distanceTo(
    new THREE.Vector3(0, baseY, 0),
  );
  return (
    (2 * cameraDistance * Math.tan((camera.fov * Math.PI) / 360)) /
    starCanvas.height
  );
}

function getSceneVerticalOffset() {
  return 15 * getWorldUnitsPerPixel();
}

function getIceCreamVerticalOffset() {
  return getSceneVerticalOffset() - 25 * getWorldUnitsPerPixel();
}

function shiftClipPlanes(clipPlanes, offset) {
  if (!clipPlanes) return;
  clipPlanes.forEach((plane) => {
    plane.constant -= plane.normal.y * offset;
  });
}

function updateCupVerticalPosition() {
  const nextCupOffset = getSceneVerticalOffset();
  const nextIceCreamOffset = getIceCreamVerticalOffset();
  const cupOffsetChange = nextCupOffset - sceneVerticalOffset;
  const iceCreamOffsetChange = nextIceCreamOffset - iceCreamVerticalOffset;

  if (cupOffsetChange !== 0) {
    sceneVerticalOffset = nextCupOffset;
  }

  if (iceCreamOffsetChange !== 0) {
    activeLayers.forEach((layer) => {
      layer.position.y += iceCreamOffsetChange;
      layer.userData.targetY += iceCreamOffsetChange;
      shiftClipPlanes(layer.userData.verticalClipPlanes, iceCreamOffsetChange);
    });
    iceCreamVerticalOffset = nextIceCreamOffset;
  }

  if (staticCupMesh) {
    staticCupMesh.position.y =
      CLIP_SETTINGS.cupTopY + sceneVerticalOffset - CUP_SPRITE_HEIGHT / 2;
  }
}

function drawChefHatPath(cx, cy, radius) {
  const s = radius / 100;
  ctx.beginPath();
  ctx.moveTo(cx - 52 * s, cy + 72 * s);
  ctx.lineTo(cx + 52 * s, cy + 72 * s);
  ctx.lineTo(cx + 52 * s, cy + 44 * s);
  ctx.bezierCurveTo(
    cx + 115 * s,
    cy + 44 * s,
    cx + 115 * s,
    cy - 48 * s,
    cx + 42 * s,
    cy - 44 * s,
  );
  ctx.bezierCurveTo(
    cx + 46 * s,
    cy - 102 * s,
    cx - 46 * s,
    cy - 102 * s,
    cx - 42 * s,
    cy - 44 * s,
  );
  ctx.bezierCurveTo(
    cx - 115 * s,
    cy - 48 * s,
    cx - 115 * s,
    cy + 44 * s,
    cx - 52 * s,
    cy + 44 * s,
  );
  ctx.closePath();
}

function renderStarsAndIndicator() {
  ctx.clearRect(0, 0, starCanvas.width, starCanvas.height);

  const cx = starCanvas.width / 2;
  const cy = starCanvas.height * 0.52;
  const baseRadius = Math.min(starCanvas.height * 0.44, 380);

  if (state.isPlayingRound || state.clickFlashAlpha > 0) {
    ctx.save();
    drawChefHatPath(cx, cy, baseRadius * state.starScale);

    ctx.shadowBlur = state.clickFlashAlpha > 0 ? 35 : 18;
    ctx.shadowColor = state.clickFlashAlpha > 0 ? "#ffffff" : "#fff700";
    ctx.strokeStyle = state.clickFlashAlpha > 0 ? "#ffffff" : "#ffea00";
    ctx.lineWidth = state.clickFlashAlpha > 0 ? 9 : 5;
    ctx.stroke();

    if (state.clickFlashAlpha > 0) {
      ctx.fillStyle = `rgba(255, 255, 255, ${state.clickFlashAlpha * 0.45})`;
      ctx.fill();
      state.clickFlashAlpha -= 0.04;
    }
    ctx.restore();
  }
}

// =========================================================================
// 遊戲流程與計時器邏輯
// =========================================================================
function resetGame(forcedFlavor = null) {
  state.round = 1;
  state.results = [];

  if (forcedFlavor && FLAVORS[forcedFlavor]) {
    state.targetFlavor = forcedFlavor;
  } else {
    const flavorKeys = Object.keys(FLAVORS);
    state.targetFlavor =
      flavorKeys[Math.floor(Math.random() * flavorKeys.length)];
  }

  state.selectedFlavor = null;
  state.isFlavorLocked = false;
  state.timeLeft = GAME_TIME_LIMIT;
  state.isGameActive = true;

  flavorBtns.forEach((btn) => {
    btn.classList.remove("selected", "locked");
  });

  updateTimerUI();
  clearDecorateTimers();

  const gameThreeContainer = document.getElementById("three-container");
  if (renderer && renderer.domElement && gameThreeContainer) {
    gameThreeContainer.appendChild(renderer.domElement);
  }
  if (nozzleMesh) {
    nozzleMesh.visible = true;
  }

  if (iceCreamGroup) {
    placedToppings.forEach((t) => iceCreamGroup.remove(t));
    placedToppings.length = 0;
    activeLayers.forEach((obj) => iceCreamGroup.remove(obj));
    iceCreamGroup.position.set(0, 0, 0);
    iceCreamGroup.rotation.y = 0;
  }
  activeLayers.length = 0;

  startRound();
}

function startRound() {
  if (!state.isGameActive) return;

  const layerNames = ["最下層", "中間層", "最上層"];
  roundIndicator.textContent = `第 ${state.round} / ${state.maxRounds} 層 (${layerNames[state.round - 1]})`;

  state.starScale = 1.0;
  state.phaseOffset = 0;
  state.isPlayingRound = true;
}

flavorBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (!state.isGameActive || state.isFlavorLocked) return;

    state.selectedFlavor = btn.dataset.flavor;
    flavorBtns.forEach((b) => {
      if (b === btn) {
        b.classList.add("selected");
      } else {
        b.classList.remove("selected");
      }
    });
  });
});

function lockFlavorSelection() {
  state.isFlavorLocked = true;
  flavorBtns.forEach((btn) => {
    if (btn.dataset.flavor === state.selectedFlavor) {
      btn.classList.add("selected");
    } else {
      btn.classList.add("locked");
    }
  });
}

playArea.addEventListener("click", () => {
  if (!state.isPlayingRound || !state.isGameActive) return;

  if (!state.selectedFlavor) {
    showJudgmentText("請先選擇口味！");
    return;
  }

  state.isPlayingRound = false;
  state.clickFlashAlpha = 1.0;

  if (state.round === 1) {
    lockFlavorSelection();
  }

  let grade = "poor";
  if (state.selectedFlavor === state.targetFlavor) {
    grade =
      state.starScale > ZONE_SCALE_THRESHOLDS.blue
        ? "poor"
        : state.starScale > ZONE_SCALE_THRESHOLDS.pink
          ? "excellent"
          : "good";
  }

  state.results.push(grade);
  showJudgmentText(grade);
  dropIceCreamLayer(state.selectedFlavor, grade, state.round);

  setTimeout(() => {
    if (!state.isGameActive) return;

    if (state.round < state.maxRounds) {
      state.round++;
      startRound();
    } else {
      state.isGameActive = false;
      enterCompletionScreen();
    }
  }, 1200);
});

function handleTimeUp() {
  state.isGameActive = false;
  state.isPlayingRound = false;
  lockFlavorSelection();

  showJudgmentText("TIME UP! POOR");

  while (state.results.length < state.maxRounds) {
    const missingRound = state.results.length + 1;
    state.results.push("poor");
    dropIceCreamLayer(state.selectedFlavor, "poor", missingRound);
  }

  setTimeout(() => {
    enterCompletionScreen();
  }, 1500);
}

function updateTimerUI() {
  const ratio = Math.max(0, state.timeLeft / GAME_TIME_LIMIT);
  timeFillEl.style.width = `${ratio * 100}%`;
  timeTextEl.textContent = `剩餘時間：${Math.ceil(state.timeLeft)}s`;

  timeFillEl.style.backgroundColor =
    state.timeLeft <= 5 ? "#ff6b8b" : "#ffaae8";
}

function showJudgmentText(textOrGrade) {
  judgmentPopup.classList.remove("hidden");
  judgmentPopup.style.animation = "none";
  judgmentPopup.offsetHeight;
  judgmentPopup.style.animation = null;

  if (textOrGrade === "excellent") {
    judgmentPopup.textContent = "EXCELLENT!";
    judgmentPopup.style.color = "#ff3b9a";
  } else if (textOrGrade === "good") {
    judgmentPopup.textContent = "GOOD!";
    judgmentPopup.style.color = "#f5b000";
  } else if (textOrGrade === "poor") {
    judgmentPopup.textContent = "POOR...";
    judgmentPopup.style.color = "#00a8a3";
  } else {
    judgmentPopup.textContent = textOrGrade;
    judgmentPopup.style.color = "#ff3b5c";
  }

  setTimeout(() => judgmentPopup.classList.add("hidden"), 1100);
}

function enterCompletionScreen() {
  showScreen(completionScreen);
}

// =========================================================================
// 第七幕：裝飾冰淇淋完整邏輯（左側「食材.png」感應格拖曳3D模型吸附、45秒計時）
// =========================================================================
const DECORATE_TIME_LIMIT = 45.0;
const MAX_TOPPING_PER_TYPE = 5;
const PLACED_TOPPING_SCALE = 1.15;
const TOPPING_SCALE_BY_TYPE = {
  blueberry: 0.8,
  chocostick: 3,
  yychoco: 0.5,
  swimring: 1.8,
  pineapple: 2,
  greengrape: 1.2,
  cookie: 2.8,
  beargummy: 1.6,
};

function getToppingScale(type) {
  return TOPPING_SCALE_BY_TYPE[type] ?? PLACED_TOPPING_SCALE;
}

const FLAT_TOPPING_TYPES = new Set([
  "cookie",
  "dragonfruit",
  "pineapple",
  "sandwich",
  "yychoco",
  "starcandy",
  "banana",
  "melon",
  "kiwi",
  "swimring",
]);

const loadedToppings = {};
const placedToppings = [];
let toppingsPreloaded = false;

const decorateState = {
  isActive: false,
  timeLeft: DECORATE_TIME_LIMIT,
  counts: {},
  draggingToppingType: null,
  draggingTemplateMesh: null,
  draggingPreviewMesh: null,
  isAlarmActive: false,
  isHiding: false,
  alarmTimerId: null,
  alarmEndTimerId: null,
  reminderTimerId: null,
};

Object.keys(MODEL_PATHS.toppings).forEach((key) => {
  decorateState.counts[key] = 0;
});

const raycaster = typeof THREE !== "undefined" ? new THREE.Raycaster() : null;
const pointerNDC = typeof THREE !== "undefined" ? new THREE.Vector2() : null;

const policeAlarmOverlay = document.getElementById("police-alarm-overlay");
const hideStateOverlay = document.getElementById("hide-state-overlay");
const hideBtn = document.getElementById("hide-btn");
const serveBtn = document.getElementById("serve-btn");
const orderReminderBanner = document.getElementById("order-reminder-banner");
const orderReminderText = document.getElementById("order-reminder-text");
const decorateTimeFill = document.getElementById("decorate-time-fill");
const decorateTimeText = document.getElementById("decorate-time-text");
const decorateFailModal = document.getElementById("decorate-fail-modal");
const decorateFailRestartBtn = document.getElementById(
  "decorate-fail-restart-btn",
);
const decorateToast = document.getElementById("decorate-toast");
const traySlots = document.querySelectorAll(".tray-slot");

function preloadToppingModels() {
  if (toppingsPreloaded) return;
  if (typeof THREE === "undefined" || typeof THREE.GLTFLoader === "undefined") {
    return;
  }
  toppingsPreloaded = true;

  const fallbackColors = {
    flowermarshmallow: 0xe6c89c,
    cookie: 0x9b6b43,
    greengrape: 0x9ccc65,
    dragonfruit: 0xd81b60,
    pineapple: 0xffd54f,
    strawberry: 0xe53935,
    catpaw: 0xffcdd2,
    blueberry: 0x283593,
    sandwich: 0xd99a56,
    beargummy: 0x5c214f,
    chocostick: 0x5d4037,
    heartgummy: 0xe53935,
    yychoco: 0x29b6f6,
    ghost: 0xf4f4f4,
    starcandy: 0xffe46b,
    banana: 0xf5f2eb,
    melon: 0xf39a2d,
    kiwi: 0x8bc34a,
    cherry: 0xd50000,
    swimring: 0x81d4fa,
  };

  Object.keys(MODEL_PATHS.toppings).forEach((key) => {
    const pathOrList = MODEL_PATHS.toppings[key];
    const paths = Array.isArray(pathOrList) ? pathOrList : [pathOrList];
    loadedToppings[key] = [];

    paths.forEach((path) => {
      const loader = new THREE.GLTFLoader();
      loader.load(
        path,
        (gltf) => {
          const wrapper = normalizeToppingModel(gltf.scene, 0.36);
          dimToppingMaterials(wrapper, key);
          loadedToppings[key].push(wrapper);
        },
        undefined,
        () => {
          const fallbackGroup = new THREE.Group();
          const mesh = new THREE.Mesh(
            new THREE.SphereGeometry(0.15, 16, 16),
            new THREE.MeshStandardMaterial({
              color: new THREE.Color(
                fallbackColors[key] || 0xffaa00,
              ).multiplyScalar(TOPPING_MATERIAL_BRIGHTNESS),
            }),
          );
          fallbackGroup.add(mesh);
          loadedToppings[key].push(fallbackGroup);
        },
      );
    });
  });
}

function getRandomToppingTemplate(type) {
  const list = loadedToppings[type];
  if (!list || list.length === 0) return null;
  return list[Math.floor(Math.random() * list.length)];
}

function dimToppingMaterials(model, type) {
  const brightness =
    type === "banana"
      ? 0.58
      : type === "heartgummy"
        ? 0.56
        : TOPPING_MATERIAL_BRIGHTNESS;

  model.traverse((child) => {
    if (!child.isMesh || !child.material) return;

    const wasArray = Array.isArray(child.material);
    const materials = wasArray ? child.material : [child.material];
    const dimmedMaterials = materials.map((material) => {
      const dimmed = material.clone();
      applyMaterialBrightness(dimmed, brightness);
      if (type === "banana" || type === "heartgummy") {
        dimmed.roughness = Math.max(dimmed.roughness ?? 0, 0.85);
        dimmed.metalness = 0;
      }
      return dimmed;
    });
    child.material = wasArray ? dimmedMaterials : dimmedMaterials[0];
  });
}

function normalizeToppingModel(gltfScene, targetSize) {
  gltfScene.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(gltfScene);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z) || 1;
  const scale = targetSize / maxDim;

  const wrapper = new THREE.Group();
  gltfScene.scale.setScalar(scale);
  gltfScene.position.set(
    -center.x * scale,
    -center.y * scale,
    -center.z * scale,
  );
  wrapper.add(gltfScene);
  return wrapper;
}

function showDecorateToast(msg) {
  decorateToast.textContent = msg;
  decorateToast.classList.remove("hidden");
  clearTimeout(decorateToast._timer);
  decorateToast._timer = setTimeout(() => {
    decorateToast.classList.add("hidden");
  }, 1300);
}

function enterDecorateScreen() {
  if (!scene && typeof THREE !== "undefined") {
    initThreeJS();
  }
  preloadToppingModels();

  if (nozzleMesh) {
    nozzleMesh.visible = false;
  }
  const decorateThreeContainer = document.getElementById(
    "decorate-three-container",
  );
  if (renderer && renderer.domElement && decorateThreeContainer) {
    decorateThreeContainer.appendChild(renderer.domElement);
  }

  showScreen(decorateScreen);
  initDecorateStage();
}

function updateCupDepthAlignment() {
  if (!staticCupMesh || !iceCreamGroup) return;

  const rightOffset =
    DECORATE_CUP_RIGHT_OFFSET_PX * getWorldUnitsPerPixel();
  const rotationY = iceCreamGroup.rotation.y;
  // Keep the cup at the same screen-space offset while the group rotates.
  staticCupMesh.position.x = Math.cos(rotationY) * rightOffset;
  staticCupMesh.position.z = Math.sin(rotationY) * rightOffset;
}

function centerIceCreamInRightZone() {
  if (!camera || !iceCreamGroup) return;

  const stageArea = document.querySelector(".icecream-stage-area");
  const stageRect = stageArea?.getBoundingClientRect();
  const targetNdcX = stageRect
    ? ((stageRect.left + stageRect.width / 2) / window.innerWidth) * 2 - 1
    : 0.465;
  const timerBarHeight = 36;
  const rightZoneCenterY =
    (0.41 * (window.innerHeight - timerBarHeight)) / window.innerHeight;
  const targetNdcY = 1 - rightZoneCenterY * 2;

  for (let i = 0; i < 4; i++) {
    iceCreamGroup.updateMatrixWorld(true);
    // Center from the finished stack position so a layer still falling into
    // place does not pull the cup and ice cream away from their visual center.
    const bounds = new THREE.Box3();
    if (staticCupMesh) {
      const cupCenter = staticCupMesh.getWorldPosition(new THREE.Vector3());
      const cupHalfSize = new THREE.Vector3(
        staticCupMesh.scale.x / 2,
        staticCupMesh.scale.y / 2,
        0,
      );
      bounds.expandByPoint(cupCenter.clone().sub(cupHalfSize));
      bounds.expandByPoint(cupCenter.clone().add(cupHalfSize));
    }
    activeLayers.forEach((layer) => {
      const currentY = layer.position.y;
      layer.position.y = layer.userData.targetY ?? currentY;
      layer.updateMatrixWorld(true);
      bounds.expandByObject(layer);
      layer.position.y = currentY;
      layer.updateMatrixWorld(true);
    });
    if (bounds.isEmpty()) return;

    const center = bounds.getCenter(new THREE.Vector3());
    const projected = center.clone().project(camera);
    const projectedRight = center
      .clone()
      .add(new THREE.Vector3(1, 0, 0))
      .project(camera);
    const projectedUp = center
      .clone()
      .add(new THREE.Vector3(0, 1, 0))
      .project(camera);
    const xPerUnit = projectedRight.x - projected.x;
    const yPerUnit = projectedUp.y - projected.y;
    if (Math.abs(xPerUnit) < 0.0001 || Math.abs(yPerUnit) < 0.0001) return;

    const deltaX = (targetNdcX - projected.x) / xPerUnit;
    const deltaY = (targetNdcY - projected.y) / yPerUnit;
    iceCreamGroup.position.x += deltaX;
    iceCreamGroup.position.y += deltaY;
    activeLayers.forEach((layer) => {
      shiftClipPlanes(layer.userData.verticalClipPlanes, deltaY);
    });
  }
}

function initDecorateStage() {
  clearDecorateTimers();

  if (iceCreamGroup) {
    placedToppings.forEach((t) => iceCreamGroup.remove(t));
    iceCreamGroup.position.set(0, 0, 0);
    iceCreamGroup.rotation.y = 0;
    updateCupDepthAlignment();
    // Keep every scoop centered over the cup. Apply the screen-space offset
    // to the shared group below so rotation cannot separate their Z depths.
    activeLayers.forEach((layer) => {
      layer.position.x = 0;
      layer.position.z = 0;
    });
    centerIceCreamInRightZone();
    iceCreamGroup.position.x -=
      DECORATE_LAYER_EXTRA_LEFT_PX * getWorldUnitsPerPixel();
  }
  placedToppings.length = 0;

  Object.keys(decorateState.counts).forEach((k) => {
    decorateState.counts[k] = 0;
  });
  decorateState.isActive = true;
  decorateState.timeLeft = DECORATE_TIME_LIMIT;
  decorateState.isAlarmActive = false;
  decorateState.isHiding = false;
  decorateState.draggingToppingType = null;
  decorateState.draggingTemplateMesh = null;

  policeAlarmOverlay.classList.add("hidden");
  hideStateOverlay.classList.add("hidden");
  decorateFailModal.classList.add("hidden");
  hideBtn.disabled = false;
  serveBtn.disabled = false;

  updateTraySlotStates();
  updateDecorateTimerUI();

  const currentOrder =
    selectedCustomerOrderIndex >= 0
      ? customerOrderSets[selectedCustomerOrderIndex]
      : null;
  orderReminderText.textContent = currentOrder
    ? `${FLAVORS[currentOrder.flavor].name}冰淇淋 ｜ ${currentOrder.toppings}`
    : "請依客人需求裝飾冰淇淋！";
  orderReminderBanner.classList.remove("hidden");

  decorateState.reminderTimerId = setTimeout(() => {
    orderReminderBanner.classList.add("hidden");
  }, 5000);

  scheduleNextPoliceAlarm();
}

function clearDecorateTimers() {
  clearTimeout(decorateState.alarmTimerId);
  clearTimeout(decorateState.alarmEndTimerId);
  clearTimeout(decorateState.reminderTimerId);
  if (decorateState.draggingPreviewMesh && scene) {
    scene.remove(decorateState.draggingPreviewMesh);
    decorateState.draggingPreviewMesh = null;
  }
  decorateState.draggingToppingType = null;
  decorateState.draggingTemplateMesh = null;
}

function screenToWorldOnZ(clientX, clientY, targetZ) {
  if (!camera) return new THREE.Vector3();
  const ndcX = (clientX / window.innerWidth) * 2 - 1;
  const ndcY = -(clientY / window.innerHeight) * 2 + 1;
  const vec = new THREE.Vector3(ndcX, ndcY, 0.5).unproject(camera);
  const dir = vec.sub(camera.position).normalize();
  const distance = (targetZ - camera.position.z) / dir.z;
  return camera.position.clone().add(dir.multiplyScalar(distance));
}

function updateTraySlotStates() {
  traySlots.forEach((slot) => {
    const type = slot.dataset.topping;
    const used = decorateState.counts[type] || 0;
    if (used >= MAX_TOPPING_PER_TYPE) {
      slot.classList.add("maxed");
    } else {
      slot.classList.remove("maxed");
    }
  });
}

// =========================================================================
// 從左側「食材.png」對應格子按下拖曳生成 3D 配料，並吸附至冰淇淋表面
// =========================================================================
traySlots.forEach((slot) => {
  slot.addEventListener("pointerdown", (e) => {
    e.stopPropagation();
    if (!decorateState.isActive || decorateState.isHiding || !scene) return;

    const type = slot.dataset.topping;
    if ((decorateState.counts[type] || 0) >= MAX_TOPPING_PER_TYPE) {
      showDecorateToast(`此配料最多只能放 ${MAX_TOPPING_PER_TYPE} 個！`);
      return;
    }

    const template = getRandomToppingTemplate(type);
    if (!template) return;

    decorateState.draggingToppingType = type;
    decorateState.draggingTemplateMesh = template;

    const preview = template.clone();
    preview.scale.setScalar(getToppingScale(type));
    if (FLAT_TOPPING_TYPES.has(type)) {
      preview.rotation.set(Math.PI / 2, 0, 0);
    }
    preview.position.copy(screenToWorldOnZ(e.clientX, e.clientY, 1.8));
    scene.add(preview);
    decorateState.draggingPreviewMesh = preview;
  });
});

let isDraggingIceCream = false;
let prevPointerX = 0;

decorateScreen.addEventListener("pointerdown", (e) => {
  if (!decorateState.isActive || decorateState.isHiding) return;
  if (e.target.closest("button") || e.target.closest(".tray-slot")) return;

  isDraggingIceCream = true;
  prevPointerX = e.clientX;
});

window.addEventListener("pointermove", (e) => {
  if (!decorateState.isActive || decorateState.isHiding) return;

  if (decorateState.draggingToppingType && decorateState.draggingPreviewMesh) {
    const type = decorateState.draggingToppingType;
    const hit = raycastIceCreamOnly(e.clientX, e.clientY);
    if (hit) {
      const frontAxis = FLAT_TOPPING_TYPES.has(type)
        ? new THREE.Vector3(0, 1, 0)
        : new THREE.Vector3(0, 0, 1);
      const preview = decorateState.draggingPreviewMesh;
      preview.quaternion.setFromUnitVectors(frontAxis, hit.normal);
      const surfaceOffset = getNormalSupportOffset(preview, hit.normal);
      preview.position
        .copy(hit.point)
        .addScaledVector(hit.normal, surfaceOffset);
    } else {
      decorateState.draggingPreviewMesh.position.copy(
        screenToWorldOnZ(e.clientX, e.clientY, 1.8),
      );
      if (FLAT_TOPPING_TYPES.has(type)) {
        decorateState.draggingPreviewMesh.rotation.set(Math.PI / 2, 0, 0);
      } else {
        decorateState.draggingPreviewMesh.rotation.set(0, 0, 0);
      }
    }
    return;
  }

  if (isDraggingIceCream && iceCreamGroup) {
    const deltaX = e.clientX - prevPointerX;
    prevPointerX = e.clientX;
    iceCreamGroup.rotation.y += deltaX * 0.012;
    updateCupDepthAlignment();
  }
});

window.addEventListener("pointerup", (e) => {
  isDraggingIceCream = false;

  if (!decorateState.draggingToppingType) return;

  const type = decorateState.draggingToppingType;
  const chosenTemplate = decorateState.draggingTemplateMesh;

  if (decorateState.draggingPreviewMesh && scene) {
    scene.remove(decorateState.draggingPreviewMesh);
    decorateState.draggingPreviewMesh = null;
  }
  decorateState.draggingToppingType = null;
  decorateState.draggingTemplateMesh = null;

  if (!decorateState.isActive || decorateState.isHiding) return;

  const hit = raycastIceCreamOnly(e.clientX, e.clientY);
  if (hit) {
    attachToppingToIceCream(type, chosenTemplate, hit.point, hit.normal);
  } else {
    showDecorateToast("請將配料放置在冰淇淋上！");
  }
});

window.addEventListener("pointercancel", () => {
  isDraggingIceCream = false;
  if (decorateState.draggingPreviewMesh && scene) {
    scene.remove(decorateState.draggingPreviewMesh);
    decorateState.draggingPreviewMesh = null;
  }
  decorateState.draggingToppingType = null;
  decorateState.draggingTemplateMesh = null;
});

function raycastIceCreamOnly(clientX, clientY) {
  if (!camera || !raycaster || !pointerNDC || activeLayers.length === 0) {
    return null;
  }

  pointerNDC.x = (clientX / window.innerWidth) * 2 - 1;
  pointerNDC.y = -(clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointerNDC, camera);

  const intersects = raycaster.intersectObjects(activeLayers, true);
  const firstHit = intersects.find((hit) => {
    let layer = hit.object;
    while (layer && !activeLayers.includes(layer)) {
      layer = layer.parent;
    }
    if (!layer) return false;

    // Reject scoop geometry hidden inside or below the cup rim as well as
    // the cup itself. This keeps drops on the visible ice-cream surface.
    const localHitPoint = iceCreamGroup.worldToLocal(hit.point.clone());
    const cupRimY = staticCupMesh
      ? staticCupMesh.position.y + staticCupMesh.scale.y / 2
      : CLIP_SETTINGS.cupTopY + sceneVerticalOffset;
    if (localHitPoint.y < cupRimY - 0.015) return false;

    const clippingPlanes = layer.userData.verticalClipPlanes || [];
    return clippingPlanes.every(
      (plane) => plane.distanceToPoint(hit.point) >= -0.015,
    );
  });
  if (!firstHit) return null;

  const worldNormal = firstHit.face
    ? firstHit.face.normal
        .clone()
        .transformDirection(firstHit.object.matrixWorld)
        .normalize()
    : new THREE.Vector3(0, 0, 1);

  return {
    point: firstHit.point,
    normal: worldNormal,
  };
}

function getNormalSupportOffset(object, normal) {
  object.position.set(0, 0, 0);
  object.updateMatrixWorld(true);

  let minProjection = Infinity;
  const vertex = new THREE.Vector3();
  object.traverse((child) => {
    const positions = child.isMesh && child.geometry?.attributes?.position;
    if (!positions) return;

    for (let i = 0; i < positions.count; i++) {
      vertex.fromBufferAttribute(positions, i).applyMatrix4(child.matrixWorld);
      minProjection = Math.min(minProjection, vertex.dot(normal));
    }
  });

  // Sink the topping a little into the scoop to hide tiny gaps on rounded
  // surfaces and make it read as resting on the ice cream.
  return Number.isFinite(minProjection) ? -minProjection - 0.03 : -0.03;
}

function attachToppingToIceCream(type, template, worldPoint, worldNormal) {
  const modelTemplate = template || getRandomToppingTemplate(type);
  if (!modelTemplate || !iceCreamGroup) return;

  const toppingObj = modelTemplate.clone();
  toppingObj.scale.setScalar(getToppingScale(type));
  iceCreamGroup.updateMatrixWorld(true);
  const groupWorldQuaternion = iceCreamGroup.getWorldQuaternion(
    new THREE.Quaternion(),
  );
  const localNormal = worldNormal
    .clone()
    .applyQuaternion(groupWorldQuaternion.clone().invert())
    .normalize();
  const frontAxis = FLAT_TOPPING_TYPES.has(type)
    ? new THREE.Vector3(0, 1, 0)
    : new THREE.Vector3(0, 0, 1);

  toppingObj.quaternion.setFromUnitVectors(frontAxis, localNormal);
  const surfaceOffset = getNormalSupportOffset(toppingObj, localNormal);
  const localAnchor = iceCreamGroup.worldToLocal(worldPoint.clone());
  iceCreamGroup.add(toppingObj);
  toppingObj.position
    .copy(localAnchor)
    .addScaledVector(localNormal, surfaceOffset);

  placedToppings.push(toppingObj);

  decorateState.counts[type] = (decorateState.counts[type] || 0) + 1;
  updateTraySlotStates();
}

// =========================================================================
// 警鈴臨檢（每10~15秒觸發，持續5秒，2秒內需點躲避）與 45 秒計時器
// =========================================================================
function scheduleNextPoliceAlarm() {
  if (!decorateState.isActive) return;

  const delayMs = (10 + Math.random() * 5) * 1000;
  decorateState.alarmTimerId = setTimeout(() => {
    triggerPoliceAlarm();
  }, delayMs);
}

function triggerPoliceAlarm() {
  if (!decorateState.isActive) return;

  decorateState.isAlarmActive = true;
  decorateState.isHiding = false;
  policeAlarmOverlay.classList.remove("hidden");

  if (decorateState.draggingPreviewMesh && scene) {
    scene.remove(decorateState.draggingPreviewMesh);
    decorateState.draggingPreviewMesh = null;
    decorateState.draggingToppingType = null;
    decorateState.draggingTemplateMesh = null;
  }

  const checkHideTimer = setTimeout(() => {
    if (
      decorateState.isActive &&
      decorateState.isAlarmActive &&
      !decorateState.isHiding
    ) {
      handlePoliceCaughtFail();
    }
  }, 2000);

  decorateState.alarmEndTimerId = setTimeout(() => {
    clearTimeout(checkHideTimer);
    if (!decorateState.isActive) return;

    decorateState.isAlarmActive = false;
    decorateState.isHiding = false;
    policeAlarmOverlay.classList.add("hidden");
    hideStateOverlay.classList.add("hidden");

    scheduleNextPoliceAlarm();
  }, 5000);
}

hideBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  if (!decorateState.isActive) return;

  if (!decorateState.isAlarmActive) {
    showDecorateToast("現在沒有警察臨檢喔！");
    return;
  }

  if (!decorateState.isHiding) {
    decorateState.isHiding = true;
    hideStateOverlay.classList.remove("hidden");
  }
});

function handlePoliceCaughtFail() {
  decorateState.isActive = false;
  clearDecorateTimers();
  policeAlarmOverlay.classList.add("hidden");
  hideStateOverlay.classList.add("hidden");
  decorateFailModal.classList.remove("hidden");
}

decorateFailRestartBtn.addEventListener("click", () => {
  decorateFailModal.classList.add("hidden");
  chooseCustomerOrder();
  showScreen(gameScreen);
  resetGame(customerOrderSets[selectedCustomerOrderIndex].flavor);
});

serveBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  if (!decorateState.isActive || decorateState.isHiding) return;

  decorateState.isActive = false;
  clearDecorateTimers();
  policeAlarmOverlay.classList.add("hidden");

  // TODO: 評分環節（暫時先空著）
  console.log("進入評分環節，目前放置配料統計：", decorateState.counts);
});

function updateDecorateTimerUI() {
  const ratio = Math.max(0, decorateState.timeLeft / DECORATE_TIME_LIMIT);
  decorateTimeFill.style.width = `${ratio * 100}%`;
  decorateTimeText.textContent = `剩餘時間：${Math.ceil(decorateState.timeLeft)}s`;
  decorateTimeFill.style.backgroundColor =
    decorateState.timeLeft <= 8 ? "#ff6b8b" : "#ff94d6";
}

function handleDecorateTimeUp() {
  decorateState.isActive = false;
  clearDecorateTimers();
  policeAlarmOverlay.classList.add("hidden");
  hideStateOverlay.classList.add("hidden");

  // TODO: 時間到自動出餐並進入評分環節（暫時先空著）
  console.log("裝飾時間結束，自動進入評分環節：", decorateState.counts);
}

// =========================================================================
// 統一視窗縮放監聽 & 主動畫迴圈
// =========================================================================
window.addEventListener("resize", () => {
  if (isSceneOneActive) {
    resizeFlowerCanvas();
    createFlowers();
  }
  resizeStarCanvas();
  if (decorateScreen.classList.contains("active")) {
    updateCupDepthAlignment();
    centerIceCreamInRightZone();
  }
});

window.addEventListener("DOMContentLoaded", () => {
  preloadToppingModels();
});

let lastTime = performance.now();

function animate(now) {
  requestAnimationFrame(animate);
  const dt = (now - lastTime) / 1000;
  lastTime = now;

  // 第五幕：擠冰淇淋 30 秒倒數
  if (state.isGameActive) {
    state.timeLeft -= dt;
    if (state.timeLeft <= 0) {
      state.timeLeft = 0;
      updateTimerUI();
      handleTimeUp();
    } else {
      updateTimerUI();
    }
  }

  // 第七幕：裝飾冰淇淋 45 秒倒數（警鈴閃爍期間暫停計時）
  if (
    decorateScreen.classList.contains("active") &&
    decorateState.isActive &&
    !decorateState.isAlarmActive
  ) {
    decorateState.timeLeft -= dt;
    if (decorateState.timeLeft <= 0) {
      decorateState.timeLeft = 0;
      updateDecorateTimerUI();
      handleDecorateTimeUp();
    } else {
      updateDecorateTimerUI();
    }
  }

  if (state.isPlayingRound) {
    state.phaseOffset += dt * (4.5 * 1.2);
    const variableSpeed = (0.28 + 0.18 * Math.sin(state.phaseOffset)) * 1.2;
    state.starScale -= variableSpeed * dt;

    if (state.starScale <= 0.08) {
      state.starScale = 1.0;
    }
  }

  activeLayers.forEach((layer) => {
    if (layer.userData.isFalling) {
      layer.position.y -= 7.5 * dt;
      if (layer.position.y <= layer.userData.targetY) {
        layer.position.y = layer.userData.targetY;
        layer.userData.isFalling = false;
      }
    }
  });

  if (gameScreen.classList.contains("active")) {
    renderStarsAndIndicator();
  }

  if (
    (gameScreen.classList.contains("active") ||
      decorateScreen.classList.contains("active")) &&
    renderer &&
    scene &&
    camera
  ) {
    renderer.render(scene, camera);
  }
}

requestAnimationFrame(animate);
