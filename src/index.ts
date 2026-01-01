#!/usr/bin/env node

import { checkbox, Separator } from '@inquirer/prompts'
import commandLineArgs from 'command-line-args'
import type Update from './types/update'
import detectPackageManager from './utils/detect_package_panager'
import filterUpdates from './utils/filter_updates'
import filterWorkspaces from './utils/filter_workspaces'
import installPackagesBeforeUpdate from './utils/install_packages_before_update'
import listUpdatesForWorkspace from './utils/list_updates_for_workspace'
import listWorkspaces from './utils/list_workspaces'
import verifyGitRepo from './utils/verify_git_repo'
import { verifyMaxVersionDiff } from './utils/verify_max_version_diff'
import verifyPristineState from './utils/verify_pristine_state'

const commandLineArgsDefinitions = [
  { name: 'filter', type: String, multiple: true },
  { name: 'package', type: String, multiple: true },
  { name: 'max-version-diff', type: String },
]

const commandLineArguments = commandLineArgs(commandLineArgsDefinitions)
const {
  filter,
  package: packages,
  'max-version-diff': maxVersionDiff,
} = commandLineArguments

const run = async () => {
  await verifyGitRepo()
  await verifyPristineState()
  verifyMaxVersionDiff(maxVersionDiff)
  const packageManager = await detectPackageManager()
  console.log(`Using ${packageManager} as package manager`)

  await installPackagesBeforeUpdate(packageManager)

  const workspaces = await listWorkspaces(packageManager)
  console.log('workspaces', workspaces)
  console.log('filter', filter)
  const filteredWorkspaces = filterWorkspaces(workspaces, filter)
  console.log('filteredWorkspaces', filteredWorkspaces)

  console.log('packages', packages)
  console.log('maxVersionDiff', maxVersionDiff)

  const choices = []

  for (const workspace of filteredWorkspaces) {
    console.log('listing updates for workspace', workspace)
    const updates = await listUpdatesForWorkspace(workspace, packageManager)
    console.log('Updates', updates.length)
    for (const update of updates) {
      console.log(update.name, update.value.diff)
    }
    let filteredUpdates: Update[]
    try {
      filteredUpdates = filterUpdates(updates, packages, maxVersionDiff)
    } catch (e) {
      console.error(e)
      process.exit(1)
    }
    console.log('Filtered updates', filteredUpdates.length)
    for (const update of filteredUpdates) {
      console.log(update.name, update.value.diff)
    }

    choices.push(new Separator(workspace.name))
    choices.push(
      ...filteredUpdates.map((update) => ({
        name: update.name,
        value: update,
      })),
    )
  }

  const updatesToApply = await checkbox({
    message: 'Select updates to apply',
    choices: choices,
    pageSize: 20,
  })

  console.log('updatesToApply', updatesToApply)
}

run()
