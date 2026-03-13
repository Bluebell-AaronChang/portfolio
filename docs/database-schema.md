# Database Schema

> Last updated: 2026-03-14

---

## `projects`

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| id | uuid | NO | gen_random_uuid() | PK |
| title_zh | text | NO | '' | |
| title_en | text | NO | '' | |
| description_zh | text | NO | '' | |
| description_en | text | NO | '' | |
| contribution_zh | text | NO | '' | |
| contribution_en | text | NO | '' | |
| image | text | YES | | |
| skill_ids | uuid[] | NO | '{}' | FK → skills.id |
| github_url | text | YES | | |
| live_url | text | YES | | |
| status | project_status | NO | 'active' | enum: active, completed, archived, in-progress |
| project_type | text | NO | 'professional' | check: professional, personal |
| featured | boolean | NO | false | |
| order | integer | NO | 0 | |
| start_date | text | YES | | |
| end_date | text | YES | | |
| created_at | timestamptz | YES | now() | |
| updated_at | timestamptz | YES | now() | auto via trigger |

**Indexes:** idx_projects_order, idx_projects_featured (partial), idx_projects_status
**Trigger:** projects_updated_at → update_updated_at()

> ⚠️ `skill_ids` replaces the old `tags text[]` column. Stores skill UUIDs.

---

## `skills`

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| id | uuid | NO | gen_random_uuid() | PK |
| name | text | NO | | UNIQUE |
| name_key | text | YES | | i18n key |
| category_id | uuid | YES | | FK → tech_categories.id ON DELETE SET NULL |
| icon | text | YES | | icon name / url |
| color | text | YES | | hex color, e.g. #3178c6 |
| order_index | integer | YES | 0 | |
| show_in_hero | boolean | YES | false | |
| created_at | timestamptz | YES | now() | |
| updated_at | timestamptz | YES | now() | |

**Indexes:** idx_skills_category, idx_skills_order
**Constraints:** skills_name_key (UNIQUE name), skills_category_id_fkey

---

## `tech_categories`

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| id | uuid | NO | gen_random_uuid() | PK |
| name | text | NO | | UNIQUE |
| created_at | timestamptz | YES | now() | |
| updated_at | timestamptz | YES | now() | |

**Constraints:** tech_categories_name_key (UNIQUE name)

---

## `blog_posts`

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| id | uuid | NO | gen_random_uuid() | PK |
| slug | text | NO | | UNIQUE |
| title_zh | text | NO | '' | |
| title_en | text | NO | '' | |
| summary_zh | text | NO | '' | |
| summary_en | text | NO | '' | |
| content_zh | text | NO | '' | |
| content_en | text | NO | '' | |
| cover_image | text | YES | | |
| tags | text[] | NO | '{}' | blog tag names (denormalized) |
| status | text | NO | 'draft' | check: published, draft, archived |
| published | boolean | NO | false | derived from status |
| featured | boolean | NO | false | |
| view_count | integer | NO | 0 | |
| published_at | timestamptz | YES | | |
| created_at | timestamptz | YES | now() | |
| updated_at | timestamptz | YES | now() | auto via trigger |

**Indexes:** idx_blog_posts_slug, idx_blog_posts_published, idx_blog_posts_featured (partial), idx_blog_posts_tags (GIN)
**Trigger:** blog_posts_updated_at → update_updated_at()

---

## `blog_tags`

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| id | uuid | NO | gen_random_uuid() | PK |
| name | text | NO | | UNIQUE |
| slug | text | NO | | UNIQUE |
| color | text | YES | | hex color |
| created_at | timestamptz | YES | now() | |

---

## `site_config`

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| key | text | NO | | PK |
| value | jsonb | NO | | |
| updated_at | timestamptz | YES | now() | auto via trigger |

**Trigger:** site_config_updated_at → update_updated_at()

