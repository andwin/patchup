import type { VersionDiffWithoutUnknown } from '../types/version_diff'

const versionDiffValues: { [key in VersionDiffWithoutUnknown]: number } = {
  major: 1,
  minor: 2,
  patch: 3,
}

export default versionDiffValues
