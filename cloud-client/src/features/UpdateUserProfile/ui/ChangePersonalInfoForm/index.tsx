import { getUserAuthData, IUser, userActions } from '@/entities/User'
import { useUpdatePersonalInfo } from '@/features/UpdateUserProfile/model/services/updatePersonalInfo'
import { useNotificationApi } from '@/shared/lib/NotificationContext'
import { DatePicker, Form, Input, Select } from 'antd'
import { Button } from 'antd'
import { FC, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import dayjs from 'dayjs'

/** Валидация российского номера: 10 цифр или 11 (7/8 + 10 цифр) */
function validatePhone(_: unknown, value?: string) {
  if (!value || !value.trim()) return Promise.resolve()
  const digits = value.replace(/\D/g, '')
  if (digits.length === 10) return Promise.resolve()
  if (digits.length === 11 && (digits[0] === '7' || digits[0] === '8')) return Promise.resolve()
  return Promise.reject(new Error('Введите корректный номер (10 или 11 цифр, например +7 999 123-45-67)'))
}

type PersonalInfoFormValues = {
  gender: '' | 'male' | 'female'
  firstName: string
  lastName: string
  patronymic?: string
  dateOfBirth?: dayjs.Dayjs | null
  locality?: string
  phone?: string
}

interface ChangePersonalInfoFormProps {
  authUser: IUser['user']
}

export const ChangePersonalInfoForm: FC<ChangePersonalInfoFormProps> = ({ authUser }) => {
  const dispatch = useDispatch()
  const authData = useSelector(getUserAuthData)
  const notificationApi = useNotificationApi()
  const [updatePersonalInfo, { isLoading }] = useUpdatePersonalInfo()
  const [form] = Form.useForm<PersonalInfoFormValues>()

  useEffect(() => {
    form.setFieldsValue({
      gender: (authUser.gender as '' | 'male' | 'female') ?? '',
      firstName: authUser.firstName ?? '',
      lastName: authUser.lastName ?? '',
      patronymic: authUser.patronymic ?? '',
      dateOfBirth: authUser.dateOfBirth ? dayjs(authUser.dateOfBirth) : null,
      locality: authUser.locality ?? '',
      phone: authUser.phone ?? ''
    })
  }, [authUser, form])

  const onFinish = async (values: PersonalInfoFormValues) => {
    try {
      await updatePersonalInfo({
        gender: values.gender || undefined,
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        patronymic: values.patronymic?.trim() || undefined,
        dateOfBirth: values.dateOfBirth ? values.dateOfBirth.toISOString() : undefined,
        locality: values.locality?.trim() || undefined,
        phone: values.phone?.trim() || undefined
      }).unwrap()

      if (authData) {
        dispatch(
          userActions.setAuthData({
            ...authData,
            user: {
              ...authData.user,
              gender: values.gender || undefined,
              firstName: values.firstName.trim(),
              lastName: values.lastName.trim(),
              patronymic: values.patronymic?.trim() || undefined,
              dateOfBirth: values.dateOfBirth ? values.dateOfBirth.toISOString() : undefined,
              locality: values.locality?.trim() || undefined,
              phone: values.phone?.trim() || undefined
            }
          })
        )
      }

      notificationApi.success({
        message: 'Данные сохранены',
        description: 'Персональные данные успешно обновлены.'
      })
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } }
      notificationApi.error({
        message: 'Ошибка сохранения',
        description: err?.data?.message ?? 'Не удалось сохранить данные. Попробуйте снова.'
      })
    }
  }

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} validateTrigger="onBlur">
      <Form.Item name="gender" label="Пол">
        <Select
          placeholder="Выберите пол"
          allowClear
          options={[
            { value: '', label: 'Не указан' },
            { value: 'male', label: 'Мужской' },
            { value: 'female', label: 'Женский' }
          ]}
        />
      </Form.Item>

      <Form.Item
        name="firstName"
        label="Имя"
        rules={[
          { required: true, message: 'Введите имя' },
          { whitespace: true, message: 'Введите имя' }
        ]}
      >
        <Input placeholder="Имя" />
      </Form.Item>

      <Form.Item
        name="lastName"
        label="Фамилия"
        rules={[
          { required: true, message: 'Введите фамилию' },
          { whitespace: true, message: 'Введите фамилию' }
        ]}
      >
        <Input placeholder="Фамилия" />
      </Form.Item>

      <Form.Item name="patronymic" label="Отчество (если есть)">
        <Input placeholder="Отчество" />
      </Form.Item>

      <Form.Item name="dateOfBirth" label="Дата рождения">
        <DatePicker style={{ width: '100%' }} placeholder="Выберите дату" format="DD.MM.YYYY" />
      </Form.Item>

      <Form.Item name="locality" label="Населённый пункт">
        <Input placeholder="Город или населённый пункт" />
      </Form.Item>

      <Form.Item name="phone" label="Номер телефона" rules={[{ validator: validatePhone }]}>
        <Input placeholder="+7 999 123-45-67" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isLoading}>
          Сохранить
        </Button>
      </Form.Item>
    </Form>
  )
}
