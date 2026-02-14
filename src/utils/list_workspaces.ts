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

const listWorkspacesForNpm = async (): Promise<Workspace[]> => {
  const result = await execa({
    shell: true,
  })`find . -name "node_modules" -prune -o -name "package.json" -type f -print | grep -v "^\\.\\/\\$" | xargs -n1 dirname`

  const workspaces: Workspace[] = result.stdout
    .split('\n')
    .filter((workspace: string) => workspace !== '.')
    .map((workspace: string) => ({
      name: workspace.replace('./', ''),
      root: false,
    }))

  workspaces.unshift({ name: 'root / global', root: true })

  return workspaces
}

const implementationForPackageManager: Record<
  PackageManager,
  () => Promise<Workspace[]>
> = {
  pnpm: listWorkspacesForPnpm,
  npm: listWorkspacesForNpm,
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
