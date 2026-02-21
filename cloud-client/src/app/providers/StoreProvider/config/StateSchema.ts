import { Action, EnhancedStore, Reducer, ReducersMapObject } from '@reduxjs/toolkit'

import { IFileStorageSchema } from '@/entities/File'
import { ILoginSchema } from '@/features/LoginByUsername'
import { IUserSchema } from '@/entities/User'
import { rtkApi } from '@/shared/api/rtkApi'

export interface StateSchema {
  login: ILoginSchema
  register: ILoginSchema
  user: IUserSchema
  fileStorage: IFileStorageSchema

  [rtkApi.reducerPath]: ReturnType<typeof rtkApi.reducer>
}

export type StateSchemaKey = keyof StateSchema

export interface ReducerManager {
  getReducerMap: () => ReducersMapObject<StateSchema>
  reduce: (state: StateSchema, action: Action) => StateSchema
  add: (key: StateSchemaKey, reducer: Reducer) => void
  remove: (key: StateSchemaKey) => void
}
export interface ReduxStoreWithManager extends EnhancedStore<StateSchema> {
  reducerManager: ReducerManager
}
