import {AppProps} from "ritz"
import {ReactQueryDevtools} from "react-query/devtools"

export default function App({Component, pageProps}: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <ReactQueryDevtools />
    </>
  )
}
