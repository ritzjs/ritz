import {useRouter, RitzPage} from "ritz"
import Layout from "app/core/layouts/Layout"
import {SignupForm} from "app/auth/components/SignupForm"

const SignupPage: RitzPage = () => {
  const router = useRouter()

  return (
    <div>
      <SignupForm onSuccess={() => router.push("/")} />
    </div>
  )
}

SignupPage.getLayout = (page) => <Layout title="Sign Up">{page}</Layout>

export default SignupPage
