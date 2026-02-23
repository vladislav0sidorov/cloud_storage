import { rtkApi } from "@/shared/api/rtkApi";

export const updateAvatar = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    updateAvatar: build.mutation<void, { avatar: string }>({
      query: ({ avatar }) => ({
        url: '/user/avatar',
        method: 'PATCH',
        body: { avatar },
      }),
      invalidatesTags: () => [{ type: 'User' as const }, { type: 'FileList' as const }],
    }),
  }),
})

export const useUpdateAvatar = updateAvatar.useUpdateAvatarMutation
