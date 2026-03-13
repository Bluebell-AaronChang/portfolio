export const TECH_CATEGORIES: Record<string, string[]> = {
  Backend: [
    'C#',
    '.NET',
    '.NET 6',
    'ASP.NET',
    'ASP.NET MVC',
    'Node.js',
    'Nest.js',
    'Strapi',
  ],
  Frontend: [
    'Vue 3',
    'TypeScript',
    'JavaScript',
    'Tailwind CSS',
    'Chart.js',
    'amCharts 5',
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
    'Bloomreach API',
    'Synology Chat API',
    'TanStack Query',
  ],
  IoT: [
    'IoT',
  ],
}

export function getTechCategory(tech: string): string {
  for (const [category, techs] of Object.entries(TECH_CATEGORIES)) {
    if (techs.includes(tech)) return category
  }
  return 'Other'
}

export function getAllCategories(): string[] {
  return ['All', ...Object.keys(TECH_CATEGORIES)]
}
