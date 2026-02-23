import { rtkApi } from '@/shared/api/rtkApi'

export interface UpdatePasswordArgs {
  currentPassword: string
  newPassword: string
}

const updatePasswordApi = rtkApi.injectEndpoints({
  endpoints: build => ({
    updatePassword: build.mutation<{ message: string }, UpdatePasswordArgs>({
      query: body => ({
        url: '/user/password',
        method: 'PATCH',
        body
      })
    })
  })
})

export const useUpdatePassword = updatePasswordApi.useUpdatePasswordMutation
