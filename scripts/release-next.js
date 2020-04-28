const path = require('path')
const fs = require('fs')
const { execSync } = require('child_process')

const pkgPath = path.resolve(__dirname, '../package.json')
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))

const gitCommit = execSync('git --no-pager log --format="%h" -n 1').toString().trim()
pkg.name = '@nuxtjs/auth-next'
pkg.version = '5.0.0-' + Math.round((new Date() / 1000)) + '.' + gitCommit

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2))

execSync('yarn clean', { stdio: 'inherit' })
execSync('yarn build', { stdio: 'inherit' })
execSync('npm publish', { stdio: 'inherit' })
