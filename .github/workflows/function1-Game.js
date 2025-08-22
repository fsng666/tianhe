/*-------------------------------------------------
  2048 逻辑实现（纯 Vanilla JS） 
  功能：
  • 初始化 / 重新开始
  • 键盘方向（↑←↓→）以及移动端按钮点击
  • 生成随机方块（2/4）
  • 判断是否胜利、游戏结束
---------------------------------------------------*/

const BOARD_SIZE = 4;              // 4×4
let board = [];                   // 2D 数组，保存每个格子的数值（0 表示空）
let score = 0;
let gameOver = false;
let gameWin = false;

// ------------------- 页面元素 -------------------
const boardEle = document.getElementById('game-board');
const newGameBtn = document.getElementById('new-game-btn');
const controlBtns = document.querySelectorAll('.control-btn');

// ------------------- 初始化 -------------------
function init() {
    board = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0));
    score = 0;
    gameOver = false;
    gameWin = false;
    addRandomTile();
    addRandomTile();
    drawBoard();
}

// ------------------- 随机生成 2 / 4 -------------------
function addRandomTile() {
    const empty = [];
    board.forEach((row, r) => {
        row.forEach((cell, c) => {
            if (cell === 0) empty.push([r, c]);
        });
    });
    if (empty.length === 0) return;
    const [r, c] = empty[Math.floor(Math.random() * empty.length)];
    // 90% 2, 10% 4
    board[r][c] = Math.random() < 0.9 ? 2 : 4;
}

// ------------------- 绘制棋盘 -------------------
function drawBoard() {
    // 清空
    boardEle.innerHTML = '';
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            const val = board[r][c];
            const tile = document.createElement('div');
            tile.className = 'tile';
            if (val !== 0) {
                tile.classList.add(`tile-${val}`);
                tile.textContent = val;
            }
            boardEle.appendChild(tile);
        }
    }
}

// ------------------- 合并与移动 -------------------
function slide(arr) {
    // 去掉 0，合并相等数字
    let newArr = arr.filter(v => v !== 0);
    for (let i = 0; i < newArr.length - 1; i++) {
        if (newArr[i] === newArr[i + 1]) {
            newArr[i] *= 2;
            score += newArr[i];
            newArr[i + 1] = 0;
            if (newArr[i] === 2048) gameWin = true;
        }
    }
    // 再次去掉 0 并补齐 0
    newArr = newArr.filter(v => v !== 0);
    while (newArr.length < BOARD_SIZE) newArr.push(0);
    return newArr;
}

// 根据方向执行一次移动；返回 true 表示有移动产生
function move(dir) {
    // dir: 0=up,1=right,2=down,3=left
    let moved = false;
    for (let i = 0; i < BOARD_SIZE; i++) {
        let line = [];
        for (let j = 0; j < BOARD_SIZE; j++) {
            switch (dir) {
                case 0: // up
                    line.push(board[j][i]); break;
                case 1: // right
                    line.push(board[i][BOARD_SIZE - 1 - j]); break;
                case 2: // down
                    line.push(board[BOARD_SIZE - 1 - j][i]); break;
                case 3: // left
                    line.push(board[i][j]); break;
            }
        }
        const newLine = slide(line);
        // 将结果写回 board
        for (let j = 0; j < BOARD_SIZE; j++) {
            let val = newLine[j];
            switch (dir) {
                case 0: // up
                    if (board[j][i] !== val) moved = true;
                    board[j][i] = val; break;
                case 1: // right
                    if (board[i][BOARD_SIZE - 1 - j] !== val) moved = true;
                    board[i][BOARD_SIZE - 1 - j] = val; break;
                case 2: // down
                    if (board[BOARD_SIZE - 1 - j][i] !== val) moved = true;
                    board[BOARD_SIZE - 1 - j][i] = val; break;
                case 3: // left
                    if (board[i][j] !== val) moved = true;
                    board[i][j] = val; break;
            }
        }
    }
    return moved;
}

// ------------------- 关键事件 -------------------
function handleInput(dir) {
    if (gameOver) return;
    const moved = move(dir);
    if (moved) {
        addRandomTile();
        drawBoard();
        if (gameWin) {
            setTimeout(() => alert('恭喜！你已达到 2048，继续玩看能否更高！'), 100);
        }
        if (isGameOver()) {
            gameOver = true;
            setTimeout(() => alert('游戏结束！没有可以移动的方块了。'), 100);
        }
    }
}

// 判断是否已无可移动的格子
function isGameOver() {
    // 有空格直接返回 false
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            if (board[r][c] === 0) return false;
        }
    }
    // 检查四个方向是否还有可以合并的
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE - 1; c++) {
            if (board[r][c] === board[r][c + 1]) return false;
            if (board[r][c] === board[r + 1]?.[c]) return false;
        }
    }
    // 最后一行/列的相邻检查
    for (let r = 0; r < BOARD_SIZE - 1; r++) {
        if (board[r][BOARD_SIZE - 1] === board[r + 1][BOARD_SIZE - 1]) return false;
    }
    for (let c = 0; c < BOARD_SIZE - 1; c++) {
        if (board[BOARD_SIZE - 1][c] === board[BOARD_SIZE - 1][c + 1]) return false;
    }
    return true;
}

/*------------------ 事件绑定 ------------------*/
document.addEventListener('keydown', (e) => {
    const map = { ArrowUp: 0, ArrowRight: 1, ArrowDown: 2, ArrowLeft: 3 };
    if (map[e.key] !== undefined) {
        e.preventDefault();
        handleInput(map[e.key]);
    }
});

controlBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const dirMap = { up: 0, right: 1, down: 2, left: 3 };
        handleInput(dirMap[btn.dataset.dir]);
    });
});

newGameBtn.addEventListener('click', () => {
    init();
});

/*------------------- 初始化 -------------------*/
init();
