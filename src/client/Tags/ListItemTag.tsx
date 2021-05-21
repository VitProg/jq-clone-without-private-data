import parser, { Tag } from 'bbcode-to-react'
import { Quote } from '../components/ui-kit/quote/Quote'
import { SpoilerTag } from './SpoilerTag'


export class ListItemTag extends Tag {
  static tag = 'li'
  protected toHTML (): string {
    return `<li>${this.getContent(true)}</li>`
  }

  toReact () {
    return (
      <li>{this.getComponents()}</li>
    )
  }
}

