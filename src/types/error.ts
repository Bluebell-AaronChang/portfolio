export interface AppError {
  code: string
  message: string
  type: 'network' | 'business' | 'validation'
}
