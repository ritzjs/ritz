/* eslint-env jest */
import fs from "fs-extra"
import {
  ritzBuild,
  ritzExport,
  ritzStart,
  File,
  findPort,
  killApp,
  launchApp,
  renderViaHTTP,
  waitFor,
} from "lib/ritz-test-utils"
import webdriver from "lib/next-webdriver"
import {join} from "path"
import rimraf from "rimraf"

let app: any
let appPort: number
const appDir = join(__dirname, "..")
const outdir = join(appDir, "out")
const ritzConfig = new File(join(appDir, "ritz.config.ts"))
jest.setTimeout(1000 * 60 * 2)

const resetDb = () => rimraf.sync(join(__dirname, "../db.json"))

const runTests = (mode: string) => {
  describe("Auth", () => {
    describe("unauthenticated", () => {
      it("should render result for open query", async () => {
        const browser = await webdriver(appPort, "/noauth-query")
        let text = await browser.elementByCss("#page").text()
        await browser.waitForElementByCss("#content")
        text = await browser.elementByCss("#content").text()
        expect(text).toMatch(/noauth-basic-result/)
        if (browser) await browser.close()
      })

      it("should render error for protected query", async () => {
        const browser = await webdriver(appPort, "/authenticated-query")
        await browser.waitForElementByCss("#error")
        let text = await browser.elementByCss("#error").text()
        expect(text).toMatch(/AuthenticationError/)
        if (browser) await browser.close()
      })

      it("should render error for protected page", async () => {
        const browser = await webdriver(appPort, "/page-dot-authenticate")
        await browser.waitForElementByCss("#error")
        let text = await browser.elementByCss("#error").text()
        expect(text).toMatch(/AuthenticationError/)
        if (browser) await browser.close()
      })
    })

    describe("authenticated", () => {
      it("should login and out successfully", async () => {
        const browser = await webdriver(appPort, "/login")
        await browser.waitForElementByCss("#content")
        let text = await browser.elementByCss("#content").text()
        expect(text).toMatch(/logged-out/)
        await browser.elementByCss("#login").click()
        await waitFor(200)
        text = await browser.elementByCss("#content").text()
        expect(text).toMatch(/logged-in/)
        await browser.elementByCss("#logout").click()
        await waitFor(250)
        text = await browser.elementByCss("#content").text()
        expect(text).toMatch(/logged-out/)

        if (browser) await browser.close()
      })

      it("should logout without infinite loop #2233", async () => {
        // Login
        let browser = await webdriver(appPort, "/login")
        await waitFor(200)
        await browser.elementByCss("#login").click()
        await waitFor(200)

        await browser.eval(`window.location = "/authenticated-query"`)
        await browser.waitForElementByCss("#content")
        let text = await browser.elementByCss("#content").text()
        expect(text).toMatch(/authenticated-basic-result/)
        await browser.elementByCss("#logout").click()
        await waitFor(200)
        await browser.waitForElementByCss("#error")
        text = await browser.elementByCss("#error").text()
        expect(text).toMatch(/AuthenticationError/)
        if (browser) await browser.close()
      })

      it("Page.authenticate = {redirect} should work ", async () => {
        // Login
        let browser = await webdriver(appPort, "/login")
        await waitFor(200)
        await browser.elementByCss("#login").click()
        await waitFor(200)

        await browser.eval(`window.location = "/page-dot-authenticate-redirect"`)
        await browser.waitForElementByCss("#content")
        let text = await browser.elementByCss("#content").text()
        expect(text).toMatch(/authenticated-basic-result/)
        await browser.elementByCss("#logout").click()
        await waitFor(500)

        expect(await browser.url()).toMatch(/\/login/)
        if (browser) await browser.close()
      })
    })

    describe("prefetching", () => {
      it("should prefetch from the query cache #2281", async () => {
        const browser = await webdriver(appPort, "/prefetching")
        await waitFor(100)
        await browser.waitForElementByCss("#content")
        const text = await browser.elementByCss("#content").text()
        expect(text).toMatch(/noauth-basic-result/)
        if (browser) await browser.close()
      })
    })

    describe("setting public data for a user", () => {
      it("should update all sessions of the user", async () => {
        // Ensure logged out
        const browser = await webdriver(appPort, "/login")
        await waitFor(200)
        let text = await browser.elementByCss("#content").text()
        if (text.match(/logged-in/)) {
          await browser.elementByCss("#logout").click()
          await waitFor(200)
        }

        await browser.eval(`window.location = "/set-public-data"`)
        await browser.waitForElementByCss("#change-role")
        await browser.elementByCss("#change-role").click()
        await waitFor(500)
        await browser.waitForElementByCss(".role")
        // @ts-ignore
        const roleElementsAfter = await browser.elementsByCss(".role")
        expect(roleElementsAfter.length).toBe(2)
        for (const role of roleElementsAfter) {
          // @ts-ignore
          const text = await role.getText()
          expect(text).toMatch(/role: new role/)
        }
        if (browser) await browser.close()
      })
    })

    describe("Page.redirectAuthenticatedTo", () => {
      it("should work when redirecting to page with useQuery", async () => {
        // https://github.com/ritz-js/ritz/issues/2527

        // Ensure logged in
        const browser = await webdriver(appPort, "/login")
        await waitFor(200)
        let text = await browser.elementByCss("#content").text()
        if (text.match(/logged-out/)) {
          await browser.elementByCss("#login").click()
          await waitFor(200)
        }

        await browser.eval(`window.location = "/redirect-authenticated"`)
        await browser.waitForElementByCss("#content")
        text = await browser.elementByCss("#content").text()
        expect(text).toMatch(/authenticated-basic-result/)
        if (browser) await browser.close()
      })
    })

    describe("setPublicData", () => {
      it("it should not throw CSRF error", async () => {
        // https://github.com/ritz-js/ritz/issues/2448

        // ensure logged out
        const browser = await webdriver(appPort, "/login")
        await waitFor(200)
        let text = await browser.elementByCss("#content").text()
        if (text.match(/logged-in/)) {
          await browser.elementByCss("#logout").click()
          await waitFor(200)
        }

        await browser.eval(`window.location = "/gssp-setpublicdata"`)
        await browser.waitForElementByCss("#content")
        text = await browser.elementByCss("#content").text()
        expect(text).toMatch(/it works/)
        if (browser) await browser.close()
      })
    })
  })
}

describe("dev mode", () => {
  beforeAll(async () => {
    resetDb()
    appPort = await findPort()
    app = await launchApp(appDir, appPort)

    const prerender = [
      "/login",
      "/noauth-query",
      "/authenticated-query",
      "/prefetching",
      "/page-dot-authenticate",
      "/page-dot-authenticate-redirect",
      "/redirect-authenticated",
      "/gssp-setpublicdata",
      "/api/rpc/getNoauthBasic",
      "/api/rpc/getAuthenticatedBasic",
      "/api/rpc/login",
      "/api/rpc/logout",
    ]
    await Promise.all(prerender.map((route) => renderViaHTTP(appPort, route)))
  })
  afterAll(() => killApp(app))
  runTests("dev")
})

describe("production mode", () => {
  beforeAll(async () => {
    resetDb()
    await ritzBuild(appDir)
    appPort = await findPort()
    app = await ritzStart(appDir, appPort)
  })
  afterAll(() => killApp(app))
  runTests("server")
})

describe("serverless mode", () => {
  beforeAll(async () => {
    resetDb()
    ritzConfig.replace("// replace me", `target: 'experimental-serverless-trace', `)
    await ritzBuild(appDir)
    appPort = await findPort()
    app = await ritzStart(appDir, appPort)
  })
  afterAll(async () => {
    await killApp(app)
    ritzConfig.restore()
  })
  runTests("serverless")
})

describe("auth - ritz export should not work", () => {
  it("should build successfully", async () => {
    await fs.remove(join(appDir, ".next"))
    const {code} = await ritzBuild(appDir)
    if (code !== 0) throw new Error(`build failed with status ${code}`)
  })

  it("should have error during ritz export", async () => {
    const {stderr} = await ritzExport(appDir, {outdir}, {stderr: true})
    expect(stderr).toContain("Ritz http middleware is not compatible with `ritz export`.")
  })
})
