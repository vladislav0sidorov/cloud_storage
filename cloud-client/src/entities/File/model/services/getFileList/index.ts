import { rtkApi } from "@/shared/api/rtkApi";
import { IFileListResponse } from "../../types/file";

export const getFileList = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getFileList: build.query<IFileListResponse, string | null>({
      query: (parentId) => ({
        url: '/files',
        params: parentId != null ? { parentId } : {}
      }),
      providesTags: (_result, _err, parentId) => [{ type: 'FileList' as const, id: parentId ?? 'root' }]
    }),
  })
})

export const useGetFileListQuery = getFileList.useGetFileListQuery
