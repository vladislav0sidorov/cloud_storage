import { getUserAuthData } from '@/entities/User'
import { UserProfileForm } from '@/features/UpdateUserProfile'
import { Card, Typography } from 'antd'
import { FC } from 'react'
import { useSelector } from 'react-redux'

const ProfilePage: FC = () => {
  const user = useSelector(getUserAuthData)

  const authUser = user?.user

  if (!authUser) {
    return (
      <Card>
        <Typography.Text type="secondary">Данные пользователя недоступны</Typography.Text>
      </Card>
    )
  }

  return <UserProfileForm authUser={authUser} />
}

export default ProfilePage
