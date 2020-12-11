import { PartialExcept } from '../../types/utils'
import SchemeOptions from '../../schemes/contracts/SchemeOptions'
import ProviderOptions from './ProviderOptions'

type ProviderOptionsKeys = Exclude<keyof ProviderOptions, 'clientSecret'>

export type ProviderPartialOptions<
  Options extends ProviderOptions & SchemeOptions
> = PartialExcept<Options, ProviderOptionsKeys>

export default ProviderPartialOptions
