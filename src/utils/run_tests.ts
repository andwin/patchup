import { execa } from 'execa'
import type PackageManager from '../types/package_manager'

const runTestsForPnpm = async () => {
  await execa`pnpm test`
}

const implementationForPackageManager: Record<
  PackageManager,
  () => Promise<void>
> = {
  pnpm: runTestsForPnpm,
}

const runTests = async (packageManager: PackageManager) => {
  try {
    await implementationForPackageManager[packageManager]()
  } catch {
    throw new Error('Tests failed')
  }
}

export default runTests
