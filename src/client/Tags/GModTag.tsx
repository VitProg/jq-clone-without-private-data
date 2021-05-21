import parser, { Tag } from 'bbcode-to-react'
import { Quote } from '../components/ui-kit/quote/Quote'
import { SpoilerTag } from './SpoilerTag'
import { Alert, AlertTitle } from '@material-ui/lab'


export class GModTag extends Tag {
  static tag = 'gmod'
  toReact () {
    return (
      <Alert severity="warning">
        <AlertTitle>Комментарий глобального модератора:</AlertTitle>
        {this.getComponents()}
      </Alert>
    )
  }
}

