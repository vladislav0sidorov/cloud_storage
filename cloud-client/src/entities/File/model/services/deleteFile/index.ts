import { rtkApi } from '@/shared/api/rtkApi'

const deleteFile = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    deleteFile: build.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/files/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: () => [{ type: 'FileList' as const }]
    })
  })
})

export const useDeleteFileMutation = deleteFile.useDeleteFileMutation
