import { AppProps } from "ritz"

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
