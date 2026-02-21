import { useCreateFolderMutation } from '@/entities/File'
import { useNotificationApi } from '@/shared/lib/NotificationContext'
import { FolderAddOutlined } from '@ant-design/icons'
import { Button, Form, Input, Modal } from 'antd'
import { FC, useState } from 'react'

interface CreateFolderButtonProps {
  parentId: string | null
}

export const CreateFolderButton: FC<CreateFolderButtonProps> = ({ parentId }) => {
  const [open, setOpen] = useState(false)
  const [form] = Form.useForm<{ name: string }>()
  const [createFolder, { isLoading }] = useCreateFolderMutation()
  const notificationApi = useNotificationApi()

  const onFinish = async (values: { name: string }) => {
    try {
      await createFolder({ parentId, name: values.name.trim() }).unwrap()
      notificationApi.success({ message: 'Папка создана' })
      form.resetFields()
      setOpen(false)
    } catch (e: unknown) {
      const err = e as { data?: { message?: string } }
      notificationApi.error({
        message: 'Ошибка',
        description: err?.data?.message ?? 'Не удалось создать папку'
      })
    }
  }

  return (
    <>
      <Button type="primary" icon={<FolderAddOutlined />} onClick={() => setOpen(true)}>
        Новая папка
      </Button>
      <Modal
        title="Новая папка"
        open={open}
        onCancel={() => {
          setOpen(false)
          form.resetFields()
        }}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="Имя папки" rules={[{ required: true, message: 'Введите имя папки' }, { whitespace: true }]}>
            <Input placeholder="Имя папки" autoFocus />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Создать
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
