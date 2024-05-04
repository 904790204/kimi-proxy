import { resolve } from 'path'
import fs from 'fs'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import autoCSSModulePlugin from 'vite-plugin-auto-css-modules'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@src': resolve('src/renderer/src'),
        ace: resolve(__dirname, 'node_modules/ace-builds/src-noconflict')
      }
    },
    plugins: [react(), autoCSSModulePlugin()],
    esbuild: { loader: 'jsx', include: /renderer\/src\/.*\.jsx?$/, exclude: [] },
    optimizeDeps: {
      esbuildOptions: {
        plugins: [
          {
            name: 'load-js-files-as-jsx',
            setup(build) {
              build.onLoad({ filter: /renderer\/src\/.*\.js$/ }, async (args) => {
                return { loader: 'jsx', contents: await fs.readFile(args.path, 'utf-8') }
              })
            }
          }
        ]
      }
    }
  }
})
