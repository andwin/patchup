import { execa } from 'execa'
import type PackageManager from '../types/package_manager'
import type Update from '../types/update'

const applyUpdateForPnpm = async (update: Update): Promise<void> => {
  const args: string[] = []
  if (update.workspace.root) {
    args.push('-w')
  } else if (update.workspace.name) {
    args.push('--filter', update.workspace.name)
  }

  args.push('add', `${update.packageName}@${update.latestVersion}`, '-E')

  await execa('pnpm', args)
}

const applyUpdateForNpm = async (update: Update): Promise<void> => {
  const args: string[] = []
  if (!update.workspace.root) {
    args.push('--workspace', update.workspace.name)
  }

  args.push(
    'install',
    `${update.packageName}@${update.latestVersion}`,
    '--save-exact',
  )

  await execa('npm', args)
}

const implementationForPackageManager: Record<
  PackageManager,
  (update: Update) => Promise<void>
> = {
  pnpm: applyUpdateForPnpm,
  npm: applyUpdateForNpm,
}

const applyUpdate = async (
  packageManager: PackageManager,
  update: Update,
): Promise<void> => {
  try {
    await implementationForPackageManager[packageManager](update)
  } catch (e) {
    ;(e as Error).message = 'Failed to apply update'
    throw e
  }
}

export default applyUpdate
