import { Tag } from 'bbcode-to-react'


export class HtmlTag extends Tag {
  static tag = 'html'
  toReact() {
    const html = (this.children as any[]).map(ch => ch.text)
    return (
      <div dangerouslySetInnerHTML={{__html: html.join(' ')}}/>
    );
  }
}
