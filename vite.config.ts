import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { fileURLToPath, URL } from "url";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  css: {
    postcss: {},
    preprocessorOptions: {
      less: {
        // DO NOT REMOVE THIS LINE
        javascriptEnabled: true,
        modifyVars: {
          hack: `true; @import 'ant-design-vue/es/style/themes/default.less'`,
        },
      },
    },
  },
});
