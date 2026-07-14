# myCases 開發者指南

Yipin 的作品集網站（repo：`piiinpiiins/ypworks`）。這份文件講**怎麼維護與擴充**；每次改動的流水帳在 [DEV.md](DEV.md)。

線上：https://piiinpiiins.github.io/ypworks/

---

## 這是什麼

一個純靜態網站——只有 HTML + 一支 CSS + 一支 JS，沒有 build step、沒有框架、沒有套件。直接開檔就能看，push 到 GitHub 就上線。

核心檔案：

| 檔案 | 角色 |
|---|---|
| `style.css` | 全站唯一樣式表（含 motion 動態、切換鈕、banner） |
| `motion.js` | 全站唯一腳本（動態進場、Static/Motion 切換、All works 浮動鈕） |
| `all.html` | 「全部作品」彙整頁——**由各分類頁自動產生，不要手改** |
| `header-cover.jpg` | 每頁頂部橫幅照（221KB） |
| `Yipin photo.png` | favicon |

---

## 目錄結構

```
myCases/
├── index.html                ← 分類頁：生物設計（也是首頁）
├── synthersizer.html         ← 分類頁：合成器
├── interaction-design.html   ← 分類頁：互動設計
├── research.html             ← 分類頁：研究
├── curation.html             ← 分類頁：工作坊（注意檔名是 curation 不是 workshop）
├── teaching.html             ← 分類頁：教學（已從選單隱藏，但頁面還在）
├── about.html                ← 關於我（純文字頁，沒有 card-grid，不進 all.html 的彙整內容）
├── all.html                  ← 產生的彙整頁
├── style.css / motion.js / header-cover.jpg / Yipin photo.png
│
├── 01_bio_design/            ← 各分類的「作品資料夾」
│   ├── 01_006/index.html     ← 一個作品 = 一個資料夾 + index.html
│   │   └── images/cover.png  ← 封面（卡片用）
│   └── ...
├── 02_synthersizer/  03_interaction design/  04_research/
├── 05_workshop/  06_teaching/  07_base/
└── 09_Product/               ← 商品（分類頁在資料夾內，見下方「注意」）
    ├── index.html
    └── 09_001/index.html
```

### ⚠️ 兩種分類頁位置（歷史遺留的不一致）

- **多數分類頁在根目錄**：`curation.html`、`synthersizer.html` 等，選單直接連過去。
- **商品 Product 的分類頁在資料夾內**：`09_Product/index.html`（依使用者當時要求）。
- 各分類資料夾裡也有一份 `01_bio_design/index.html` 之類的檔——那是**舊的孤兒頁**（內容過時、沒人連結），不要當範本。真正在用的分類頁是上面根目錄那批 + `09_Product/index.html`。

---

## 路徑慣例（最容易錯的地方）

深度決定相對路徑：

| 檔案位置 | style.css / motion.js | 回根目錄 |
|---|---|---|
| 根分類頁（`curation.html`） | `style.css` | （本身在根） |
| 子資料夾分類頁（`09_Product/index.html`） | `../style.css` | `../` |
| 作品內頁（`01_bio_design/01_006/index.html`） | `../../style.css` | `../../` |

- 內頁封面圖用 `images/cover.png`（相對自己）。
- 內頁**返回連結**指向自己所屬的分類頁，例如生物設計內頁 → `../../index.html`「← 生物設計 Bio Design」；旁邊再放一個 `../../all.html`「全部作品 All works →」。
- `motion.js` 一律放在 `<head>`（同步執行，避免動態版切換閃爍）。

---

## 選單（section-nav）

目前順序（每個根分類頁、`09_Product/index.html`、`about.html`、`all.html` 都有同一份）：

```
生物設計 | 合成器 | 互動設計 | 研究 | 工作坊 | 商品 Product | 關於我 ABOUT ME | 全部作品 All works
```

- 選單只顯示名稱、不帶編號。
- `class="active"` 標在「當前頁」那一項。
- 從根頁連 Product／About Me 用 `09_Product/index.html`／`about.html`；從 Product 頁連別人（含 About Me）都要加 `../` 前綴。
- **教學 Teaching 不在選單**（頁面仍在，只是拿掉入口）。
- **關於我 About Me**（`about.html`）沒有 card-grid，只是一段自我介紹純文字頁（目前內文待補），所以**不在** `all.html` 產生器的 `pages` 清單裡（那份清單只收有 card-grid 的分類頁）——改 `about.html` 內文不用重建 all.html；但如果動到選單本身（順序、新增分類），還是要重建，因為 all.html 的 nav 是直接從 `index.html` 的 `<header>` 整段複製過去的。

底部另有「全部分類 All Categories」清單（01–05），這是獨立於選單的第二層導覽。目前**不含**商品 Product、關於我（只加在上方選單）。

---

## 常見維護操作

### A. 新增一個作品（到既有分類）

以生物設計為例，加一個 `01_007`：

1. 建資料夾 `01_bio_design/01_007/images/`，放 `cover.png`（卡片封面，4:3 最佳）。
2. 建 `01_bio_design/01_007/index.html`，複製現有內頁當範本，改：
   - `<title>`、`<h1>`
   - 返回連結：`../../index.html`「← 生物設計 Bio Design」（分類不同就換對應頁）
   - 內文與圖片
3. 在分類頁（`index.html`）的 `<div class="card-grid">` 裡加一張卡片：
   ```html
   <a href="01_bio_design/01_007/index.html" class="card"> <img src="01_bio_design/01_007/images/cover.png" class="card-media"> <div class="card-label">標題</div> </a>
   ```
4. **重建 all.html**（見下）。

> 沒有封面的卡片（placeholder）之前已全部移除，新卡片請務必附 `cover.png`。

### B'. 日誌型作品（如 01_007 真菌研究日誌）——編筆記只改 content.md，不碰 HTML

跟一般「一個作品一頁」不同，`01_bio_design/01_007-mycelium-log/` 是自成一格的小型 log 站，而且**內容是 `log.js` 在瀏覽器裡即時抓 `content.md` 轉出來的**，不是寫死在 `index.html` 裡——改內文只要存 `content.md`，重新整理頁面就看得到，不用叫我同步、也沒有編譯步驟。

```
01_007-mycelium-log/
├── index.html                    ← 只有骨架（banner、日期欄、筆記欄），內容是空的
├── log.js                        ← 抓每個日期資料夾的 content.md，轉成畫面
├── content.md                    ← 只放頁面標題與開場白，不放各則內容
├── images/cover.png              ← 頁首 banner，也是生物設計卡片的封面
├── 20260713/
│   ├── content.md                ← 這一則的內容，唯一要編輯的地方
│   └── S__197148681.jpg
└── 20260709/
    ├── content.md
    └── C91A9226-....JPG
```

**改既有一則**：直接編那個日期資料夾裡的 `content.md`，存檔、重新整理頁面即可。`content.md` 的格式（`log.js` 看得懂的寫法）：

```markdown
# YYYY-MM-DD

![說明文字](檔名.jpg)

一段開場白文字。

[連結文字](https://...)

- 配方／製程參數：...
- 問題與觀察：...
- 下一步：...
- self-founded
- tags: 標籤一, 標籤二
```

- 第一行 `#` 標題會被跳過（畫面上的日期標題是照資料夾名稱自動生成的，不是照這行文字）。
- `![說明](檔名.jpg)` 這一行會變成照片，檔名相對於這個日期資料夾（不用寫路徑前綴）。可以放好幾張、放在任何段落之間，都會照順序輸出。
- 單獨一行的 `[文字](網址)` 變成可點連結（例如 YouTube）。
- 用 `-` 開頭、彼此不隔空行的幾行會被當成一個清單：`標籤：內容` 格式的自動變粗體標籤；單獨一行 `self-founded` 原樣顯示；`tags: a, b` 這行**不會**印出來，會轉成畫面下方可點的 hashtag（點了篩選左邊日期清單，逗號分隔可以給多個）。
- 其他不符合以上規則的段落，就是普通一段文字。

**新增一則新日期**（**新到舊排列**，`log.js` 照 `index.html` 裡 `data-entries` 屬性的順序顯示，所以永遠把新資料夾名加在最前面）：

1. 建 `01_bio_design/01_007-mycelium-log/YYYYMMDD/`（不帶槓線），把這則的照片直接放進去。
2. 在裡面寫 `content.md`（格式如上）。
3. 打開 `index.html`，找到 `<div class="log-notes" data-entries="...">` 這一行，把新資料夾名（`YYYYMMDD`）加到 `data-entries` 最前面，逗號分隔。**這是唯一還要碰 HTML 的地方**——因為靜態網站沒辦法自己列目錄，需要一個清單告訴 `log.js` 有哪些日期。
4. 卡片封面 `images/cover.png` 通常不用換，除非想換代表照。
5. 這種頁不需要重建 all.html 的卡片（作品本身只有一張卡在生物設計 `index.html`），但如果換了 cover 圖或標題，仍要跑一次 C. 重建 all.html。

**本機預覽注意**：這個頁面靠 `fetch()` 讀 `content.md`，瀏覽器基於安全限制，直接雙擊打開 HTML（`file://`）會抓不到檔案（每則會顯示「載入失敗」，不會整頁空白，但也看不到內容）。本機要預覽真實效果，得先起一個本地伺服器再連過去，例如在 `myCases/` 資料夾下跑：
```bash
python3 -m http.server 8000
```
然後瀏覽器開 `http://localhost:8000/01_bio_design/01_007-mycelium-log/index.html`。**部署到 GitHub Pages 後不受影響**，正式站是用 https 伺服的，`fetch()` 完全正常。

這套「編 `content.md` 自動更新」「hashtag／篩選」機制**只用在這個日誌頁**，其他作品頁還是原本「一個作品一個 `index.html`」的寫法，不用比照。

### B. 新增一個分類

比照 `09_Product` 的做法（分類頁放資料夾內），或比照根目錄那批（分類頁放根目錄，較符合舊慣例）。無論哪種，都要：

1. 建分類頁（含 banner、header、nav、card-grid、footer）。
2. 把新項目**加進所有頁面的選單**（section-nav），插在想要的位置。
3. 決定要不要把它加進「全部分類 All Categories」footer。
4. 重建 all.html（記得把新分類頁加進產生器的 `pages` 清單）。

### C. 重建 all.html

`all.html` 是產生物。改了任何分類頁的卡片後都要重跑。目前產生器是**臨時 inline script**（尚未存檔——建議之後存成 `build-all.mjs`）。邏輯如下（可直接貼進 `python3 - <<'PY'` 執行）：

```python
import re, os
pages = ["index.html","synthersizer.html","interaction-design.html",
         "research.html","curation.html","09_Product/index.html"]  # 要顯示的分類（不含 teaching）
def extract(fn):
    html = open(fn, encoding="utf-8").read()
    m = re.search(r'<h2>(?!全部分類).*?</h2>', html, re.S); h2 = m.group(0)
    start = html.index('<div class="card-grid">', m.end()); depth=0; i=start
    while i < len(html):
        if html.startswith("<div", i): depth+=1
        elif html.startswith("</div>", i):
            depth-=1
            if depth==0: grid=html[start:i+6]; break
        i+=1
    d = os.path.dirname(fn)                       # 子資料夾分類頁：補上資料夾前綴
    if d:
        grid = re.sub(r'(href|src)="(?!http|/|\.\./)([^"]+)"',
                      lambda mm: '%s="%s/%s"' % (mm.group(1), d, mm.group(2)), grid)
    return h2, grid
sections = [s for s in (extract(p) for p in pages) if re.search(r'class="card[ \"]', s[1])]
src = open("index.html", encoding="utf-8").read()
banner = re.search(r'<div class="site-banner">.*?</div>', src, re.S).group(0)
header = re.sub(r'\s*class="active"', '',
                re.search(r'<header class="site-header">.*?</header>', src, re.S).group(0))
body = [("        <hr>\n" if i else "") + "        " + h2 + "\n        " + grid
        for i,(h2,grid) in enumerate(sections)]
doc = f'''<!DOCTYPE html>
<html lang="zh-TW">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>全部作品 All Works | Yi-Pin Huang</title>
        <link rel="stylesheet" href="style.css">
        <link rel="icon" type="image/png" href="Yipin photo.png">
        <script src="motion.js"></script>
</head>
    <body>
        {banner}
        {header}
        <hr>
        <p class="cat-label">全部作品 · All works on one page</p>
{chr(10).join(body)}
    </body>
</html>
'''
open("all.html","w",encoding="utf-8").write(doc)
```

規則：`pages` 決定顯示哪些分類與順序；`extract` 抓每頁的 `<h2>` + `.card-grid`；子資料夾分類頁的卡片路徑會自動補資料夾前綴（根分類頁不受影響）。

---

## Motion（動態視圖）

- `style.css` 裡所有動態都掛在 `html.motion` 之下；不加這個 class 就是原本的靜態外觀。
- `motion.js` 負責：在 `<head>` 依 localStorage 決定加不加 `.motion`；用 IntersectionObserver 把進入畫面的元素加上 `.in-view` 觸發進場。
- 會進場的元素（`SELECTOR`）：`.site-banner`、`.site-header`、`h2`、`hr`、`.card`、`.cat-index li`、`.detail-media`、`#desc`、`.cat-label`、`.back-link`。**新增想要有動畫的元素時，記得加進這個 SELECTOR，並在 CSS 補對應的隱藏/`.in-view` 樣式。**
- **預設 motion**；桌機右下角可切 Static（存 localStorage）。
- **手機（≤520px）一律 motion**、不顯示切換鈕、進場幅度加大。
- 尊重系統「減少動態效果」（`prefers-reduced-motion`）：開了就只顯示內容、不動。
- 左下角「全部作品」浮動鈕由 motion.js 注入，連結用 script 自身路徑推算 all.html 位置，內頁也不會錯。

---

## 部署（GitHub Pages）

- legacy 模式，`main` 分支根目錄，push 後自動建置。**內容是靜態檔，push 什麼就上什麼。**
- 自動觸發偶爾卡住。手動觸發（已設 shell alias）：
  ```bash
  pages-build     # = gh api -X POST repos/piiinpiiins/ypworks/pages/builds
  pages-status    # 查狀態，顯示 "built <commit前7碼>"
  ```
- 看到舊版通常是快取，硬重整（`Cmd+Shift+R`）。

---

## .gitignore（暫不發布的本機檔）

```
黃宜品活動表 yipin event.md
VISION BASE 願景與前期規劃.md
113-2 互動作品實務 課程說明.md
```

這些檔案本機保留、不上傳。若某天要發布，從 .gitignore 移除再 `git add`。

---

## 已知問題 / 待辦

- **83MB 大檔**：`01_bio_design/01_003-bioKit/images/intro.mp4` 超過 GitHub 50MB 建議上限（會警告）。要瘦身得壓縮 / 改 Git LFS / 影片外部化。`.git` 目前約 400MB。
- **all.html 產生器未存檔**：建議存成 `build-all.mjs` 之類，一行重建。
- **孤兒頁**：各分類資料夾內的 `index.html`（如 `01_bio_design/index.html`）是過時的舊頁，沒被連結；可考慮清掉。
- **商品 Product 位置不一致**：分類頁在 `09_Product/` 資料夾內，其餘在根目錄。
- **教學 Teaching**：頁面在、選單與 all.html 皆無入口（刻意隱藏）。
- **未上傳的 .md 連結**：teaching.html 等頁面若連到 .gitignore 的 .md，線上會 404（在發布前）。
- **`09_Product/09_001`**：目前是佔位內容（封面標「待補封面」、內文「（待補內文）」），待替換。
```
