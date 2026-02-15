import { createSlice } from '@reduxjs/toolkit'

import { ILoginSchema } from '../types/loginSchema'

const initialState: ILoginSchema = {}

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {}
})

export const { actions: loginActions } = loginSlice
export const { reducer: loginReducer } = loginSlice
