const {rollup} = require('rollup')
const conditional = require('rollup-plugin-conditional')
const nodeResolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const stripCode = require('rollup-plugin-strip-code')
const babel = require('rollup-plugin-babel')
const {terser} = require('rollup-plugin-terser')

async function main () {
  const configs = [
    {
      input: 'index.js',
      output: 'flipstate',
      globals: {
        react: 'React'
      },
      external: ['react']
    },
    {
      input: 'preact.js',
      output: 'flipstate.preact',
      globals: {
        preact: 'preact',
        'preact-context': 'preactContext'
      },
      external: ['preact', 'preact-context']
    }
  ]
  function build ({devBuild = false, min = false} = {}) {
    return Promise.all(configs.map(async ({input, output, globals, external}) => {
      const bundle = await rollup({
        input: input,
        external,
        plugins: [
          nodeResolve(),
          commonjs(),
          conditional(!devBuild, [
            stripCode({
              start_comment: ' START DEVELOPMENT BUILD ONLY ',
              end_comment: ' END DEVELOPMENT BUILD ONLY '
            })
          ]),
          babel({
            externalHelpers: false,
            exclude: 'node_modules/**'
          }),
          min && terser()
        ]
      })
      await bundle.write({
        file: `dist/${output}${devBuild ? '.dev' : ''}${min ? '.min' : ''}.js`,
        format: 'umd',
        name: 'flipstate',
        globals
      })
    }))
  }

  return Promise.all([build(), build({devBuild: true}), build({min: true})])
}

main()
