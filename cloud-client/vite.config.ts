import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import vitePluginSvgr from 'vite-plugin-svgr'

const port = (process.env.PORT && parseInt(process.env.PORT, 10)) || 3000

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: [{ find: '@', replacement: '/src' }],
  },
  server: {
    port,
    open: true,
  },
  plugins: [vitePluginSvgr({}), react()],
})
