import { access } from 'node:fs/promises'
import { join } from 'node:path'
import type PackageManager from '../types/package_manager'

const lockFileForPackageManager: Record<PackageManager, string> = {
  pnpm: 'pnpm-lock.yaml',
}

const detectPackageManager = async (): Promise<PackageManager> => {
  for (const [packageManager, lockFile] of Object.entries(
    lockFileForPackageManager,
  )) {
    if (await exists(lockFile)) return packageManager as PackageManager
  }

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
