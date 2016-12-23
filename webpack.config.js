var path = require('path')

const config = {
    entry: {
        mobile: "./mobile/home.js",
        web: "./web/webApp.js"
    },
    output: {
        path: path.resolve(__dirname, 'bundle'),
        filename: "[name].bundle.js"
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
        ]
    }
};

module.exports = config;