import parser, { Tag } from 'bbcode-to-react'
import { Quote } from '../components/ui-kit/quote/Quote'
import { SpoilerTag } from './SpoilerTag'
import { Alert, AlertTitle } from '@material-ui/lab'


export class ModTag extends Tag {
  static tag = 'mod'
  toReact () {
    return (
      <Alert severity="info">
        <AlertTitle>Комментарий модератора:</AlertTitle>
        {this.getComponents()}
      </Alert>
    )
  }
}

