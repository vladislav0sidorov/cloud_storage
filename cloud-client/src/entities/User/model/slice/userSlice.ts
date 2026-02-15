import { USER_LOCALSTORAGE_KEY } from '@/shared/consts/localStorage'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IUser, IUserSchema } from '../types/user'

const initialState: IUserSchema = {
  _inited: false
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setInited: (state) => {
      state._inited = true
    },
    setAuthData: (state, action) => {
      state._inited = true
      state.authData = action.payload

      localStorage.setItem(USER_LOCALSTORAGE_KEY, JSON.stringify(action.payload))
    },
    setErrorData: (state, action) => {
      state.errors = action.payload
    },
    logout: state => {
      state._inited = true
      state.authData = undefined

      localStorage.removeItem(USER_LOCALSTORAGE_KEY)
    }
  },
  extraReducers: builder => {
    builder.addMatcher(
      action => action.type === 'user/pending',
      state => {
        state._inited = true

      }
    )
    builder.addMatcher(
      action => action.type === 'user/fulfilled',
      (state, action: PayloadAction<IUser>) => {
        state._inited = true
        state.authData = action.payload
      }
    )
    builder.addMatcher(
      action => action.type === 'user/rejected',
      state => {
        state._inited = true
        state.authData = undefined
      }
    )
  }
})

export const { actions: userActions } = userSlice
export const { reducer: userReducer } = userSlice
