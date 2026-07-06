#!/usr/bin/env node

import commandLineArgs from 'command-line-args'
import applyUpdates from './utils/apply_updates'
import buildChoices from './utils/build_choices'
import commandLineArgsDefinitions from './utils/command_line_args_definitions'
import detectPackageManager from './utils/detect_package_manager'
import displayHelp from './utils/display_help'
import * as fileLogger from './utils/file_logger'
import filterWorkspaces from './utils/filter_workspaces'
import installPackagesBeforeUpdate from './utils/install_packages'
import listWorkspaces from './utils/list_workspaces'
import { enableDebug, logger } from './utils/logger'
import selectUpdates from './utils/select_updates'
import verifyGitRepo from './utils/verify_git_repo'
import { verifyMaxVersionDiff } from './utils/verify_max_version_diff'
import verifyPristineState from './utils/verify_pristine_state'

const commandLineArguments = commandLineArgs(commandLineArgsDefinitions)

const filter = {
  workspaces: commandLineArguments.workspace,
  packages: commandLineArguments.package,
  maxVersionDiff: commandLineArguments['max-version-diff'],
}
const customCommands = {
  test: commandLineArguments.test,
  preUpdate: commandLineArguments['pre-update'],
}

const run = async () => {
  if (commandLineArguments.help) {
    displayHelp(commandLineArgsDefinitions)
    process.exit(0)
  }

  enableDebug(commandLineArguments.debug)
  logger.debug('Debug mode enabled')

  await verifyGitRepo()
  await verifyPristineState()
  verifyMaxVersionDiff(filter.maxVersionDiff)
  const packageManager = await detectPackageManager()
  logger.debug('Detected package manager', packageManager)

  await fileLogger.clear()

  await installPackagesBeforeUpdate(packageManager)

  const workspaces = await listWorkspaces(packageManager)
  logger.debug('Workspaces', workspaces)
  logger.debug('Workspace filter', filter.workspaces)
  const filteredWorkspaces = filterWorkspaces(workspaces, filter.workspaces)
  logger.debug('Filtered workspaces', filteredWorkspaces)

  logger.debug('Packages filter', filter.packages)
  logger.debug('Max version diff filter', filter.maxVersionDiff)

  if (!filteredWorkspaces.length) {
    logger.error('No matching workspaces found')
    process.exit(1)
  }

  logger.info('Listing updates')
  const choices = await buildChoices(packageManager, filteredWorkspaces, filter)

  if (!choices.length) {
    logger.error('No updates available')
    process.exit(0)
  }

  const updatesToApply = await selectUpdates(commandLineArguments, choices)
  if (!updatesToApply.length) {
    logger.error('No updates selected')
    process.exit(0)
  }

  logger.debug(
    'Updates to apply',
    updatesToApply.map((update) => ({
      package: update.packageName,
      workspace: update.workspace.name,
    })),
  )
  await applyUpdates(
    packageManager,
    updatesToApply,
    customCommands,
    commandLineArguments.combine,
  )
}

run()
