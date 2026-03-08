import { rtkApi } from '@/shared/api/rtkApi'
import type { FileStorageBreadcrumb } from '../../slice/fileStorageSlice'

export interface IFileBreadcrumbsResponse {
  breadcrumbs: FileStorageBreadcrumb[]
}

export const getFileBreadcrumbs = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getFileBreadcrumbs: build.query<IFileBreadcrumbsResponse, string | null>({
      query: (folderId) => ({
        url: '/files/path',
        params: folderId != null ? { folderId } : {}
      }),
      providesTags: (_result, _err, folderId) => [{ type: 'FileList' as const, id: `breadcrumbs-${folderId ?? 'root'}` }]
    })
  })
})

export const useGetFileBreadcrumbsQuery = getFileBreadcrumbs.useGetFileBreadcrumbsQuery
