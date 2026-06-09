import type Update from '../types/update'
import type { VersionDiffWithoutUnknown } from '../types/version_diff'
import versionDiffValues from './version_diff_values'

const filterUpdates = (
  updates: Update[],
  packages: string[] | undefined = [],
  maxVersionDiff: VersionDiffWithoutUnknown | undefined,
): Update[] => {
  let filteredUpdates = [...updates]

  if (maxVersionDiff) {
    filteredUpdates = filteredUpdates.filter((update) => {
      return (
        update.versionDiff !== 'unknown' &&
        versionDiffValues[update.versionDiff] >=
          versionDiffValues[maxVersionDiff]
      )
    })
  }

  if (packages.length) {
    filteredUpdates = filteredUpdates.filter((update) =>
      packages.includes(update.packageName),
    )
  }

  return filteredUpdates
}

export default filterUpdates
