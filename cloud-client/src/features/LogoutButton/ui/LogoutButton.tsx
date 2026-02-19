import { Button } from 'antd'
import { FC, useState } from 'react'
import { useLogout } from '../model/services/logout/logout'

interface LogoutButtonProps {
  className?: string
}

export const LogoutButton: FC<LogoutButtonProps> = ({ className }) => {
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
    <Button loading={isLoading} onClick={onLogout} color="danger" variant="outlined" className={className}>
      Выйти
    </Button>
  )
}
