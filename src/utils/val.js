export const isUnset = o => typeof o === 'undefined' || o === null
export const isSet = o => !isUnset(o)
