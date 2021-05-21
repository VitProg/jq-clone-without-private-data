import parser, { Tag } from 'bbcode-to-react'
import { Quote } from '../components/ui-kit/quote/Quote'
import { SpoilerTag } from './SpoilerTag'
import { Alert, AlertTitle } from '@material-ui/lab'


export class ContentTag extends Tag {
  static tag = 'content'
  toReact () {
    return (
      <div>{this.getComponents()}</div>
    )
  }
}

