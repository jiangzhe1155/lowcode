import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import WindiCSS from 'vite-plugin-windicss';
import * as path from 'path'

export default defineConfig({
  plugins: [vue(), WindiCSS()],
  resolve: {
    // 配置别名
    alias: {
      '@': path.join(__dirname, './src')
    }
  }
})

