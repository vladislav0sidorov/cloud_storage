import { userActions } from "@/entities/User";
import { rtkApi } from "@/shared/api/rtkApi";

const registerByEmail = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    registerByEmail: build.mutation<void, { email: string; password: string }>({
      query: ({ email, password }) => ({
        url: "/register",
        method: "POST",
        body: { email, password },
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(userActions.setAuthData(data))
        } catch (errors: any) {
          dispatch(userActions.setErrorData(errors?.error.data))
          console.error("Register error:", errors)
        }
      }
    }),
  }),
})

export const useRegisterByEmail = registerByEmail.useRegisterByEmailMutation
