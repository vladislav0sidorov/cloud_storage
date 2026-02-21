import { fileStorageActions, FileStorageBreadcrumb } from '@/entities/File'
import { Breadcrumb } from 'antd'
import { FC } from 'react'
import { useDispatch } from 'react-redux'

interface FileStorageBreadcrumbsProps {
  breadcrumbs: FileStorageBreadcrumb[]
}

export const FileStorageBreadcrumbs: FC<FileStorageBreadcrumbsProps> = props => {
  const { breadcrumbs } = props

  const dispatch = useDispatch()

  const goToBreadcrumb = (index: number) => {
    const item = breadcrumbs[index]
    dispatch(
      fileStorageActions.setNavigation({
        currentParentId: item.id,
        breadcrumbs: breadcrumbs.slice(0, index + 1)
      })
    )
  }

  return (
    <Breadcrumb
      items={breadcrumbs.map((breadcrumb, index) => ({
        title: index === breadcrumbs.length - 1 ? breadcrumb.name : <a onClick={() => goToBreadcrumb(index)}>{breadcrumb.name}</a>
      }))}
    />
  )
}
