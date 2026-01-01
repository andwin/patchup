import { execa } from 'execa'
import type PackageManager from '../types/package_manager'

const installPackagesBeforeUpdateForPnpm = async () => {
  await execa`pnpm install`
}

const implementationForPackageManager: Record<
  PackageManager,
  () => Promise<void>
> = {
  pnpm: installPackagesBeforeUpdateForPnpm,
}

const installPackagesBeforeUpdate = async (packageManager: PackageManager) => {
  await implementationForPackageManager[packageManager]()
}

export default installPackagesBeforeUpdate
