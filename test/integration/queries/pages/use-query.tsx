import getBasic from "app/queries/getBasic"
import {useQuery} from "ritz"
import {Suspense} from "react"

function Content() {
  const [result] = useQuery(getBasic, undefined)
  return <div id="content">{result}</div>
}

function Query() {
  return (
    <div id="page">
      <Suspense fallback={"Loading..."}>
        <Content />
      </Suspense>
    </div>
  )
}

export default Query
