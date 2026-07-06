import type Update from '../types/update'

const describeUpdate = (update: Update) => {
  let description = update.packageName
  if (update.workspace.name) {
    description += ` in ${update.workspace.name}`
  }

  return description
}

export default describeUpdate
