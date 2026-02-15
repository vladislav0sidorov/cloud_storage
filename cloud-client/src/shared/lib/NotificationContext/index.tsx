import { createContext, useContext } from 'react'
import type { NotificationInstance } from 'antd/es/notification/interface'

export const NotificationContext = createContext<NotificationInstance | null>(null)

export const useNotificationApi = () => {
  const context = useContext(NotificationContext)

  if (!context) throw new Error('useNotificationApi must be used within NotificationProvider')

  return context
}
