import { FC } from 'react'
import { RouteLink } from '../components/route/RouteLink'
import { store } from '../store'

export const IndexPage: FC = () => {

  store.seoStore.setTitle('Главная страница')

  return (
    <div>
      [[IndexPage]]
      <ul>
        <li><RouteLink to={'profile'}>Профиль</RouteLink></li>
        <li><RouteLink to={'lastMessages'} route={{}}>Последние сообщения [1]</RouteLink></li>
        <li><RouteLink to={'lastMessages'} route={{page: 2}}>{p => `Последние сообщения [${p.page}]`}</RouteLink></li>
        <li><RouteLink to={'lastMessages'} route={{page: 10}}>Последние сообщения [10]</RouteLink></li>
      </ul>
    </div>
  )
}
