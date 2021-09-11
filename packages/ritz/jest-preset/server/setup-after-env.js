require("@testing-library/jest-dom")
process.env.__RITZ_SESSION_COOKIE_PREFIX = "ritz"

jest.setTimeout(10000)

afterAll(async () => {
  try {
    await global._ritz_prismaClient.$disconnect()
    // console.log("DISCONNECT")
    // await new Promise((resolve) => setTimeout(resolve, 500))
  } catch (error) {
    // ignore error
  }
})
