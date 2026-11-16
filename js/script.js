// 1. 在這裡設定你的劇本台詞（可自由增減，也能同時切換說話者名字）
const dialogues = [
  { name: "丘丘鈴", text: "運氣好差，今天撿垃圾又沒有收穫......" }, //[cite: 1]
  { name: "丘丘鈴", text: "今天的晚餐要怎麼辦呢......" },
  { name: "", text: "......？" },
  { name: "丘丘鈴", text: "疑...？前面有一間冰淇淋店？...是以前就有的嗎" },
  { name: "丘丘鈴", text: "(走進去看看...)" },
  { name: "丘丘鈴", text: "沒有店員嗎???" },
  { name: "丘丘鈴", text: "......如果我只拿一點點現金...應該不會被發現吧..." },
  { name: "丘丘鈴", text: "錢櫃怎麼還有密碼！！" },
  { name: "", text: "(叮咚）" },
];

// 2. 取得 HTML 元素
const gameScreen = document.getElementById("gameScreen");
const speakerName = document.getElementById("speakerName");
const dialogueText = document.getElementById("dialogueText");
const nextIndicator = document.getElementById("nextIndicator");

// 3. 狀態變數
let currentIndex = 0; // 目前第幾句
let charIndex = 0; // 目前打到第幾個字
let isTyping = false; // 是否正在打字中
let isFinished = false; // 是否已全部播放完畢
let typingTimer = null; // 計時器
const typingSpeed = 60; // 打字速度（毫秒/字，數字越小越快）

// 開始打字函式
function typeDialogue(index) {
  const currentLine = dialogues[index];

  // 判斷這句話有沒有人名，決定是否顯示黃色方塊
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

// 瞬間完成當前句子
function finishTyping() {
  clearInterval(typingTimer);
  dialogueText.textContent = dialogues[currentIndex].text;
  isTyping = false;

  // 如果是最後一句，結束對話並隱藏三角形、恢復一般滑鼠游標
  if (currentIndex === dialogues.length - 1) {
    isFinished = true;
    nextIndicator.classList.remove("show");
    gameScreen.style.cursor = "default";
  } else {
    nextIndicator.classList.add("show");
  }
}

// 點擊畫面時的互動邏輯
gameScreen.addEventListener("click", () => {
  // 如果全部台詞都結束了，就不再觸發任何動作
  if (isFinished) return;

  if (isTyping) {
    finishTyping();
  } else {
    currentIndex++;
    if (currentIndex < dialogues.length) {
      typeDialogue(currentIndex);
    }
  }
});

// 網頁載入後自動播放第一句
window.addEventListener("DOMContentLoaded", () => {
  typeDialogue(currentIndex);
});
