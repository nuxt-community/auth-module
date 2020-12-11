import ProviderPartialOptions from '../../providers/contracts/ProviderPartialOptions'
import ProviderOptions from '../../providers/contracts/ProviderOptions'
import SchemeOptions from '../../schemes/contracts/SchemeOptions'

export type StrategyOptions<
  SOptions extends SchemeOptions = SchemeOptions
> = ProviderPartialOptions<ProviderOptions & SOptions>

export default StrategyOptions
