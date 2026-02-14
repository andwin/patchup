import { execa } from 'execa'
import type PackageManager from '../types/package_manager'

const packageManagerCommand: Record<PackageManager, string> = {
  pnpm: 'pnpm install',
  npm: 'npm ci',
}

const installPackages = async (packageManager: PackageManager) => {
  const command = packageManagerCommand[packageManager]
  await execa(command, { shell: process.env.SHELL || true })
}

export default installPackages
