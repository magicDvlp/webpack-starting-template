const path = require('path');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const ImageminWebpWebpackPlugin= require("imagemin-webp-webpack-plugin");
const cssnano = require('cssnano');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebappWebpackPlugin = require('webapp-webpack-plugin');
const HtmlCriticalWebpackPlugin = require("html-critical-webpack-plugin");
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");

module.exports = (env, options) => {

    const isProduction = options.mode === 'production';
    const isDevelopment = options.mode === 'development';

    return {
        entry: {
            style: ['./node_modules/slick-carousel/slick/slick.scss', './src/sass/libs.sass', './src/sass/style.sass'],
            bundle: './index.js',
            common: './src/js/index.js',
        },
        output: {
            path: path.resolve(__dirname, './public'),
            filename: 'js/[name].js',
            publicPath: ''
        },
        optimization: {
            splitChunks: {
                chunks: chunk => chunk.name !== 'style' && chunk.name !== 'libs' && chunk.name !== 'bundle',
                minSize: 1,
                minChunks: 2
            }
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/, 
                    use: [
                        {
                            loader: 'babel-loader',
                        },
                        {
                            loader: 'eslint-loader'
                        }
                    ],
                    exclude: /node_modules/,
                },
                {
                    test: /\.(sass|scss)$/,
                    use: [
                        {
                            loader: isProduction ? MiniCssExtractPlugin.loader : 'style-loader'
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: [
                                    autoprefixer(),
                                    cssnano({
                                        preset: 'default'
                                    })
                                ],
                            }
                        },
                        {
                            loader: "resolve-url-loader"
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sassOptions: {
                                    sourceMap: true,
                                    includePaths: ["node_modules"],
                                }
                            }
                        }
                    ]
                },
                {
                    test: /\.(css)$/,
                    use: [
                        {
                            loader: isProduction ? MiniCssExtractPlugin.loader : 'style-loader'
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: [
                                    autoprefixer(),
                                    cssnano({
                                        preset: 'default'
                                    })
                                ],
                            }
                        },
                    ]
                },
                {
                    test: /\.(png|jpg|gif|svg)$/,
                    exclude: [
                        path.resolve(__dirname, './src/img/svg/'),
                        path.resolve(__dirname, './src/img/base64/')
                    ],
                    use:[
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[name].[ext]',
                                outputPath: './img',
                                publicPath: '../img'
                            }
                        }
                    ]
                },
                {
                    test: /\.svg$/,
                    loader: 'svg-sprite-loader',
                    options: {
                        extract: true,
                        spriteFilename: "./img/svg.svg",
                        esModule: false
                    },
                    include: [
                        path.resolve(__dirname, "./src/img/svg/")
                    ],
                },
                {
                    test: /\.(png|jpg|gif|svg)$/i,
                    include: [
                        path.resolve(__dirname, "./src/img/base64/")
                    ],
                    use: [
                      {
                        loader: 'url-loader',
                      }
                    ]
                },
                {
                    test: /\.(woff|woff2|ttf|otf|eot)$/,
                    use:[
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[name].[ext]',
                                outputPath: './font',
                                publicPath: '../font'
                            }
                        }
                    ]
                },
            ]
        },
        devtool: isProduction ? 'source-map' : isDevelopment && 'eval-source-map',
        devServer: {
            contentBase: [path.resolve(__dirname, './public'), path.resolve(__dirname, './src')],
            watchContentBase: true,
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
                title: 'РемАгроКом',
                filename: 'index.html',
                template: './src/index.html',
                chunks: ['common', 'style']
            }),
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery'
            }),
            isDevelopment && new webpack.HotModuleReplacementPlugin(),
            // isProduction && new WebappWebpackPlugin({
            //     logo: './src/fav-logo.png',
            //     prefix: 'img/favicons/',
            //     inject: 'force',
            //     favicons: {
            //         android: true,
            //         appleIcon: true,
            //         appleStartup: true,
            //         coast: true,
            //         favicons: true,
            //         firefox: false,
            //         yandex: false,
            //         windows: false
            //     }
            // }),
            isProduction && new FixStyleOnlyEntriesPlugin({
                extensions: ["less", "scss", "css", "sass"]
            }),
            isProduction && new MiniCssExtractPlugin({
                filename: "./css/[name].css",
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
                }
            }),
            // new ImageminWebpWebpackPlugin({
            //     config: [{
            //         test: /\.(jpe?g|png)$/,
            //         options: {
            //             quality:  75
            //         }
            //     }],
            //     strict: true
            // }),
            isProduction && new ImageminPlugin({
                pngquant: {
                    quality: '95-100'
                }
            })
        ].filter(Boolean)
    }
    
}