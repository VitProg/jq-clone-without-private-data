import parser, { Tag } from 'bbcode-to-react'
import { Quote } from '../components/ui-kit/quote/Quote'
import { SpoilerTag } from './SpoilerTag'
import { Alert, AlertTitle } from '@material-ui/lab'


export class BRTag extends Tag {
  static tag = 'br'
  toReact () {
    const parentName = (this.parent as any)?.name
    if (parentName) {
      return null
    }
    return (<br/>)
  }
}

