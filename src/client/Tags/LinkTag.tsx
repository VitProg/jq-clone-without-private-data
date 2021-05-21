import { Tag } from 'bbcode-to-react'
import { Link } from '@material-ui/core'
import { isExternalLink, trimLinkSchema } from '../../common/utils/links'


export class LinkTag extends Tag {
  static tag = 'url'

  toReact () {
    const params = this.params as {
      url?: string
    }

    const href = params.url ?? this.getContent(false)
    const isExternal = isExternalLink(href)
    const content = params.url ? this.getComponents() : trimLinkSchema(href)

    return (<Link href={href} {...(isExternal ? { target: '_blank' } : {})}>{content}</Link>)
  }
}

