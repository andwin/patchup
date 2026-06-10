import { checkbox } from '@inquirer/prompts'
import type commandLineArgs from 'command-line-args'
import type Choice from '../types/choice'
import type Update from '../types/update'
import theme from './inquirer_theme'

const selectUpdates = async (
  commandLineArguments: commandLineArgs.CommandLineOptions,
  choices: Choice[],
): Promise<Update[]> => {
  if (commandLineArguments.auto) {
    const updatesToApply = choices
      .filter(
        (choice): choice is { name: string; value: Update } =>
          'value' in choice,
      )
      .map((choice) => choice.value)

    return updatesToApply
  }

  try {
    const updatesToApply = await checkbox({
      message: 'Select updates to apply',
      choices: choices,
      pageSize: 20,
      theme,
      loop: false,
    })

    return updatesToApply
  } catch (e) {
    if (e instanceof Error && e.name === 'ExitPromptError') {
      process.exit(0)
    }
    throw e
  }
}

export default selectUpdates
