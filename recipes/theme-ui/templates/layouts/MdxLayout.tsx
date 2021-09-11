import {Head} from "ritz"
import {FC, ReactNode} from "react"
import {Container} from "theme-ui"

type MdxLayoutProps = {
  title: string
  children: ReactNode
}

const MdxLayout: FC<MdxLayoutProps> = ({title, children}) => {
  return (
    <>
      <Head>
        <title>{title || "Ritz App"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container mx="50|100|150|200">{children}</Container>
    </>
  )
}

export default MdxLayout
