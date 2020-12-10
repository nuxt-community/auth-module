import { PartialExcept } from '../../types/utils'
import SchemeOptions from './SchemeOptions'

export type SchemePartialOptions<Options extends SchemeOptions> = PartialExcept<Options, keyof SchemeOptions>

export default SchemePartialOptions
