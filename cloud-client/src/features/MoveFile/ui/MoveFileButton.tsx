import { useMoveFileMutation, type IFileItem } from '@/entities/File'
import { useNotificationApi } from '@/shared/lib/NotificationContext'
import { Button, Modal, Select } from 'antd'
import { FC, useState } from 'react'

interface MoveFileButtonProps {
  item: IFileItem
  currentParentId: string | null
  foldersInCurrent: IFileItem[]
}

export const MoveFileButton: FC<MoveFileButtonProps> = ({ item, currentParentId, foldersInCurrent }) => {
  const [open, setOpen] = useState(false)
  const [targetParentId, setTargetParentId] = useState<string | null>(currentParentId)
  const [moveFile, { isLoading }] = useMoveFileMutation()
  const notificationApi = useNotificationApi()

  const options = [
    { value: '__root__', label: 'Корень' },
    ...foldersInCurrent.filter(f => f.id !== item.id).map(f => ({ value: f.id, label: f.name }))
  ]

  const handleOk = async () => {
    const parentId = targetParentId === '__root__' ? null : targetParentId
    if (parentId === currentParentId) {
      setOpen(false)
      return
    }
    try {
      await moveFile({ id: item.id, parentId }).unwrap()
      notificationApi.success({ message: 'Перемещено' })
      setOpen(false)
    } catch (err: unknown) {
      const e = err as { data?: { message?: string } }
      notificationApi.error({
        message: 'Ошибка',
        description: e?.data?.message ?? 'Не удалось переместить'
      })
    }
  }

  return (
    <>
      <Button size="small" onClick={() => setOpen(true)}>
        Переместить
      </Button>
      <Modal
        title={`Переместить "${item.name}"`}
        open={open}
        onOk={handleOk}
        onCancel={() => setOpen(false)}
        confirmLoading={isLoading}
        okText="Переместить"
      >
        <Select
          placeholder="Выберите папку"
          style={{ width: '100%' }}
          value={targetParentId === null ? '__root__' : targetParentId}
          onChange={v => setTargetParentId(v === '__root__' ? null : v)}
          options={options}
        />
      </Modal>
    </>
  )
}
