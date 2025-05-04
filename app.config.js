// Register Babel to strip Flow types in React Native modules during config evaluation
require('@babel/register')({
  only: [/node_modules[\\/]react-native[\\/]/],
  presets: ['@babel/preset-flow'],
});

// app.config.js – proxy to static JSON config to avoid dynamic module loading
module.exports = require('./app.json');