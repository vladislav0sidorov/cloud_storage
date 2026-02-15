import { Card } from 'antd'
import { FC } from 'react'
import cls from './Sidebar.module.css'
import { SidebarUserList } from './SidebarUserList/SidebarUserList'

export const Sidebar: FC = () => {
  return (
    <Card
      title="Пользователи"
      style={{ overflow: 'hidden' }}
      styles={{
        body: {
          overflowY: 'auto',
          height: '100%',
          padding: 0
        }
      }}
      className={cls.Sidebar}
    >
      <SidebarUserList />
    </Card>
  )
}
