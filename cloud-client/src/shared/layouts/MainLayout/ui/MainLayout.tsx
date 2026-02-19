import classNames from 'classnames'
import { FC, ReactNode } from 'react'
import cls from './MainLayout.module.css'

interface MainLayoutProps {
  className?: string
  header?: ReactNode
  sidebar: ReactNode | undefined
  content: ReactNode
}

export const MainLayout: FC<MainLayoutProps> = props => {
  const { className, sidebar, content } = props

  return (
    <main className={classNames(cls.MainLayout, [className])}>
      {sidebar ? <aside className={cls.sidebar}>{sidebar}</aside> : null}
      <section className={cls.content}>{content}</section>
    </main>
  )
}
