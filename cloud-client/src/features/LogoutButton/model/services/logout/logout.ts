import { userActions } from "@/entities/User";
import { rtkApi } from "@/shared/api/rtkApi";

const logout = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    logout: build.mutation({
      query: () => ({
        url: "/logout",
        method: "POST"
      }),
      async onQueryStarted(_, { dispatch }) {
        try {
          dispatch(userActions.logout())
        } catch (error) {
          console.error("Logout error:", error)
        }
      }
    }),
  }),
})

export const useLogout = logout.useLogoutMutation
