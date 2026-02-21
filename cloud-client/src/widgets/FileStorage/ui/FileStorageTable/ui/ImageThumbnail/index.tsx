import { useGetFileDownloadUrlQuery } from '@/entities/File'
import { Image } from 'antd'
import { FC, useEffect, useState } from 'react'

interface ImageThumbnailProps {
  fileId: string
  alt?: string
}

const THUMB_SIZE = 40

export const ImageThumbnail: FC<ImageThumbnailProps> = ({ fileId, alt = '' }) => {
  const { data: blob } = useGetFileDownloadUrlQuery(fileId)
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!blob) return
    const objectUrl = URL.createObjectURL(blob)
    setUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [blob])

  if (!url) {
    return (
      <span
        style={{
          display: 'inline-block',
          width: THUMB_SIZE,
          height: THUMB_SIZE,
          background: '#f0f0f0',
          borderRadius: 4
        }}
      />
    )
  }

  return (
    <Image
      width={THUMB_SIZE}
      height={THUMB_SIZE}
      src={url}
      alt={alt}
      style={{ objectFit: 'cover', borderRadius: 4, flexShrink: 0 }}
      preview={{ mask: 'Просмотр' }}
    />
  )
}
