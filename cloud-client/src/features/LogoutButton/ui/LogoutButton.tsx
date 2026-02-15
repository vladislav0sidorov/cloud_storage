import { Button } from 'antd'
import { FC, useState } from 'react'
import { useLogout } from '../model/services/logout/logout'

export const LogoutButton: FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [logoutMutation] = useLogout()

  const onLogout = async () => {
    try {
      setIsLoading(true)
      await logoutMutation({}).unwrap()
    } catch (error) {
      console.error('Failed to logout: ', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button loading={isLoading} onClick={onLogout} type="primary">
      Выйти
    </Button>
  )
}
