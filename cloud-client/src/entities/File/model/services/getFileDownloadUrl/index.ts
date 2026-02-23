import { rtkApi } from '@/shared/api/rtkApi'

const getFileDownloadUrl = rtkApi.injectEndpoints({
  endpoints: build => ({
    getFileDownloadUrl: build.query<Blob, string>({
      query: id => ({ url: `/files/${id}/download`, responseHandler: res => res.blob() })
    })
  })
})

export const useGetFileDownloadUrlQuery = getFileDownloadUrl.useGetFileDownloadUrlQuery
export const useLazyGetFileDownloadUrlQuery = getFileDownloadUrl.useLazyGetFileDownloadUrlQuery
