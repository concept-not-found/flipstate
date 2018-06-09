const {rollup} = require('rollup')
const commonjs = require('rollup-plugin-commonjs')
const nodeResolve = require('rollup-plugin-node-resolve')
const babel = require('rollup-plugin-babel')
const {terser} = require('rollup-plugin-terser')

async function main() {
  const configs = [
    {
      input: 'index.js',
      output: 'context-state',
      globals: {
        react: 'React'
      },
      external: ['react']
    },
    {
      input: 'preact.js',
      output: 'context-state.preact',
      globals: {
        preact: 'preact',
        'preact-context': 'preactContext'
      },
      external: ['preact', 'preact-context']
    }
  ]
  function build(min = false) {
    return Promise.all(configs.map(async ({input, output, globals, external}) => {
      const bundle = await rollup({
        input: input,
        external,
        plugins: [
          nodeResolve(),
          commonjs(),
          babel({
            externalHelpers: false,
            exclude: 'node_modules/**'
          }),
          min && terser()
        ]
      })
      await bundle.write({
        file: `dist/${output}${min ? '.min' : ''}.js`,
        format: 'umd',
        name: 'contextState',
        globals
      })
    }))
  }

  return Promise.all([build(), build(true)])
}

main()
