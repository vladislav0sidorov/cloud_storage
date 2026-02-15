import { StateSchema } from '@/app/providers/StoreProvider'

export const getLoginErrors = (state: StateSchema) => state?.login?.error
