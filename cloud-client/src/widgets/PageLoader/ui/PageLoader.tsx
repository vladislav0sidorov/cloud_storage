import { Flex, Spin } from 'antd'
import { FC } from 'react'

export const PageLoader: FC = () => {
  return (
    <Flex justify="center" align="center" style={{ height: '100vh' }}>
      <Spin size="large" />
    </Flex>
  )
}
