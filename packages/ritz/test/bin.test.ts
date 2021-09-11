import spawn from "cross-spawn"
import path from "path"

const ritzBin = path.resolve(__dirname, "../bin/ritz")
const exampleProject = path.resolve(__dirname, "../../../examples/auth")

describe("Binary ritz", () => {
  it("should return exit code 0 if command is successful", () => {
    const result = spawn.sync(ritzBin, ["--version"], {
      cwd: exampleProject,
    })
    expect(result.status).toBe(0)
  })
  it("should return exit code 1 if command is unsuccessful", () => {
    const result = spawn.sync(ritzBin, ["install", "notExistingRecipe"], {
      cwd: exampleProject,
    })
    expect(result.status).toBe(1)
  })
})
