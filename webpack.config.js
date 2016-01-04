var path = require("path");

module.exports = {
  entry: {
    react: path.join(__dirname, "./client/react.jsx"),
    websockets: path.join(__dirname, "./client/websockets.js")
  },
  output: {
    path: path.join(__dirname, "public/js"),
    filename: "bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        loader: 'jsx-loader'
      }
    ]
  },
  externals: {
      //don't bundle the 'react' npm package with our bundle.js
      //but get it from a global 'React' variable
    'react': 'React'
  },
  resolve: {
    extensions: ['','.js','.jsx']
  }
}
