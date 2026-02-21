import { rtkApi } from '@/shared/api/rtkApi'
import type { IFileItem } from '../../types/file'

const uploadFile = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    uploadFile: build.mutation<IFileItem, FormData>({
      query: (formData) => ({
        url: '/files/upload',
        method: 'POST',
        body: formData
      }),
      invalidatesTags: () => [{ type: 'FileList' as const }]
    })
  })
})

export const useUploadFileMutation = uploadFile.useUploadFileMutation
