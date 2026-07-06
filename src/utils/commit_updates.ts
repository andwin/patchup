import { execa } from 'execa'
import type Update from '../types/update'
import describeUpdate from './describe_update'

const commitUpdates = async (updates: Update[]) => {
  const [firstUpdate] = updates
  const messageArguments =
    updates.length === 1 && firstUpdate
      ? ['-m', `Updating package ${describeUpdate(firstUpdate)}`]
      : [
          '-m',
          'Updating packages',
          '-m',
          updates.map((update) => `- ${describeUpdate(update)}`).join('\n'),
        ]

  await execa('git', ['add', '--all'])
  await execa('git', ['commit', ...messageArguments])
}

export default commitUpdates
