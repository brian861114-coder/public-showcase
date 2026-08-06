# GitHub Pages 上傳說明

本文件記錄如何把 `github-pages/` 這份靜態副本，正確更新到 GitHub 並透過 GitHub Pages 上線。

---

## 一、目前實際部署方式（推薦）

東京旅程**不是獨立 repo**，而是放在 showcase 專案的子資料夾中：

| 項目 | 內容 |
|------|------|
| GitHub repo | https://github.com/brian861114-coder/public-showcase |
| 本專案對應路徑 | `public-showcase/tokyo_trip/` |
| Showcase 入口 | https://brian861114-coder.github.io/public-showcase/ |
| 東京旅程入口 | https://brian861114-coder.github.io/public-showcase/tokyo_trip/ |

Showcase 首頁 `index.html` 的旅遊卡片，連結到：

```text
tokyo_trip/index.html
```

---

## 二、更新前檢查

在複製或推送前，請確認：

1. **只複製靜態檔案**，不要帶入：
   - `server/`、`.openai/`、`migrations/`
   - `sync.html`、`assets/cloud-sync.js`
   - `dist/`、`.git/`（來源 repo 的 git 目錄）
2. **入口頁是 `index.html`**，不是 `trip_portal.html`
3. **鐵路地圖是 `tokyo_rail.html`**，不是 `index.html`
4. **路徑使用相對路徑**（例如 `assets/site.css`），不要用 `/assets/...` 開頭的絕對路徑
5. **本機預覽請用 HTTP**，不要直接雙擊 HTML（`file://` 會讓部分功能異常）
6. **大改內容後，把 `sw.js` 的快取版本號 +1**（見下方「快取版本」）

本機預覽：

```bash
cd github-pages
npx --yes serve .
```

瀏覽器開啟終端機顯示的網址，確認入口與各子頁正常。

### 快取版本（部署必做檢查）

網站有 Service Worker（`sw.js`），會在訪客瀏覽器裡快取頁面，方便離線觀看。  
若部署後不 bump 版本，有些人可能還短暫看到舊檔。

**每次有實質內容更新（改 HTML／CSS／JS／圖片）要上線前：**

1. 打開 `sw.js` 第一行，例如：

```js
const CACHE = 'tokyo-trip-gh-v16';
```

2. 把結尾數字 **+1**，例如改成：

```js
const CACHE = 'tokyo-trip-gh-v17';
```

3. 再連同其他改動一起複製到 `public-showcase` 並 push

數字只要單調遞增即可，不需跳號。只改說明文件、沒改網站內容時，可不用動。

---

## 三、標準更新流程（更新到 public-showcase）

以下假設：

- 來源資料夾：`tokyo_trip/github-pages/`
- 目標 repo 本機路徑：`public-showcase/`

### 步驟 1：拉最新 showcase

```powershell
cd C:\Users\brian\Downloads\public-showcase
git pull origin main
```

### 步驟 2：用最新版覆蓋 `tokyo_trip/`

```powershell
$src = "C:\Users\brian\Downloads\tokyo_trip\github-pages"
$dst = "C:\Users\brian\Downloads\public-showcase\tokyo_trip"

Remove-Item $dst -Recurse -Force
New-Item -ItemType Directory -Path $dst | Out-Null

Get-ChildItem $src -Force |
  Where-Object { $_.Name -ne '.git' } |
  ForEach-Object { Copy-Item $_.FullName (Join-Path $dst $_.Name) -Recurse -Force }
```

### 步驟 3：確認 showcase 入口連結正確

打開 `public-showcase/index.html`，旅遊卡片應指向：

```html
<a href="tokyo_trip/index.html" class="card">
```

**不要**再指向已刪除的 `tokyo_trip/trip_portal.html`。

### 步驟 4：提交並推送

```powershell
cd C:\Users\brian\Downloads\public-showcase
git status
git add index.html tokyo_trip/
git commit -m "Update tokyo_trip to latest GitHub Pages build."
git push origin main
```

### 步驟 5：驗證上線

1. 等 1–2 分鐘讓 GitHub Pages 重新部署
2. 開啟 https://brian861114-coder.github.io/public-showcase/tokyo_trip/
3. 若看到舊版：
   - 先確認本次是否有把 `sw.js` 的 `CACHE` 版本號 +1
   - 再強制重新整理（Windows：`Ctrl + Shift + R` 或 `Ctrl + F5`）
   - 仍舊時：Chrome → F12 → **Application** → **Service Workers** → **Unregister** → 再重新整理

---

## 四、若要改成獨立 repo 部署（選用）

若未來想讓東京旅程有自己的 GitHub Pages 網址（例如 `https://<user>.github.io/tokyo-trip/`）：

1. 在 GitHub 建立新 repo
2. 將 `github-pages/` 整個資料夾內容推上去（不含 `.git` 以外的後端檔案）
3. 到 repo **Settings → Pages**
4. **Source** 選 `Deploy from a branch`
5. **Branch** 選 `main`，**Folder** 選 `/ (root)`
6. 儲存後等待部署

此資料夾已包含 `.nojekyll`，可避免 Jekyll 忽略底線開頭檔案（例如 `_TRIP_KNOWLEDGE.md`）。

---

## 五、檔案結構速查

```text
github-pages/
├── index.html              # 旅程中心（GitHub Pages 入口）
├── tokyo_rail.html         # 東京鐵路互動地圖
├── trip_timeline.html      # 可編輯時程
├── packing_checklist.html  # 行前清單
├── transportation_guide.html
├── attractions_guide.html
├── japanese_phrases.html
├── emergency_guide.html
├── budget.html
├── search.html
├── manifest.webmanifest    # PWA
├── sw.js                   # Service Worker
├── .nojekyll               # GitHub Pages 用
├── assets/
│   ├── site.css
│   ├── site.js
│   ├── trip-data.js
│   ├── attraction-resources.js
│   ├── images/
│   └── ...
└── GITHUB_PAGES_DEPLOY.md  # 本說明文件
```

---

## 六、常見問題

### Q1. 推送後網站還是舊版？

依序檢查：

1. **等 GitHub Pages 部署完成**（通常 1–2 分鐘；可到 repo 的 **Actions** 或 **Settings → Pages** 看狀態）
2. **確認有 bump `sw.js` 快取版本**（例如 `v16` → `v17`）。這是最常漏掉的一步
3. **強制重新整理**：`Ctrl + Shift + R`（Mac：`Cmd + Shift + R`）
4. **解除 Service Worker**：F12 → Application → Service Workers → Unregister → 重新整理

補充說明：

- 目前 HTML 採「網路優先」：有網路時會盡量抓 GitHub 上的新頁面
- Service Worker 仍會快取內容供離線使用；換版本號可一次清掉訪客瀏覽器裡的舊快取箱
- 新版 Service Worker 接管後，頁面通常會自動重整一次；若對方一直開著舊分頁不重新進入，仍可能暫時看到舊內容

### Q2. 圖示或 SVG 不顯示？

- 不要用 `file://` 直接開 HTML
- `index.html` 的工具卡圖示已改為**頁內嵌 SVG sprite**，不依賴外部 `icons.svg` 引用
- 請用 `npx serve .` 或已部署的 HTTPS 網址測試

### Q3. 子頁連結 404？

- 確認 showcase 入口是 `tokyo_trip/index.html`
- 確認 `tokyo_rail.html` 存在，且沒有誤把鐵路地圖命名成 `index.html`
- 確認連結都是相對路徑，例如 `trip_timeline.html`

### Q4. 資料會同步到其他裝置嗎？

- **不會**。此 GitHub Pages 版已移除後端與雲端同步
- 清單、旅費、收藏只存在目前瀏覽器的 `localStorage`

### Q5. 修改完要先在哪裡改？

建議流程：

```text
在 github-pages/ 修改並本機測試
        ↓
（有改網站內容）sw.js 的 CACHE 版本號 +1
        ↓
複製到 public-showcase/tokyo_trip/
        ↓
commit + push
        ↓
GitHub Pages 自動更新
```

### Q6. Service Worker / 快取到底在做什麼？

簡短版：

| 狀況 | 行為 |
|------|------|
| 有網路、開 HTML 頁 | 優先向 GitHub 抓新版，再更新本機快取 |
| 沒網路 | 用本機快取，離線仍可看已開過的頁 |
| 你把 CACHE 改成新版本號 | 訪客下次進站會刪掉舊快取箱 |

所以「內容更新 + CACHE +1」是最穩的上線組合。

## 七、建議的 commit 訊息

```text
Update tokyo_trip to latest GitHub Pages static build.
```

若只改部分頁面，可更具體，例如：

```text
Update tokyo_trip attractions guide Google Maps links.
```

---

## 八、相關連結

- GitHub Pages 官方說明：https://docs.github.com/pages
- Showcase repo：https://github.com/brian861114-coder/public-showcase
- 線上入口：https://brian861114-coder.github.io/public-showcase/tokyo_trip/
