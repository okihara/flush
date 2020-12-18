const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  entry: './src/main.ts',
  output: {
    path: path.resolve(__dirname, 'public/js'),
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'public'),
    publicPath: '/js/',
    liveReload: false
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
        options: {
          esModule: true
        }
      },
      {
        test: /\.ts$/,
        loader: "ts-loader",
        exclude: /node_modules/
      },
      {
        test: /\.css/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {url: false}
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.vue', '.ts'],
    modules: [
      "node_modules"
    ],
    alias: {
      // vue.js のビルドを指定する
      vue: 'vue/dist/vue.common.js'
    }
  },
  plugins: [
    // ...
    new VueLoaderPlugin()
  ],
  externals: {
    jquery: 'jQuery',
    firebase: 'firebase'
  }
};
