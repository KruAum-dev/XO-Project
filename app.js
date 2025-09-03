// ===== XO Game (IT Neon) =====
const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
const scoreXEl = document.getElementById("scoreX");
const scoreOEl = document.getElementById("scoreO");
const scoreDEl = document.getElementById("scoreD");
const btnNewRound = document.getElementById("btnNewRound");
const btnReset = document.getElementById("btnReset");

const WIN_LINES = [
  [0,1,2],[3,4,5],[6,7,8], // แถว
  [0,3,6],[1,4,7],[2,5,8], // คอลัมน์
  [0,4,8],[2,4,6]          // แนวทแยง
];

let state, current, locked, scores;

init();

function init(){
  // เตรียม UI ช่อง 3x3
  boardEl.innerHTML = "";
  for (let i=0;i<9;i++){
    const b = document.createElement("button");
    b.className = "cell";
    b.setAttribute("role","gridcell");
    b.setAttribute("aria-label", `ช่องที่ ${i+1}`);
    b.dataset.index = i.toString();
    b.addEventListener("click", onCellClick);
    b.addEventListener("keydown", onCellKey);
    boardEl.appendChild(b);
  }

  // สถานะเกม
  state = Array(9).fill(null);
  current = "X";
  locked = false;

  // คะแนน เก็บใน memory ของหน้าไว้
  scores = { X: 0, O: 0, D: 0 };
  updateScoreUI();

  updateTurnUI();

  // ปุ่ม
  btnNewRound.addEventListener("click", newRound);
  btnReset.addEventListener("click", resetAll);
}

function onCellClick(e){
  const idx = Number(e.currentTarget.dataset.index);
  playAt(idx);
}

function onCellKey(e){
  if (e.key === "Enter" || e.key === " "){
    e.preventDefault();
    const idx = Number(e.currentTarget.dataset.index);
    playAt(idx);
  }
}

function playAt(idx){
  if (locked) return;
  if (state[idx] !== null) return;

  state[idx] = current;
  const cell = boardEl.children[idx];
  cell.classList.add(current.toLowerCase(), "disabled");
  cell.textContent = current;

  const result = checkResult();
  if (result){
    handleResult(result);
  }else{
    current = current === "X" ? "O" : "X";
    updateTurnUI();
  }
}

function checkResult(){
  // ชนะ?
  for (const [a,b,c] of WIN_LINES){
    if (state[a] && state[a] === state[b] && state[a] === state[c]){
      return { type: "win", player: state[a], line: [a,b,c] };
    }
  }
  // เสมอ?
  if (state.every(v => v !== null)) return { type: "draw" };
  return null;
}

function handleResult(res){
  locked = true;

  if (res.type === "win"){
    // ไฮไลต์ช่องที่ชนะ
    res.line.forEach(i => boardEl.children[i].classList.add("win"));
    statusEl.innerHTML = `ผู้ชนะคือ <span class="win">${res.player}</span>`;
    scores[res.player] += 1;
  }else{
    statusEl.innerHTML = `<span class="draw">เสมอ</span>`;
    scores.D += 1;
  }
  updateScoreUI();
}

function updateTurnUI(){
  statusEl.innerHTML = `เทิร์นของผู้เล่น <span class="${current === 'X' ? 'p1' : 'p2'}">${current}</span>`;
}

function updateScoreUI(){
  scoreXEl.textContent = scores.X;
  scoreOEl.textContent = scores.O;
  scoreDEl.textContent = scores.D;
}

function newRound(){
  // เคลียร์กระดาน แต่ไม่รีเซ็ตสกอร์
  state = Array(9).fill(null);
  locked = false;
  current = "X";
  Array.from(boardEl.children).forEach(c=>{
    c.textContent = "";
    c.className = "cell";
  });
  updateTurnUI();
  // โฟกัสช่องแรกเพื่อความสะดวก
  boardEl.children[0].focus();
}

function resetAll(){
  scores = { X: 0, O: 0, D: 0 };
  updateScoreUI();
  newRound();
}
