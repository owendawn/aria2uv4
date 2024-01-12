// vite.config.js
import { resolve } from "path";
import { defineConfig } from "file:///E:/workstation/web/aria2uv4/node_modules/vite/dist/node/index.js";
import vue from "file:///E:/workstation/web/aria2uv4/node_modules/@vitejs/plugin-vue/dist/index.mjs";
var __vite_injected_original_dirname = "E:\\workstation\\web\\aria2uv4";
var vite_config_default = defineConfig({
  plugins: [vue()],
  root: "./src/",
  outputDir: "../dist",
  publicDir: "public",
  base: "./",
  resolve: {
    alias: {
      "@": resolve(__vite_injected_original_dirname, "src"),
      "@_c": resolve(__vite_injected_original_dirname, "src/components")
    },
    // 导入时想要省略的扩展名列表
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"]
  },
  build: {
    assertsDir: "static2",
    rollupOptions: {
      input: {
        index: resolve(__vite_injected_original_dirname, "src/index.html"),
        index2: resolve(__vite_injected_original_dirname, "src/index2.html")
      },
      output: {
        // 在这里修改静态资源路径
        chunkFileNames: "static2/assets/js/[name]-[hash].js",
        entryFileNames: "static2/assets/js/[name]-[hash].js",
        assetFileNames: "static2/assets/[ext]/[name]-[hash].[ext]"
      }
    }
  },
  minify: true
  // 是否压缩代码
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFx3b3Jrc3RhdGlvblxcXFx3ZWJcXFxcYXJpYTJ1djRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkU6XFxcXHdvcmtzdGF0aW9uXFxcXHdlYlxcXFxhcmlhMnV2NFxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRTovd29ya3N0YXRpb24vd2ViL2FyaWEydXY0L3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3Z1ZSgpXSxcbiAgcm9vdDogJy4vc3JjLycsXG4gIG91dHB1dERpcjogJy4uL2Rpc3QnLFxuICBwdWJsaWNEaXI6IFwicHVibGljXCIsXG4gIGJhc2U6ICcuLycsXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ0AnOiByZXNvbHZlKF9fZGlybmFtZSwgXCJzcmNcIiksXG4gICAgICBcIkBfY1wiOiByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9jb21wb25lbnRzJyksXG4gICAgfSxcbiAgICAvLyBcdTVCRkNcdTUxNjVcdTY1RjZcdTYwRjNcdTg5ODFcdTc3MDFcdTc1NjVcdTc2ODRcdTYyNjlcdTVDNTVcdTU0MERcdTUyMTdcdTg4NjhcbiAgICBleHRlbnNpb25zOiBbJy5tanMnLCAnLmpzJywgJy50cycsICcuanN4JywgJy50c3gnLCAnLmpzb24nLCAnLnZ1ZSddLFxuICB9LFxuICBidWlsZDoge1xuICAgIGFzc2VydHNEaXI6IFwic3RhdGljMlwiLFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIGlucHV0OiB7XG4gICAgICAgIGluZGV4OiByZXNvbHZlKF9fZGlybmFtZSwgXCJzcmMvaW5kZXguaHRtbFwiKSxcbiAgICAgICAgaW5kZXgyOiByZXNvbHZlKF9fZGlybmFtZSwgXCJzcmMvaW5kZXgyLmh0bWxcIiksXG4gICAgICB9LFxuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIC8vIFx1NTcyOFx1OEZEOVx1OTFDQ1x1NEZFRVx1NjUzOVx1OTc1OVx1NjAwMVx1OEQ0NFx1NkU5MFx1OERFRlx1NUY4NFxuICAgICAgICBjaHVua0ZpbGVOYW1lczogJ3N0YXRpYzIvYXNzZXRzL2pzL1tuYW1lXS1baGFzaF0uanMnLFxuICAgICAgICBlbnRyeUZpbGVOYW1lczogJ3N0YXRpYzIvYXNzZXRzL2pzL1tuYW1lXS1baGFzaF0uanMnLFxuICAgICAgICBhc3NldEZpbGVOYW1lczogJ3N0YXRpYzIvYXNzZXRzL1tleHRdL1tuYW1lXS1baGFzaF0uW2V4dF0nLFxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgbWluaWZ5OiB0cnVlLCAvLyBcdTY2MkZcdTU0MjZcdTUzOEJcdTdGMjlcdTRFRTNcdTc4MDFcbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTJRLFNBQVMsZUFBZTtBQUNuUyxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFNBQVM7QUFGaEIsSUFBTSxtQ0FBbUM7QUFLekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLElBQUksQ0FBQztBQUFBLEVBQ2YsTUFBTTtBQUFBLEVBQ04sV0FBVztBQUFBLEVBQ1gsV0FBVztBQUFBLEVBQ1gsTUFBTTtBQUFBLEVBQ04sU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxRQUFRLGtDQUFXLEtBQUs7QUFBQSxNQUM3QixPQUFPLFFBQVEsa0NBQVcsZ0JBQWdCO0FBQUEsSUFDNUM7QUFBQTtBQUFBLElBRUEsWUFBWSxDQUFDLFFBQVEsT0FBTyxPQUFPLFFBQVEsUUFBUSxTQUFTLE1BQU07QUFBQSxFQUNwRTtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsWUFBWTtBQUFBLElBQ1osZUFBZTtBQUFBLE1BQ2IsT0FBTztBQUFBLFFBQ0wsT0FBTyxRQUFRLGtDQUFXLGdCQUFnQjtBQUFBLFFBQzFDLFFBQVEsUUFBUSxrQ0FBVyxpQkFBaUI7QUFBQSxNQUM5QztBQUFBLE1BQ0EsUUFBUTtBQUFBO0FBQUEsUUFFTixnQkFBZ0I7QUFBQSxRQUNoQixnQkFBZ0I7QUFBQSxRQUNoQixnQkFBZ0I7QUFBQSxNQUNsQjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUE7QUFDVixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
