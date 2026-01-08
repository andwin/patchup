import { execa } from 'execa'

const runCommand = async (command: string) => {
  try {
    await execa(command, { shell: process.env.SHELL || true })
  } catch (e) {
    ;(e as Error).message = `Command failed: ${command}`
    throw e
  }
}

export default runCommand
