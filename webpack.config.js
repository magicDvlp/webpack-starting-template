/* eslint-disable max-len */
const path = require("path");
const glob = require("glob");
const autoprefixer = require("autoprefixer");
const ESLintPlugin = require("eslint-webpack-plugin");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const SpriteLoaderPlugin = require("svg-sprite-loader/plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlCriticalWebpackPlugin = require("html-critical-webpack-plugin");
// const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');
const BeautifyHtmlWebpackPlugin = require("beautify-html-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const RemovePlugin = require("remove-files-webpack-plugin");
const { PurgeCSSPlugin } = require("purgecss-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const PATHS = {
  src: path.join(__dirname, "src"),
};

module.exports = (env, options) => {
  const isProduction = options.mode === "production";
  const isDevelopment = options.mode === "development";

  return {
    entry: {
      common: "./src/index.ts",
      image: "./src/imageImport.ts",
    },
    output: {
      path: path.resolve(__dirname, "./public"),
      filename: "js/[name].js",
      publicPath: "",
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js"],
    },
    optimization: {
      minimizer: [
        `...`,
        new ImageMinimizerPlugin({
          minimizer: {
            implementation: ImageMinimizerPlugin.imageminMinify,
            options: {
              // Lossless optimization with custom option
              // Feel free to experiment with options for better result for you
              plugins: [
                ["gifsicle", { interlaced: true }],
                ["jpegtran", { progressive: true }],
                ["optipng", { optimizationLevel: 1 }],
                // Svgo configuration here https://github.com/svg/svgo#configuration
                [
                  "svgo",
                  {
                    plugins: [
                      {
                        name: "preset-default",
                        params: {
                          overrides: {
                            removeViewBox: false,
                            addAttributesToSVGElement: {
                              params: {
                                attributes: [
                                  { xmlns: "http://www.w3.org/2000/svg" },
                                ],
                              },
                            },
                          },
                        },
                      },
                    ],
                  },
                ],
              ],
            },
          },
        }),
        new CssMinimizerPlugin({
          minimizerOptions: {
            preset: [
              "default",
              {
                discardComments: {
                  removeAll: true,
                },
              },
            ],
          },
        }),
      ],
      splitChunks: {
        cacheGroups: {
          libs: {
            name: "libs",
            test: /node_modules.*(?<!\.css)(?<!\.scss)(?<!\.less)$/,
            enforce: true,
            chunks: "all",
          },
        },
      },
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          use: [
            {
              loader: "babel-loader",
            },
          ].filter(Boolean),
          exclude: /node_modules/,
        },
        {
          test: /\.(sass|scss)$/,
          use: [
            {
              loader: isProduction
                ? MiniCssExtractPlugin.loader
                : "style-loader",
              options: isProduction
                ? {
                    publicPath: "../",
                  }
                : {},
            },
            {
              loader: "css-loader",
              options: {
                sourceMap: true,
              },
            },
            {
              loader: "postcss-loader",
            },
            {
              loader: "sass-loader",
              options: {
                sassOptions: {
                  sourceMap: true,
                  includePaths: ["node_modules"],
                  outputStyle: "expanded", // disabled minimize
                },
              },
            },
          ],
        },
        {
          test: /\.(css)$/,
          use: [
            {
              loader: isProduction
                ? MiniCssExtractPlugin.loader
                : "style-loader",
            },
            {
              loader: "css-loader",
              options: {
                sourceMap: true,
              },
            },
            {
              loader: "postcss-loader",
            },
          ],
        },
        {
          test: /\.(png|jpg|gif|svg)$/,
          exclude: [
            path.resolve(__dirname, "./src/img/svg/"),
            path.resolve(__dirname, "./src/img/base64/"),
          ],
          type: "asset/resource",
          generator: {
            filename: pathData => {
              const relativePath =
                pathData.module.resourceResolveData.relativePath;
              const index = relativePath.search("img/");
              const path = relativePath.substring(index);
              return path;
            },
          },
        },
        {
          test: /\.svg$/,
          loader: "svg-sprite-loader",
          include: [path.resolve(__dirname, "./src/img/svg/")],
          options: {},
        },
        {
          test: /\.(png|jpg|gif|svg)$/i,
          include: [path.resolve(__dirname, "./src/img/base64/")],
          type: "asset/inline",
        },
        {
          test: /\.(woff|woff2|ttf|otf|eot)$/,
          type: "asset",
          generator: {
            filename: "font/[name][ext]",
          },
        },
        {
          test: /\.hbs$/,
          loader: "handlebars-loader",
          options: {
            helperDirs: path.resolve(__dirname, "helper"),
          },
        },
      ],
    },
    devtool: isProduction ? false : "eval-source-map",
    stats: {
      loggingDebug: ["sass-loader"],
    },
    devServer: {
      watchFiles: ["src/**/**.hbs"],
      hot: true,
      open: true,
      allowedHosts: "all",
      devMiddleware: {
        publicPath: "/",
      },
    },
    externals: {
      jquery: "jQuery",
    },
    plugins: [
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: ["**/*", "!model/**", "!.git/**"],
      }),
      new ForkTsCheckerWebpackPlugin({
        typescript: {
          diagnosticOptions: {
            semantic: true,
            syntactic: true,
          },
          mode: "write-references",
        },
      }),
      new SpriteLoaderPlugin(),
      new HtmlWebpackPlugin({
        minify: {
          collapseWhitespace: false,
          removeComments: false,
          collapseInlineTagWhitespace: false,
          minifyCSS: true,
        },
        inject: false,
        title: "",
        filename: "index.html",
        template: "./src/index.hbs",
        chunks: ["common"],
        templateParameters: require("./data.js"),
      }),
      new ESLintPlugin({
        configType: "flat",
        overrideConfigFile: path.resolve(__dirname, "eslint.config.mjs"),
        extensions: [".ts", ".js"],
      }),
      isProduction && new BeautifyHtmlWebpackPlugin(),
      // new webpack.ProvidePlugin({
      //   $: 'jquery',
      //   jQuery: 'jquery',
      // }),
      isProduction &&
        new RemovePlugin({
          after: {
            test: [
              {
                folder: "./public/js",
                method: absoluteItemPath => {
                  return new RegExp(/image.*.js/).test(absoluteItemPath);
                },
              },
              {
                folder: "./public/js",
                method: absoluteItemPath => {
                  return new RegExp(/.txt/).test(absoluteItemPath);
                },
              },
            ],
          },
        }),
      //   isProduction && new FixStyleOnlyEntriesPlugin({
      //     extensions: ['less', 'scss', 'css', 'sass'],
      //   }),
      isProduction &&
        new MiniCssExtractPlugin({
          filename: "./css/style.css",
        }),
      isProduction &&
        new HtmlCriticalWebpackPlugin({
          base: path.resolve(__dirname, "public"),
          src: "index.html",
          dest: "index.html",
          inline: true,
          minify: true,
          extract: false,
          width: 310,
          height: 550,
          penthouse: {
            blockJSRequests: true,
          },
        }),
      // isProduction && new PurgeCSSPlugin({
      //   paths: glob.sync(`${PATHS.src}/**/*`, {nodir: true}),
      //   rejected: true,
      //   safelist: [/^is-open/, /^ct-/],
      // }),
    ].filter(Boolean),
  };
};
