// import { NotFoundPage } from '@/pages/NotFoundPage'
// import { ForbiddenPage } from '@/pages/ForbiddenPage'
import { LoginPage } from '@/pages/LoginPage'
import { AppRoutesProps } from '@/shared/types/router'
import { AppRoutes, getRouteLogin, getRouteMain, getRouteRegister } from '@/shared/consts/router'
import { MainPage } from '@/pages/MainPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

export const routeConfig: Record<AppRoutes, AppRoutesProps> = {
  [AppRoutes.LOGIN]: {
    path: getRouteLogin(),
    element: <LoginPage />
  },
  [AppRoutes.REGISTER]: {
    path: getRouteRegister(),
    element: <RegisterPage />
  },
  [AppRoutes.MAIN]: {
    path: getRouteMain(),
    element: <MainPage />,
    authOnly: true
  },
  // last
  [AppRoutes.NOT_FOUND]: {
    path: '*',
    element: <NotFoundPage />
  }
}
