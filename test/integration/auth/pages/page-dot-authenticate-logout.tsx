import logout from "app/mutations/logout"
import getAuthenticatedBasic from "app/queries/getAuthenticatedBasic"
import {RitzPage, useMutation, useQuery} from "ritz"
import {Suspense} from "react"

function Content() {
  const [result] = useQuery(getAuthenticatedBasic, undefined)
  const [logoutMutation] = useMutation(logout)
  return (
    <div>
      <div id="content">{result}</div>
      <button
        id="logout"
        onClick={async () => {
          await logoutMutation()
        }}
      >
        logout
      </button>
    </div>
  )
}

const AuthLogout: RitzPage = () => {
  return (
    <div id="page">
      <Suspense fallback={"Loading..."}>
        <Content />
      </Suspense>
    </div>
  )
}

AuthLogout.authenticate = {redirectTo: "/login"}

export default AuthLogout
