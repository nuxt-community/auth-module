import path from 'path'
import fs from 'fs'
import { execSync } from 'child_process'

const pkgPath = path.resolve(__dirname, '../package.json')
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))

const gitRef = execSync('git --no-pager log --format="%h" -n 1')
  .toString()
  .trim()

pkg.name = '@nuxtjs/auth-next'
pkg.version = '5.0.0-' + Math.round(new Date() / 1000) + '.' + gitRef

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2))
