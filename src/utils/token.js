// Ie "Bearer " + token
export function addTokenPrefix (token, tokenType) {
  if (!tokenType || token.startsWith(tokenType)) {
    return token
  }

  return tokenType + ' ' + token
}
