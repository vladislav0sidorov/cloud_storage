export enum AppRoutes {
  MAIN = 'home',
  FILE_STORAGE = 'file-storage',
  LOGIN = 'login',
  REGISTER = 'register',
  PROFILE = 'profile',

  // last
  NOT_FOUND = 'not_found',
}

export const getRouteFileStoragePath = () => '/file-storage/:folderId?'

export const getRouteMain = () => '/'
export const getRouteLogin = () => '/login'
export const getRouteRegister = () => '/register'
export const getRouteProfile = () => '/profile'
export const getRouteFileStorage = (id?: string) => id ? `/file-storage/${id}` : '/file-storage'

export const AppRouteByPathPattern: Record<string, AppRoutes> = {
  [getRouteFileStorage()]: AppRoutes.FILE_STORAGE,
  [getRouteMain()]: AppRoutes.MAIN,
  [getRouteLogin()]: AppRoutes.LOGIN,
  [getRouteProfile()]: AppRoutes.PROFILE,
}
