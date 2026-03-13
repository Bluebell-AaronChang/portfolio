import { supabase } from '@/api/supabase'
import type { Project } from '@/types/project'

const STATIC_PROJECTS: Project[] = [
  {
    id: '1',
    i18n_key: 'project-global-pos',
    name: 'Global POS System',
    description: '全球共用 POS 銷售系統，支援多品牌、多市場、多幣別的統一銷售平台，涵蓋銷售、交易與帳務相關功能。',
    tech_stack: ['C#', '.NET', 'MS SQL'],
    contribution: '承擔核心模組設計與長期維護，規劃可維護與可擴充的系統架構，協助改善系統穩定性並降低技術負債。',
    order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    i18n_key: 'project-wms',
    name: 'WMS — Retail Warehouse Management System',
    description: '零售業倉儲管理系統，涵蓋入出庫管理、即時庫存追蹤、盤點流程，並支援多電商平台串接。',
    tech_stack: ['C#', '.NET', 'MS SQL'],
    contribution: '參與倉儲流程功能開發，設計 backend service 並優化資料庫查詢效能。',
    order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    i18n_key: 'project-tailtales',
    name: 'TailTales — Pet Health Management App',
    description: '專為現代飼主設計的寵物健康管理系統。主打「溫暖簡約風 (Warm Minimalism)」，提供多寵物無縫管理、健康紀錄等功能，並具備流暢的跨步驟表單與動態路由體驗。',
    tech_stack: ['Flutter', 'Dart', 'Riverpod', 'Supabase', 'GoRouter'],
    contribution: '獨立負責全端架構與 UI/UX 實作。前端使用 Riverpod 管理複雜的跨頁面表單狀態，並結合 GoRouter 實作 Auth Guard 路由攔截；後端使用 Supabase (PostgreSQL) 設計正規化資料庫，並嚴格設定 RLS (Row Level Security) 確保多用戶資料隔離與資安。',
    order: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    i18n_key: 'project-personal-cfo',
    name: 'Personal CFO — Cash Flow Navigation System',
    description: '企業級個人財務管理平台，捨棄傳統記帳思維，實現現金流預測、分期攤銷自動化與動態預算管理。具備歷史資料遷移引擎，可無痛匯入主流記帳 App 資料。',
    tech_stack: ['Vue 3', 'TypeScript', 'Supabase', 'PostgreSQL', 'TanStack Query', 'Tailwind CSS'],
    contribution: '獨立設計並開發全端架構，涵蓋雙式簿記資料模型設計、週期自動帳單引擎、信用卡跨月結帳路由、未來 30 天現金流預測曲線，以及 ETL 歷史資料匯入精靈。',
    order: 4,
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    i18n_key: 'project-mdm',
    name: 'Master Data Management System',
    description: '內部主檔資料系統，確保跨模組資料一致性並支援多品牌架構，為企業核心流程提供可靠資料基礎。',
    tech_stack: ['C#', '.NET', 'MS SQL'],
    contribution: '參與核心流程設計，確保資料完整性與跨系統一致性。',
    order: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: '6',
    i18n_key: 'project-digital-card',
    name: 'Digital Card — Google & Apple Wallet',
    description: '數位卡發卡系統，建置與維護 Google Wallet / Apple Wallet 發卡機制，提升會員數位體驗。',
    tech_stack: ['C#', '.NET', 'Google Wallet API', 'Apple Wallet API'],
    contribution: '建置完整發卡流程，處理第三方 API 整合與例外狀況。',
    order: 6,
    created_at: new Date().toISOString(),
  },
  {
    id: '7',
    i18n_key: 'project-ecommerce',
    name: 'E‑Commerce Platform Integration',
    description: '串接 Shopify、Bloomreach 等電商平台，實作資料同步流程，確保訂單與庫存資料即時一致。',
    tech_stack: ['C#', '.NET', 'Shopify API', 'Bloomreach'],
    contribution: '實作資料同步流程，確保資料同步穩定、正確，並具備後續擴充彈性。',
    order: 7,
    created_at: new Date().toISOString(),
  },
  {
    id: '8',
    i18n_key: 'project-supplier',
    name: 'Supplier Evaluation & Audit System',
    description: '供應商評比系統與內部稽核流程系統，建立多維度評比機制並將稽核作業數位化。',
    tech_stack: ['Vue 3', 'TypeScript', 'JavaScript'],
    contribution: '負責前端功能實作，支援表單客製化、審核流程控管與進度追蹤。',
    order: 8,
    created_at: new Date().toISOString(),
  },
  {
    id: '9',
    i18n_key: 'project-barcode',
    name: 'Barcode Verification App',
    description: '來料條碼比對應用程式，提升投料與收料流程準確性，將來料錯誤率由約 15% 降至 1%。',
    tech_stack: ['C#', '.NET', 'MS SQL'],
    contribution: '獨立開發整體系統，大幅降低人工錯誤與作業時間。',
    order: 9,
    created_at: new Date().toISOString(),
  },
  {
    id: '10',
    i18n_key: 'project-chrome-extension',
    name: 'Internal Project Management Chrome Extension',
    description: '透過 WXT + Vue 3 + Strapi 開發公司內部專案管理 Chrome Extension，提升團隊工作效率。',
    tech_stack: ['WXT', 'Vue 3', 'TypeScript', 'Strapi'],
    contribution: '負責整體架構設計與開發，串接 Strapi 後端 API，實現即時專案狀態追蹤與管理功能。',
    order: 10,
    created_at: new Date().toISOString(),
  },
  {
    id: '11',
    i18n_key: 'project-interview-platform',
    name: 'Interview Management Platform',
    description: '面試管理平台，整合候選人資料管理與面試流程電子化，提升招募作業效率。',
    tech_stack: ['Vue 3', 'TypeScript', 'Node.js'],
    contribution: '建置面試管理平台，整合候選人資料管理與面試流程電子化，實現招募流程數位化轉型。',
    order: 11,
    created_at: new Date().toISOString(),
  },
  {
    id: '12',
    i18n_key: 'project-wms-inventory',
    name: 'WMS — Semiconductor Warehouse Management System',
    description: '半導體產業倉儲管理系統，涵蓋入出庫管理、即時庫存追蹤與盤點流程。',
    tech_stack: ['Vue 3', '.NET 6', 'MS SQL'],
    contribution: '負責倉儲管理系統前後端開發，涵蓋入出庫管理、即時庫存追蹤與盤點流程功能實作。',
    order: 12,
    created_at: new Date().toISOString(),
  },
  {
    id: '13',
    i18n_key: 'project-email-scheduler',
    name: 'Automated Email Scheduling System',
    description: '自動化信件排程系統，支援排程發送與條件觸發，減少人工操作並提升通知效率。',
    tech_stack: ['Node.js', 'TypeScript'],
    contribution: '獨立開發自動化信件排程系統，實現排程發送與條件觸發機制，大幅降低人工操作成本。',
    order: 13,
    created_at: new Date().toISOString(),
  },
  {
    id: '14',
    i18n_key: 'project-worktime-bot',
    name: 'Work-hour Reminder Bot (Synology Chat)',
    description: '工時提醒 Bot，串接 Synology Chat，改善內部工時管理流程。',
    tech_stack: ['Node.js', 'Synology Chat API'],
    contribution: '開發工時提醒 Bot，透過 Synology Chat 即時推播提醒，改善內部工時填報效率與合規性。',
    order: 14,
    created_at: new Date().toISOString(),
  },
  {
    id: '15',
    i18n_key: 'project-face-recognition',
    name: 'Real-time Face Recognition Display System',
    description: '以 WebSocket 技術實作人臉辨識即時結果顯示系統，串接第三方人臉辨識平台。',
    tech_stack: ['Vue 3', 'WebSocket', 'TypeScript'],
    contribution: '實作 WebSocket 即時通訊架構，串接第三方人臉辨識平台，實現辨識結果即時呈現。',
    order: 15,
    created_at: new Date().toISOString(),
  },
  {
    id: '16',
    i18n_key: 'project-news-dashboard',
    name: 'News Industry Traffic Dashboard',
    description: '新聞產業內部流量分析戰情室，提供即時流量監控與數據視覺化。',
    tech_stack: ['Vue 3', 'TypeScript', 'Chart.js'],
    contribution: '負責前端製作，實現即時流量數據視覺化與戰情室介面設計。',
    order: 16,
    created_at: new Date().toISOString(),
  },
  {
    id: '17',
    i18n_key: 'project-waste-management',
    name: 'Manufacturing Waste Management System',
    description: '製造業廢棄物管理系統，包含後端串接櫃門警報與前端管理畫面製作。',
    tech_stack: ['Vue 3', 'Node.js', 'TypeScript', 'IoT'],
    contribution: '負責後端串接櫃門警報系統與前端管理畫面開發，實現廢棄物管理流程數位化。',
    order: 17,
    created_at: new Date().toISOString(),
  },
]

export interface GetProjectsOptions {
  signal?: AbortSignal
}

export async function getProjects(options?: GetProjectsOptions): Promise<Project[]> {
  if (!supabase) return STATIC_PROJECTS

  const query = supabase
    .from('projects')
    .select('*')
    .order('order', { ascending: true })

  if (options?.signal) {
    query.abortSignal(options.signal)
  }

  const { data, error } = await query

  if (error) throw { code: error.code, message: error.message, type: 'business' as const }
  return (data as Project[]) ?? []
}
