#!/usr/bin/env node

import { checkbox, Separator } from '@inquirer/prompts'
import commandLineArgs from 'command-line-args'
import type Update from './types/update'
import applyUpdate from './utils/apply_update'
import commitUpdate from './utils/commit_update'
import detectPackageManager from './utils/detect_package_panager'
import filterUpdates from './utils/filter_updates'
import filterWorkspaces from './utils/filter_workspaces'
import installPackagesBeforeUpdate from './utils/install_packages_before_update'
import listUpdatesForWorkspace from './utils/list_updates_for_workspace'
import listWorkspaces from './utils/list_workspaces'
import rollbackUpdate from './utils/rollback_update'
import runTests from './utils/run_tests'
import verifyGitRepo from './utils/verify_git_repo'
import { verifyMaxVersionDiff } from './utils/verify_max_version_diff'
import verifyPristineState from './utils/verify_pristine_state'

const commandLineArgsDefinitions = [
  { name: 'workspace', type: String, multiple: true },
  { name: 'package', type: String, multiple: true },
  { name: 'max-version-diff', type: String },
]

const commandLineArguments = commandLineArgs(commandLineArgsDefinitions)
const {
  workspace,
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
  console.log('workspace filter', workspace)
  const filteredWorkspaces = filterWorkspaces(workspaces, workspace)
  console.log('filteredWorkspaces', filteredWorkspaces)

  console.log('packages', packages)
  console.log('maxVersionDiff', maxVersionDiff)

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
      filteredUpdates = filterUpdates(updates, packages, maxVersionDiff)
    } catch (e) {
      console.error(e)
      process.exit(1)
    }
    console.log('Filtered updates', filteredUpdates.length)
    for (const update of filteredUpdates) {
      console.log(update.packageName, update.versionDiff)
    }

    if (workspace.name) {
      choices.push(new Separator(workspace.name))
    }
    choices.push(
      ...filteredUpdates.map((update) => ({
        name: `${update.packageName} ${update.currentVersion} => ${update.latestVersion} (${update.versionDiff})`,
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
  for (const update of updatesToApply) {
    try {
      console.log('Updating package', update.packageName)
      await applyUpdate(packageManager, update)
      console.log('running tests')
      await runTests(packageManager)
    } catch (e) {
      console.error((e as Error).message)
      console.log('rolling back update')
      await rollbackUpdate(packageManager)
      continue
    }
    console.log('update applied successfully')
    await commitUpdate(update)
  }
}

run()
