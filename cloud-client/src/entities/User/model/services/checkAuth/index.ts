import { userActions } from '@/entities/User'
import { rtkApi } from '@/shared/api/rtkApi'
import { USER_LOCALSTORAGE_KEY } from '@/shared/consts/localStorage'

const checkAuth = rtkApi.injectEndpoints({
  endpoints: build => ({
    checkAuth: build.mutation({
      query: () => ({
        url: '/refresh',
        method: 'GET'
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const {data} = await queryFulfilled

          localStorage.setItem(USER_LOCALSTORAGE_KEY, JSON.stringify(data))
          dispatch(userActions.setAuthData(data))
        } catch (error) {
          console.error('Auth error:', error)
        } finally {
          dispatch(userActions.setInited())
        }
      }
    })
  })
})

export const useCheckAuth = checkAuth.useCheckAuthMutation
