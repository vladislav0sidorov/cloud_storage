export enum AppRoutes {
  MAIN = 'home',
  LOGIN = 'login',
  REGISTER = 'register',
  // PROFILE = 'profile',

  // last
  NOT_FOUND = 'not_found',
}

export const getRouteMain = () => '/'
export const getRouteLogin = () => '/login'
export const getRouteRegister = () => '/register'


export const AppRouteByPathPattern: Record<string, AppRoutes> = {
  [getRouteMain()]: AppRoutes.MAIN,
  [getRouteLogin()]: AppRoutes.LOGIN,
  // [getRouteProfile(':id')]: AppRoutes.PROFILE,

}
