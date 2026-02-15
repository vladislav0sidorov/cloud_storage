import { Action, EnhancedStore, Reducer, ReducersMapObject } from '@reduxjs/toolkit'

// import { ArticleDetailsSchema } from '@/entities/Article'
// import { UserSchema } from '@/entities/User'
// import { AddCommentFormSchema } from '@/features/addCommentForm'
// import { LoginSchema } from '@/features/AuthByUsername'
// import { ProfileSchema } from '@/features/EditableProfileCard'
// import { ScrollRestorationSchema } from '@/features/ScrollRestoration'
// import { ArticleDetailsPageSchema } from '@/pages/ArticleDetailsPage'
// import { ArticlePageSchema } from '@/pages/ArticlesPage'
import { ILoginSchema } from '@/features/LoginByUsername'
import { IUserSchema } from '@/entities/User'
import { rtkApi } from '@/shared/api/rtkApi'

export interface StateSchema {
  login: ILoginSchema
  register: ILoginSchema
  user: IUserSchema

  [rtkApi.reducerPath]: ReturnType<typeof rtkApi.reducer>

  // async reducers

  // profile?: ProfileSchema
  // articleDetails?: ArticleDetailsSchema
  // addCommentForm?: AddCommentFormSchema
  // articlesPage?: ArticlePageSchema
  // articlesDetailsPage?: ArticleDetailsPageSchema
}

export type StateSchemaKey = keyof StateSchema

export interface ReducerManager {
  getReducerMap: () => ReducersMapObject<StateSchema>
  reduce: (state: StateSchema, action: Action) => StateSchema
  add: (key: StateSchemaKey, reducer: Reducer) => void
  remove: (key: StateSchemaKey) => void

  // true - mounted; false - unmounted
}
export interface ReduxStoreWithManager extends EnhancedStore<StateSchema> {
  reducerManager: ReducerManager
}
