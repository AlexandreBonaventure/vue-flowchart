import babel from 'rollup-plugin-babel'
import vue from 'rollup-plugin-vue'
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import scss from 'rollup-plugin-scss';
import buble from 'rollup-plugin-buble';

export default {
  plugins: [
    vue({
      styleToImports: true,
      // css: null,
    }),
    scss({
      //Choose *one* of these possible "output:..." options
      // Default behaviour is to write all styles to the bundle destination where .js is replaced by .css
      // output: true,
      //
      // // Filename to write all styles to
      output: 'dist/vue-flowchart.css',
      //
      // // Callback that will be called ongenerate with two arguments:
      // // - styles: the contents of all style tags combined: 'body { color: green }'
      // // - styleNodes: an array of style objects: { filename: 'body { ... }' }
      // output: function (styles, styleNodes) {
      //   writeFileSync('bundle.css', styles)
      // },
      //
      // // Disable any style output or callbacks, import as string
      // output: false
    }),
    // babel({
    //   exclude: ['node_modules/**', '*.vue'],
    // }),
    buble({objectAssign: 'Object.assign'}),
    nodeResolve({
      browser: true,
      jsnext: true,
      main: true
    }),
    commonjs({
      include: 'node_modules/**',
    }),
  ],
  format: 'umd',
  external: [
    'vue',
  ],
  sourceMap: true,
}
