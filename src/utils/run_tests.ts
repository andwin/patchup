import { execa } from 'execa'
import type PackageManager from '../types/package_manager'

const runTestsForPnpm = async () => {
  await execa`pnpm test`
}

const runTestsForNpm = async () => {
  await execa`pnpm test`
}

const implementationForPackageManager: Record<
  PackageManager,
  () => Promise<void>
> = {
  pnpm: runTestsForPnpm,
  npm: runTestsForNpm,
}

const runTests = async (packageManager: PackageManager) => {
  try {
    await implementationForPackageManager[packageManager]()
  } catch (e) {
    ;(e as Error).message = 'Default test command failed'
    throw e
  }
}

export default runTests
