import { Parser } from 'bbcode-to-react'
import { parseSmiles } from './smiles'
import {escape, unescape} from 'html-escaper';

const parser = new Parser()

export const parseBBCodes = (message: string, smiles = true) => {
  const text = unescape(message)
    .replace(/<br\s*\/?>/gm, '\n')
    .replace(/\n/gm, '[br][/br]')
    // .replace(/\[content](\s*)\[\/content]/, '$1')
    .split('&nbsp;').join(' ')
    .split('&quot;').join('"')
    .replace(/&quot;/g, '"')
    .replace(/&#32;/g, '')
    .replace(/&#39;/g, '\'')
    .replace(/&#x3A;/g, ':')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/^@([\w\d_-]+)/gm, '[user]$1[/user]')
    .replace(/([\s+])@([\w\d_-]+)/gm, '$1[user]$2[/user]')

  return parser
    .toReact(smiles ? parseSmiles(text) : text)
}
