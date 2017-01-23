import babel from 'rollup-plugin-babel'
import vue from 'rollup-plugin-vue'
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  plugins: [
    nodeResolve({
      browser: true,
    }),
    commonjs({
      include: 'node_modules/**',
    }),
    vue(),
    babel({
    exclude: ['node_modules/**', '*.vue'],
  }) ],
  format: 'umd',
  external: [
    'vue',
  ],
}
