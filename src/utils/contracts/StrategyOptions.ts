import { ProviderOptions, ProviderPartialOptions } from '../../providers'
import { SchemeOptions } from '../../schemes'

export type StrategyOptions<
  SOptions extends SchemeOptions = SchemeOptions
> = ProviderPartialOptions<ProviderOptions & SOptions>

export default StrategyOptions
