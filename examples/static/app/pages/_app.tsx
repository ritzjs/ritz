import {
  AppProps,
  ErrorBoundary,
  ErrorComponent,
  ErrorFallbackProps,
  useQueryErrorResetBoundary,
} from "ritz"

export default function App({ Component, pageProps }: AppProps) {
  const getLayout = Component.getLayout || ((page) => page)
  const { reset } = useQueryErrorResetBoundary()

  return (
    <ErrorBoundary FallbackComponent={RootErrorFallback} onReset={reset}>
      {getLayout(<Component {...pageProps} />)}
    </ErrorBoundary>
  )
}

function RootErrorFallback({ error }: ErrorFallbackProps) {
  return <ErrorComponent statusCode={error.statusCode || 400} title={error.message || error.name} />
}
