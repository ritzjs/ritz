export * from "@ritzjs/core/app"
export * from "@ritzjs/core/config"
export * from "@ritzjs/core/dynamic"
export * from "@ritzjs/core/head"
export * from "@ritzjs/core"
export * from "@ritzjs/core/server"

/*
 * IF YOU CHANGE THE BELOW EXPORTS
 *    You also need to update the rewrite map in
 *    packages/babel-preset/src/rewrite-imports.ts
 */
export {default as Image} from "next/image"
export type {ImageProps, ImageLoader, ImageLoaderProps} from "next/image"

export * from "next/link"
export {Document, DocumentHead, Html, Main, RitzScript} from "next/document"
export type {DocumentProps, DocumentContext, DocumentInitialProps} from "next/document"

export {Script} from "next/script"
export type {Props as ScriptProps} from "next/script"

export * from "next/stdlib"
export * from "next/stdlib-server"
export * from "next/data-client"

export type {
  NextPageContext,
  RitzPageContext,
  NextComponentType,
  RitzComponentType,
  NextApiResponse,
  RitzApiResponse,
  NextApiRequest,
  RitzApiRequest,
  NextApiHandler,
  RitzApiHandler,
  DefaultCtx,
  Ctx,
  MiddlewareRequest,
  MiddlewareResponse,
  MiddlewareNext,
  Middleware,
  ConnectMiddleware,
  Session,
  PublicData,
  EmptyPublicData,
  IsAuthorizedArgs,
  SessionModel,
  SessionConfig,
  SessionContext,
  SessionContextBase,
  AuthenticatedSessionContext,
  ClientSession,
  AuthenticatedClientSession,
  Redirect,
  NextPage,
  RitzPage,
  AppProps,
  PageConfig,
  PreviewData,
  GetStaticPropsContext,
  GetStaticPropsResult,
  GetStaticProps,
  InferGetStaticPropsType,
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPaths,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  GetServerSideProps,
  InferGetServerSidePropsType,
  RedirectAuthenticatedTo,
  RedirectAuthenticatedToFnCtx,
  RedirectAuthenticatedToFn,
  RouteUrlObject,
} from "next/types"
