import React from "react"
import {useRouter, RitzPage} from "ritz"
import Layout from "app/layouts/Layout"
import {LoginForm} from "app/auth/components/LoginForm"

const LoginPage: RitzPage = () => {
  const router = useRouter()

  return (
    <div>
      <LoginForm onSuccess={() => router.push("/")} />
    </div>
  )
}

LoginPage.getLayout = (page) => <Layout title="Log In">{page}</Layout>

export default LoginPage
