import type Update from '../types/update'
import type VersionDiff from '../types/version_diff'
import versionDiffValues from './version_diff_values'

const filterUpdates = (
  updates: Update[],
  packages: string[] | undefined = [],
  maxVersionDiff: VersionDiff | undefined,
): Update[] => {
  if (maxVersionDiff) {
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
