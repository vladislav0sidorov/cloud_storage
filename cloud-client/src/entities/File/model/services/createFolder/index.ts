import { rtkApi } from "@/shared/api/rtkApi";
import { IFileItem } from "../../types/file";

const createFolder = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    createFolder: build.mutation<IFileItem, { parentId: string | null; name: string }>({
      query: (body) => ({
        url: '/files/folder',
        method: 'POST',
        body
      }),
      invalidatesTags: () => [{ type: 'FileList' }]
    })
  })
})

export const useCreateFolderMutation = createFolder.useCreateFolderMutation
