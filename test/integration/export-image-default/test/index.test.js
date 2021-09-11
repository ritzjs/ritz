/* eslint-env jest */

import fs from "fs-extra"
import {ritzBuild, ritzExport} from "lib/ritz-test-utils"
import {join} from "path"

jest.setTimeout(1000 * 60 * 5)
const appDir = join(__dirname, "../")
const outdir = join(appDir, "out")

describe("Export with default loader image component", () => {
  it("should build successfully", async () => {
    await fs.remove(join(appDir, ".next"))
    const {code} = await ritzBuild(appDir)
    if (code !== 0) throw new Error(`build failed with status ${code}`)
  })

  it("should have error during ritzx export", async () => {
    const {stderr} = await ritzExport(appDir, {outdir}, {stderr: true})
    expect(stderr).toContain(
      "Image Optimization using Ritz.js' default loader is not compatible with `ritz export`.",
    )
  })
})
