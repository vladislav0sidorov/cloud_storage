import { getFileStorage, useUploadFileMutation } from '@/entities/File'
import { CreateFolderButton } from '@/features/CreateFolder'
import { UploadFileButton } from '@/features/UploadFile'
import { useNotificationApi } from '@/shared/lib/NotificationContext'
import { formatBytes, STORAGE_LIMIT_BYTES } from '@/shared/lib/format/formatBytes'
import { Flex, Space, Typography } from 'antd'
import { FC, useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { FileStorageBreadcrumbs } from './FileStorageBreadcrumbs'
import { FileStorageTable } from './FileStorageTable'

export const FileStorage: FC = () => {
  const { items, used, currentParentId, breadcrumbs } = useSelector(getFileStorage)
  const [uploadFile] = useUploadFileMutation()
  const notificationApi = useNotificationApi()
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer.types.includes('Files')) setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
      const files = Array.from(e.dataTransfer.files)
      if (!files.length) return
      let ok = 0
      let err = 0
      for (const file of files) {
        const formData = new FormData()
        formData.append('file', file)
        if (currentParentId != null) formData.append('parentId', currentParentId)
        try {
          await uploadFile(formData).unwrap()
          ok += 1
        } catch {
          err += 1
        }
      }
      if (ok) notificationApi.success({ message: `Загружено файлов: ${ok}` })
      if (err) notificationApi.error({ message: `Не удалось загрузить: ${err}` })
    },
    [currentParentId, uploadFile, notificationApi]
  )

  return (
    <Flex vertical gap={16}>
      <Flex
        justify="space-between"
        align="center"
        wrap="wrap"
        gap={12}
        style={{
          padding: '12px 16px',
          background: 'var(--ant-colorFillQuaternary, #f5f5f5)',
          borderRadius: 8
        }}
      >
        <FileStorageBreadcrumbs breadcrumbs={breadcrumbs} />

        <Space size="middle">
          <CreateFolderButton parentId={currentParentId} />
          <UploadFileButton parentId={currentParentId} />
        </Space>
      </Flex>
      <Typography.Text type="secondary">
        Занято: {formatBytes(used)} из {formatBytes(STORAGE_LIMIT_BYTES)}
      </Typography.Text>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          position: 'relative',
          borderRadius: 8,
          minHeight: 120,
          transition: 'background 0.2s, box-shadow 0.2s',
          ...(isDragging && {
            background: 'var(--ant-colorPrimaryBgHover, #e6f4ff)',
            boxShadow: 'inset 0 0 0 2px var(--ant-colorPrimary, #1677ff)'
          })
        }}
      >
        {isDragging && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 8,
              background: 'rgba(255,255,255,0.85)',
              zIndex: 1,
              pointerEvents: 'none'
            }}
          >
            <Typography.Text type="secondary" style={{ fontSize: 16 }}>
              Отпустите файлы для загрузки
            </Typography.Text>
          </div>
        )}
        <FileStorageTable items={items} breadcrumbs={breadcrumbs} currentParentId={currentParentId} />
      </div>
    </Flex>
  )
}
