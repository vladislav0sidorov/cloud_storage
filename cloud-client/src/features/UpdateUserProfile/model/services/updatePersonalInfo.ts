import { rtkApi } from '@/shared/api/rtkApi'

export interface UpdatePersonalInfoArgs {
  gender?: '' | 'male' | 'female'
  firstName?: string
  lastName?: string
  patronymic?: string
  dateOfBirth?: string
  locality?: string
  phone?: string
}

const updatePersonalInfoApi = rtkApi.injectEndpoints({
  endpoints: build => ({
    updatePersonalInfo: build.mutation<{ message: string }, UpdatePersonalInfoArgs>({
      query: body => ({
        url: '/user/personal-info',
        method: 'PATCH',
        body
      }),
      invalidatesTags: () => [{ type: 'User' as const }, { type: 'FileList' as const }]
    })
  })
})

export const useUpdatePersonalInfo = updatePersonalInfoApi.useUpdatePersonalInfoMutation
