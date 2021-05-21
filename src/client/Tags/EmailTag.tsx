import { Tag } from 'bbcode-to-react'
import { Link } from '@material-ui/core'
import { isExternalLink, trimLinkSchema } from '../../common/utils/links'


export class EmailTag extends Tag {
  static tag = 'email'

  toReact () {
    const params = this.params as {
      email?: string
    }

    const href = 'mailto://' + (params.email ?? this.getContent(false))
    const content = params.email ? this.getComponents() : trimLinkSchema(href)

    return (<Link href={href} target='_blank'>{content}</Link>)
  }
}

