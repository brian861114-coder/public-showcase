# public-showcase

入口已改為 **NOTES 個人部落格**（Astro），原本的 Demo Showcase 改為子頁：

- 首頁（部落格）：https://brian861114-coder.github.io/public-showcase/
- 展示館（舊入口）：https://brian861114-coder.github.io/public-showcase/showcase/

## 本機開發（一鍵）

雙擊 `start-blog.bat`，或：

```bash
npm install
npm start
```

- 網站：http://127.0.0.1:4321/
- 後台：http://127.0.0.1:4321/keystatic/
- 展示館：http://127.0.0.1:4321/showcase/

## 網站結構

| 路徑 | 內容 |
|---|---|
| `/` | NOTES 部落格首頁 |
| `/posts/...` | 文章 |
| `/about/` | 關於我 |
| `/showcase/` | 舊 Demo Showcase 入口 |
| `/showcase/tokyo_trip/` | 東京旅程 |
| `/showcase/*.html` | 教材／元件示範頁 |

## 新增文章

見下方檢查清單，或打開 Keystatic 後台。

### 用後台

1. `npm run dev` / `npm start`
2. 打開 http://127.0.0.1:4321/keystatic/
3. 新增或修改「文章」後儲存
4. commit → push 更新 GitHub Pages

### 用檔案

1. 在 `src/content/posts/` 新增／修改 `.mdx`
2. 媒體放 `public/images/`、`public/videos/`
3. 本機預覽後 commit / push

## 部署

推送到 `main` 後，GitHub Actions 會 build Astro 並部署到 Pages。

請確認 Repo → Settings → Pages → Source 為 **GitHub Actions**。
