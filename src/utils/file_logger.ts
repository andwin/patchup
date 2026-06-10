import fs from 'node:fs/promises'
import type Update from '../types/update'

const logfile = 'patchup.log'

export const clear = async () => {
  await fs.unlink(logfile).catch(() => {})
}

export const log = async (
  update: Update,
  error: Error & { stdout?: string; stderr?: string },
) => {
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
}
