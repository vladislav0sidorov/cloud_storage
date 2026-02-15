import { createRoot } from 'react-dom/client'
import '@/app/styles/reset.css'
import 'antd/dist/reset.css'

import { BrowserRouter } from 'react-router-dom'
import { App } from './app/App'
import { StoreProvider } from '@/app/providers/StoreProvider'

const container = document.getElementById('root')

if (!container) {
  throw new Error('Контейнер "root" не найден. НЕ удалось вмонтировать приложение')
}

createRoot(container).render(
  <BrowserRouter>
    <StoreProvider>
      <App />
    </StoreProvider>
  </BrowserRouter>
)
