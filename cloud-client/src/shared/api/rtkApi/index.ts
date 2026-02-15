import { USER_LOCALSTORAGE_KEY } from '@/shared/consts/localStorage'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const rtkApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    credentials: 'include',
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: headers => {
      const user = localStorage.getItem(USER_LOCALSTORAGE_KEY)
      const parsedUser = user ? JSON.parse(user) : null
      const token = parsedUser?.accessToken || ''

      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      return headers
    }
  }),
  endpoints: () => ({})
})
