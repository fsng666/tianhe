/* 文件名：function3-board.js */

/**
 * 五子棋（Gomoku）电子棋盘
 *  - 15 × 15 交叉点（总共 225 格）
 *  - 黑子先手，交替落子
 *  - 检测五连珠（横、竖、左斜、右斜）即为胜利
 *  - 兼容 PC 与移动端（点击 / 触摸）
 */

(() => {
    const BOARD_SIZE = 15;
    const boardEl = document.getElementById('board');
    const turnEl = document.getElementById('turn');
    const resetBtn = document.getElementById('resetBtn');

    // 0：空，1：黑，2：白
    const board = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0));
    let current = 1; // 1 为黑子，2 为白子
    let gameOver = false;

    // 创建格子
    function createBoard() {
        boardEl.innerHTML = '';
        for (let y = 0; y < BOARD_SIZE; y++) {
            for (let x = 0; x < BOARD_SIZE; x++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.x = x;
                cell.dataset.y = y;
                // 为了更好地点击体验，使用 `touchstart` 与 `click` 同时监听
                cell.addEventListener('click', handleClick);
                cell.addEventListener('touchend', handleClick);
                boardEl.appendChild(cell);
            }
        }
    }

    // 处理点击 / 触摸
    function handleClick(e) {
        if (gameOver) return;
        const cell = e.currentTarget;
        const x = Number(cell.dataset.x);
        const y = Number(cell.dataset.y);
        if (board[y][x] !== 0) return; // 已经有棋子

        // 放置棋子
        board[y][x] = current;
        const stone = document.createElement('div');
        stone.className = `stone ${current === 1 ? 'black' : 'white'}`;
        cell.appendChild(stone);

        // 检查胜负
        if (checkWin(x, y, current)) {
            gameOver = true;
            turnEl.innerHTML = `胜利：<span class="${current === 1 ? 'black' : 'white'}">${current === 1 ? '黑子' : '白子'}</span>！`;
            return;
        }

        // 切换玩家
        current = current === 1 ? 2 : 1;
        turnEl.innerHTML = `轮到：<span class="${current === 1 ? 'black' : 'white'}">${current === 1 ? '黑子' : '白子'}</span>`;
    }

    // 检查五连珠
    function checkWin(x, y, player) {
        // 4 个方向（水平、垂直、左斜、右斜）
        const dirs = [
            [[-1,0],[1,0]],     // 横
            [[0,-1],[0,1]],     // 竖
            [[-1,-1],[1,1]],     // 主对角线
            [[-1,1],[1,-1]]      // 副对角线
        ];
        for (const dir of dirs) {
            let count = 1; // 当前落子算 1
            for (const [dx, dy] of dir) {
                let nx = x + dx, ny = y + dy;
                while (isInside(nx, ny) && board[ny][nx] === player) {
                    count++;
                    nx += dx; ny += dy;
                }
            }
            if (count >= 5) return true;
        }
        return false;
    }

    function isInside(x, y) {
        return x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE;
    }

    // 重置游戏
    function reset() {
        board.forEach(row => row.fill(0));
        current = 1;
        gameOver = false;
        turnEl.innerHTML = `轮到：<span class="black">黑子</span>`;
        createBoard();
    }

    // 初始渲染
    createBoard();

    // 绑定重置按钮
    resetBtn.addEventListener('click', reset);
})();
