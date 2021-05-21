export const parseSmiles = (text: string): string => {
  let resultText = text

  for (const [rule, to] of smilesRules) {
    resultText = resultText.replace(rule, `$1${to}$3`)
  }

  return resultText
}

const smiles = Object.entries({
  'O0': '🤡',
  ':)': '😊',
  ';)': '😉',
  ':D': '😆',
  ';D': '😁',
  '>:(': '😡',
  ':(': '🙁',
  ':o': '😲',
  '???': '🤔',
  '::)': '😳',
  ':P': '😜',
  ':-[': '😟',
  ':-X': '🤐',
  ':-\\': '😕',
  ':-*': '😘',
  ':\'(': '😢',
  ':&#039;(': '😢',
  '>:D': '👿',
  ':))': '😃',
  'C:-)': '👮',
  'O:-)': '😇',
  '-\\-{@': '🌹',
  ':aggressive:': '👊',
  ':cray2:': '😭',
  ':crazy:': '🤪',
  ':lol:': '🤣',
  ':blush:': '😳',
  ':good:': '👍',
  '8-)': '😎',
})

const escapeRule = /[\/\\(\[\{\)\]\}\+\*\?\:\.]/gmi
const esc = (str: string) => str.replace(escapeRule, '$1')

function escapeRegExp (string: string) {
  return string.replace(/[-@.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

const smilesRules = smiles.map(([from, to]) => {
  const rule = new RegExp(`(^|\\s)(${escapeRegExp(from)})($|\\s|\\n)`, 'gmi')
  return [rule, to]
})
