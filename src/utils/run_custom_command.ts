import { execa } from 'execa'

const runCustomCommand = async (command: string) => {
  try {
    await execa(command, { shell: true })
  } catch (e) {
    const error = e as Error & { stdout?: string }
    console.log('stdout', error)

    ;(e as Error).message = `Custom command failed: ${command}`
    throw e
  }
}

export default runCustomCommand
