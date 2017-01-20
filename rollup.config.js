import { rollup } from 'rollup'
import babel from 'rollup-plugin-babel'

export default {
  plugins: [ babel() ],
  format: 'umd',
}
