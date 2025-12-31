import type Update from '../types/update'
import type VersionDiff from '../types/version_diff'

const versionDiffValues: { [key in VersionDiff]: number } = {
  major: 1,
  minor: 2,
  patch: 3,
}
const validVersionDiffsString = Object.keys(versionDiffValues)
  .map((key) => `"${key}"`)
  .join(', ')

const filterUpdates = (
  updates: Update[],
  packages: string[] | undefined = [],
  maxVersionDiff: VersionDiff | undefined,
): Update[] => {
  if (maxVersionDiff) {
    if (versionDiffValues[maxVersionDiff] === undefined) {
      throw new Error(
        `Invalid max version diff: "${maxVersionDiff}". Valid values are ${validVersionDiffsString}`,
      )
    }
    return updates.filter((update) => {
      return (
        versionDiffValues[update.value.diff as VersionDiff] >=
        versionDiffValues[maxVersionDiff]
      )
    })
  }

  if (!packages.length) return updates

  return updates.filter((update) => packages.includes(update.value.pkg))
}

export default filterUpdates
