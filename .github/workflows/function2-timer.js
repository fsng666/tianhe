/* file: function2-timer.js */

/**
 * 2026 年高考第一场（语文）开考时间：2026-06-07 09:00（北京时间）
 */
const GAOKAO_START = new Date('2026-06-07T09:00:00+08:00');

/**
 * 8 科目的开考时间（已按照您提供的时间填写）
 * 时间格式均为北京时间（+08:00），请根据实际安排自行修改。
 */
const subjects = [
    { name: '语文',    start: new Date('2026-06-07T09:00:00+08:00') },
    { name: '数学',    start: new Date('2026-06-07T15:00:00+08:00') },
    { name: '物理/历史', start: new Date('2026-06-08T09:00:00+08:00') },
    { name: '外语',    start: new Date('2026-06-08T15:00:00+08:00') },
    { name: '化学',    start: new Date('2026-06-09T08:30:00+08:00') },
    { name: '地理',    start: new Date('2026-06-09T11:00:00+08:00') },
    { name: '政治',    start: new Date('2026-06-09T14:30:00+08:00') },
    { name: '生物',    start: new Date('2026-06-09T17:00:00+08:00') }
];

/**
 * 将毫秒差转为「X 天 X 小时 X 分 X 秒」的文字（秒级显示）
 */
function formatDuration(ms) {
    const totalSec = Math.floor(ms / 1000);
    const days = Math.floor(totalSec / (24 * 3600));
    const hours = Math.floor((totalSec % (24 * 3600)) / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;

    const parts = [];
    if (days)    parts.push(`${days} 天`);
    if (hours)   parts.push(`${hours} 小时`);
    if (minutes) parts.push(`${minutes} 分`);
    parts.push(`${seconds} 秒`);
    return parts.join(' ');
}

/**
 * 更新页面上“距高考剩余天数”
 */
function updateOverallDays() {
    const now = new Date();
    const diff = GAOKAO_START - now;
    const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
    document.getElementById('overall-days').textContent = `${days} 天`;
}

/**
 * 初始化科目列表（在 <ul> 中生成 8 条 <li>）并第一次刷新
 */
function initSubjectList() {
    const ul = document.getElementById('subject-list');
    ul.innerHTML = ''; // 清空

    subjects.forEach((sub, index) => {
        const li = document.createElement('li');
        li.id = `subject-${index}`;
        li.textContent = `${sub.name}：加载中...`;
        ul.appendChild(li);
    });
}

/**
 * 更新 8 科目的倒计时（秒级）并在时间到达后显示 “已开始”
 */
function updateSubjectTimers() {
    const now = new Date();

    subjects.forEach((sub, index) => {
        const li = document.getElementById(`subject-${index}`);
        const diff = sub.start - now;

        if (diff <= 0) {
            // 已经开始
            li.textContent = `${sub.name}：已开始`;
            li.style.color = '#4caf50'; // 绿色
        } else {
            const timeStr = formatDuration(diff);
            li.textContent = `${sub.name}：${timeStr}`;
            li.style.color = '#555';
        }
    });
}

/**
 * 初始化并开启定时刷新（每秒一次）
 */
function init() {
    initSubjectList();

    // 初始渲染一次
    updateOverallDays();
    updateSubjectTimers();

    // 每秒刷新一次
    setInterval(() => {
        updateOverallDays();
        updateSubjectTimers();
    }, 1000);
}

// 页面加载完成后启动计时器
window.addEventListener('DOMContentLoaded', init);
