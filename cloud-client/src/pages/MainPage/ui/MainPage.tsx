import { getUserAuthData } from '@/entities/User'
import { Card, Flex, Typography } from 'antd'
import { FC } from 'react'
import { useSelector } from 'react-redux'

const MainPage: FC = () => {
  const user = useSelector(getUserAuthData)
  const isActivated = user?.user.isActivated

  return (
    <Card
      styles={{
        body: {
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }
      }}
      style={{ height: '100%' }}
    >
      {isActivated ? (
        <Typography.Text>Вы активировали свой аккаунт. Начните общение!</Typography.Text>
      ) : (
        <Flex justify="center" vertical gap={5}>
          <Typography.Text>Мы заметили, что ваш аккаунт не активирован. Активируйте свой аккаунт, чтобы открыть больше функций. </Typography.Text>
          <Typography.Text type="secondary">
            Отправили ссылку для активации на ваш email ({user?.user.email}). Если вы не получили письмо, проверьте папку "Спам".
          </Typography.Text>
        </Flex>
      )}
    </Card>
  )
}

export default MainPage
