import { memo, Suspense, useCallback } from 'react'
import { Route, Routes } from 'react-router-dom'

import { RequireAuth } from './RequireAuth'

import { AppRoutesProps } from '@/shared/types/router'
import { routeConfig } from '../config/routerConfig'
import { PageLoader } from '@/widgets/PageLoader'

export const AppRouter = memo(() => {
  const renderWithWrapper = useCallback((route: AppRoutesProps) => {
    const element = <Suspense>{route.element}</Suspense>

    return <Route key={route.path} path={route.path} element={route.authOnly ? <RequireAuth>{element}</RequireAuth> : element} />
  }, [])

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>{Object.values(routeConfig).map(renderWithWrapper)}</Routes>
    </Suspense>
  )
})
