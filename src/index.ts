#!/usr/bin/env node

import fs from 'node:fs/promises'
import { checkbox, Separator } from '@inquirer/prompts'
import chalk from 'chalk'
import commandLineArgs from 'command-line-args'
import type Update from './types/update'
import applyUpdate from './utils/apply_update'
import commitUpdate from './utils/commit_update'
import detectPackageManager from './utils/detect_package_panager'
import displayHelp, {
  type OptionDefinitionWithDescription,
} from './utils/display_help'
import filterUpdates from './utils/filter_updates'
import filterWorkspaces from './utils/filter_workspaces'
import inquirerTheme from './utils/inquirer_theme'
import installPackagesBeforeUpdate from './utils/install_packages'
import listUpdatesForWorkspace from './utils/list_updates_for_workspace'
import listWorkspaces from './utils/list_workspaces'
import rollbackUpdate from './utils/rollback_update'
import runCommand from './utils/run_command'
import runTests from './utils/run_tests'
import verifyGitRepo from './utils/verify_git_repo'
import { verifyMaxVersionDiff } from './utils/verify_max_version_diff'
import verifyPristineState from './utils/verify_pristine_state'

const commandLineArgsDefinitions: OptionDefinitionWithDescription[] = [
  {
    name: 'help',
    alias: 'h',
    type: Boolean,
    description: 'Display this usage guide.',
  },
  {
    name: 'workspace',
    alias: 'w',
    type: String,
    multiple: true,
    description: 'Filter updates by workspace name.',
  },
  {
    name: 'package',
    alias: 'p',
    type: String,
    multiple: true,
    description: 'Filter updates by package name.',
  },
  {
    name: 'max-version-diff',
    alias: 'm',
    type: String,
    description: 'Filter updates by maximum version difference.',
  },
  {
    name: 'test',
    type: String,
    description: 'Custom command to run tests after updating packages.',
  },
  {
    name: 'pre-update',
    type: String,
    description: 'Custom command to run before updating packages.',
  },
]

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

const logfile = 'auto-package-updater.log'

const run = async () => {
  if (commandLineArguments.help) {
    displayHelp(commandLineArgsDefinitions)
    process.exit(0)
  }

  await verifyGitRepo()
  await verifyPristineState()
  verifyMaxVersionDiff(filter.maxVersionDiff)
  const packageManager = await detectPackageManager()
  console.log(`Using ${packageManager} as package manager`)

  await fs.unlink(logfile).catch(() => {})

  await installPackagesBeforeUpdate(packageManager)

  const workspaces = await listWorkspaces(packageManager)
  console.log('workspaces', workspaces)
  console.log('workspace filter', filter.workspaces)
  const filteredWorkspaces = filterWorkspaces(workspaces, filter.workspaces)
  console.log('filteredWorkspaces', filteredWorkspaces)

  console.log('packages', filter.packages)
  console.log('maxVersionDiff', filter.maxVersionDiff)

  if (!filteredWorkspaces.length) {
    console.error('No matching workspaces found')
    process.exit(1)
  }

  const choices = []

  for (const workspace of filteredWorkspaces) {
    console.log('listing updates for workspace', workspace)
    const updates = await listUpdatesForWorkspace(workspace, packageManager)
    console.log('Updates', updates.length)
    for (const update of updates) {
      console.log(update.packageName, update.versionDiff)
    }
    let filteredUpdates: Update[]
    try {
      filteredUpdates = filterUpdates(
        updates,
        filter.packages,
        filter.maxVersionDiff,
      )
    } catch (e) {
      console.error(e)
      process.exit(1)
    }
    console.log('Filtered updates', filteredUpdates.length)
    for (const update of filteredUpdates) {
      console.log(update.packageName, update.versionDiff)
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
    console.error('No updates available')
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
    console.error('No updates selected')
    process.exit(0)
  }

  console.log('updatesToApply', updatesToApply)
  for (const update of updatesToApply) {
    try {
      console.log(
        'Updating package',
        update.packageName,
        update.workspace.name ? `in ${update.workspace.name}` : '',
      )

      if (customCommands.preUpdate) {
        console.log('running custom pre-update command')
        await runCommand(customCommands.preUpdate)
      }

      await applyUpdate(packageManager, update)

      if (customCommands.test) {
        console.log('running custom test command')
        await runCommand(customCommands.test)
      } else {
        console.log('running tests')
        await runTests(packageManager)
      }
    } catch (e) {
      const error = e as Error & { stdout?: string; stderr?: string }
      console.error(error.message)
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

      console.log('rolling back update')
      await rollbackUpdate(packageManager)
      continue
    }
    console.log('update applied successfully')
    await commitUpdate(update)
  }
}

run()
