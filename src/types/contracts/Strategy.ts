import SchemeOptions from '../../schemes/contracts/SchemeOptions'

export interface Strategy extends SchemeOptions {
  provider?: string | ((...args: unknown[]) => unknown)
  scheme: string
  enabled: boolean
  [option: string]: unknown
}

export default Strategy
