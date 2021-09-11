import {getLatestVersion} from "@ritzjs/generator/src/utils/get-latest-version"
import * as fs from "fs"
import nock from "nock"
import fetch from "node-fetch"
import * as os from "os"
import * as path from "path"
import pkgDir from "pkg-dir"
import rimraf from "rimraf"
import {stdout} from "stdout-stderr"
import {New} from "../../src/commands/new"

jest.setTimeout(120 * 1000)
const ritzCliPackageJson = require("../../package.json")

async function getRitzDistTags() {
  const response = await fetch("https://registry.npmjs.org/-/package/ritz/dist-tags")
  return await response.json()
}

/* TODO - fix test on CI windows. Getting this error:
 *
 *  TypeError:
 *  JSON Error in D:\a\ritz\ritz\node_modules\@ritzjs\generator\dist\templates\app\package.json:
 *     LinesAndColumns$1 is not a constructor
 *       at parseJson$1 (../../node_modules/prettier/third-party.js:3200:21)
 *       at Object.loadJson (../../node_modules/prettier/third-party.js:11009:22)
 */
const testIfNotWindows = process.platform === "win32" ? test.skip : test

jest.mock("enquirer", () => {
  return jest.fn().mockImplementation(() => {
    return {
      prompt: jest.fn().mockImplementation(() => ({form: "React Final Form"})),
    }
  })
})

const tempDir = path.join(__dirname, ".test")

beforeEach(() => {
  fs.mkdirSync(tempDir)
})
afterEach(() => {
  rimraf.sync(tempDir)
})

describe("`new` command", () => {
  describe("when scaffolding new project", () => {
    beforeEach(() => {
      stdout.stripColor = true
      stdout.start()
    })

    afterEach(() => {
      stdout.stop()
    })

    jest.setTimeout(200 * 1000)

    function makeTempDir() {
      const tmpDirPath = path.join(os.tmpdir(), "ritzjs-test-")
      return fs.mkdtempSync(tmpDirPath)
    }

    async function whileStayingInCWD(task: () => PromiseLike<void>) {
      const oldCWD = process.cwd()
      await task()
      process.chdir(oldCWD)
    }

    function getStepsFromOutput() {
      const output = stdout.output
      const exp = /^ {3}\d. (.*)$/gm
      const matches = []
      let match

      while ((match = exp.exec(output)) != null) {
        matches.push(match[1].trim())
      }

      return matches
    }

    async function withNewApp(test: (dirName: string, packageJson: any) => Promise<void> | void) {
      const tempDir = makeTempDir()

      await whileStayingInCWD(() => New.run([tempDir, "--skip-install"]))

      const packageJsonFile = fs.readFileSync(path.join(tempDir, "package.json"), {
        encoding: "utf8",
        flag: "r",
      })
      const packageJson = JSON.parse(packageJsonFile)

      await test(tempDir, packageJson)

      rimraf.sync(tempDir)
    }

    testIfNotWindows(
      "pins Ritz to the current version",
      async () =>
        await withNewApp(async (dirName, packageJson) => {
          const {
            dependencies: {ritz: ritzVersion},
          } = packageJson

          const {latest, main} = await getRitzDistTags()
          if (ritzCliPackageJson.version.includes("main")) {
            expect(ritzVersion).toEqual(main)
          } else {
            expect(ritzVersion).toEqual(latest)
          }

          expect(getStepsFromOutput()).toStrictEqual([
            `cd ${dirName}`,
            "yarn",
            "ritz prisma migrate dev (when asked, you can name the migration anything)",
            "ritz dev",
          ])
        }),
    )

    testIfNotWindows("performs all steps on a full install", async () => {
      const currentRitzWorkspaceVersion = require(path.join(
        await pkgDir(__dirname),
        "package.json",
      )).version

      jest.mock("@ritzjs/generator/src/utils/get-ritz-dependency-version", () => {
        return jest.fn().mockImplementation(() => {
          return {
            value: currentRitzWorkspaceVersion,
            fallback: false,
          }
        })
      })

      const newAppDir = fs.mkdtempSync(path.join(tempDir, "full-install-"))
      await whileStayingInCWD(() => New.run([newAppDir, "--skip-upgrade"]))

      expect(getStepsFromOutput()).toStrictEqual([`cd ${newAppDir}`, "ritz dev"])
    })

    it("fetches latest version from template", async () => {
      const expectedVersion = "3.0.0"
      const templatePackage = {name: "eslint-plugin-react-hooks", version: "3.x"}

      const scope = nock("https://registry.npmjs.org")

      scope
        .get(`/${templatePackage.name}`)
        .reply(200, {versions: {"4.0.0": {}, "3.0.0": {}}})
        .persist()

      scope
        .get(`/-/package/${templatePackage.name}/dist-tags`)
        .reply(200, {
          latest: "4.0.0",
        })
        .persist()

      const {value: latestVersion} = await getLatestVersion(
        templatePackage.name,
        templatePackage.version,
      )
      expect(latestVersion).toBe(expectedVersion)
    })

    describe("with network trouble", () => {
      testIfNotWindows("uses template versions", async () => {
        nock("https://registry.npmjs.org").get(/.*/).reply(500).persist()

        await withNewApp((_, packageJson) => {
          const {dependencies} = packageJson
          expect(dependencies.ritz).toBe("latest")
        })

        nock.restore()
      })
    })
  })
})
