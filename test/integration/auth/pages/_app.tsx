import {AppProps, ErrorBoundary, ErrorFallbackProps, useQueryErrorResetBoundary} from "ritz"
import {ReactQueryDevtools} from "react-query/devtools"

if (typeof window !== "undefined") {
  ;(window as any).DEBUG_RITZ = 1
}

export default function App({Component, pageProps}: AppProps) {
  return (
    <ErrorBoundary
      FallbackComponent={RootErrorFallback}
      onReset={useQueryErrorResetBoundary().reset}
    >
      <Component {...pageProps} />
      <ReactQueryDevtools />
    </ErrorBoundary>
  )
}

function RootErrorFallback({error}: ErrorFallbackProps) {
  return (
    <div>
      <div id="error">{error.name}</div>
      {error.statusCode} {error.message}
    </div>
  )
}
