#!/usr/bin/env node

import commandLineArgs from 'command-line-args'
import detectPackageManager from './utils/detect_package_panager'
import filterWorkspaces from './utils/filter_workspaces'
import listUpdatesForWorkspace from './utils/list_updates_for_workspace'
import listWorkspaces from './utils/list_workspaces'
import verifyGitRepo from './utils/verify_git_repo'
import verifyPristineState from './utils/verify_pristine_state'

const commandLineArgsDefinitions = [
  { name: 'filter', type: String, multiple: true },
]

const commandLineArguments = commandLineArgs(commandLineArgsDefinitions)
const { filter } = commandLineArguments

const run = async () => {
  await verifyGitRepo()
  await verifyPristineState()
  const packageManager = await detectPackageManager()
  console.log(`Using ${packageManager} as package manager`)

  const workspaces = await listWorkspaces(packageManager)
  console.log('workspaces', workspaces)
  console.log('filter', filter)
  const filteredWorkspaces = filterWorkspaces(workspaces, filter)
  console.log('filteredWorkspaces', filteredWorkspaces)

  for (const workspace of filteredWorkspaces) {
    console.log('listing updates for workspace', workspace)
    const updates = await listUpdatesForWorkspace(workspace, packageManager)
    for (const update of updates) {
      console.log('update', update.name)
    }
  }
}

run()
