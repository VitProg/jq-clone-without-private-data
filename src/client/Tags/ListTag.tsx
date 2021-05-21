import { Tag } from 'bbcode-to-react'


export class ListTag extends Tag {
  static tag = 'list'

  toReact () {
    const params = this.params as {
      type?: 'decimal'
    }

    if (params?.type === 'decimal') {
      return (<ol>{this.getComponents()}</ol>)
    }
    return (<ul>{this.getComponents()}</ul>)
  }
}

