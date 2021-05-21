import { FC } from 'react'
import { observer } from 'mobx-react-lite'
import { store } from '../../store'


export const ProfilePage: FC = observer(function ProfilePage (props) {
  const user = store.myStore.user

  store.seoStore.setTitle('Мой профиль', user?.name)

  return user ? (
    <div>
      {user.id}: {user.login}
    </div>
  ) : null
})
