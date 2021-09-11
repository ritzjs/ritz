const {sessionMiddleware, simpleRolesIsAuthorized} = require("ritz")

module.exports = {
  middleware: [
    sessionMiddleware({
      cookiePrefix: "ritz-custom-server-example",
      isAuthorized: simpleRolesIsAuthorized,
    }),
  ],
  /* Uncomment this to customize the webpack config
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Note: we provide webpack above so you should not `require` it
    // Perform customizations to webpack config
    // Important: return the modified config
    return config
  },
  */
}