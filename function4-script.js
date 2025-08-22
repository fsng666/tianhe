/* -------------------------------------------------
   function4-script.js  (增强版)
   - 支持 <source> 标签
   - 更完整的错误处理
   - 自动播放限制友好提示
   - 支持跨域 / MIME 检查
---------------------------------------------------- */

(() => {
    // ----------------- 常量 -----------------
    const VIDEO_ROOT = "sp/function4/";   // 相对路径
    const PREFIX      = "video";         // 文件名前缀
    const EXTENSION   = ".mp4";          // 后缀，如需改动请自行修改

    // ----------------- DOM -----------------
    const inputEl   = document.getElementById("video-id");
    const playBtn   = document.getElementById("play-btn");
    const videoEl   = document.getElementById("video-player");
    const msgEl     = document.getElementById("msg");

    // ----------------- 工具函数 -----------------
    const clearMessage = () => { msgEl.textContent = ""; };
    const showMessage  = (txt) => { msgEl.textContent = txt; };

    /** 检查是否为 8 位数字 */
    const isValidId = (s) => /^\d{8}$/.test(s.trim());

    /** 生成完整 URL */
    const buildUrl = (id) => `${VIDEO_ROOT}${PREFIX}${id}${EXTENSION}`;

    /** 给 <video> 添加 <source> 并返回该 source 元素 */
    const setSource = (url) => {
        // 移除旧的 source（如果已有）
        const old = videoEl.querySelector("source");
        if (old) old.remove();

        const src = document.createElement("source");
        src.src = url;
        src.type = `video/mp4`; // 根据实际后缀自行修改
        videoEl.appendChild(src);
        return src;
    };

    // ----------------- 主逻辑 -----------------
    const loadVideo = async () => {
        clearMessage();
        const raw = inputEl.value;

        if (!raw) return showMessage("请输入视频编号！");
        if (!isValidId(raw)) return showMessage("编号必须为 8 位数字（如 00001234）。");

        const url = buildUrl(raw.trim());

        try {
            // 1️⃣ HEAD 请求检查文件是否存在、MIME 是否合适
            const head = await fetch(url, { method: "HEAD" });
            if (!head.ok) throw new Error(`HTTP ${head.status}`);

            const ct = head.headers.get("Content-Type") || "";
            if (!ct.includes("video")) {
                console.warn("服务器返回的 Content-Type 可能不正确:", ct);
                // 仍然尝试播放，部分浏览器会自行判断
            }

            // 2️⃣ 动态添加 source 并加载
            setSource(url);
            videoEl.load();

            // 3️⃣ 试图自动播放（需要用户交互）
            try {
                await videoEl.play();
            } catch (autoErr) {
                // 自动播放被阻止（常见于移动端）
                showMessage("视频已加载，点击播放器的播放按钮开始观看。");
            }
        } catch (err) {
            console.error(err);
            showMessage("未找到对应视频，请检查编号是否正确。");
            // 清空旧资源
            videoEl.removeAttribute("src");
            videoEl.innerHTML = ""; // 移除 <source>
            videoEl.load();
        }
    };

    // ----------------- 事件绑定 -----------------
    playBtn.addEventListener("click", loadVideo);
    inputEl.addEventListener("keypress", (e) => {
        if (e.key === "Enter") loadVideo();
    });

    // 当 video 播放出错时（比如编码不支持）给用户提示
    videoEl.addEventListener("error", (e) => {
        console.error("Video element error:", e);
        showMessage("视频播放出错，可能是编码不兼容或浏览器不支持该格式。");
    });
})();
