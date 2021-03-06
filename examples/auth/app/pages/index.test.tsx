import {render} from "test/utils"
import Home from "./index"

jest.mock("@ritzjs/core", () => ({
  ...jest.requireActual<object>("@ritzjs/core")!,
  useQuery: () => [
    {
      id: 1,
      name: "User",
      email: "user@email.com",
      role: "user",
    },
  ],
}))

test("renders ritz documentation link", () => {
  // This is an example of how to ensure a specific item is in the document
  // But it's disabled by default (by test.skip) so the test doesn't fail
  // when you remove the the default content from the page

  // This is an example on how to mock api hooks when testing

  const {getByText} = render(<Home />)
  const element = getByText(/powered by ritz/i)
  // @ts-ignore
  expect(element).toBeInTheDocument()
})