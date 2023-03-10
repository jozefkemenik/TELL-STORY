import angular from 'rollup-plugin-angular';
import resolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';
import copy from 'rollup-plugin-copy-glob';
import babel from 'rollup-plugin-babel';

const widgetName = 'widget_category_chart_basic'

export default [{
  input: 'src/main.ts',
  output: {
    file: '../../web/src/assets/widgets/' + widgetName + '/main.js',
    format: 'umd',
    name: widgetName,
  },
  treeshake: true,
  plugins: [
    angular(),
    resolve({
      jsnext: true,
      main: true,
      // pass custom options to the resolve plugin
      customResolveOptions: {
        moduleDirectory: 'node_modules'
      }
    }),

    typescript({
      typescript: require('typescript'),
      objectHashIgnoreUnknownHack: true,
    }),

    commonjs(),

    babel({
      babelrc: false
    }),
    copy([
      { files: 'src/assets/package/*', dest: 'src/dist' },
    ])
  ],
  external: [
    '@angular/core',
    '@angular/common',
    '@angular/forms',

    //amChart
    "@amcharts/amcharts4/core",
    "@amcharts/amcharts4/charts",
    "@amcharts/amcharts4/themes/animated"
  ]
}]