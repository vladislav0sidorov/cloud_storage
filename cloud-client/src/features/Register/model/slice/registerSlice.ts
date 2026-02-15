import { createSlice } from '@reduxjs/toolkit'

import { IRefisterSchema } from '../types/registerSchema'

const initialState: IRefisterSchema = {
}

export const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {},
})

export const { actions: registerActions } = registerSlice
export const { reducer: registerReducer } = registerSlice
