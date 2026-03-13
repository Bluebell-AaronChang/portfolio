export interface TechCategory {
  id: string
  name: string
  created_at: string
  updated_at: string
}

export interface Skill {
  id: string
  name: string
  name_key?: string
  category_id?: string
  icon?: string
  color?: string
  order_index: number
  show_in_hero: boolean
  created_at: string
  updated_at: string
}

export interface CreateSkillDto {
  name: string
  name_key?: string
  category_id?: string
  icon?: string
  color?: string
  order_index?: number
  show_in_hero?: boolean
}

export interface UpdateSkillDto extends Partial<CreateSkillDto> { }

export interface CreateTechCategoryDto {
  name: string
}

export interface UpdateTechCategoryDto extends Partial<CreateTechCategoryDto> { }
