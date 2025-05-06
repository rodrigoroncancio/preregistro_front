import { defineConfig } from 'vite';

// Plugins
import vue from '@vitejs/plugin-vue'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

// Utilities
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
    vuetify({
      autoImport: true,
      styles: {
        configFile: 'src/styles/settings.scss',
      },
    }),
  ],
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ],
  },
  server: {
    port: 3000,
    // host: '0.0.0.0', // Permite acceder desde cualquier IP
    // allowedHosts: ['local.expansionti.co'], // Mueve aquí allowedHosts
  },
  css: {
    loaderOptions: {
      sass: {
        // implementation: require('sass'),  // Fuerza usar Dart Sass moderno
        additionalData: `@import "./src/assets/scss/app.scss";`
      }
    }
  }
})
