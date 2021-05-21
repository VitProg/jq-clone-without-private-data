import { FC, useEffect, useState } from 'react'
import { IndexPage } from './pages/Index.page'
import { LastMessageListPage } from './pages/LastMessageList.page'
import { LoginModal } from './pages/auth/login-modal/LoginModal'
import { ProfilePage } from './pages/my/Profile.page'
import { observer } from 'mobx-react-lite'
import { toJS } from 'mobx'
import { store } from './store'
import { IRouteStore } from './store/types'
import { routerSession, routes } from './routing'
import { routeSwitch } from './routing/utils'
import { RegistrationModal } from './pages/auth/registration-modal/RegistrationModal'
import { ForgotPasswordModal } from './pages/auth/forgot-password-modal/ForgotPasswordModal'
import { BoardListPage } from './pages/BoardList.page'
import { BoardTopicList } from './pages/BoardTopicList.page'
import { TopicMessageListPage } from './pages/TopicMessageList.page'


export const RouterSwitch: FC = observer(function RouterSwitch () {
  const onModalClose = (rs: IRouteStore) => {
    if (rs.noModalRoute) {
      rs.noModalRoute.push()
    } else {
      if (rs.last) {
        rs.last.push()
      } else {
        routes.boardList().push()
      }
    }
  }

  // todo add command to refresh page component

  return (
    <>
      {/* MODALS */}

      {store.routeStore.isModal && routeSwitch({
        name: 'login',
        currentRoute: store.routeStore.current,
        guard: r => !store.myStore.isAuth,
        render: route => <LoginModal  isOpen={true} onClose={() => onModalClose(store.routeStore)}/>,
      })}

      {store.routeStore.isModal && routeSwitch({
        name: 'registration',
        currentRoute: store.routeStore.current,
        guard: r => !store.myStore.isAuth,
        render: route => <RegistrationModal  isOpen={true} onClose={() => onModalClose(store.routeStore)}/>,
      })}

      {store.routeStore.isModal && routeSwitch({
        name: 'forgotPassword',
        currentRoute: store.routeStore.current,
        guard: r => !store.myStore.isAuth,
        render: route => <ForgotPasswordModal isOpen={true} onClose={() => onModalClose(store.routeStore)}/>,
      })}

      {/* PAGES */}

      {routeSwitch({
        name: 'boardList',
        currentRoute: store.routeStore.noModalRoute,
        // prepareData: route => store.routeDataStore.get(route),
        render: route => BoardListPage,
      })}

      {/*{routeSwitch({*/}
      {/*  name: 'lastMessages',*/}
      {/*  route: store.routeStore.noModalRoute,*/}
      {/*  render: route => LastMessageListPage,*/}
      {/*})}*/}

      {routeSwitch({
        name: 'boardTopicList',
        currentRoute: store.routeStore.noModalRoute,
        // prepareData: (route) => store.routeDataStore.get(route),
        // render: route => <BoardTopicList page={route.params.page ?? 1} board={route.params.board}/>,
        render: route => BoardTopicList,
      })}

      {routeSwitch({
        name: 'topicMessageList',
        currentRoute: store.routeStore.noModalRoute,
        render: route => TopicMessageListPage
      })}

      {routeSwitch({
        name: 'profile',
        currentRoute: store.routeStore.noModalRoute,
        guard: r => store.myStore.isAuth ? true : routes.login(),
        saveRedirect: true,
        render: route => ProfilePage,
      })}

    </>
  )
})


