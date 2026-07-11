# 東京旅程中心（GitHub Pages）

純靜態前端副本，適合部署到 [GitHub Pages](https://pages.github.com/)。清單、旅費與收藏僅使用瀏覽器 `localStorage`，不含後端、D1 或雲端同步。

## 行程

2026/7/19–7/25：河口湖 → 箱根 → 東京 → 成田返程

## 本機預覽

在專案根目錄啟動靜態伺服器即可，例如：

```bash
npx --yes serve .
```

瀏覽器開啟顯示的網址；入口為 `index.html`。

## 部署到 GitHub Pages

1. 將此資料夾推到 GitHub 儲存庫（可為獨立 repo，或 monorepo 的 `/docs`／子目錄）。
2. 在 repo **Settings → Pages** 選擇來源：
   - **Deploy from a branch**：選 `main`（或 `gh-pages`），資料夾選 `/`（root）或 `/docs`。
3. 若使用 **Project site**（`https://<user>.github.io/<repo>/`），本專案已使用相對路徑，可直接運作。
4. 首次部署後，PWA / Service Worker 會在 HTTPS 下啟用離線快取。

## 與原專案差異

| 項目 | 原專案 | 此副本 |
|------|--------|--------|
| 後端 Worker / D1 | 有 | 無 |
| `sync.html` / `cloud-sync.js` | 有 | 已移除 |
| OpenAI hosting / migrations | 有 | 無 |
| 入口頁 | `trip_portal.html` | `index.html` |
| 東京鐵路地圖 | `index.html` | `tokyo_rail.html` |

## 主要頁面

- `index.html` — 旅程中心
- `trip_timeline.html` — 可編輯時程
- `packing_checklist.html` — 行前清單
- `transportation_guide.html` — 交通攻略
- `attractions_guide.html` — 景點導覽
- `tokyo_rail.html` — 東京鐵路地圖
- `japanese_phrases.html` — 日語速查
- `emergency_guide.html` — 緊急手冊
- `budget.html` — 旅費與分帳
- `search.html` — 搜尋與收藏
