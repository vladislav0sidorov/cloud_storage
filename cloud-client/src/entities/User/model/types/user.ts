export interface IUser {
  user: {
    accessToken: string
    refreshToken: string
    email: string
    id: string
    isActivated: boolean
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
