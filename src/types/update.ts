import type VersionDiff from './version_diff'
import type Workspace from './workspace'

type Update = {
  packageName: string
  workspace: Workspace
  versionDiff: VersionDiff
  currentVersion: string
  latestVersion: string
}

export default Update
