import { SchemeOptions } from 'src/schemes'
import { ProviderOptions, ProviderPartialOptions } from 'src/providers'

export type StrategyOptions<
  SOptions extends SchemeOptions = SchemeOptions
> = ProviderPartialOptions<ProviderOptions & SOptions>

export default StrategyOptions
