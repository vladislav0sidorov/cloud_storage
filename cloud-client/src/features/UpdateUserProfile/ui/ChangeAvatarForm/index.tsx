import { getUserAuthData, IUser, userActions } from '@/entities/User'
import { CameraOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Flex, Upload, UploadProps } from 'antd'
import { FC, useState } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { useUpdateAvatar } from '../../model/services/updateAvatar'
import { useNotificationApi } from '@/shared/lib/NotificationContext'

export interface ChangeAvatarFormProps {
  authUser: IUser['user']
}

const MAX_AVATAR_SIZE_MB = 2
const ACCEPT_IMAGES = 'image/jpeg,image/png,image/webp,image/gif'

const readFileAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

export const ChangeAvatarForm: FC<ChangeAvatarFormProps> = props => {
  const { authUser } = props

  const dispatch = useDispatch()
  const authData = useSelector(getUserAuthData)
  const notificationApi = useNotificationApi()
  const [updateAvatar, { isLoading: isAvatarLoading }] = useUpdateAvatar()
  const [avatarHover, setAvatarHover] = useState(false)

  const handleAvatarChange: UploadProps['beforeUpload'] = async file => {
    if (file.size > MAX_AVATAR_SIZE_MB * 1024 * 1024) {
      notificationApi.error({
        message: `Размер файла превышает ${MAX_AVATAR_SIZE_MB} МБ`,
        description: `Размер файла должен быть не более ${MAX_AVATAR_SIZE_MB} МБ`
      })
      return Upload.LIST_IGNORE
    }
    try {
      const dataUrl = await readFileAsDataUrl(file)

      await updateAvatar({ avatar: dataUrl }).unwrap()
      if (authData) {
        dispatch(
          userActions.setAuthData({
            ...authData,
            user: { ...authData.user, avatar: dataUrl }
          })
        )
      }
      notificationApi.success({
        message: 'Аватар обновлён',
        description: 'Ваш аватар успешно обновлён.'
      })
    } catch {
      notificationApi.error({
        message: 'Не удалось загрузить аватар',
        description: 'Попробуйте ещё раз.'
      })
    }
    return false
  }

  return (
    <Upload accept={ACCEPT_IMAGES} showUploadList={false} beforeUpload={handleAvatarChange} disabled={isAvatarLoading}>
      <Flex
        align="center"
        justify="center"
        style={{ position: 'relative', cursor: 'pointer' }}
        onMouseEnter={() => setAvatarHover(true)}
        onMouseLeave={() => setAvatarHover(false)}
      >
        <Avatar src={authUser.avatar} icon={<UserOutlined />} size={100} style={{ flexShrink: 0 }} />
        <Flex
          align="center"
          justify="center"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.45)',
            borderRadius: '50%',
            opacity: avatarHover ? 1 : 0,
            transition: 'opacity 0.2s',
            pointerEvents: 'none'
          }}
        >
          <CameraOutlined style={{ fontSize: 24, color: '#fff' }} />
        </Flex>
      </Flex>
    </Upload>
  )
}
