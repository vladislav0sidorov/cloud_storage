import { CloudOutlined, UserOutlined } from '@ant-design/icons'
import { Menu } from 'antd'
import { FC } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { NAVIGATION_ITEMS } from './config/navigationItems'

const ICONS: Record<(typeof NAVIGATION_ITEMS)[number]['id'], React.ReactNode> = {
  home: <CloudOutlined />,
  profile: <UserOutlined />
}

export const SidebarNavigationList: FC = () => {
  const location = useLocation()

  const menuItems = NAVIGATION_ITEMS.map(item => ({
    key: item.path,
    icon: ICONS[item.id],
    label: <Link to={item.path}>{item.label}</Link>
  }))

  return <Menu mode="inline" selectedKeys={[location.pathname]} items={menuItems} />
}
