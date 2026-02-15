import { Button, Flex, Form, Input } from 'antd'
import Card from 'antd/es/card/Card'
import { FC } from 'react'
import { useLoginByUsername } from '../model/services/loginByUsername/loginByUsername'
import { useSelector } from 'react-redux'
import { getUserAuthErrors } from '@/entities/User'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { getRouteRegister } from '@/shared/consts/router'
import { useNotificationApi } from '@/shared/lib/NotificationContext'

type FieldType = {
  email?: string
  password?: string
}

export const LoginForm: FC = () => {
  const navigate = useNavigate()
  const notificationApi = useNotificationApi()

  const [loginByUsernameMutation, { isLoading }] = useLoginByUsername()
  const errors = useSelector(getUserAuthErrors)

  const isEmailError = errors?.message.includes('email')
  const isPasswordError = errors?.message.includes('пароль')

  const onFinish = async (values: FieldType) => {
    const { email, password } = values

    if (!email || !password) {
      return
    }

    try {
      await loginByUsernameMutation({
        email,
        password
      }).unwrap()
    } catch (error: any) {
      const { data } = error

      console.log(data.status === 500)

      if (data.status === 500) {
        notificationApi.error({
          message: 'Серверная ошибка',
          description: `Код ошибки: ${data.status}. ${data.message}`,
          showProgress: true
        })
      }

      console.error('Failed to login: ', error)
    }
  }

  return (
    <Flex justify="center" align="center" style={{ height: '100vh', width: '100%' }}>
      <Card title="Вход в систему" style={{ minWidth: 400 }}>
        <Form name="login" initialValues={{ remember: true }} style={{ maxWidth: 500 }} onFinish={onFinish}>
          <Form.Item
            name="email"
            validateTrigger="onBlur"
            validateStatus={isEmailError ? 'error' : ''}
            help={isEmailError ? errors?.message : null}
            rules={[
              {
                type: 'email',
                message: 'Пожалуйста, введите корректный Email'
              },
              { required: true, message: 'Пожалуйста, введите свой Email' }
            ]}
          >
            <Input prefix={<UserOutlined />} type="email" placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            validateTrigger="onBlur"
            validateStatus={isPasswordError ? 'error' : ''}
            help={isPasswordError ? errors?.message : null}
            rules={[{ required: true, message: 'Пожалуйста, введите свой пароль' }]}
          >
            <Input prefix={<LockOutlined />} type="password" placeholder="Пароль" />
          </Form.Item>

          <Form.Item>
            <Flex vertical gap={10}>
              <Button block loading={isLoading} type="primary" htmlType="submit">
                Войти
              </Button>
              <Button block onClick={() => navigate(getRouteRegister())}>
                Зарегистрироваться
              </Button>
            </Flex>
          </Form.Item>
        </Form>
      </Card>
    </Flex>
  )
}
