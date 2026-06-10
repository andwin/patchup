import type { Separator } from '@inquirer/prompts'
import type Update from './update'

type Choice =
  | Separator
  | {
      name: string
      value: Update
    }

export default Choice
