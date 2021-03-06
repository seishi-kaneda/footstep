const { VueLoaderPlugin } = require("vue-loader");

var path = require('path')
var webpack = require('webpack')

module.exports = {
  watch: true,
  mode: 'production',
  plugins: [new VueLoaderPlugin()],
  entry: {
    main: './src/main.js',
    options: './src/options.js',
    background: './src/bg/background.ts'
  },
  output: {
    path: path.resolve(__dirname, './extension/dist'),
    publicPath: '/extension/dist/',
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ],
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.ts?$/,
        use: [
          // 下から順に処理される
          { loader: "babel-loader" },
          { loader: "ts-loader" },
          {
            loader: 'tslint-loader',
            options: {
              typeCheck: true,
              // tslint時に自動的に修正しない
              fix: false,
              // warningをエラーにすることでその後のビルドを止める
              emitErrors: true
            },
          },
        ],
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]',
          outputPath : 'images/',
          publicPath : function(path){
              return 'dist/images/' + path;
          }
        }
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['*', '.js', '.vue', '.json', '.ts']
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
