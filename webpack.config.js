const path = require('path');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const cssnano = require('cssnano');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlCriticalWebpackPlugin = require('html-critical-webpack-plugin');
// const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');

module.exports = (env, options) => {
  const isProduction = options.mode === 'production';
  const isDevelopment = options.mode === 'development';

  return {
    resolve: {
      extensions: ['.js'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '~': path.resolve(__dirname, 'node_modules'),
      },
    },
    entry: {
      bundle: './src/index.js',
    },
    output: {
      path: path.resolve(__dirname, './public'),
      filename: 'js/[name].js',
      publicPath: '',
    },
    optimization: {
      splitChunks: {
        // chunks: (chunk) => (
        //   chunk.name !== 'style' &&
        //     chunk.name !== 'libs' &&
        //     chunk.name !== 'bundle'),
        // minSize: 1,
        // minChunks: 2,
        minSize: 1,
        minChunks: 2,
        cacheGroups: {
          libs: {
            name: 'libs',
            test: /node_modules.*(?<!\.css)(?<!\.scss)(?<!\.less)$/,
            enforce: true,
            chunks: 'all',
          },
        },
      },
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          use: [
            {
              loader: 'babel-loader',
            },
            isDevelopment && {
              loader: 'eslint-loader',
            },
          ].filter(Boolean),
          exclude: /node_modules/,
        },
        {
          test: /\.(sass|scss)$/,
          use: [
            {
              loader: isProduction ?
                MiniCssExtractPlugin.loader : 'style-loader',
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: [
                  autoprefixer(),
                  cssnano(),
                ],
              },
            },
            {
              loader: 'resolve-url-loader',
            },
            {
              loader: 'sass-loader',
              options: {
                sassOptions: {
                  sourceMap: true,
                  includePaths: ['node_modules'],
                  outputStyle: 'expanded', // disabled minimize
                },
              },
            },
          ],
        },
        {
          test: /\.(css)$/,
          use: [
            {
              loader: isProduction ?
                MiniCssExtractPlugin.loader : 'style-loader',
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: [
                  autoprefixer(),
                  cssnano(),
                ],
              },
            },
          ],
        },
        {
          test: /\.(png|jpg|gif|svg)$/,
          exclude: [
            path.resolve(__dirname, './src/img/svg/'),
            path.resolve(__dirname, './src/img/base64/'),
          ],
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: './img',
                publicPath: '../img',
              },
            },
          ],
        },
        {
          test: /\.svg$/,
          loader: 'svg-sprite-loader',
        //   options: {
        //     extract: true,
        //     spriteFilename: './img/svg.svg',
        //     esModule: false,
        //   },
          include: [
            path.resolve(__dirname, './src/img/svg/'),
          ],
        },
        {
          test: /\.(png|jpg|gif|svg)$/i,
          include: [
            path.resolve(__dirname, './src/img/base64/'),
          ],
          use: [
            {
              loader: 'url-loader',
            },
          ],
        },
        {
          test: /\.(woff|woff2|ttf|otf|eot)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: './font',
                publicPath: '../font',
              },
            },
          ],
        },
        {
          test: /\.hbs$/,
          loader: 'handlebars-loader',
          options: {
            helperDirs: path.resolve(__dirname, 'helper'),
          },
        },
      ],
    },
    devtool: isProduction ? false : 'eval-source-map',
    devServer: {
      before(app, server) {
        server._watch(`src/**.hbs`);
      },
      hot: true,
    },
    plugins: [
      new CleanWebpackPlugin({cleanAfterEveryBuildPatterns: ['./public']}),
      new SpriteLoaderPlugin(),
      new HtmlWebpackPlugin({
        minify: {
          collapseWhitespace: false,
          removeComments: false,
          collapseInlineTagWhitespace: false,
          minifyCSS: true,
        },
        inject: false,
        title: '',
        filename: 'index.html',
        template: './src/index.hbs',
        chunks: ['bundle'],
      }),
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
      }),
      isDevelopment && new webpack.HotModuleReplacementPlugin(),
    //   isProduction && new FixStyleOnlyEntriesPlugin({
    //     extensions: ['less', 'scss', 'css', 'sass'],
    //   }),
      isProduction && new MiniCssExtractPlugin({
        filename: './css/style.css',
      }),
      isProduction && new HtmlCriticalWebpackPlugin({
        base: path.resolve(__dirname, 'public'),
        src: 'index.html',
        dest: 'index.html',
        inline: true,
        minify: true,
        extract: false,
        width: 310,
        height: 550,
        penthouse: {
          blockJSRequests: true,
        },
      }),
      isProduction && new ImageminPlugin({
        pngquant: {
          quality: '95-100',
        },
      }),
    ].filter(Boolean),
  };
};
