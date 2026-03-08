import { getUserAuthData } from '@/entities/User'
import { getRouteFileStorage } from '@/shared/consts/router'
import { Button, Card, Flex, Typography } from 'antd'
import { FC } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

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
      <Flex justify="center" vertical gap={5}>
        {isActivated ? (
          <>
            <Typography.Text>Ваш аккаунт активирован. Перейдите в облачное хранилище.</Typography.Text>
            <Link to={getRouteFileStorage()}>
              <Button type="primary">Перейти в облачное хранилище</Button>
            </Link>
          </>
        ) : (
          <>
            <Typography.Text>Активируйте аккаунт, чтобы открыть облачное хранилище.</Typography.Text>
            <Typography.Text type="secondary">
              Ссылка для активации отправлена на {user?.user.email}. Проверьте папку «Спам», если письма нет.
            </Typography.Text>
          </>
        )}
      </Flex>
    </Card>
  )
}

export default MainPage
