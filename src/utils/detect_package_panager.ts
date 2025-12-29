import { access } from 'node:fs/promises'
import { join } from 'node:path'

type PackageManager = 'pnpm' | 'yarn' | 'npm'

const detectPackageManager = async (): Promise<PackageManager> => {
  if (await exists('pnpm-lock.yaml')) return 'pnpm'
  if (await exists('yarn.lock')) return 'yarn'
  if (await exists('package-lock.json')) return 'npm'

  console.error('No package manager found')
  console.error(
    'Please run this command in the root of your project with a package manager lock file',
  )
  process.exit(1)
}

const exists = async (filename: string) => {
  try {
    await access(join(process.cwd(), filename))
    return true
  } catch {
    return false
  }
}

export default detectPackageManager
