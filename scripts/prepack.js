const fs = require("fs-extra")
const cpx = require("@juanm04/cpx")

cpx.copy("README.md", "packages/ritz/")

const nextJsonPath = "nextjs/packages/next/package.json"
const nextJson = fs.readJSONSync(nextJsonPath)
nextJson.name = "@ritzjs/next"
nextJson.ritzVersion = nextJson.version
nextJson.version = `${nextJson.nextjsVersion}-${nextJson.ritzVersion}`
fs.writeJSONSync(nextJsonPath, nextJson, {spaces: 2})

const ritzCoreJsonPath = "packages/core/package.json"
const ritzCoreJson = fs.readJSONSync(ritzCoreJsonPath)
ritzCoreJson.dependencies.next = `npm:@ritzjs/next@${nextJson.version}`
fs.writeJSONSync(ritzCoreJsonPath, ritzCoreJson, {spaces: 2})
