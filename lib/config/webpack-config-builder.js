var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

// var nodeModules = {};
// fs.readdirSync('node_modules')
//   .filter(function(x) {
//     return ['.bin'].indexOf(x) === -1;
//   })
//   .forEach(function(mod) {
//     nodeModules[mod] = 'commonjs ' + mod;
//   });

module.exports = (dir) => ({
  entry: dir + '/index.js',
  target: 'node',
  output: {
    path: dir,
    filename: 'node.bundle.js',
    libraryTarget: "commonjs2",
  },
  // externals: nodeModules
});