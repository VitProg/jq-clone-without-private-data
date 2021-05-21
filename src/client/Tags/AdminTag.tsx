import parser, { Tag } from 'bbcode-to-react'
import { Quote } from '../components/ui-kit/quote/Quote'
import { SpoilerTag } from './SpoilerTag'
import { Alert, AlertTitle } from '@material-ui/lab'


export class AdminTag extends Tag {
  static tag = 'admin'
  toReact () {
    return (
      <Alert severity="error">
        <AlertTitle>Комментарий администратора :</AlertTitle>
        {this.getComponents()}
      </Alert>
    )
  }
}

