import { useDeleteFileMutation, type IFileItem } from '@/entities/File'
import { useNotificationApi } from '@/shared/lib/NotificationContext'
import { DeleteOutlined } from '@ant-design/icons'
import { Button, Popconfirm } from 'antd'
import { FC } from 'react'

interface DeleteFileButtonProps {
  item: IFileItem
}

export const DeleteFileButton: FC<DeleteFileButtonProps> = ({ item }) => {
  const [deleteFile, { isLoading }] = useDeleteFileMutation()
  const notificationApi = useNotificationApi()

  const handleConfirm = async () => {
    try {
      await deleteFile(item.id).unwrap()
      notificationApi.success({
        message: item.isFolder ? 'Папка удалена' : 'Файл удалён',
        description: item.isFolder ? 'Папка и всё её содержимое удалены.' : undefined
      })
    } catch (err: unknown) {
      const e = err as { data?: { message?: string } }
      notificationApi.error({
        message: 'Ошибка удаления',
        description: e?.data?.message ?? 'Не удалось удалить'
      })
    }
  }

  const confirmTitle = item.isFolder
    ? `Удалить папку «${item.name}» и всё её содержимое? Это действие нельзя отменить.`
    : `Удалить файл «${item.name}»?`

  return (
    <Popconfirm title={confirmTitle} onConfirm={handleConfirm} okText="Удалить" cancelText="Отмена" okButtonProps={{ danger: true }}>
      <Button type="link" danger size="small" icon={<DeleteOutlined />} loading={isLoading} />
    </Popconfirm>
  )
}
