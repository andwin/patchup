import type commandLineArgs from 'command-line-args'
import commandLineUsage from 'command-line-usage'

export type OptionDefinitionWithDescription =
  commandLineArgs.OptionDefinition & {
    description: string
  }

const displayHelp = (
  commandLineArgsDefinitions: OptionDefinitionWithDescription[],
) => {
  console.log(
    commandLineUsage([
      {
        header: 'Auto Package Updater',
        content: 'Automatically updates npm packages in a git repository.',
      },
      {
        header: 'Usage',
        content: 'auto-package-updater [options]',
      },
      {
        header: 'Options',
        optionList: commandLineArgsDefinitions,
      },
    ]),
  )
}

export default displayHelp
