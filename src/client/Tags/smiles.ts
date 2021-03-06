export const parseSmiles = (text: string): string => {
  let resultText = text

  for (const [rule, to] of smilesRules) {
    resultText = resultText.replace(rule, `$1${to}$3`)
  }

  return resultText
}

const smiles = Object.entries({
  'O0': 'ðĪĄ',
  ':)': 'ð',
  ';)': 'ð',
  ':D': 'ð',
  ';D': 'ð',
  '>:(': 'ðĄ',
  ':(': 'ð',
  ':o': 'ðē',
  '???': 'ðĪ',
  '::)': 'ðģ',
  ':P': 'ð',
  ':-[': 'ð',
  ':-X': 'ðĪ',
  ':-\\': 'ð',
  ':-*': 'ð',
  ':\'(': 'ðĒ',
  ':&#039;(': 'ðĒ',
  '>:D': 'ðŋ',
  ':))': 'ð',
  'C:-)': 'ðŪ',
  'O:-)': 'ð',
  '-\\-{@': 'ðđ',
  ':aggressive:': 'ð',
  ':cray2:': 'ð­',
  ':crazy:': 'ðĪŠ',
  ':lol:': 'ðĪĢ',
  ':blush:': 'ðģ',
  ':good:': 'ð',
  '8-)': 'ð',
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
