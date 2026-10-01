---
id: public-showcase
name: public-showcase
summary: 靜態 HTML 展示站，收納教材互動頁與東京旅遊導覽
state: paused
locations:
  - host: nitro
    path: C:\Users\brian\Downloads\10_projects\19_archive\public-showcase
    role: source
status_source: inline
snapshot: summary
related: []
card_reviewed: 2026-10-01
---

## 用途
靜態展示站，把教科書式內容做成可瀏覽的單頁互動示範；價值在具體頁面而非通用框架。適合靜態託管。

## 功能
- 波動／微分教材頁、元件示範、入口頁（README.md 列為目前包含）
- `tokyo_trip/index.html`：東京鐵路導覽（README 列為目前包含）
- 無自動化測試紀錄

## 結構與入口
- 根目錄：`index.html`、`ch16_waves_demo.html`、`ch3_derivatives_demo.html`、`demo_all_components.html`
- `tokyo_trip/`：旅遊導覽；`pages/`：章節分頁素材
- 啟動／測試：README 未寫本機伺服器指令（靜態開啟／Pages）
- 導覽手冊：`PROJECT_GUIDE.html`（cursor-grok-4.6-medium 產生，2026-10-01；來源未逐條人工核對）

## 外部依賴
- 瀏覽器端 MathJax（README.md）
- git remote 存在；卡片不寫帳號

## 禁區
- 無符合隱私關鍵字的檔名（未開啟旅遊頁內文）

## 給 AI 的注意事項
- 無 AGENTS.md；架構說明見 `ARCHITECTURE_for_VibeCoder.md`
- 不要把本 repo 做成通用 UI 框架

## 現況
- 目標：展示教材型互動頁（README.md）
- 卡在：文件未記載；HEAD 為 2026-08-06
- 下一步：文件未記載
