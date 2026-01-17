import type { OptionDefinitionWithDescription } from './display_help'

const commandLineArgsDefinitions: OptionDefinitionWithDescription[] = [
  {
    name: 'help',
    alias: 'h',
    type: Boolean,
    description: 'Display this usage guide.',
  },
  {
    name: 'debug',
    alias: 'd',
    type: Boolean,
    defaultValue: false,
    description: 'Enable debug mode.',
  },
  {
    name: 'workspace',
    alias: 'w',
    type: String,
    multiple: true,
    description: 'Filter updates by workspace name.',
  },
  {
    name: 'package',
    alias: 'p',
    type: String,
    multiple: true,
    description: 'Filter updates by package name.',
  },
  {
    name: 'max-version-diff',
    alias: 'm',
    type: String,
    description: 'Filter updates by maximum version difference.',
  },
  {
    name: 'test',
    type: String,
    description: 'Custom command to run tests after updating packages.',
  },
  {
    name: 'pre-update',
    type: String,
    description: 'Custom command to run before updating packages.',
  },
]

export default commandLineArgsDefinitions
