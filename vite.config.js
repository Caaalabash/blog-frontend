import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import VitePluginOss from 'vite-plugin-oss'

export default defineConfig({
  base: '/',
  experimental: {
    renderBuiltUrl(filename) {
      return 'https://static.calabash.top/blog2/' + filename
    },
  },
  plugins: [
    vue(),
    vueJsx(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    process.env.NODE_ENV === 'production' && VitePluginOss({
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
  ].filter(Boolean),
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
        // 线上
        // target: 'https://blog.calabash.top',
        // 本地
        target: 'http://localhost:8080',
        rewrite: (path) => path.replace(/^\/api/, ''),
        changeOrigin: true,
      },
    },
  },
})
