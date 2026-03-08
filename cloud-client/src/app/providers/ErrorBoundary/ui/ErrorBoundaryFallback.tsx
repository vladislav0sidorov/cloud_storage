import { Button, Card, Flex, Typography } from 'antd'
import { WarningOutlined } from '@ant-design/icons'
import { FC } from 'react'
import { getRouteMain } from '@/shared/consts/router'
import { Link } from 'react-router-dom'

interface ErrorBoundaryFallbackProps {
  error: Error
  resetErrorBoundary?: () => void
}

export const ErrorBoundaryFallback: FC<ErrorBoundaryFallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <Card
      title="Что-то пошло не так"
      styles={{
        body: {
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }
      }}
      style={{ height: '100%', minHeight: '100vh' }}
    >
      <Flex justify="center" align="center" vertical gap={16}>
        <WarningOutlined style={{ fontSize: 64, color: 'var(--ant-colorError)' }} />
        <Typography.Text type="secondary" style={{ textAlign: 'center', maxWidth: 480 }}>
          Произошла непредвиденная ошибка. Попробуйте обновить страницу или вернуться на главную.
        </Typography.Text>
        {error?.message && (
          <Typography.Text
            type="secondary"
            style={{
              fontSize: 12,
              fontFamily: 'monospace',
              padding: 8,
              background: 'var(--ant-colorFillQuaternary)',
              borderRadius: 6,
              maxWidth: 480,
              wordBreak: 'break-word',
              textAlign: 'center',
              display: 'block'
            }}
          >
            {error.message}
          </Typography.Text>
        )}
        <Flex gap={8}>
          {resetErrorBoundary && <Button onClick={resetErrorBoundary}>Попробовать снова</Button>}
          <Link to={getRouteMain()}>
            <Button type="primary">На главную</Button>
          </Link>
          <Button onClick={() => window.location.reload()}>Обновить страницу</Button>
        </Flex>
      </Flex>
    </Card>
  )
}
