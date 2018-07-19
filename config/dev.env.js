'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"'
})

// module.exports = {
// 	API_URL: {
// 		base_url: 'http://localhost:5000/books'
// 	}
// }
