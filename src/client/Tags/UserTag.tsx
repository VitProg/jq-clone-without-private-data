import { Tag } from 'bbcode-to-react'
import { UserMention } from '../components/user/UserMention'


export class UserTag extends Tag {
  static tag = 'user'
  toReact() {
    const user = this.getContent(true)
    //todo
    return (
      <UserMention user={user}/>
    );
  }
}
