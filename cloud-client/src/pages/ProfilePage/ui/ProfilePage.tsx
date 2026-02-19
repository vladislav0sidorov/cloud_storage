import { getUserAuthData } from '@/entities/User'
import { useUpdatePassword } from '@/features/UpdatePassword'
import { useNotificationApi } from '@/shared/lib/NotificationContext'
import { Button, Card, Descriptions, Divider, Form, Input, Typography } from 'antd'
import { FC } from 'react'
import { useSelector } from 'react-redux'
import cls from './ProfilePage.module.css'

type PasswordFormValues = {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

const ProfilePage: FC = () => {
  const user = useSelector(getUserAuthData)
  const [form] = Form.useForm<PasswordFormValues>()
  const [updatePassword, { isLoading }] = useUpdatePassword()
  const notificationApi = useNotificationApi()

  const authUser = user?.user

  const onFinishPassword = async (values: PasswordFormValues) => {
    try {
      await updatePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword
      }).unwrap()
      notificationApi.success({
        message: 'Пароль изменён',
        description: 'Ваш пароль успешно обновлён. Используйте новый пароль при следующем входе.'
      })
      form.resetFields()
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } }
      notificationApi.error({
        message: 'Ошибка смены пароля',
        description: err?.data?.message ?? 'Проверьте текущий пароль и попробуйте снова.'
      })
    }
  }

  if (!authUser) {
    return (
      <Card>
        <Typography.Text type="secondary">Данные пользователя недоступны</Typography.Text>
      </Card>
    )
  }

  return (
    <Card title="Профиль" style={{ height: '100%' }}>
      <Descriptions
        column={1}
        items={[
          { key: '1', label: 'Email', children: authUser.email },
          { key: '2', label: 'ID', children: <Typography.Text copyable>{authUser.id}</Typography.Text> },
          {
            key: '3',
            label: 'Статус аккаунта',
            children: authUser.isActivated ? (
              <Typography.Text type="success">Активирован</Typography.Text>
            ) : (
              <Typography.Text type="warning">Ожидает активации</Typography.Text>
            )
          }
        ]}
      />

      <Divider />

      <Typography.Title level={5}>Изменить пароль</Typography.Title>
      <Form form={form} layout="vertical" onFinish={onFinishPassword} className={cls.form} validateTrigger="onBlur">
        <Form.Item name="currentPassword" label="Текущий пароль" rules={[{ required: true, message: 'Введите текущий пароль' }]}>
          <Input.Password placeholder="Текущий пароль" />
        </Form.Item>
        <Form.Item
          name="newPassword"
          label="Новый пароль"
          rules={[
            { required: true, message: 'Введите новый пароль' },
            { min: 6, message: 'Минимум 6 символов' }
          ]}
        >
          <Input.Password placeholder="Новый пароль" />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          label="Подтвердите новый пароль"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: 'Подтвердите пароль' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) return Promise.resolve()
                return Promise.reject(new Error('Пароли не совпадают'))
              }
            })
          ]}
        >
          <Input.Password placeholder="Повторите новый пароль" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Сохранить новый пароль
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}

export default ProfilePage
