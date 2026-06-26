# 開發紀錄 DEV LOG

作品集網站（ypworks）開發紀錄。線上：https://piiinpiiins.github.io/ypworks/

---

## 2026-06-27 — Motion view、All works、Header 橫幅、導覽整理

這次的主軸：仿 [outpacestudios.com](https://www.outpacestudios.com/) 做出捲動進場的動態效果，並整理導覽與內容結構。

### 1. Static / Motion 雙視圖（commit `06cb0be`）
- 新增 `motion.js` + `style.css` 的 `.motion` 區段，做出捲動進場動畫：
  - 卡片：淡入 + 上升，依序錯開（stagger），圖片 Ken-Burns 縮放
  - 內頁主圖 / header 橫幅：遮罩抹開（clip-path wipe）+ 輕微 zoom
  - 分隔線 `hr`：由左往右抹開
- 進場用 `IntersectionObserver` 觸發 `.in-view`；緩動 `cubic-bezier(.16,1,.3,1)`
- 右下角 **Static / Motion 切換鈕**，選擇存 `localStorage`（跨頁保留）
- script 放在 `<head>` 同步執行，切換不閃爍；尊重 `prefers-reduced-motion`
- **預設模式後改為 motion**（一進站即動態，除非手動切 static）

### 2. 全部作品 All works（commit `06cb0be`）
- 新增 `all.html`：彙整所有分類的作品到單一頁面（由分類頁自動產生）
- 「全部作品 All works」入口：頂部選單、內頁返回列、左下角浮動鈕（每頁都有）

### 3. 導覽與內容整理（commit `06cb0be`）
- 內頁左上角返回連結：由「回首頁」改為回到**各自所屬分類**（如生物設計內頁 → 生物設計）
- 各分類頁底部加「全部分類 All Categories」清單
- 標題下方加 Instagram 連結（`https://www.instagram.com/yipin.play/`）
- 移除所有「只有佔位符、無實際內容」的項目，並刪除對應的 19 個空殼內頁資料夾
- 選單收掉「教學與講座 Teaching & Talks」與「策展與基地 Curation & Base」
  - base.html 整頁刪除
  - teaching.html 頁面保留，但選單與 all.html 都不再有入口（`1cb8c86` 把教學從 all.html 也移除）

### 4. 修正破損資源（commit `fa4fbbb`）
- 移除兩個生物設計內頁（01_005、01_006）失效的 `<video src="example.mp4">`（檔案從未上傳）
- `黃宜品活動表 yipin event.md` 加進 `.gitignore`（暫不發布；其卡片連結在上傳前線上會 404）

### 5. Header 橫幅照片（commit `9d7a588`）
- 每個分類頁與 all.html 標題上方加橫幅工作照
- 原圖 3.6MB PNG → 縮 1600px 寬、轉 JPEG → `header-cover.jpg`（**221KB**，減約 94%）
- alt：`I work in my home lab, my balcony`
- 動態版用遮罩抹開 + zoom 進場；響應式高度（桌機 280px、手機 200px）

### 6. 手機版優化（commit `7e22a53`）
- 手機（≤520px）**一律 motion**，不切 static、不理會桌機存的 static 設定
- 手機**隱藏 Static/Motion 切換鈕**（JS 不建立 + CSS `display:none` 雙保險）
- 手機進場動畫加大：卡片位移 34→56px、圖片 zoom 1.14→1.2、時間拉長到 1s，更有感

### 7. CV 修正與重轉（與網站無關，同資料夾）
- [黃宜品_CV.md](黃宜品_CV.md) 英文段落：`Ph.D. candidate` → `Ph.D. student`（本人是博士生，非博士候選人）
  - 日文「博士課程に在籍」、中文「博士班進修中」本來就正確，未動（誤植只在英文版）
- 用 SKILL `markdown-2-docx-n-pdf`（PingFang TC 中文／Helvetica Neue 英文）從修正後的 .md 重轉 PDF，覆蓋 `Yipin Huang- 黃宜品_CV.pdf`（220KB）
- **docx 整份刪除**；正本是 .md，PDF 由它轉出
- 驗證：轉檔中間 docx 內 `candidate` 0 次、`student` 1 次

---

## 架構備忘

- **`all.html` 是產生出來的**：由各分類頁的 `<h2>` + `.card-grid` 彙整而成。之後在分類頁增刪卡片後，all.html 不會自動更新，需重跑產生器（目前是臨時 inline script，尚未存成檔）。
- **路徑慣例**：分類頁在根目錄；內頁在 `分類資料夾/作品/index.html`（深度 2），用 `../../` 回根。`motion.js` 在 `<head>` 用各頁深度對應的相對路徑載入。
- **`motion.js` 注入的東西**：Static/Motion 切換鈕、左下角 All works 浮動鈕、捲動進場觀察器。All works 連結用 script 自身路徑算出 `all.html` 位置，內頁也不會錯。

## 部署備忘（GitHub Pages）

- legacy 模式，`main` 分支根目錄，push 後自動建置。
- 自動觸發偶爾會卡住（這次遇到過）。手動觸發：
  ```bash
  gh api -X POST repos/piiinpiiins/ypworks/pages/builds      # 觸發（已設 alias: pages-build）
  gh api repos/piiinpiiins/ypworks/pages/builds/latest --jq '.status + " " + .commit[0:7]'   # 查狀態（alias: pages-status）
  ```
- 看到舊版多半是瀏覽器/CDN 快取，硬重整（`Cmd+Shift+R`）即可。

## 已知待辦 / 注意

- `黃宜品活動表 yipin event.md` 尚未上傳：teaching.html / all.html 裡指向它的卡片在發布前線上會 404。要發布時把它從 `.gitignore` 移除再 `git add`。
- `prefers-reduced-motion`：使用者若在系統開了「減少動態效果」，即使選 motion 也只會看到內容、不會動（刻意保留的無障礙行為）。手機若覺得「沒動畫」可先確認此設定。
- `all.html` 產生器建議之後存成一支腳本（如 `build-all.mjs`），方便日後一行重建。
