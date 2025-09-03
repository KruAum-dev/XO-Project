// XO — Black & Pink
const boardEl   = document.getElementById("board");
const statusEl  = document.getElementById("status");
const scoreXEl  = document.getElementById("scoreX");
const scoreOEl  = document.getElementById("scoreO");
const scoreDEl  = document.getElementById("scoreD");
const btnNew    = document.getElementById("btnNewRound");
const btnReset  = document.getElementById("btnReset");

const WIN = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

let grid, turn, locked, scores;

init();

function init(){
  // สร้างช่อง 3x3
  boardEl.innerHTML = "";
  for(let i=0;i<9;i++){
    const c = document.createElement("button");
    c.className = "cell";
    c.dataset.i = i;
    c.setAttribute("aria-label", `ช่องที่ ${i+1}`);
    c.addEventListener("click", ()=> play(i));
    c.addEventListener("keydown", e=>{
      if(e.key==="Enter"||e.key===" "){ e.preventDefault(); play(i); }
    });
    boardEl.appendChild(c);
  }

  grid = Array(9).fill(null);
  turn = "X";
  locked = false;
  scores = {X:0,O:0,D:0};
  paintStatus();
  paintScore();

  btnNew.addEventListener("click", newRound);
  btnReset.addEventListener("click", resetAll);
}

function play(i){
  if(locked || grid[i]) return;
  grid[i] = turn;
  const cell = boardEl.children[i];
  cell.textContent = turn;
  cell.classList.add(turn.toLowerCase());

  const res = judge();
  if(res){ finish(res); }
  else {
    turn = turn==="X" ? "O" : "X";
    paintStatus();
  }
}

function judge(){
  for(const [a,b,c] of WIN){
    if(grid[a] && grid[a]===grid[b] && grid[a]===grid[c]){
      return {type:"win", player:grid[a], line:[a,b,c]};
    }
  }
  if(grid.every(v=>v!==null)) return {type:"draw"};
  return null;
}

function finish(res){
  locked = true;
  if(res.type==="win"){
    res.line.forEach(i=> boardEl.children[i].classList.add("win"));
    statusEl.innerHTML = `ผู้ชนะคือ <span class="win">${res.player}</span>`;
    scores[res.player] += 1;
  }else{
    statusEl.innerHTML = `<span class="draw">เสมอ</span>`;
    scores.D += 1;
  }
  paintScore();
}

function paintStatus(){
  statusEl.innerHTML = `ตาเดินของ <span class="${turn==='X'?'p1':'p2'}">${turn}</span>`;
}

function paintScore(){
  scoreXEl.textContent = scores.X;
  scoreOEl.textContent = scores.O;
  scoreDEl.textContent = scores.D;
}

function newRound(){
  grid.fill(null);
  locked = false;
  turn = "X";
  Array.from(boardEl.children).forEach(c=>{ c.className="cell"; c.textContent=""; });
  paintStatus();
  boardEl.children[0].focus();
}

function resetAll(){
  scores = {X:0,O:0,D:0};
  paintScore();
  newRound();
}
