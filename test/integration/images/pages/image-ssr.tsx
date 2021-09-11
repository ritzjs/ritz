import {RitzPage, Image} from "ritz"

export const getServerSideProps = () => {
  return {props: {}}
}

const ImageSSR: RitzPage = () => {
  return (
    <div>
      <Image
        id="avatar"
        src="https://raw.githubusercontent.com/ritz-js/art/master/github-cover-photo.png"
        alt="ritz.js"
        width={300}
        height={138}
      />
    </div>
  )
}

export default ImageSSR
