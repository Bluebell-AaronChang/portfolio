export interface SkillCategoryDef {
  titleKey: string
  icon: string
  showInHero?: boolean
  skills: { key?: string; label: string; hero?: boolean }[]
}

export const SKILL_DEFS: SkillCategoryDef[] = [
  {
    titleKey: 'skills-backend',
    icon: '⚙️',
    skills: [
      { label: 'C#', hero: true },
      { label: '.NET', hero: true },
      { label: 'ASP.NET', hero: true  },
      { label: 'API Design', hero: true },
      { label: 'System Integration', hero: true  },
    ],
  },
  {
    titleKey: 'skills-frontend',
    icon: '🎨',
    skills: [
      { label: 'Vue 3', hero: true },
      { label: 'TypeScript', hero: true },
    ],
  },
  {
    titleKey: 'skills-mobile',
    icon: '📱',
    skills: [
      { label: 'Flutter', hero: true },
      { label: 'Dart' },
    ],
  },
  {
    titleKey: 'skills-database',
    icon: '🗄️',
    skills: [
      { label: 'MS SQL', hero: true },
    ],
  },
  {
    titleKey: 'skills-tools-process',
    icon: '🛠️',
    skills: [
      { label: 'Git', hero: true  },
      { label: 'Docker' , hero: true },
      { label: 'Scrum', hero: true },
    ],
  },
  {
    titleKey: 'skills-soft-skills',
    icon: '🤝',
    skills: [
      { key: 'skills-mentoring', label: 'Mentoring' },
      { key: 'skills-cross-team', label: 'Cross‑Team Collaboration' },
      { key: 'skills-technical-discussion', label: 'Technical Discussion' },
    ],
  },
]

export const HERO_TECH_TAGS: string[] = SKILL_DEFS.flatMap((cat) =>
  cat.skills.filter((s) => s.hero).map((s) => s.label),
)
