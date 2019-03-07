import uuid from 'uuid/v1'

export default async function({store, app, redirect}) {
  if (!store.$auth.loggedIn) {
    store.$auth.loginWith('local', {
      data: {
        uuid: uuid()
      }
    })
  }
}
