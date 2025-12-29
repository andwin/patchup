import { execa } from 'execa'

const verifyPristineState = async () => {
  const gitStatus = await execa`git status --porcelain --ignore-submodules`
  if (gitStatus.stdout.trim() === '') return

  console.error('Repository is not in a pristine state')
  console.error(
    'Please commit or stash your changes before running this command',
  )
  process.exit(1)
}

export default verifyPristineState
