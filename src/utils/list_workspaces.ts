import { execa } from 'execa'
import type PackageManager from '../types/package_manager'
import type Workspace from '../types/workspace'

const listWorkspacesForPnpm = async (): Promise<Workspace[]> => {
  const result = await execa`pnpm list -r --depth -1 --json`
  const workspaces: Workspace[] = JSON.parse(result.stdout).map(
    (workspace: { name: string }) => ({ name: workspace.name, root: false }),
  )

  if (workspaces.length > 1) {
    const rootWorkspace = workspaces.at(0)
    if (rootWorkspace) {
      rootWorkspace.root = true
    }
  }

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

  return workspaces
}

export default listWorkspaces
