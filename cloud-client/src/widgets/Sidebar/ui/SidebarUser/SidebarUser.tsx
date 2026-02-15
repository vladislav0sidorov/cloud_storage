import { Card, Flex, Typography } from 'antd'
import { FC } from 'react'
import cls from './SidebarUser.module.css'
import { getUserAuthData, IUser } from '@/entities/User'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import classNames from 'classnames'

interface SidebarUserProps {
  email: IUser['user']['email']
  isActivated: IUser['user']['isActivated']
  isSelected: boolean
}

export const SidebarUser: FC<SidebarUserProps> = props => {
  const { email, isActivated, isSelected } = props
  const user = useSelector(getUserAuthData)
  const navigate = useNavigate()

  const moveToChatPage = () => {
    if (!user?.user.id) {
      return
    }

    navigate('/')
  }

  return (
    <Card size="small" className={classNames(cls.SidebarUser, { [cls.isSelectedUser]: isSelected })} onClick={moveToChatPage}>
      <Flex vertical gap={8} className={cls.userInfo}>
        <Typography.Text className={cls.email} ellipsis>
          {email}
        </Typography.Text>
        <Typography.Text className={cls.isActivated} ellipsis type="secondary">
          {isActivated ? 'Учетная запись активирована' : 'Учетная запись не активирована'}
        </Typography.Text>
      </Flex>
    </Card>
  )
}
