export interface AppError {
  code: string
  message: string
  type: 'network' | 'business' | 'validation' | 'auth' | 'cancelled'
  hint?: string
  details?: string
}
