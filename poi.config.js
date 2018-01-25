module.exports = (options, req) => ({
  entry: './src/index.js',
  extractCSS: false,
  babel: {
    babelrc: false,
    cacheDirectory: true,
    presets: [
      [require.resolve('babel-preset-poi'), { jsx: 'vue' }]
    ]
  },
  html: {
    // `pkg` is the data from `package.json`
    template: './index.html', // Defaults to $cwd/index.ejs if it exists, otherwise use built-in template
  }
  // Other options
})