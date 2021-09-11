import {RitzScript, Document, DocumentHead, Html, Main} from "ritz"

class MyDocument extends Document {
  // Only uncomment if you need to customize this behaviour
  // static async getInitialProps(ctx: DocumentContext) {
  //   const initialProps = await Document.getInitialProps(ctx)
  //   return {...initialProps}
  // }

  render() {
    return (
      <Html lang="en">
        <DocumentHead />
        <body>
          <Main />
          <RitzScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
