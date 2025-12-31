import type Update from '../types/update'

const filterUpdates = (
  updates: Update[],
  packages: string[] | undefined = [],
): Update[] => {
  if (!packages.length) return updates

  return updates.filter((update) => packages.includes(update.value.pkg))
}

export default filterUpdates
