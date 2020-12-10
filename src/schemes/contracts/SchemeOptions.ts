export interface TokenOptions {
  property: string
  type: string | false
  name: string
  maxAge: number | false
  global: boolean
  required: boolean
  prefix: string
  expirationPrefix: string
}

export interface RefreshTokenOptions {
  property: string | false
  type: string | false
  data: string | false
  maxAge: number | false
  required: boolean
  tokenRequired: boolean
  prefix: string
  expirationPrefix: string
}

export interface UserOptions {
  property: string | false
  autoFetch: boolean
}

export interface SchemeOptions {
  name: string
}

export default SchemeOptions
