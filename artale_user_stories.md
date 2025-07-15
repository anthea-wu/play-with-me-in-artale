# Artale 組隊網站 - User Stories

## 專案概述

建立一個幫助 Artale 玩家尋找組隊夥伴的網站，使用 Next.js + Vercel + Material-UI 技術棧。

### 技術棧
- **前端**: Next.js 13+ + Material-UI (MUI)
- **後端**: Next.js API Routes
- **資料庫**: Vercel Postgres / PlanetScale
- **部署**: Vercel

### 核心功能
- 組隊表單：選擇職業、等級、地圖、時間、聯絡方式
- 組隊列表：顯示所有組隊請求，支援篩選
- 響應式設計：桌面、手機、平板

---

## Sprint 1: 基礎架構 & 資料庫

### Story 1: 建立基礎專案架構
**As a** 開發者  
**I want** 建立 Next.js 專案基礎架構  
**So that** 我可以開始開發功能  

**Acceptance Criteria:**
- [ ] 使用 Next.js 13+ 建立專案
- [ ] 整合 Material-UI (MUI)
- [ ] 建立響應式 layout (桌面左右分欄，手機上下堆疊)
- [ ] 可以在本地成功運行
- [ ] 部署到 Vercel 並可訪問

**技術要求:**
- App Router 架構
- TypeScript 支援
- ESLint + Prettier 設定

---

### Story 2: 設計並建立資料庫 Schema
**As a** 開發者  
**I want** 建立資料庫並設計表格結構  
**So that** 我可以儲存組隊請求資料  

**Acceptance Criteria:**
- [ ] 選擇並設定資料庫 (Vercel Postgres/PlanetScale)
- [ ] 設計 `groups` 表格 schema:
  - `id` (主鍵, UUID/INT)
  - `job` (職業, VARCHAR) - 龍騎士/祭司
  - `level` (等級, INT) - 70+
  - `map` (地圖, VARCHAR) - DT/PW/CD
  - `start_time` (開始時間, TIMESTAMP)
  - `end_time` (結束時間, TIMESTAMP)
  - `game_id` (遊戲ID, VARCHAR)
  - `discord_id` (Discord, VARCHAR, 可選)
  - `created_at` (建立時間, TIMESTAMP)
  - `user_id` (預留給未來 Discord 登入, VARCHAR, 可選)
- [ ] 建立資料庫連線設定
- [ ] 可以在本地和 Vercel 環境連線資料庫
- [ ] 建立初始的種子資料 (測試用)

**技術要求:**
- 使用 Prisma ORM 或 Drizzle ORM
- 環境變數管理
- 資料庫遷移腳本

---

### Story 3: 實作 API 端點
**As a** 系統  
**I want** 提供 RESTful API  
**So that** 前端可以進行 CRUD 操作  

**Acceptance Criteria:**
- [ ] `POST /api/groups` - 建立組隊請求
- [ ] `GET /api/groups` - 取得所有組隊請求
- [ ] 輸入驗證 (職業、等級、地圖等)
- [ ] 錯誤處理與狀態碼
- [ ] API 回應格式一致
- [ ] 使用 Postman 或類似工具測試 API
- [ ] 部署到 Vercel 並可正常運作

**API 規格:**
```typescript
// POST /api/groups
{
  "job": "龍騎士" | "祭司",
  "level": number (>= 70),
  "map": "DT" | "PW" | "CD",
  "start_time": string (ISO 8601),
  "end_time": string (ISO 8601),
  "game_id": string,
  "discord_id": string | null
}

// GET /api/groups
{
  "data": [
    {
      "id": string,
      "job": string,
      "level": number,
      "map": string,
      "start_time": string,
      "end_time": string,
      "game_id": string,
      "discord_id": string | null,
      "created_at": string
    }
  ]
}
```

---

## Sprint 2: 表單功能

### Story 4: 實作組隊表單
**As a** 玩家  
**I want** 填寫組隊表單  
**So that** 我可以發布尋找隊友的請求  

**Acceptance Criteria:**
- [ ] 職業下拉選單 (龍騎士/祭司)
- [ ] 等級數字輸入框 (限制 70+)
- [ ] 地圖下拉選單 (DT/PW/CD)
- [ ] 開始時間/結束時間選擇器
- [ ] 遊戲 ID 必填輸入框
- [ ] Discord 選填輸入框
- [ ] 表單驗證 (必填欄位、等級限制)
- [ ] 提交後儲存到資料庫
- [ ] 手機版表單正常顯示
- [ ] 成功/錯誤訊息顯示

**UI 要求:**
- 使用 MUI 的 Form 組件
- 清晰的錯誤提示
- 適當的輸入提示 (placeholder)
- 提交按鈕禁用/啟用狀態

---

## Sprint 3: 列表顯示 & 篩選

### Story 5: 顯示組隊列表
**As a** 玩家  
**I want** 查看所有組隊請求  
**So that** 我可以找到合適的隊友  

**Acceptance Criteria:**
- [ ] 從資料庫讀取並顯示所有組隊請求
- [ ] 以卡片形式顯示 (職業、等級、地圖、時間、聯絡方式)
- [ ] 桌面版：表單左側，列表右側
- [ ] 手機版：表單上方，列表下方
- [ ] 空狀態顯示提示訊息
- [ ] 列表項目排序 (最新在上)

**UI 要求:**
- 使用 MUI Card 組件
- 清晰的資訊層級
- 時間格式化顯示
- 聯絡方式可點擊 (遊戲ID 複製、Discord 連結)

---

### Story 6: 實作篩選功能
**As a** 玩家  
**I want** 篩選組隊列表  
**So that** 我可以快速找到符合條件的隊友  

**Acceptance Criteria:**
- [ ] 職業篩選器 (全部/龍騎士/祭司)
- [ ] 地圖篩選器 (全部/DT/PW/CD)
- [ ] 我的等級輸入框 (篩選 ±5 等級)
- [ ] 篩選即時生效
- [ ] 清除篩選按鈕
- [ ] 篩選結果為空時顯示提示

**篩選邏輯:**
- 職業篩選：完全匹配
- 地圖篩選：完全匹配
- 等級篩選：目標等級 ± 5 範圍內

---

## Sprint 4: 優化 & 預留功能

### Story 7: 優化使用者體驗
**As a** 玩家  
**I want** 更好的使用體驗  
**So that** 我可以更方便地使用這個網站  

**Acceptance Criteria:**
- [ ] Loading 狀態顯示
- [ ] 成功/錯誤訊息 Toast
- [ ] 表單提交後清空並重新整理列表
- [ ] 自動重新整理列表
- [ ] 無障礙功能 (鍵盤導航、ARIA 標籤)
- [ ] SEO 優化 (meta tags)

**UX 改進:**
- 骨架屏 (Skeleton) 載入狀態
- 樂觀更新 (Optimistic Updates)
- 錯誤邊界 (Error Boundary)

---

### Story 8: 預留 Discord 登入整合點
**As a** 開發者  
**I want** 預留 Discord 登入的整合點  
**So that** 未來可以容易地加入身份驗證  

**Acceptance Criteria:**
- [ ] 資料庫已包含 user_id 欄位
- [ ] 預留登入按鈕位置
- [ ] 建立 auth 相關的 API 架構
- [ ] 文件說明未來整合步驟
- [ ] 現有功能不受影響

**預留架構:**
- NextAuth.js 整合準備
- Discord OAuth 應用程式設定文件
- 使用者權限設計

---

## 開發時程建議

| Sprint | 期間 | 重點 |
|--------|------|------|
| Sprint 1 | 1-2 週 | 基礎架構 + 資料庫 |
| Sprint 2 | 1 週 | 表單功能 |
| Sprint 3 | 1 週 | 列表顯示 + 篩選 |
| Sprint 4 | 1 週 | 優化 + 預留功能 |

## 技術債務與後續規劃

### 立即後續功能
- Discord OAuth 登入
- 使用者個人化設定
- 組隊請求編輯/刪除
- 即時通知功能

### 長期規劃
- 多語言支援
- 進階篩選 (時間範圍、等級範圍)
- 組隊歷史記錄
- 評價系統

---

## Definition of Done

每個 Story 完成時需要滿足：
- [ ] 功能符合所有 AC
- [ ] 通過本地測試
- [ ] 部署到 Vercel 正常運作
- [ ] 響應式設計在各裝置正常
- [ ] 程式碼經過 review
- [ ] 相關文件更新