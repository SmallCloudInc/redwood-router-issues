/* eslint-disable no-undef */
import { Router, Route, Private } from '@redwoodjs/router'
import { useHashRedirects, useSubdomain } from 'src/middleware'

const userRouteParamTypes = {
  slug: {
    constraint: /\w+-\w+/,
    transform: (param) => param,
  },
}

const Routes = () => {
  useHashRedirects()

  const subdomain = useSubdomain()

  if (subdomain == 'app') {
    return (
      <Router>
        <Route path="/" page={HomeSwitchPage} name="home" />
        <Route path="/logout" page={LogoutPage} name="logout" />
        <Route path="/login" page={LoginPage} name="login" />
        <Route path="/signup" page={SignupPage} name="signup" />
        <Private unauthenticated="login" role="ADMIN">
          <Route path="/w/{workspace}/dashboard" page={HomePage} name="dashboard" />
        </Private>
      </Router>
    )
  } else {
    return (
      <Router>
        <Route path="/login" page={CustomTokenPage} name="customToken" />
        <Route path="/" page={PortalHomePagePage} name="portalHomePage" />
        <Private unauthenticated="login">
          <Route path="/user/logout" page={LogoutPage} name="logout" />
          <Route path="/history" page={PortalFeedbackHistoryPage} name="portalFeedbackHistory" />
        </Private>
      </Router>
    )
  }
}

export default Routes
