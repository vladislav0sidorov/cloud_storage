import { fileStorageActions, FileStorageBreadcrumb, IFileItem, useGetFileListQuery, useLazyGetFileDownloadUrlQuery } from '@/entities/File'
import { DeleteFileButton } from '@/features/DeleteFile'
import { MoveFileButton } from '@/features/MoveFile'
import { formatBytes } from '@/shared/lib/format/formatBytes'
import { DownloadOutlined, FileOutlined, FolderOutlined } from '@ant-design/icons'
import { Button, Space, Typography } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import { FC, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { ImageThumbnail } from './ui/ImageThumbnail'

const IMAGE_MIME_PREFIX = 'image/'
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg']

function isImageFile(record: IFileItem): boolean {
  if (record.isFolder) return false
  if (record.mimeType?.startsWith(IMAGE_MIME_PREFIX)) return true
  const lower = record.name.toLowerCase()
  return IMAGE_EXTENSIONS.some(ext => lower.endsWith(ext))
}

interface FileStorageTableProps {
  items: IFileItem[]
  breadcrumbs: FileStorageBreadcrumb[]
  currentParentId: string | null
}

export const FileStorageTable: FC<FileStorageTableProps> = props => {
  const { items, breadcrumbs, currentParentId } = props
  const dispatch = useDispatch()

  const { data, isLoading } = useGetFileListQuery(currentParentId)
  const [triggerDownload, { isLoading: isDownloading }] = useLazyGetFileDownloadUrlQuery()

  useEffect(() => {
    if (data) {
      dispatch(fileStorageActions.setFileList({ items: data.items, used: data.used }))
    }
  }, [data, dispatch])

  const foldersInCurrent = items.filter(i => i.isFolder)

  const handleDownload = async (id: string, name: string) => {
    const blob = await triggerDownload(id).unwrap()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = name
    a.click()
    URL.revokeObjectURL(url)
  }

  const openFolder = (folder: IFileItem) => {
    dispatch(
      fileStorageActions.setNavigation({
        currentParentId: folder.id,
        breadcrumbs: [...breadcrumbs, { id: folder.id, name: folder.name }]
      })
    )
  }
  const columns: ColumnsType<IFileItem> = [
    {
      title: 'Имя',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: IFileItem) => (
        <Space>
          {record.isFolder ? (
            <FolderOutlined style={{ color: '#faad14' }} />
          ) : isImageFile(record) ? (
            <ImageThumbnail fileId={record.id} alt={record.name} />
          ) : (
            <FileOutlined />
          )}
          {record.isFolder ? (
            <Typography.Link onClick={() => openFolder(record)}>{name}</Typography.Link>
          ) : (
            <Space>
              <span>{name}</span>
              <Button
                type="link"
                size="small"
                icon={<DownloadOutlined />}
                loading={isDownloading}
                onClick={() => handleDownload(record.id, record.name)}
              >
                Скачать
              </Button>
            </Space>
          )}
        </Space>
      )
    },
    {
      title: 'Размер',
      dataIndex: 'size',
      key: 'size',
      width: 120,
      render: (_: unknown, record: IFileItem) => (record.isFolder ? '—' : formatBytes(record.size ?? 0))
    },
    {
      title: '',
      key: 'actions',
      width: 200,
      align: 'right',
      render: (_: unknown, record: IFileItem) => (
        <Space size="small">
          <MoveFileButton item={record} currentParentId={currentParentId} foldersInCurrent={foldersInCurrent} />
          <DeleteFileButton item={record} />
        </Space>
      )
    }
  ]

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={items}
      loading={isLoading}
      pagination={false}
      size="small"
      locale={{ emptyText: 'Здесь пока ничего нет. Создайте папку или загрузите файл.' }}
    />
  )
}
