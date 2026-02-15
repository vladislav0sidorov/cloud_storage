import { Button, Flex, Form, Input } from 'antd'
import Card from 'antd/es/card/Card'
import { FC } from 'react'
import { useRegisterByEmail } from '../model/services/registerByEmail/registerByEmail'
import { useSelector } from 'react-redux'
import { getUserAuthErrors } from '@/entities/User'
import { useNavigate } from 'react-router-dom'
import { getRouteLogin, getRouteMain } from '@/shared/consts/router'
import { useNotificationApi } from '@/shared/lib/NotificationContext'

type FieldType = {
  email?: string
  password?: string
}

export const RegisterForm: FC = () => {
  const navigate = useNavigate()

  const [registerByEmailMutation, { isLoading }] = useRegisterByEmail()
  const notificationApi = useNotificationApi()

  const errors = useSelector(getUserAuthErrors)

  const isEmailError = errors?.message.includes('email')
  const isPasswordError = errors?.message.includes('пароль')

  const onFinish = async (values: FieldType) => {
    const { email, password } = values

    if (!email || !password) {
      return
    }

    try {
      await registerByEmailMutation({
        email,
        password
      }).unwrap()

      notificationApi.info({
        message: 'Активируйте аккаунт',
        description: 'Проверьте свой Email и перейдите по ссылке для активации аккаунта.',
        showProgress: true
      })
      navigate(getRouteMain())
    } catch (error: any) {
      const { data } = error

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
      <Card title="Регистрация">
        <Form name="register" onFinish={onFinish} style={{ maxWidth: 600 }} scrollToFirstError>
          <Form.Item
            name="email"
            label="Email"
            validateTrigger="onBlur"
            help={isEmailError ? errors?.message : null}
            validateStatus={isEmailError ? 'error' : ''}
            rules={[
              {
                type: 'email',
                message: 'Пожалуйста, введите корректный Email'
              },
              {
                required: true,
                message: 'Пожалуйста, введите свой Email'
              }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Пароль"
            validateTrigger="onBlur"
            help={isPasswordError ? errors?.message : null}
            validateStatus={isPasswordError ? 'error' : ''}
            rules={[
              {
                required: true,
                message: 'Пожалуйста, введите свой пароль'
              },
              {
                min: 6,
                message: 'Пароль должен содержать минимум 6 символов'
              }
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Подтверждение пароля"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Пожалуйста, подтвердите свой пароль'
              },
              {
                min: 6,
                message: 'Пароль должен содержать минимум 6 символов'
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('Пароли не совпадают'))
                }
              })
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Flex vertical gap={10}>
              <Button loading={isLoading} block type="primary" htmlType="submit">
                Зарегистрироваться
              </Button>
              <Button onClick={() => navigate(getRouteLogin())} block>
                На страницу авторизации
              </Button>
            </Flex>
          </Form.Item>
        </Form>
      </Card>
    </Flex>
  )
}
