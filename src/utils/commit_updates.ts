import { execa } from 'execa'
import type Update from '../types/update'
import describeUpdate from './describe_update'

const commitUpdates = async (updates: Update[]) => {
  const messageArguments = generateMessageArguments(updates)

  await execa('git', ['add', '--all'])
  await execa('git', ['commit', ...messageArguments])
}

const generateMessageArguments = (updates: Update[]) => {
  if (updates.length === 1) {
    return ['-m', `Updating package ${describeUpdate(updates[0])}`]
  }

  return [
    '-m',
    'Updating packages',
    '-m',
    updates.map((update) => `- ${describeUpdate(update)}`).join('\n'),
  ]
}

export default commitUpdates
