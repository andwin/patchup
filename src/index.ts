#!/usr/bin/env node

import detectPackageManager from './utils/detect_package_panager'
import listWorkspaces from './utils/list_workspaces'
import verifyGitRepo from './utils/verify_git_repo'
import verifyPristineState from './utils/verify_pristine_state'

const run = async () => {
  await verifyGitRepo()
  await verifyPristineState()
  const packageManager = await detectPackageManager()
  console.log(`Using ${packageManager} as package manager`)

  const workspaces = await listWorkspaces(packageManager)
  console.log('workspaces', workspaces)
}

run()
