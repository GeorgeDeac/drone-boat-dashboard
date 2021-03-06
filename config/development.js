const
    ConfigClass = require('./config.js'),
    StyleLintPlugin = require('stylelint-webpack-plugin');

module.exports = class extends ConfigClass {
    constructor() {
        super();

        this.config = {
            mode: 'development',
            output: {
                filename: './js/[name].js',
                path: `${this.appPath}/dist/dev`,
                hotUpdateChunkFilename: `../../.hot/hot-update.js`,
                hotUpdateMainFilename: `../../.hot/hot-update.json`
            },

            module: {
                rules: [
                    {
                        enforce: 'pre',
                        test: /\.js$/,
                        exclude: /node_modules/,
                        loader: 'eslint-loader',
                    },
                    {
                        test: /\.html?$/,
                        loader: "template-literals-loader"
                    },
                    {
                        test: /\.(png|svg|jpg|gif|jpe?g)$/,
                        use: [
                            {
                                options: {
                                    name: "[name].[ext]",
                                    outputPath: "../images/"
                                },
                                loader: "file-loader"
                            }
                        ]
                    },
                    {
                        test: /\.scss$/,
                        use: [
                            'style-loader',
                            {
                                loader: 'file-loader',
                                options: {
                                    name: '[name].css',
                                    outputPath: '../../dist/dev/css/'
                                }
                            },
                            'extract-loader',
                            {
                                loader: 'css-loader',
                                options: {
                                    sourceMap: true,
                                },
                            },
                            {
                                loader: 'sass-loader',
                                options: {
                                    sourceMap: true,
                                },
                            }
                        ],
                    }
                ],
            },

            plugins: [
                new StyleLintPlugin()
            ],

            devServer: {
                contentBase: ['public', 'dist/dev'],
                publicPath: '/',
                compress: false,
                host: '0.0.0.0',
                port: 9000,
                headers: {
                    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
                    "Access-Control-Allow-Headers": "Origin, Accept, X-Requested-With, Content-Type, Authorization",
                    "Access-Control-Allow-Origin": "*",
                },
                hot: true,
                index: 'public/index.html',
                writeToDisk: true,
                watchOptions: {
                    poll: true
                },
                watchContentBase: true
            }
        };
        return this.mergeConfig();
    };
};
