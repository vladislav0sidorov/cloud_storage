import { Flex } from 'antd'
import { FC } from 'react'
import cls from './Navbar.module.css'
import { LogoutButton } from '@/features/LogoutButton'
import { getUserAuthData } from '@/entities/User'
import { useSelector } from 'react-redux'

export const Navbar: FC = () => {
  const auth = useSelector(getUserAuthData)

  if (!auth) return null

  return (
    <Flex className={cls.Navbar}>
      <LogoutButton />
    </Flex>
  )
}
