import { readFileSync } from 'node:fs'
import { findPackageJSON } from 'node:module'
import { pathToFileURL } from 'node:url'

const packageVersion = () => {
  try {
    const packageJsonPath = findPackageJSON(pathToFileURL(__filename).href)
    if (!packageJsonPath) {
      console.error('Could not find package.json')

      process.exit(1)
    }

    const { version } = JSON.parse(readFileSync(packageJsonPath, 'utf8'))
    return version
  } catch {
    console.error('Could not read package.json')

    process.exit(1)
  }
}

export default packageVersion
