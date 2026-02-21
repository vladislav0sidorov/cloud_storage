import type { IFileItem } from '../types/file'
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type FileStorageBreadcrumb = { id: string | null; name: string }

export interface IFileStorageSchema {
  items: IFileItem[]
  used: number
  currentParentId: string | null
  breadcrumbs: FileStorageBreadcrumb[]
}

const initialState: IFileStorageSchema = {
  items: [],
  used: 0,
  currentParentId: null,
  breadcrumbs: [{ id: null, name: 'Корень' }]
}

export const fileStorageSlice = createSlice({
  name: 'fileStorage',
  initialState,
  reducers: {
    setFileList: (
      state,
      action: PayloadAction<{ items: IFileItem[]; used: number }>
    ) => {
      state.items = action.payload.items
      state.used = action.payload.used
    },
    setNavigation: (
      state,
      action: PayloadAction<{ currentParentId: string | null; breadcrumbs: FileStorageBreadcrumb[] }>
    ) => {
      state.currentParentId = action.payload.currentParentId
      state.breadcrumbs = action.payload.breadcrumbs
    }
  }
})

export const { actions: fileStorageActions } = fileStorageSlice
export const { reducer: fileStorageReducer } = fileStorageSlice
