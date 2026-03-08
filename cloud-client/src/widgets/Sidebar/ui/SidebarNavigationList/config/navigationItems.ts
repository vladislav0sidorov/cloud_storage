import { getRouteFileStorage, getRouteProfile } from '@/shared/consts/router'

export const NAVIGATION_ITEMS = [
  {
    id: 'file-storage',
    path: getRouteFileStorage(),
    label: 'Мое облако',
  },
  {
    id: 'profile',
    path: getRouteProfile(),
    label: 'Профиль',
  },
] as const
