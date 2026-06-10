import fs from 'node:fs/promises'
import chalk from 'chalk'
import type PackageManager from '../types/package_manager'
import type Update from '../types/update'
import applyUpdate from './apply_update'
import commitUpdate from './commit_update'
import logger from './logger'
import rollbackUpdate from './rollback_update'
import runCommand from './run_command'
import runTests from './run_tests'

const applyUpdates = async (
  packageManager: PackageManager,
  updates: Update[],
  customCommands: {
    preUpdate: string
    test: string
  },
  logfile: string,
): Promise<void> => {
  for (const update of updates) {
    logger.info('') // Space between updates

    try {
      logger.info(
        'Updating package',
        chalk.bold(update.packageName),
        update.workspace.name ? `in ${chalk.bold(update.workspace.name)}` : '',
      )

      if (customCommands.preUpdate) {
        logger.info('Running custom pre-update command')
        await runCommand(customCommands.preUpdate)
      }

      await applyUpdate(packageManager, update)

      if (customCommands.test) {
        logger.info('Running custom test command')
        await runCommand(customCommands.test)
      } else {
        logger.info('Running tests')
        await runTests(packageManager)
      }
    } catch (e) {
      const error = e as Error & { stdout?: string; stderr?: string }
      logger.error(`❌ ${error.message}`)
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

      logger.info('Rolling back update')
      await rollbackUpdate(packageManager)
      continue
    }

    logger.info('✅ Update applied successfully')
    await commitUpdate(update)
  }
}

export default applyUpdates
