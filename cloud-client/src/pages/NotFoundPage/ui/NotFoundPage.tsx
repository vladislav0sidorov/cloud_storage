import { Button, Card, Flex, Typography } from 'antd'
import { FileUnknownOutlined, HomeOutlined } from '@ant-design/icons'
import { FC } from 'react'
import { Link } from 'react-router-dom'
import { getRouteMain } from '@/shared/consts/router'

const NotFoundPage: FC = () => {
  return (
    <Card
      title="Страница не найдена"
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
      <Flex justify="center" align="center" vertical gap={16}>
        <FileUnknownOutlined style={{ fontSize: 64, color: 'var(--ant-colorTextQuaternary)' }} />
        <Typography.Title level={1} style={{ margin: 0, color: 'var(--ant-colorText)' }}>
          404
        </Typography.Title>
        <Typography.Text type="secondary" style={{ textAlign: 'center' }}>
          Запрашиваемая страница не существует. Возможно, ссылка устарела или файл был перемещён.
        </Typography.Text>
        <Link to={getRouteMain()}>
          <Button type="primary" icon={<HomeOutlined />}>
            На главную
          </Button>
        </Link>
      </Flex>
    </Card>
  )
}

export default NotFoundPage
