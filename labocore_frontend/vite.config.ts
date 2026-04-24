import { defineConfig } from 'vite'

export default defineConfig(async () => {
  // Use dynamic import to avoid ESM/CommonJS loading issues in some Node setups
  const reactPlugin = (await import('@vitejs/plugin-react')).default
  return {
    plugins: [reactPlugin()],
  }
})
