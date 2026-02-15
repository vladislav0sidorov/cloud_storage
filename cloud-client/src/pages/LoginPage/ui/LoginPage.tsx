import { getUserAuthData } from '@/entities/User'
import { LoginForm } from '@/features/LoginByUsername'
import { FC, useLayoutEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const LoginPage: FC = () => {
  const auth = useSelector(getUserAuthData)
  const navigate = useNavigate()

  useLayoutEffect(() => {
    if (!auth) {
      return
    }

    navigate('/')
  }, [auth, navigate])

  return <LoginForm />
}

export default LoginPage
