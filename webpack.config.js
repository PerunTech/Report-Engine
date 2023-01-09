let path = require('path');

module.exports = (mode, { env }) => {
  return {
    devtool: 'source-map',
    mode: mode,
    entry: env === 'production' ? './frontend/index.js' : './frontend/client.js',
    output: {
      path: path.resolve('./backend/www'),
      filename: 'report-engine.js',
      library: 'report-engine',
      libraryTarget: 'umd',
      globalObject: 'this'
    },
    devServer: {
      contentBase: './backend/www',
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)?$/,
          exclude: /(node_modules)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react', { 'plugins': ['@babel/plugin-proposal-class-properties'] }],
              cacheDirectory: true
            }
          }
        },
        {
          test: /(\.jsx|\.js)$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
              cacheDirectory: true
            }
          },
          enforce: 'pre',
          include: [/perun-core/, /persons-registry/]
        },
        {
          // For pure CSS (without CSS modules)
          test: /\.css$/i,
          exclude: /\.module\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
          // For CSS modules
          test: /\.module\.css$/i,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                modules: true,
                modules: {
                  localIdentName: '[name]-[local]'
                }
              },
            },
          ],
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            // Creates `style` nodes from JS strings
            "style-loader",
            // Translates CSS into CommonJS
            "css-loader",
            // Compiles Sass to CSS
            "sass-loader",
          ],
        },
        {
          test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
          loader: 'url-loader',
          options: {
            limit: 10000,
          }
        },
      ]
    },
    resolve: {
      extensions: ['.js', '.jsx']
    },
    externals: env === 'production' ? { 'perun-core': 'perun-core' } : {}
  }
};
