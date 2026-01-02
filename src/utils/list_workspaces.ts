import { execa } from 'execa'
import type PackageManager from '../types/package_manager'
import type Workspace from '../types/workspace'

const listWorkspacesForPnpm = async (): Promise<Workspace[]> => {
  const result = await execa`pnpm list -r --depth -1 --json`
  const workspaces: Workspace[] = JSON.parse(result.stdout).map(
    (workspace: { name: string }) => ({ name: workspace.name, root: false }),
  )

  return workspaces
}

const implementationForPackageManager: Record<
  PackageManager,
  () => Promise<Workspace[]>
> = {
  pnpm: listWorkspacesForPnpm,
}

const listWorkspaces = async (
  packageManager: PackageManager,
): Promise<Workspace[]> => {
  const workspaces = await implementationForPackageManager[packageManager]()

  if (workspaces.length > 1) {
    workspaces[0].root = true
  }

  if (workspaces.length === 1) {
    // We don't need to know the name of the workspace if there is only one
    workspaces[0].name = ''
  }

  return workspaces
}

export default listWorkspaces
