import { IUser } from '@/entities/User'
import { Card, Flex, Tabs, Typography } from 'antd'
import { FC } from 'react'
import { ChangePasswordForm } from '../ChangePasswordForm'
import { ChangeAvatarForm } from '../ChangeAvatarForm'
import { ChangePersonalInfoForm } from '../ChangePersonalInfoForm'

interface UserProfileFormProps {
  authUser: IUser['user']
}

export const UserProfileForm: FC<UserProfileFormProps> = props => {
  const { authUser } = props

  return (
    <Card title="Профиль">
      <Flex gap={24} align="flex-start" justify="space-between" style={{ flexWrap: 'wrap-reverse' }}>
        <Flex vertical gap={12}>
          <Flex gap={8} align="center">
            <Typography.Text type="secondary">Email</Typography.Text>
            <Typography.Text>{authUser.email}</Typography.Text>
          </Flex>
          <Flex gap={8} align="center">
            <Typography.Text type="secondary">ID</Typography.Text>
            <Typography.Text copyable>{authUser.id}</Typography.Text>
          </Flex>
          <Flex gap={8} align="center">
            <Typography.Text type="secondary">Статус аккаунта</Typography.Text>
            {authUser.isActivated ? (
              <Typography.Text type="success">Активирован</Typography.Text>
            ) : (
              <Typography.Text type="warning">Ожидает активации</Typography.Text>
            )}
          </Flex>
        </Flex>
        <ChangeAvatarForm authUser={authUser} />
      </Flex>

      <Tabs
        items={[
          { key: 'password', label: 'Пароль', children: <ChangePasswordForm /> },
          { key: 'personal-info', label: 'Персональные данные', children: <ChangePersonalInfoForm authUser={authUser} /> }
        ]}
        defaultActiveKey="password"
      />
    </Card>
  )
}
