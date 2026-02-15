export { userReducer } from './model/slice/userSlice'
export { userActions } from './model/slice/userSlice'

export type { IUserSchema, IUser } from './model/types/user'

export { getUserAuthData } from './model/selectors/getUserAuthData'
export { getUserInited } from './model/selectors/getUserInited'
export { getUserAuthErrors } from './model/selectors/getUserAuthErrors'
export { useCheckAuth } from './model/services/checkAuth'
