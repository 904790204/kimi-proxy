import path from 'path'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import clear from 'rollup-plugin-clear'
import terser from '@rollup/plugin-terser'
import polyfillNode from 'rollup-plugin-polyfill-node'

export default {
  input: path.resolve(__dirname, './sdk/index.js'),
  output: {
    file: './resources/sdk/index.js',
    // format: 'cjs'
    // format: 'iife'
    format: 'umd',
    // globals: {
    //   // 在这里添加你的第三方库和全局变量映射
    //   qs: 'querystring'
    // },
    name: 'debugSdk'
  },
  // external: ['querystring'],
  plugins: [
    clear({
      targets: ['resources/sdk']
    }),
    // 如果依赖的是 node_modules 里面的库文件，则进行引入
    resolve(),
    // 把commonjs的写法 require 转换为 import 写法
    commonjs(),
    // babel进行转义
    babel({
      presets: [['@babel/preset-env']]
    }),
    polyfillNode({
      include: ['uuid']
    }),
    terser()
  ]
}
