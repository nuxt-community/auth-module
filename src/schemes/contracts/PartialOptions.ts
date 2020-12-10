import { PartialExcept } from '../../types/utils'
import SchemeOptions from './SchemeOptions'

export type PartialOptions<Options extends SchemeOptions> = PartialExcept<Options, keyof SchemeOptions>

export default PartialOptions
