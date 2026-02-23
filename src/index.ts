#!/usr/bin/env node

import fs from 'node:fs/promises'
import { checkbox, Separator } from '@inquirer/prompts'
import chalk from 'chalk'
import commandLineArgs from 'command-line-args'
import type Update from './types/update'
import applyUpdate from './utils/apply_update'
import commandLineArgsDefinitions from './utils/command_linke_args_definitions'
import commitUpdate from './utils/commit_update'
import detectPackageManager from './utils/detect_package_manager'
import displayHelp from './utils/display_help'
import filterUpdates from './utils/filter_updates'
import filterWorkspaces from './utils/filter_workspaces'
import inquirerTheme from './utils/inquirer_theme'
import installPackagesBeforeUpdate from './utils/install_packages'
import listUpdatesForWorkspace from './utils/list_updates_for_workspace'
import listWorkspaces from './utils/list_workspaces'
import { enableDebug, logger } from './utils/logger'
import rollbackUpdate from './utils/rollback_update'
import runCommand from './utils/run_command'
import runTests from './utils/run_tests'
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

const logfile = 'patchup.log'

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

  await fs.unlink(logfile).catch(() => {})

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

  if (!choices.length) {
    logger.error('No updates available')
    process.exit(0)
  }

  const updatesToApply = await checkbox({
    message: 'Select updates to apply',
    choices: choices,
    pageSize: 20,
    theme: inquirerTheme,
    loop: false,
  })

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
  for (const update of updatesToApply) {
    try {
      logger.info(
        'Updating package',
        update.packageName,
        update.workspace.name ? `in ${update.workspace.name}` : '',
      )

      if (customCommands.preUpdate) {
        logger.info('Running custom pre-update command')
        await runCommand(customCommands.preUpdate)
      }

      await applyUpdate(packageManager, update)

      if (customCommands.test) {
        logger.info('Running custom test command')
        await runCommand(customCommands.test)
      } else {
        logger.info('Running tests')
        await runTests(packageManager)
      }
    } catch (e) {
      const error = e as Error & { stdout?: string; stderr?: string }
      logger.error(error.message)
      let logMessage = `❌ Updating ${update.packageName} in ${update.workspace.name} failed`
      logMessage += `\n\n${error.message}`
      if (error.stderr) {
        logMessage += `\n\n${error.stderr}`
      }
      if (error.stdout) {
        logMessage += `\n\n${error.stdout}`
      }
      logMessage += `\n\n`
      await fs.appendFile(logfile, logMessage)

      logger.info('Rolling back update')
      await rollbackUpdate(packageManager)
      continue
    }

    logger.info('Update applied successfully')
    await commitUpdate(update)
  }
}

run()
