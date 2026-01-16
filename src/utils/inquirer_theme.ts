import chalk, { type ChalkInstance } from 'chalk'

const inquirerTheme = {
  icon: {
    checked: '■',
    unchecked: '□',
    cursor: '',
  },
  style: {
    highlight: (text: string) => addColor(text, chalk.cyan.underline),
  },
}

const addColor = (text: string, colorFunction: ChalkInstance) => {
  const parts = text.split(' ')
  const firstPart = parts[0]
  const rest = parts.slice(1).join(' ')

  return ` ${firstPart} ${colorFunction(rest)}`
}

export default inquirerTheme
