import { asgardeo, AsgardeoProviderOptions } from '../src/providers/asgardeo'
import type { ProviderPartialOptions } from '../src/types'

const ISSUER = 'https://api.asgardeo.io/t/example'

const buildStrategy = (
  overrides: Partial<ProviderPartialOptions<AsgardeoProviderOptions>> = {}
): ProviderPartialOptions<AsgardeoProviderOptions> =>
  ({
    clientId: 'test_client_id',
    issuer: ISSUER,
    ...overrides
  } as ProviderPartialOptions<AsgardeoProviderOptions>)

describe('asgardeo provider', () => {
  test('defaults to the openIDConnect scheme', () => {
    const strategy = buildStrategy()
    asgardeo({}, strategy)
    expect(strategy.scheme).toBe('openIDConnect')
  })

  test('derives the discovery document endpoint from the issuer', () => {
    const strategy = buildStrategy()
    asgardeo({}, strategy)
    expect(strategy.endpoints.configuration).toBe(
      `${ISSUER}/oauth2/token/.well-known/openid-configuration`
    )
  })

  test('applies the default OpenID Connect scope', () => {
    const strategy = buildStrategy()
    asgardeo({}, strategy)
    expect(strategy.scope).toEqual(['openid', 'profile', 'email'])
  })

  test('merges a user-provided scope with default scope', () => {
    const strategy = buildStrategy({ scope: ['openid', 'internal_login'] })
    asgardeo({}, strategy)

    expect(strategy.scope).toEqual([
      'openid',
      'profile',
      'email',
      'openid',
      'internal_login'
    ])
  })

  test('does not override a user-provided configuration endpoint', () => {
    const custom = 'https://example.com/custom/.well-known/openid-configuration'
    const strategy = buildStrategy({
      endpoints: { configuration: custom }
    })
    asgardeo({}, strategy)
    expect(strategy.endpoints.configuration).toBe(custom)
  })
})
