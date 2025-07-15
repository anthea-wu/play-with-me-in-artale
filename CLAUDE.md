# Artale 組隊網站開發 - Claude 開發記錄

## 專案概述
建立一個幫助 Artale 玩家尋找組隊夥伴的網站，使用 Next.js + Vercel + Material-UI 技術棧。

## Scrum Team 架構

### 團隊成員分工
1. **產品負責人 (Product Owner) - Claude-PO**
   - 負責需求分析與 Story 規劃
   - 確保功能符合使用者需求
   - 撰寫詳細的 Acceptance Criteria

2. **技術架構師 (Tech Lead) - Claude-Tech**
   - 負責技術架構設計
   - 程式碼品質控制
   - 技術決策與最佳實踐

3. **全端開發者 (Full-stack Developer) - Claude-Dev**
   - 負責前後端實作
   - 撰寫測試程式
   - 執行 TDD 開發流程

## 開發流程與規範

### Sprint 規劃
- 每個 Story 開始前進行 Planning
- 需等待使用者確認計劃後才開始執行
- 每個 Story 完成後需等待使用者確認才進行下一個

### 開發方法
- **TDD (Test-Driven Development)**: 除了 Story 1 基礎架構外，所有功能都使用 TDD
- **測試優先**: 先寫測試，再實作功能
- **持續重構**: 確保程式碼品質

### 溝通規範
- **對話語言**: 與使用者對話時使用繁體中文
- **程式語言**: 程式碼、commit message、commands 使用英文
- **文件**: 專案文件使用繁體中文，技術註解使用英文

### 技術棧
- **前端**: Next.js (React + Material-UI) + TypeScript
- **後端**: Next.js API Routes
- **資料庫**: Vercel Postgres 或 PlanetScale (MySQL) + Prisma ORM
- **部署**: Vercel (免費額度很大方)
- **測試**: Jest + React Testing Library
- **程式碼品質**: ESLint + Prettier

### 技術選擇優點
- **一鍵部署**: Vercel 自動化部署流程
- **自動 CI/CD**: Git 整合自動建置與部署
- **Serverless**: 無伺服器管理成本
- **全端整合**: Next.js 前後端統一開發體驗

## 遊戲內容規格

### 職業系統
- 龍騎士
- 祭司

### 等級系統
- 起始等級: 70+
- 無等級上限
- 表單可自由填寫
- 篩選功能: 我的等級 ±5 範圍

### 地圖系統
- DT (Dragon Tower)
- PW (Phoenix Wing) 
- CD (Crystal Dungeon)

### 功能需求
- **配對類型**: 一起練等
- **時間設定**: 開始時間 + 結束時間
- **聯絡方式**: 
  - 遊戲 ID (必填)
  - Discord (選填)

## 資料庫設計

### groups 表格
```sql
CREATE TABLE groups (
  id UUID PRIMARY KEY,
  job VARCHAR(20) NOT NULL, -- '龍騎士' | '祭司'
  level INT NOT NULL, -- >= 70
  map VARCHAR(10) NOT NULL, -- 'DT' | 'PW' | 'CD'
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  game_id VARCHAR(50) NOT NULL,
  discord_id VARCHAR(50) NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  user_id VARCHAR(50) NULL -- 預留 Discord 登入
);
```

## API 規格

### POST /api/groups
```typescript
interface CreateGroupRequest {
  job: '龍騎士' | '祭司';
  level: number; // >= 70
  map: 'DT' | 'PW' | 'CD';
  start_time: string; // ISO 8601
  end_time: string; // ISO 8601
  game_id: string;
  discord_id?: string;
}
```

### GET /api/groups
```typescript
interface GetGroupsResponse {
  data: Array<{
    id: string;
    job: string;
    level: number;
    map: string;
    start_time: string;
    end_time: string;
    game_id: string;
    discord_id: string | null;
    created_at: string;
  }>;
}
```

## 介面設計規範

### 響應式布局
- **桌面**: 左側表單，右側列表 (左右分欄)
- **手機**: 上方表單，下方列表 (上下堆疊)
- **平板**: 依螢幕尺寸適應

### Material-UI 組件使用
- 表單: TextField, Select, DateTimePicker, Button
- 列表: Card, CardContent, Grid
- 篩選: FormControl, MenuItem, Chip
- 狀態: Skeleton, Alert, Snackbar

## Sprint 計劃

### Sprint 1: 基礎架構 & 資料庫 (1-2週)
1. **Story 1**: 建立基礎專案架構
2. **Story 2**: 設計並建立資料庫 Schema  
3. **Story 3**: 實作 API 端點

### Sprint 2: 表單功能 (1週)
4. **Story 4**: 實作組隊表單

### Sprint 3: 列表顯示 & 篩選 (1週)
5. **Story 5**: 顯示組隊列表
6. **Story 6**: 實作篩選功能

### Sprint 4: 優化 & 預留功能 (1週)
7. **Story 7**: 優化使用者體驗
8. **Story 8**: 預留 Discord 登入整合點

## Definition of Done
每個 Story 完成需滿足:
- [ ] 功能符合所有 Acceptance Criteria
- [ ] 通過所有測試 (單元測試 + 整合測試)
- [ ] 程式碼通過 ESLint + Prettier 檢查
- [ ] 本地 `npm run build` 建置成功
- [ ] 部署到 Vercel 正常運作
- [ ] 響應式設計在各裝置正常顯示
- [ ] 程式碼經過 code review

## 測試策略
- **單元測試**: 測試個別函數與組件
- **整合測試**: 測試 API 端點與資料庫操作
- **E2E 測試**: 測試完整使用者流程 (後期加入)
- **測試覆蓋率**: 目標 80% 以上

## 開發命令
```bash
# 開發環境
npm run dev

# 測試
npm run test
npm run test:watch

# 程式碼檢查
npm run lint
npm run format

# 建置
npm run build

# 資料庫
npx prisma migrate dev
npx prisma studio
```

## Sprint 1 Retrospective 改進事項

### Story 2 開始前的準備工作
- [ ] 建立 pre-commit hook 自動執行 lint 和 build
- [ ] 選擇穩定版本的 API 和組件，避免實驗性功能
- [ ] 每次推送前執行 `npm run build` 測試
- [ ] 準備 TDD 測試環境

### 技術決策記錄
- **響應式布局**: 優先使用 MUI Stack 而非 Grid2 (相容性考量)
- **部署流程**: GitHub push → Vercel 自動部署
- **錯誤處理**: TypeScript 嚴格模式幫助提早發現問題

### 團隊協作優化
- **明確 AC**: 未來 Story 的 AC 包含具體的技術要求
- **分工清晰**: PO 負責需求、Tech 負責架構、Dev 負責實作
- **問題解決**: 遇到技術問題時快速協作解決

---

*最後更新: 2025-07-15*