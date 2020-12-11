import { ModuleOptions } from '../../types'

export type StorageOptions = ModuleOptions & {
  initialState: {
    user: null
    loggedIn: boolean
  }
}

export default StorageOptions
