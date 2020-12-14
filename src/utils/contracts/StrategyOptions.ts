import SchemeOptions from '../../schemes/contracts/SchemeOptions'
import { ProviderOptions, ProviderPartialOptions } from '../../providers'

export type StrategyOptions<
  SOptions extends SchemeOptions = SchemeOptions
> = ProviderPartialOptions<ProviderOptions & SOptions>

export default StrategyOptions
