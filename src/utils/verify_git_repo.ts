import { execa } from "execa"

const verifyGitRepo = async () => {
  const gitRepo = await isGitRepo()
  if (!gitRepo) {
    console.error('Not in a git repo')
    process.exit(1)
  }
}

const isGitRepo = async () => {
  try {
    const result = await execa`git rev-parse --is-inside-work-tree`
    return result.stdout.trim() === 'true'
  } catch (error) {
    return false
  }
}

export default verifyGitRepo
