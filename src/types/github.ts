export interface GitHubRepo {
  id: number
  name: string
  repo: string
  description: string | null
  createdAt: string
  updatedAt: string
  pushedAt: string
  stars: number
  watchers: number
  forks: number
  defaultBranch: string
}

export interface GitHubReposResponse {
  repos: GitHubRepo[]
}
