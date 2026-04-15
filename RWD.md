# iOS RWD 版面調整規劃 (iPhone 13 ~ 17 全系列)

針對 iPhone 13 到 iPhone 17 全系列，螢幕尺寸（CSS 邏輯像素 width）主要集中在三個級距：
1. **375px**：iPhone 13 Mini / SE
2. **390px - 393px**：iPhone 13, 14, 15, 16 (標準版與 Pro 版)
3. **428px - 430px**：iPhone 13 Pro Max, 14 Plus~16 Plus/Pro Max

這表示現有的 `@media (max-width: 520px)` 已經能成功覆蓋所有的最新型號 iPhone。然而，為了擁有「Apple 等級」的最優化體驗，我們採用了以下的細節調整策略並寫入 CSS 中：

## 1. 支援 Dynamic Island 與瀏海（Safe Area）
iPhone 13 採用瀏海設計，而 14 Pro 以後到 17 則全面換用動態島（Dynamic Island）。如果在橫向（Landscape）瀏覽或無邊界設計中，內容很容易被遮擋。
**實作：** 在 Mobile 版本的 `body` 內距規劃中引入 iOS 專屬的 `env(safe-area-inset-*)`，確保不管手機橫拿直拿，內容都能避開危險顯示區域。

## 2. 觸控區域最佳化 (Touch Targets)
Apple 的 HIG（Human Interface Guidelines）建議最小觸控目標應為 `44px × 44px`。
**實作：** 針對 `< 520px` 裝置，稍微調高 `.card-label` 的字級（變為 13px）與 `padding` (12px 16px)，這有助於一般使用者在單手持機走路時，更輕易去觸碰目標。

## 3. 圖像比例自適應 (Fluid Image Heights)
原本的手機版把卡片圖片高度定死在 `150px`，這會導致在小寬度（Mini）跟大寬度（Pro Max）上看見的圖片長寬比例截然不同。
**實作：** 將寫死高度的做法改為 `aspect-ratio: 4 / 3`，確保所有的圖片都能在不管是大手機還是小手機上，以等高比例完美縮放。

## 4. OLED 螢幕黑轉深黑 (True Black Dark Mode)
iPhone 13~17 全系列皆採用 OLED 螢幕。OLED 顯示 `#000000` 時像素會直接關閉，能極大程度省電並且對比度極佳。
**實作：** 把 Dark Mode 的 `--bg` 由 `#0a0a0a`（深灰）調整成極致純黑 `#000000`，字體從 `#f2f2f2` 稍微提亮為 Apple 愛用的 `#f5f5f7`。卡片框線稍微調淡。這能夠對蘋果手機提供最頂尖舒適的暗黑模式體驗。
