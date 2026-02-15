import { FC } from 'react'
import { SidebarUser } from '../SidebarUser/SidebarUser'
import { Flex } from 'antd'
import cls from './SidebarUserList.module.css'

export const SidebarUserList: FC = () => {
  return (
    <div className={cls.SidebarUserListWrapper}>
      <Flex vertical gap="middle" className={cls.SidebarUserList}>
        <SidebarUser email="test@test.com" isActivated={true} isSelected={false} />
      </Flex>
    </div>
  )
}
