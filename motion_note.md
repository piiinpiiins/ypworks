# Saruya Hostel 網站技術分析 — 複刻指南

## Context
分析 https://saruya-hostel.com/ 的前端技術棧，為未來複刻提供完整的 CSS 和 JavaScript 動態參考。

---

## 一、技術棧總覽

| 層面 | 技術 |
|------|------|
| CMS | WordPress + **UNCODE 主題** |
| CSS | CSS3 Custom Properties + Flexbox/Grid |
| JS 框架 | UNCODE 自有 JS 庫（非 React/Vue） |
| 輪播 | **Owl Carousel**（fade 過場） |
| 字型 | **Adobe Typekit**（日文襯線/黑體） |
| 多語言 | WPML（JP/FR/EN） |
| 表單 | Contact Form 7 + reCAPTCHA v3 |
| 追蹤 | Google Analytics 4 (gtag) |

---

## 二、CSS 分析

### 2.1 佈局系統
- **Flexbox + Grid 混用**：WordPress block 使用 `is-layout-flex` / `is-layout-grid`
- **最大寬度容器**：桌面版 `max-width: 1200px`（`min-width: 960px` 以上）
- **間距系統**：CSS Variables `--wp--preset--spacing--60` ~ `--80`

### 2.2 字型設計（重點）
```css
/* 日文標題 — 明朝體風格 */
:lang(ja) h1, :lang(ja) h2 { font-family: 'a-otf-midashi-go-mb31-pr6n', serif; }

/* 日文內文 — 哥德體 */
:lang(ja) body { font-family: 'a-otf-gothic-bbb-pr6n', sans-serif; }
```
- 字級預設：`13px`（small）→ `42px`（x-large）
- 標題加粗：`font-weight: 600`，約 `24px`~`36px`

### 2.3 色彩方案
- **主色調**：黑白極簡為主
- **強調色**：Pale pink、Vivid red、Luminous orange
- **背景**：Cyan-bluish-gray
- **漸層**：Cool-to-warm spectrum、Midnight 等 WordPress 預設漸層

### 2.4 動畫與過場（核心亮點）

#### Keyframe 動畫
```css
/* 由上往下淡入 */
@keyframes anim_ttb {
  from { transform: translateY(-50px); opacity: 0; }
  to   { transform: translateY(0); opacity: 1; }
}

/* 由下往上淡入 */
@keyframes anim_btt {
  from { transform: translateY(50px); opacity: 0; }
  to   { transform: translateY(0); opacity: 1; }
}

/* 左至右 / 右至左 滑入 */
@keyframes anim_ltr { /* translateX(-50px) → 0 */ }
@keyframes anim_rtl { /* translateX(50px) → 0 */ }

/* Ken Burns 緩慢放大效果（英雄圖片） */
@keyframes kenburns {
  /* 40 秒無限循環的緩慢 zoom */
  animation: kenburns 40s ease infinite;
}
```

#### 過場曲線
```css
transition: background 1000ms cubic-bezier(0.25, 1, 0.5, 1),
            color 1000ms cubic-bezier(0.25, 1, 0.5, 1);
```
- 使用 `cubic-bezier(0.25, 1, 0.5, 1)` — 快進慢出，自然感強

### 2.5 響應式斷點
```
258px / 516px / 720px / 1032px / 1440px / 2064px / 2880px
```
- 手機版（< 959px）：導航列 logo 縮小至 `30px`
- 平板/桌面分界：約 `1048px`

### 2.6 特殊 CSS 效果
- **視差滾動**：`parallax_factor: 0.25`（由 JS 控制）
- **Ken Burns**：`.with-kburns .uncode-kburns` 元素上的持續放大
- **背景色漸變器**：`#changer-back-color` div，`opacity` 過場 `1000ms`
- **自訂游標**：互動元素上的客製化游標樣式

---

## 三、JavaScript 動態分析

### 3.1 捲動驅動動畫（Scroll-triggered）
```javascript
// 核心配置
{
  constant_scroll: "on",
  scroll_speed: 2,
  parallax_factor: 0.25
}
```
- **進場觸發**：`animate_when_almost_visible` class + `data-speed="1000"`
- **動畫時長**：`1.5s`，元素進入視窗時觸發 fade + slide
- **群組觸發**：`animate_when_parent_almost_visible` — 父容器進入視窗時，子元素依序動畫

### 3.2 UNCODE 核心初始化序列
```javascript
UNCODE.initCursor();   // 自訂游標
UNCODE.initBox();      // Lightbox / Modal
UNCODE.initRow();      // 行級佈局計算
UNCODE.initHeader();   // Header 固定/高度
UNCODE.fixMenuHeight(); // 選單高度修正
```

### 3.3 Owl Carousel 配置
```html
<div class="owl-carousel" data-fade="true" data-navspeed="1000">
```
- **過場模式**：Fade（非滑動）
- **導航速度**：1000ms
- **控制項**：prev/next 按鈕 + 底部圓點指示器

### 3.4 圖片載入策略
- **Lazy Loading**：延遲載入 + async srcset
- **自適應圖片**：`uncode_adaptive: 1`，根據螢幕尺寸載入不同解析度
- **壓縮品質**：`resize_quality: 80`
- **ShortPixel 優化**：可選的圖片壓縮

### 3.5 背景色切換系統
- `#changer-back-color` 元素
- Class `bg-changer-init` 啟動
- 隨捲動位置改變背景色，過場 `1000ms opacity`

### 3.6 其他互動
- **手機影片封鎖**：`block_mobile_videos` — 手機上不自動播放影片
- **表單提交**：監聽 `wpcf7mailsent` 事件，提交後跳轉感謝頁
- **hover 停用**：`disable-hover` class 在捲動時移除 hover 效果以提升效能

---

## 四、頁面結構與設計模式

### 4.1 頁面架構
```
Header（固定導航 + Logo 明/暗切換 + 語言切換器）
├── Hero Section（全幅圖片 + Ken Burns + 標語文字）
│   "A perfect imperfection, an extraordinary normality"
├── 房間展示（圖片 Grid + 淡入動畫）
├── 設施介紹
├── 地區資訊（富士吉田）
├── 藝術駐村 / 圖書館 / 展覽
├── 在地合作夥伴（亞麻、花草茶、盥洗用品、穀物麥片）
├── Access & Contact（地址、地圖、表單）
└── Footer（版權 + Facebook/Instagram 社群連結）
```

### 4.2 動態設計哲學
- **微妙且有目的的動態**：不花俏，每個動畫都有功能性
- **入場動畫**：fade + translate，1.5s，滾到才觸發
- **持續動態**：Ken Burns 為靜態圖片增加生命感
- **深度感**：視差 `0.25` factor 分離前後景
- **自然曲線**：cubic-bezier 確保非線性、有機的過場感受

---

## 五、複刻技術選擇（純 HTML/CSS/JS）

| 原站技術 | 複刻替代方案 |
|----------|-------------|
| WordPress + UNCODE | **純 HTML** 手刻頁面 |
| Owl Carousel | **Swiper.js**（CDN 引入，無需 npm） |
| UNCODE 捲動動畫 | **Intersection Observer API**（原生 JS） |
| 視差效果 | **scroll event** + `requestAnimationFrame` |
| Ken Burns | **純 CSS** `@keyframes` |
| Typekit 字型 | **Adobe Fonts** embed 或 **Google Fonts** 日文字型 |
| Lazy Loading | 原生 `loading="lazy"` 屬性 |
| 背景色切換 | **Intersection Observer** + CSS `transition` |
| 多語言 | 多個 HTML 檔案（`/ja/`, `/en/`） |
| Contact Form 7 | **Formspree** 或 **Netlify Forms**（免後端） |

---

## 六、純 HTML/CSS/JS 實作指引

### 6.1 專案結構
```
saruya-clone/
├── index.html
├── css/
│   ├── reset.css          # CSS Reset (normalize.css)
│   ├── variables.css      # CSS Custom Properties
│   ├── layout.css         # Grid / Flexbox 佈局
│   ├── typography.css     # 字型與文字樣式
│   ├── animations.css     # 所有 @keyframes 與動畫 class
│   ├── components.css     # 導航、輪播、卡片等元件
│   └── responsive.css     # 響應式斷點
├── js/
│   ├── scroll-animations.js  # 捲動觸發動畫
│   ├── parallax.js           # 視差效果
│   ├── bg-changer.js         # 背景色切換
│   ├── carousel.js           # Swiper 初始化
│   ├── cursor.js             # 自訂游標
│   └── main.js               # 入口 + 初始化
├── images/
│   ├── hero/
│   ├── rooms/
│   └── ...
└── fonts/                 # 若自行 host 字型
```

### 6.2 CSS 動畫實作

#### variables.css — 核心設計 token
```css
:root {
  /* 色彩 */
  --color-black: #000;
  --color-white: #fff;
  --color-gray: #abb8c3;
  --color-accent-pink: #f78da7;
  --color-accent-red: #cf2e2e;

  /* 間距 */
  --spacing-sm: 1rem;
  --spacing-md: 2rem;
  --spacing-lg: 4rem;
  --spacing-xl: 6rem;

  /* 容器 */
  --container-max: 1200px;

  /* 動畫 */
  --ease-natural: cubic-bezier(0.25, 1, 0.5, 1);
  --duration-enter: 1.5s;
  --duration-transition: 1000ms;
  --parallax-factor: 0.25;

  /* 字型 */
  --font-heading: 'a-otf-midashi-go-mb31-pr6n', 'Noto Serif JP', serif;
  --font-body: 'a-otf-gothic-bbb-pr6n', 'Noto Sans JP', sans-serif;
}
```

#### animations.css — 入場動畫
```css
/* 基礎隱藏狀態 */
.animate-on-scroll {
  opacity: 0;
  transition: opacity var(--duration-enter) var(--ease-natural),
              transform var(--duration-enter) var(--ease-natural);
}

/* 方向變體 */
.animate-on-scroll.from-bottom { transform: translateY(50px); }
.animate-on-scroll.from-top    { transform: translateY(-50px); }
.animate-on-scroll.from-left   { transform: translateX(-50px); }
.animate-on-scroll.from-right  { transform: translateX(50px); }

/* 觸發後的可見狀態 */
.animate-on-scroll.is-visible {
  opacity: 1;
  transform: translate(0, 0);
}

/* Ken Burns */
@keyframes kenburns {
  0%   { transform: scale(1); }
  50%  { transform: scale(1.1); }
  100% { transform: scale(1); }
}
.kenburns-active {
  animation: kenburns 40s ease infinite;
}

/* 背景色過場 */
.bg-transition {
  transition: background-color var(--duration-transition) var(--ease-natural);
}
```

### 6.3 JS 捲動動畫實作

#### scroll-animations.js
```javascript
// Intersection Observer 實現入場動畫
function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // 只觸發一次
      }
    });
  }, {
    threshold: 0.15,  // 元素 15% 進入視窗時觸發
    rootMargin: '0px 0px -50px 0px'
  });

  elements.forEach(el => observer.observe(el));
}
```

#### parallax.js
```javascript
// 視差滾動效果
function initParallax() {
  const parallaxElements = document.querySelectorAll('[data-parallax]');

  function updateParallax() {
    const scrollY = window.scrollY;
    parallaxElements.forEach(el => {
      const factor = parseFloat(el.dataset.parallax) || 0.25;
      const rect = el.getBoundingClientRect();
      const offset = (rect.top + scrollY - window.innerHeight / 2) * factor;
      el.style.transform = `translateY(${offset}px)`;
    });
    requestAnimationFrame(updateParallax);
  }

  requestAnimationFrame(updateParallax);
}
```

#### bg-changer.js
```javascript
// 背景色隨區塊切換
function initBgChanger() {
  const sections = document.querySelectorAll('[data-bg-color]');
  const body = document.body;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        body.style.backgroundColor = entry.target.dataset.bgColor;
      }
    });
  }, { threshold: 0.5 });

  sections.forEach(section => observer.observe(section));
}
```

### 6.4 HTML 骨架範例
```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Saruya Hostel Clone</title>

  <!-- 字型 -->
  <link rel="stylesheet" href="https://use.typekit.net/YOUR_KIT_ID.css">
  <!-- 或用 Google Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;600&family=Noto+Sans+JP:wght@400;500&display=swap" rel="stylesheet">

  <!-- Swiper CSS -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css">

  <!-- 自有樣式 -->
  <link rel="stylesheet" href="css/variables.css">
  <link rel="stylesheet" href="css/reset.css">
  <link rel="stylesheet" href="css/layout.css">
  <link rel="stylesheet" href="css/typography.css">
  <link rel="stylesheet" href="css/animations.css">
  <link rel="stylesheet" href="css/components.css">
  <link rel="stylesheet" href="css/responsive.css">
</head>
<body class="bg-transition">

  <!-- 固定導航 -->
  <header class="site-header">
    <nav class="nav-container">
      <a href="/" class="logo"><img src="images/logo.svg" alt="Saruya"></a>
      <ul class="nav-links">
        <li><a href="#rooms">The Hostel</a></li>
        <li><a href="#art">Art</a></li>
        <li><a href="#local">Local</a></li>
        <li><a href="#access">Access</a></li>
      </ul>
      <div class="lang-switcher">
        <a href="/ja/">JP</a> | <a href="/en/">EN</a>
      </div>
    </nav>
  </header>

  <!-- Hero + Ken Burns -->
  <section class="hero">
    <div class="hero-image kenburns-active">
      <img src="images/hero/main.jpg" alt="Saruya Hostel">
    </div>
    <h1 class="hero-title animate-on-scroll from-bottom">
      A perfect imperfection,<br>an extraordinary normality
    </h1>
  </section>

  <!-- 內容區塊 -->
  <section data-bg-color="#fff" class="rooms" id="rooms">
    <div class="container">
      <h2 class="animate-on-scroll from-bottom">Rooms</h2>
      <div class="swiper rooms-carousel">
        <!-- Swiper slides -->
      </div>
    </div>
  </section>

  <!-- ...更多區塊 -->

  <!-- JS -->
  <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
  <script src="js/scroll-animations.js"></script>
  <script src="js/parallax.js"></script>
  <script src="js/bg-changer.js"></script>
  <script src="js/carousel.js"></script>
  <script src="js/cursor.js"></script>
  <script src="js/main.js"></script>
</body>
</html>
```

### 6.5 自訂游標實作
```javascript
// cursor.js
function initCustomCursor() {
  const cursor = document.createElement('div');
  cursor.classList.add('custom-cursor');
  document.body.appendChild(cursor);

  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });

  // 互動元素上放大游標
  const interactives = document.querySelectorAll('a, button, .swiper-button-next, .swiper-button-prev');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
  });
}
```

```css
/* 自訂游標樣式 */
.custom-cursor {
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-black);
  border-radius: 50%;
  position: fixed;
  pointer-events: none;
  z-index: 9999;
  transition: transform 0.2s var(--ease-natural);
  transform: translate(-50%, -50%);
}
.custom-cursor.cursor-hover {
  transform: translate(-50%, -50%) scale(1.5);
}
```

---

## 七、複刻時的關鍵動畫參數速查

```
入場動畫位移：50px（上下）/ 50px（左右）
入場動畫時長：1.5s
過場曲線：cubic-bezier(0.25, 1, 0.5, 1)
背景過場：1000ms
Ken Burns：40s ease infinite
視差係數：0.25
輪播過場速度：1000ms (Swiper: speed: 1000)
捲動觸發閾值：15% 進入視窗
圖片品質：80%
容器最大寬度：1200px
手機斷點：959px
```

---

## 八、外部資源 CDN

```html
<!-- Swiper.js（取代 Owl Carousel） -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css">
<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>

<!-- Google Fonts 日文字型（免費替代 Typekit） -->
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;600&family=Noto+Sans+JP:wght@400;500&display=swap" rel="stylesheet">

<!-- Normalize.css -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/normalize.css@8/normalize.min.css">
```

---

## 九、驗證方式
- 在瀏覽器 DevTools 中開啟 saruya-hostel.com，逐一驗證以上動畫參數
- 使用 Performance tab 觀察捲動時的動畫觸發
- 使用 Network tab 確認圖片載入策略
- 複刻後以肉眼對比動畫節奏和視覺效果
- 測試響應式：手機（375px）、平板（768px）、桌面（1440px）
- Lighthouse 跑分確認效能
