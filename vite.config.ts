import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import WindiCSS from 'vite-plugin-windicss'
import * as path from 'path'
import { viteMockServe } from 'vite-plugin-mock'

export default defineConfig({
  plugins: [vue(), WindiCSS(),viteMockServe({mockPath: './src/mock',supportTs:true})],
  resolve: {
    // 配置别名
    alias: {
      '@': path.join(__dirname, './src')
    }
  }
})

