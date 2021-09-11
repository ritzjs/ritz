import {getPublicDataStore, useAuthorizeIf, useSession} from "next/data-client"
import {RitzProvider} from "next/data-client"
import {formatWithValidation} from "next/dist/shared/lib/utils"
import {RedirectError} from "next/stdlib"
import {AppProps, RitzPage} from "next/types"
import React, {ComponentPropsWithoutRef, useEffect} from "react"
import SuperJSON from "superjson"
import {Head} from "./head"
import {clientDebug} from "./utils"

const customCSS = `
  body::before {
    content: "";
    display: block;
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 99999;
    background-color: white;
  }

  .ritz-first-render-complete body::before {
    display: none;
  }
`
const noscriptCSS = `
  body::before {
    content: none
  }
`

const NoPageFlicker = () => {
  return (
    <Head>
      <style dangerouslySetInnerHTML={{__html: customCSS}} />
      <noscript>
        <style dangerouslySetInnerHTML={{__html: noscriptCSS}} />
      </noscript>
    </Head>
  )
}

export function withRitzInnerWrapper(Page: RitzPage) {
  const RitzInnerRoot = (props: ComponentPropsWithoutRef<RitzPage>) => {
    // We call useSession so this will rerender anytime session changes
    useSession({suspense: false})

    useAuthorizeIf(Page.authenticate === true)

    if (typeof window !== "undefined") {
      const publicData = getPublicDataStore().getData()
      // We read directly from publicData.userId instead of useSession
      // so we can access userId on first render. useSession is always empty on first render
      if (publicData.userId) {
        clientDebug("[RitzInnerRoot] logged in")
        const redirectAuthenticatedTo =
          typeof Page.redirectAuthenticatedTo === "function"
            ? Page.redirectAuthenticatedTo({session: publicData})
            : Page.redirectAuthenticatedTo
        if (redirectAuthenticatedTo) {
          const redirectUrl =
            typeof redirectAuthenticatedTo === "string"
              ? redirectAuthenticatedTo
              : formatWithValidation(redirectAuthenticatedTo)
          clientDebug("[RitzInnerRoot] redirecting to", redirectUrl)
          const error = new RedirectError(redirectUrl)
          error.stack = null!
          throw error
        }
      } else {
        clientDebug("[RitzInnerRoot] logged out")
        const authenticate = Page.authenticate
        if (authenticate && typeof authenticate === "object" && authenticate.redirectTo) {
          let {redirectTo} = authenticate
          if (typeof redirectTo !== "string") {
            redirectTo = formatWithValidation(redirectTo)
          }

          const url = new URL(redirectTo, window.location.href)
          url.searchParams.append("next", window.location.pathname)
          clientDebug("[RitzInnerRoot] redirecting to", url.toString())
          const error = new RedirectError(url.toString())
          error.stack = null!
          throw error
        }
      }
    }

    return <Page {...props} />
  }
  for (let [key, value] of Object.entries(Page)) {
    ;(RitzInnerRoot as any)[key] = value
  }
  if (process.env.NODE_ENV !== "production") {
    RitzInnerRoot.displayName = `RitzInnerRoot`
  }
  return RitzInnerRoot
}

export function withRitzAppRoot(UserAppRoot: React.ComponentType<any>) {
  const RitzOuterRoot = (props: AppProps) => {
    const component = React.useMemo(() => withRitzInnerWrapper(props.Component), [props.Component])

    const noPageFlicker =
      props.Component.suppressFirstRenderFlicker ||
      props.Component.authenticate !== undefined ||
      props.Component.redirectAuthenticatedTo

    useEffect(() => {
      document.documentElement.classList.add("ritz-first-render-complete")
    }, [])

    let {dehydratedState, _superjson} = props.pageProps
    if (dehydratedState && _superjson) {
      const deserializedProps = SuperJSON.deserialize({
        json: {dehydratedState},
        meta: _superjson,
      }) as {dehydratedState: any}
      dehydratedState = deserializedProps?.dehydratedState
    }

    return (
      <RitzProvider dehydratedState={dehydratedState}>
        {noPageFlicker && <NoPageFlicker />}
        <UserAppRoot {...props} Component={component} />
      </RitzProvider>
    )
  }
  return RitzOuterRoot
}
