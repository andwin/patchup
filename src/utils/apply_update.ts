import { execa } from 'execa'
import type PackageManager from '../types/package_manager'
import type Update from '../types/update'

const applyUpdateForPnpm = async (update: Update): Promise<void> => {
  const args: string[] = []
  if (update.value.workspace.root) {
    args.push('-w')
  } else {
    args.push('--filter', update.value.workspace.name)
  }

  args.push('add', `${update.value.pkg}@latest`, '-E')

  await execa('pnpm', args)
}

const implementationForPackageManager: Record<
  PackageManager,
  (update: Update) => Promise<void>
> = {
  pnpm: applyUpdateForPnpm,
}

const applyUpdate = async (
  packageManager: PackageManager,
  update: Update,
): Promise<void> => {
  await implementationForPackageManager[packageManager](update)
}

export default applyUpdate
