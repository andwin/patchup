import type PackageManager from '../types/package_manager'
import type Update from '../types/update'
import applyUpdate from './apply_update'
import commitUpdates from './commit_updates'
import describeUpdate from './describe_update'
import * as fileLogger from './file_logger'
import logger from './logger'
import rollbackUpdate from './rollback_update'
import runCommand from './run_command'
import runTests from './run_tests'

type CustomCommands = {
  preUpdate?: string
  test?: string
}

const applyUpdates = async (
  packageManager: PackageManager,
  updates: Update[],
  customCommands: CustomCommands,
  combine: boolean,
): Promise<void> => {
  const batches = combine ? [updates] : updates.map((update) => [update])

  for (const batch of batches) {
    await applyBatch(packageManager, batch, customCommands)
  }
}

const applyBatch = async (
  packageManager: PackageManager,
  batch: Update[],
  customCommands: CustomCommands,
): Promise<void> => {
  const plural = batch.length > 1

  logger.info('') // Space between batches

  try {
    if (customCommands.preUpdate) {
      logger.info('Running custom pre-update command')
      await runCommand(customCommands.preUpdate)
    }

    for (const update of batch) {
      logger.info('📦 Updating package', describeUpdate(update))
      await applyUpdate(packageManager, update)
    }

    if (customCommands.test) {
      logger.info('🧪 Running custom test command')
      await runCommand(customCommands.test)
    } else {
      logger.info('🧪 Running tests')
      await runTests(packageManager)
    }

    await commitUpdates(batch)
  } catch (e) {
    const error = e as Error & { stdout?: string; stderr?: string }
    logger.error(`❌ ${error.message}`)

    await fileLogger.log(batch, error)

    logger.info(plural ? 'Rolling back updates' : 'Rolling back update')
    await rollbackUpdate(packageManager)

    return
  }

  logger.info(
    plural
      ? '✅ All updates applied successfully'
      : '✅ Update applied successfully',
  )
}

export default applyUpdates
