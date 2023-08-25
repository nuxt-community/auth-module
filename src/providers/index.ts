export * from './auth0'
export * from './discord'
export * from './drupal-simple_oauth'
export * from './facebook'
export * from './github'
export * from './google'
export * from './laravel-jwt'
export * from './laravel-passport'
export * from './laravel-sanctum'

export const ProviderAliases = {
  'drupal/simple_oauth': 'drupalSimpleOauth',
  'laravel/jwt': 'laravelJWT',
  'laravel/passport': 'laravelPassport',
  'laravel/sanctum': 'laravelSanctum'
}
