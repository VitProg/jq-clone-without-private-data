import { Tag } from 'bbcode-to-react'
import { Link, Typography } from '@material-ui/core'
import { isExternalLink, trimLinkSchema } from '../../common/utils/links'


export class SizeTag extends Tag {
  static tag = 'size'

  toReact () {
    const params = this.params as {
      size?: string
    }

    if (params.size) {
      return (<span style={{ fontSize: params.size }}>{this.getComponents()}</span>)
    } else {
      return this.getComponents()
    }
  }
}

