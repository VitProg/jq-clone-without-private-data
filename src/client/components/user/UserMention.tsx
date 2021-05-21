import { FC } from 'react'
import { observer } from 'mobx-react-lite'
import { IUser } from '../../../common/forum/forum.base.interfaces'
import { getUserName } from '../../../common/forum/utils'
import { UserLink } from './UserLink'
import { isString } from '../../../common/type-guards'
import { store } from '../../store'
import { IUserExMin } from '../../../common/forum/forum.ex.interfaces'

interface Props {
  user: string | IUserExMin
}

export const UserMention: FC<Props> = observer(function UserMention(props) {

  const user = isString(props.user) ?
    (store.forumStore.userStore.getByName(props.user) ?? props.user) :
    props.user

  return (
    <UserLink user={user}>@{isString(user) ? user : getUserName(user)}</UserLink>
  )
})
