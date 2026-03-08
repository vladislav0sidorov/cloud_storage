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
      invalidatesTags: () => [{ type: 'FileList' }]
    })
  })
})

export const useUploadFileMutation = uploadFile.useUploadFileMutation
