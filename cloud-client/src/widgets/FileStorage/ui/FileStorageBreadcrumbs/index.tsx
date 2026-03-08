import { fileStorageActions, useGetFileBreadcrumbsQuery } from '@/entities/File'
import { getRouteFileStorage } from '@/shared/consts/router'
import { Breadcrumb } from 'antd'
import { FC, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

interface FileStorageBreadcrumbsProps {
  currentParentId: string | null
}

const ROOT_CRUMB = [{ id: null, name: 'Корень' }]

export const FileStorageBreadcrumbs: FC<FileStorageBreadcrumbsProps> = ({ currentParentId }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { data } = useGetFileBreadcrumbsQuery(currentParentId)

  const breadcrumbs = data?.breadcrumbs ?? ROOT_CRUMB

  useEffect(() => {
    if (data?.breadcrumbs) {
      dispatch(
        fileStorageActions.setNavigation({
          currentParentId,
          breadcrumbs: data.breadcrumbs
        })
      )
    }
  }, [data?.breadcrumbs, currentParentId, dispatch])

  const goToBreadcrumb = (index: number) => {
    const item = breadcrumbs[index]

    navigate(getRouteFileStorage(item.id ?? undefined))
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
        title:
          index === breadcrumbs.length - 1 ? breadcrumb.name || 'Папка' : <a onClick={() => goToBreadcrumb(index)}>{breadcrumb.name || 'Папка'}</a>
      }))}
    />
  )
}
