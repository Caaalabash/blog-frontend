import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import VitePluginOss from 'vite-plugin-oss'

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? 'https://static.calabash.top/blog2/' : '/',
  plugins: [
    vue(),
    vueJsx(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    VitePluginOss({
      from: './dist/**', // 上传那个文件或文件夹
      dist: "/blog2",  // 需要上传到oss上的给定文件目录
      region: 'oss-cn-beijing',
      bucket: 'calabash-static',
      accessKeyId: process.env.PROD_OSS_AK,
      accessKeySecret: process.env.PROD_OSS_SK,
      setOssPath: filePath => {
        let index = filePath.lastIndexOf("dist")
        let Path = filePath.substring(index + 4, filePath.length)
        return Path.replace(/\\/g, "/")
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: '0.0.0.0',
    port: '5173',
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
