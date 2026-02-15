import { userActions } from "@/entities/User";
import { rtkApi } from "@/shared/api/rtkApi";

const loginByUsername = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    loginByUsername: build.mutation<void, { email: string; password: string }>({
      query: ({ email, password }) => ({
        url: "/login",
        method: "POST",
        body: { email, password },
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(userActions.setAuthData(data))
        } catch (errors: any) {
          dispatch(userActions.setErrorData(errors?.error.data))
          console.error("Login error:", errors)
        }
      }
    }),
  }),
})

export const useLoginByUsername = loginByUsername.useLoginByUsernameMutation
