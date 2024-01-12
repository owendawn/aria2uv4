import { resolve } from 'path';
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  root: './src/',

  publicDir: "../public",
  base: './',
  resolve: {
    alias: {
      '@': resolve(__dirname, "src"),
      "@_c": resolve(__dirname, 'src/components'),
    },
    // 导入时想要省略的扩展名列表
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
  },
  build: {
    assertsDir: "static2",
    outDir: '../dist',
    rollupOptions: {
      input: {
        index: resolve(__dirname, "src/index.html"),
        index2: resolve(__dirname, "src/index2.html"),
      },
      output: {
        // 在这里修改静态资源路径
        chunkFileNames: 'static2/assets/js/[name]-[hash].js',
        entryFileNames: 'static2/assets/js/[name]-[hash].js',
        assetFileNames: 'static2/assets/[ext]/[name]-[hash].[ext]',
      }
    }
  },
  minify: true, // 是否压缩代码
})
