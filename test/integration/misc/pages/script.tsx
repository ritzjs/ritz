import {Script} from "ritz"

function Page() {
  return (
    <div id="page">
      <Script>{`console.log('LOADED'); window.scriptLoaded = true`}</Script>
    </div>
  )
}

export default Page
