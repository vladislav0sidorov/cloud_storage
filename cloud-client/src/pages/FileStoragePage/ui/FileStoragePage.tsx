import { FileStorage } from '@/widgets/FileStorage'
import { Card } from 'antd'
import { FC } from 'react'
import { useParams } from 'react-router-dom'

const FileStoragePage: FC = () => {
  const { folderId = null } = useParams()

  return (
    <Card title="Моё облако" style={{ height: '100%' }}>
      <FileStorage folderId={folderId} />
    </Card>
  )
}

export default FileStoragePage
