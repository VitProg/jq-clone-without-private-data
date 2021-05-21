import { Tag } from 'bbcode-to-react'


export class YoutubeTag extends Tag {
  static tag = 'youtube'

  toReact() {
    // using this.getContent(true) to get it's inner raw text.
    const attributes = {
      src: this.getContent(true),
      width: (this.params as any).width || 420,
      height: (this.params as any).height || 315,
    };
    return (
      <iframe
        {...attributes}
        frameBorder="0"
        allowFullScreen
      />
    );
  }
}
