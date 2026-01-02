import { execa } from 'execa'
import type Update from '../types/update'

const commitUpdate = async (update: Update) => {
  let message = `Updating package ${update.value.pkg}`
  if (update.value.workspace.name) {
    message += `  in ${update.value.workspace.name}`
  }

  await execa('git', ['add', '--all'])
  await execa('git', ['commit', '-m', message])
}

export default commitUpdate
