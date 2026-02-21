import { rtkApi } from "@/shared/api/rtkApi";
import { IFileItem } from "../../types/file";

const moveFile = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    moveFile: build.mutation<IFileItem, { id: string; parentId: string | null }>({
      query: ({ id, parentId }) => ({
        url: `/files/${id}/move`,
        method: 'PATCH',
        body: { parentId }
      }),
      invalidatesTags: () => [{ type: 'FileList' as const }]
    })
  })
})

export const useMoveFileMutation = moveFile.useMoveFileMutation
