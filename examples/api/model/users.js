// The actual database of users
const users = [
  {
    id: 0,
    name: 'Graham',
    providers: []
  }
]

// Get a single user by their Internal ID
function getUserById (id) {
  return users.find((u) =>
    u.id === id)
}

// Get a single user by their External ID with a specified provider
function getUserByExternalId (provider, id) {
  return users.find((u) =>
    u.providers.findIndex((p) => p.provider === provider && p.id === id) >= 0)
}

// Create a new user
function createUser (name, provider, id) {
  const user = {
    id: users.length,
    name: name,
    providers: [
      {
        provider: provider,
        id: id
      }
    ]
  }
  users.push(user)
  return user
}

module.exports = {
  getUserById,
  getUserByExternalId,
  createUser,
  userDB: users
}
