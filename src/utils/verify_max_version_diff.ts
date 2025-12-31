import type VersionDiff from '../types/version_diff'
import versionDiffValues from './version_diff_values'

const validVersionDiffsString = Object.keys(versionDiffValues)
  .map((key) => `"${key}"`)
  .join(', ')

export const verifyMaxVersionDiff = (
  maxVersionDiff: VersionDiff | undefined,
) => {
  if (!maxVersionDiff) return

  if (versionDiffValues[maxVersionDiff] === undefined) {
    console.error(
      `Invalid --max-version-diff: "${maxVersionDiff}". Valid values are ${validVersionDiffsString}`,
    )
    process.exit(1)
  }
}
