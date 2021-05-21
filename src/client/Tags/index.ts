import parser, { Tag } from 'bbcode-to-react'
import { UserTag } from './UserTag'
import { YoutubeTag } from './YoutubeTag'
import { HtmlTag } from './HtmlTag'
import { SpoilerTag } from './SpoilerTag'
import { QuoteTag } from './QuoteTag'
import { ListItemTag } from './ListItemTag'
import { ModTag } from './ModTag'
import { GModTag } from './GModTag'
import { AdminTag } from './AdminTag'
import { ListTag } from './ListTag'
import { LinkTag } from './LinkTag'
import { EmailTag } from './EmailTag'
import { LeftTag } from './LeftTag'
import { SizeTag } from './SizeTag'
import { BRTag } from './BRTag'
import { ContentTag } from './ContentTag'

const registerTag = (tag: Omit<typeof Tag, 'new'> & {tag: string}) => {
  parser.registerTag(tag.tag, tag as any)
}

registerTag(BRTag)
registerTag(ContentTag)

registerTag(SpoilerTag)
registerTag(QuoteTag)

registerTag(HtmlTag)

registerTag(UserTag)

registerTag(YoutubeTag)

registerTag(LeftTag)
registerTag(SizeTag)

registerTag(ListTag)
registerTag(ListItemTag)

registerTag(LinkTag)
registerTag(EmailTag)

registerTag(ModTag)
registerTag(GModTag)
registerTag(AdminTag)
