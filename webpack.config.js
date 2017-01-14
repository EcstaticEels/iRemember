var path = require('path')

const config = {
    entry: {
        web: "./web/webApp.js"
    },
    output: {
        path: path.resolve(__dirname, 'public/bundle'),
        filename: "[name].bundle.js"
    },
    module: {
        loaders: [
            { 
                test: /\.js$/, 
                exclude: /node_modules/, 
                loader: "babel-loader",
                query: {
                    presets: ['es2015', 'react']
                } 
            }
        ]
    }
};

module.exports = config;