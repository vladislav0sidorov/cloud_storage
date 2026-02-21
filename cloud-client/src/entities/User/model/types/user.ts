export interface IUser {
  user: {
    accessToken: string
    refreshToken: string
    email: string
    id: string
    isActivated: boolean
    avatar?: string
    gender?: 'male' | 'female' | ''
    firstName?: string
    lastName?: string
    patronymic?: string
    dateOfBirth?: string
    locality?: string
    phone?: string
  }
}

export interface IErrors {
  errors: string[]
  message: string
  status: number
}

export interface IUserSchema {
  _inited: boolean
  authData?: IUser
  errors?: IErrors
}
