import { CloudOutlined } from '@ant-design/icons'
import { FC } from 'react'
import cls from './Sidebar.module.css'
import { LogoutButton } from '@/features/LogoutButton'
import { SidebarNavigationList } from './SidebarNavigationList/SidebarNavigation'
import { Link } from 'react-router-dom'
import { getRouteMain } from '@/shared/consts/router'

export const Sidebar: FC = () => {
  return (
    <aside className={cls.sidebar}>
      <div className={cls.header}>
        <Link to={getRouteMain()}>
          <div className={cls.logo}>
            <div className={cls.logoIcon}>
              <CloudOutlined />
            </div>
            Cloud storage
          </div>
        </Link>
      </div>
      <div className={cls.navWrap}>
        <SidebarNavigationList />
      </div>
      <div className={cls.footer}>
        <div className={cls.logoutWrap}>
          <LogoutButton className={cls.logoutButton} />
        </div>
      </div>
    </aside>
  )
}
