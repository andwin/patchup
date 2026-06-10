import { Separator } from '@inquirer/prompts'
import chalk from 'chalk'
import type Choice from '../types/choice'
import type PackageManager from '../types/package_manager'
import type Update from '../types/update'
import type { VersionDiffWithoutUnknown } from '../types/version_diff'
import type Workspace from '../types/workspace'
import filterUpdates from './filter_updates'
import listUpdatesForWorkspace from './list_updates_for_workspace'
import logger from './logger'

const buildChoices = async (
  packageManager: PackageManager,
  filteredWorkspaces: Workspace[],
  filter: {
    packages: string[]
    maxVersionDiff: VersionDiffWithoutUnknown
  },
): Promise<Choice[]> => {
  const choices = []

  for (const workspace of filteredWorkspaces) {
    logger.debug('Listing updates for workspace', workspace)
    const updates = await listUpdatesForWorkspace(workspace, packageManager)
    logger.debug('Updates found', updates.length)
    for (const update of updates) {
      logger.debug(update.packageName, update.versionDiff)
    }
    let filteredUpdates: Update[]
    try {
      filteredUpdates = filterUpdates(
        updates,
        filter.packages,
        filter.maxVersionDiff,
      )
    } catch (e) {
      logger.error('Error filtering updates', e)
      process.exit(1)
    }

    logger.debug('Filtered updates', filteredUpdates.length)
    for (const update of filteredUpdates) {
      logger.debug(update.packageName, update.versionDiff)
    }
    if (!filteredUpdates.length) {
      continue
    }

    if (choices.length) {
      choices.push(new Separator(' '))
    }
    if (workspace.name) {
      choices.push(new Separator(chalk.bold(workspace.name)))
    }
    choices.push(
      ...filteredUpdates.map((update) => ({
        name: `${update.packageName} ${update.currentVersion} => ${update.latestVersion} (${update.versionDiff})`,
        value: update,
      })),
    )
  }

  return choices
}

export default buildChoices
