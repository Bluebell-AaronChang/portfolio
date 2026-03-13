/**
 * 技術分類映射 — 將 tech_stack 中的技術歸類到主題群組。
 * 用於 Projects Section 的 filter chip bar。
 *
 * 若新增專案用到了不在此 mapping 中的技術，它會自動被歸入 "Other"。
 */

export const TECH_CATEGORIES: Record<string, string[]> = {
  Backend: [
    'C#',
    '.NET',
    '.NET 6',
    'Node.js',
    'Strapi',
  ],
  Frontend: [
    'Vue 3',
    'TypeScript',
    'JavaScript',
    'Tailwind CSS',
    'Chart.js',
    'WXT',
    'WebSocket',
  ],
  Mobile: [
    'Flutter',
    'Dart',
    'Riverpod',
    'GoRouter',
  ],
  Database: [
    'MS SQL',
    'Supabase',
    'PostgreSQL',
  ],
  'Cloud & API': [
    'Google Wallet API',
    'Apple Wallet API',
    'Shopify API',
    'Bloomreach',
    'Synology Chat API',
    'TanStack Query',
  ],
  IoT: [
    'IoT',
  ],
}

/** 根據技術名稱回傳它所屬的分類，找不到則歸 "Other" */
export function getTechCategory(tech: string): string {
  for (const [category, techs] of Object.entries(TECH_CATEGORIES)) {
    if (techs.includes(tech)) return category
  }
  return 'Other'
}

/** 取得所有分類名稱（含 "All"）*/
export function getAllCategories(): string[] {
  return ['All', ...Object.keys(TECH_CATEGORIES)]
}
