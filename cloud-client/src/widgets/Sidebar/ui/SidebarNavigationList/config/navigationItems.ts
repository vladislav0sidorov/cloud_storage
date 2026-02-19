import { getRouteMain, getRouteProfile } from '@/shared/consts/router'

export const NAVIGATION_ITEMS = [
  {
    id: 'home',
    path: getRouteMain(),
    label: 'Мое облако',
  },
  {
    id: 'profile',
    path: getRouteProfile(),
    label: 'Профиль',
  },
] as const
