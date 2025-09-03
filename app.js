const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
const scoreXEl = document.getElementById("scoreX");
const scoreOEl = document.getElementById("scoreO");
const scoreDEl = document.getElementById("scoreD");
const btnNewRound = document.getElementById("btnNewRound");
const btnReset = document.getElementById("btnReset");

const WIN_LINES = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

let state, current, locked, scores;

init();

function init(){
  boardEl.innerHTML = "";
  for (let i=0;i<9;i++){
    const b = document.createElement("div");
    b.className = "cell";
    b.dataset.index = i;
    b.addEventListener("click", ()=> playAt(i));
    boardEl.appendChild(b);
  }
  state = Array(9).fill(null);
  current = "X";
  locked = false;
  scores = { X:0, O:0, D:0 };
  updateScoreUI();
  updateTurnUI();

  btnNewRound.addEventListener("click", newRound);
  btnReset.addEventListener("click", resetAll);
}

function playAt(idx){
  if(locked || state[idx]) return;
  state[idx] = current;
  const cell = boardEl.children[idx];
  cell.classList.add(current.toLowerCase());
  cell.textContent = current;

  const result = checkResult();
  if(result){ handleResult(result); }
  else {
    current = current === "X" ? "O" : "X";
    updateTurnUI();
  }
}

function checkResult(){
  for(const [a,b,c] of WIN_LINES){
    if(state[a] && state[a]===state[b] && state[a]===state[c]){
      return {type:"win", player:state[a], line:[a,b,c]};
    }
  }
  if(state.every(v=>v!==null)) return {type:"draw"};
  return null;
}

function handleResult(res){
  locked = true;
  if(res.type==="win"){
    res.line.forEach(i=> boardEl.children[i].classList.add("win"));
    statusEl.innerHTML = `ผู้ชนะคือ <span class="win">${res.player}</span>`;
    scores[res.player]++;
  }else{
    statusEl.innerHTML = `<span class="draw">เสมอ</span>`;
    scores.D++;
  }
  updateScoreUI();
}

function updateTurnUI(){
  statusEl.innerHTML = `เทิร์นของผู้เล่น <span class="${current==="X"?"p1":"p2"}">${current}</span>`;
}

function updateScoreUI(){
  scoreXEl.textContent = scores.X;
  scoreOEl.textContent = scores.O;
  scoreDEl.textContent = scores.D;
}

function newRound(){
  state.fill(null);
  locked = false;
  current = "X";
  Array.from(boardEl.children).forEach(c=>{
    c.textContent=""; c.className="cell";
  });
  updateTurnUI();
}

function resetAll(){
  scores = {X:0,O:0,D:0};
  updateScoreUI();
  newRound();
}
