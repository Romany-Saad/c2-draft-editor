import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import external from 'rollup-plugin-peer-deps-external'
import resolve from 'rollup-plugin-node-resolve'
import postcss from 'rollup-plugin-postcss'
import url from 'rollup-plugin-url'
import svgr from '@svgr/rollup'
import * as draftJs from 'draft-js'

import pkg from './package.json'

export default {
  input: 'src/index.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true,
    },
  ],
  plugins: [
    external(),
    postcss({
      extract: true,
    }),
    url(),
    svgr(),
    babel({
      exclude: 'node_modules/**',
      plugins: ['external-helpers'],
    }),
    resolve(),
    commonjs({
      namedExports: {
        'draft-js': Object.keys(draftJs),
        'node_modules/punycode/punycode.js': ['punycode'],
        'src/RichEditor/draft-js-compact/index.js': [
          'compress', 'expand',
        ],
      },
    }),
  ],
}
