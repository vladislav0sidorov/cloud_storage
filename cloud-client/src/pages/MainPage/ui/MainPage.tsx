import { getUserAuthData } from '@/entities/User'
import { FileStorage } from '@/widgets/FileStorage'
import { Card, Flex, Typography } from 'antd'
import { FC } from 'react'
import { useSelector } from 'react-redux'

const MainPage: FC = () => {
  const user = useSelector(getUserAuthData)
  const isActivated = user?.user.isActivated

  if (false) {
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
        <Flex justify="center" vertical gap={5}>
          <Typography.Text>Активируйте аккаунт, чтобы открыть облачное хранилище.</Typography.Text>
          <Typography.Text type="secondary">
            Ссылка для активации отправлена на {user?.user.email}. Проверьте папку «Спам», если письма нет.
          </Typography.Text>
        </Flex>
      </Card>
    )
  }

  return (
    <Card title="Моё облако" style={{ height: '100%' }}>
      <FileStorage />
    </Card>
  )
}

export default MainPage
