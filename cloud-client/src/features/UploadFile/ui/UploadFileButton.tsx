import { useUploadFileMutation } from '@/entities/File'
import { useNotificationApi } from '@/shared/lib/NotificationContext'
import { UploadOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useRef, FC } from 'react'

interface UploadFileButtonProps {
  parentId: string | null
}

export const UploadFileButton: FC<UploadFileButtonProps> = ({ parentId }) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploadFile, { isLoading }] = useUploadFileMutation()
  const notificationApi = useNotificationApi()

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)
    if (parentId != null) formData.append('parentId', parentId)
    try {
      await uploadFile(formData).unwrap()
      notificationApi.success({ message: 'Файл загружен' })
    } catch (err: unknown) {
      const e = err as { data?: { message?: string } }
      notificationApi.error({
        message: 'Ошибка загрузки',
        description: e?.data?.message ?? 'Не удалось загрузить файл'
      })
    }
    e.target.value = ''
  }

  return (
    <>
      <input ref={inputRef} type="file" style={{ display: 'none' }} onChange={handleChange} disabled={isLoading} />
      <Button icon={<UploadOutlined />} onClick={() => inputRef.current?.click()} loading={isLoading}>
        Загрузить файл
      </Button>
    </>
  )
}
