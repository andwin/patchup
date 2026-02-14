import { execa } from 'execa'
import semver from 'semver'
import type PackageManager from '../types/package_manager'
import type Update from '../types/update'
import type VersionDiff from '../types/version_diff'
import type Workspace from '../types/workspace'
import versionDiffValues from './version_diff_values'

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
    .map(([packageName, value]) => {
      const {
        current: currentVersion,
        latest: latestVersion,
        isDeprecated,
      } = value
      if (isDeprecated) return undefined

      try {
        let versionDiff: string | null
        try {
          versionDiff = semver.diff(currentVersion, latestVersion)
        } catch {
          throw new Error('Exception parsing semver diff for package')
        }

        if (!versionDiff || !versionDiffValues[versionDiff as VersionDiff]) {
          throw new Error('Invalid version diff for package')
        }

        const update: Update = {
          packageName,
          workspace,
          versionDiff: versionDiff as VersionDiff,
          currentVersion,
          latestVersion,
        }
        return update
      } catch (e) {
        const workspaceName = workspace.name
          ? ` workspace: ${workspace.name}`
          : ''

        console.error(
          (e as Error).message +
            packageName +
            ' currentVersion: ' +
            currentVersion +
            ' latestVersion: ' +
            latestVersion +
            workspaceName,
        )
        return undefined
      }
    })
    .filter(Boolean) as Update[]

  return updates
}

const listUpdatesForWorkspaceForNpm = async (
  workspace: Workspace,
): Promise<Update[]> => {
  const args = ['outdated', '--json']
  if (!workspace.root) {
    args.push('--workspace', workspace.name)
  }

  const result = await execa('npm', args).catch((e) => e)

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
    .map(([packageName, value]) => {
      const {
        current: currentVersion,
        latest: latestVersion,
        isDeprecated,
      } = value
      if (isDeprecated) return undefined

      try {
        let versionDiff: string | null
        try {
          versionDiff = semver.diff(currentVersion, latestVersion)
        } catch {
          throw new Error('Exception parsing semver diff for package')
        }

        if (!versionDiff || !versionDiffValues[versionDiff as VersionDiff]) {
          throw new Error('Invalid version diff for package')
        }

        const update: Update = {
          packageName,
          workspace,
          versionDiff: versionDiff as VersionDiff,
          currentVersion,
          latestVersion,
        }
        return update
      } catch (e) {
        const workspaceName = workspace.name
          ? ` workspace: ${workspace.name}`
          : ''

        console.error(
          (e as Error).message +
            packageName +
            ' currentVersion: ' +
            currentVersion +
            ' latestVersion: ' +
            latestVersion +
            workspaceName,
        )
        return undefined
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
  npm: listUpdatesForWorkspaceForNpm,
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
