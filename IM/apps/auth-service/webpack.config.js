const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');
const path = require('path');

module.exports = {
  output: {
    path: join(__dirname, 'dist'),
  },
  resolve : {
    alias: {
      "@packages": resolve(__dirname, "../../packages"),
    },
    extensions: [".ts", ".js", '.tsx'],
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ['./src/assets'],
      optimization: false,
      outputHashing: 'none',
      generatePackageJson: true,
      sourceMaps: true,
    }),
  ],
};