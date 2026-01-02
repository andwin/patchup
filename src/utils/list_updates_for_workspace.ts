import { execa } from 'execa'
import semver from 'semver'
import type PackageManager from '../types/package_manager'
import type Update from '../types/update'
import type Workspace from '../types/workspace'

const listUpdatesForWorkspaceForPnpm = async (
  workspace: Workspace,
): Promise<Update[]> => {
  const args = ['outdated', '--json']
  if (workspace.name) {
    args.push('--filter', workspace.name)
  }

  const result = await execa('pnpm', args).catch((e) => e)

  let jsonOutput: Record<
    string,
    { current: string; latest: string; isDeprecated: boolean }
  >
  try {
    jsonOutput = JSON.parse(result.stdout)
  } catch (e) {
    console.error('Exception parsing JSON for workspace', workspace)
    console.error(e)
    console.error(result.stdout)
    process.exit(1)
  }

  const updates = Object.entries(jsonOutput)
    .map(([pkg, value]) => {
      const { current, latest, isDeprecated } = value
      if (isDeprecated) return undefined

      try {
        const diff = semver.diff(current, latest)
        return {
          name: `${pkg} ${current} => ${latest} (${diff})`,
          value: { pkg, workspace, diff },
        }
      } catch (e) {
        console.error(
          'Exception parsing semver diff for package ' +
            pkg +
            ' is the package installed?',
        )
        console.error(e)
        return process.exit(1)
      }
    })
    .filter(Boolean) as Update[]

  return updates
}

const implementationForPackageManager: Record<
  PackageManager,
  (workspace: Workspace) => Promise<Update[]>
> = {
  pnpm: listUpdatesForWorkspaceForPnpm,
}

const listUpdatesForWorkspace = async (
  workspace: Workspace,
  packageManager: PackageManager,
): Promise<Update[]> => {
  const updatesForWorkspace =
    await implementationForPackageManager[packageManager](workspace)
  return updatesForWorkspace
}

export default listUpdatesForWorkspace
