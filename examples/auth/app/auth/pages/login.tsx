import React from "react"
import {useRouter, RitzPage} from "ritz"
import Layout from "app/core/layouts/Layout"
import {LoginForm} from "app/auth/components/LoginForm"
import {Routes} from ".ritz"

const LoginPage: RitzPage = () => {
  const router = useRouter()

  return (
    <div>
      <LoginForm
        onSuccess={() => {
          const next = router.query.next ? decodeURIComponent(router.query.next as string) : "/"
          router.push(next)
        }}
      />
    </div>
  )
}

LoginPage.redirectAuthenticatedTo = Routes.Home().pathname
LoginPage.getLayout = (page) => <Layout title="Log In">{page}</Layout>

export default LoginPage
