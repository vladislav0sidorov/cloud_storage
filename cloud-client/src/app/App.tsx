import { FC, Suspense, useLayoutEffect } from 'react'
import { AppRouter } from './providers/router/ui/AppRouter'
import { getUserAuthData, getUserInited, useCheckAuth, userActions } from '@/entities/User'
import { USER_LOCALSTORAGE_KEY } from '@/shared/consts/localStorage'
import { useSelector } from 'react-redux'
import { PageLoader } from '@/widgets/PageLoader'
import { MainLayout } from '@/shared/layouts/MainLayout'
import { Navbar } from '@/widgets/Navbar'
import { useDispatch } from 'react-redux'
import { Sidebar } from '@/widgets/Sidebar'
import { notification } from 'antd'
import { NotificationContext } from '@/shared/lib/NotificationContext'

export const App: FC = () => {
  const dispatch = useDispatch()
  const [api, contextHolder] = notification.useNotification()
  const [checkAuthMutation] = useCheckAuth()
  const auth = useSelector(getUserAuthData)
  const inited = useSelector(getUserInited)

  useLayoutEffect(() => {
    const user = localStorage.getItem(USER_LOCALSTORAGE_KEY)

    if (user) {
      checkAuthMutation({})
    } else {
      dispatch(userActions.setInited())
    }
  }, [checkAuthMutation, dispatch])

  if (!inited) {
    return <PageLoader />
  }

  return (
    <NotificationContext.Provider value={api}>
      {contextHolder}
      <Suspense fallback={<PageLoader />}>
        <MainLayout header={auth && <Navbar />} sidebar={auth && <Sidebar />} content={<AppRouter />} />
      </Suspense>
    </NotificationContext.Provider>
  )
}
