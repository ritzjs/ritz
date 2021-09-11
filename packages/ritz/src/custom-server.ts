import next from "next"

// Support commonjs `require('ritz')`
if (process.env.RITZ_PROD_BUILD) {
  module.exports = next
  exports = module.exports
}

// eslint-disable-next-line import/no-default-export
export default next
