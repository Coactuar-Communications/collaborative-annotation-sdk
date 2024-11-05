
const { GetEnvVars } = require('env-cmd');
const path = require('path');
const webpack = require('webpack');


module.exports =() => {
    const envVars =  GetEnvVars({envFile: {
             filePath:  path.join(__dirname, '.env'), // Path to your .env file
             fallback: true
         }});
    const dotenv = require('dotenv').config({
        path: path.join(__dirname, '.env'),
      });
    const mergedEnv = { ...dotenv.parsed, ...envVars };
    
    return {
        mode: 'development',
        devtool: 'source-map',
        entry: './src/index.js',
        output: {
            path: path.resolve('lib'),
            filename: 'index.js',
            library: "sariska-collaborative-annotation-sdk",      
            libraryTarget: 'umd',      
            publicPath: '/lib/',      
            umdNamedDefine: true 
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: 'babel-loader'
                },
                {
                    test: /\.css$/i,
                    use: ["style-loader", "css-loader"],
                },
                {
                    test: /\.(png|jp(e*)g|svg|gif)$/,
                    use: ['file-loader'],
                },
                {
                    test: /\.svg$/,
                    use: ['@svgr/webpack'],
                },
            ],
        },
        resolve: {
            alias: {
                'react': path.resolve(__dirname, './node_modules/react'),
                'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
              }
        },
        
        plugins: [
            new webpack.DefinePlugin({
              'process.env': JSON.stringify(mergedEnv)
            }),
        ],
        externals: {
            // Don't bundle react or react-dom      
            react: {
              commonjs: "react",
              commonjs2: "react",
              amd: "React",
              root: "React"
            },
            "react-dom": {
              commonjs: "react-dom",
              commonjs2: "react-dom",
              amd: "ReactDOM",
              root: "ReactDOM"
            }
          }
    }
};
