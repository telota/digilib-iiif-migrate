const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: './index.js',
  output: {
    path: `${__dirname}/dist`,
    filename: 'digilib-iiif-migrate.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  plugins: [
    new UglifyJSPlugin(),
  ],
};
