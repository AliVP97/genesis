import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import del from 'rollup-plugin-delete';
import dts from 'rollup-plugin-dts';
import terser from '@rollup/plugin-terser';
import copy from 'rollup-plugin-copy';

const commonPlugins = [
  peerDepsExternal(),
  resolve(),
  commonjs(),
  json(),
  postcss({
    extract: true,
    modules: {
      auto: (id) => !id.includes('fonts.css'),
    },
    minimize: true,
    use: ['sass'],
  }),
  terser(),
];

const jsConfig = {
  input: 'src/index.ts',
  output: [
    { file: 'dist/index.js', format: 'cjs', sourcemap: false },
    { file: 'dist/index.mjs', format: 'esm', sourcemap: false },
  ],
  plugins: [
    del({ targets: 'dist/*', runOnce: true }),
    ...commonPlugins,
    copy({
      targets: [{ src: 'src/fonts/*.woff2', dest: 'dist/fonts' }],
    }),
    typescript({
      tsconfig: './tsconfig.json',
      clean: true,
      declarationDir: 'dist/types',
      useTsconfigDeclarationDir: true,
    }),
  ],
};

const dtsConfig = {
  input: 'src/index.ts',
  output: { file: 'dist/index.d.ts', format: 'es' },
  plugins: [dts()],
};

export default [jsConfig, dtsConfig];
