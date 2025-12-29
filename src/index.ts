#!/usr/bin/env node

import verifyGitRepo from './utils/verify_git_repo'

const run = async () => {
  await verifyGitRepo()
}

run()
