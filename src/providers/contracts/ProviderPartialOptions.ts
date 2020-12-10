import { PartialExcept } from '../../types/utils'
import SchemeOptions from '../../schemes/contracts/SchemeOptions'
import ProviderOptions from './ProviderOptions'

export type ProviderPartialOptions<Options extends ProviderOptions & SchemeOptions> = PartialExcept<Options, keyof ProviderOptions | keyof SchemeOptions>

export default ProviderPartialOptions
