import React from 'react'
import './App.css'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import { SignIn } from './components/Auth'
import ROUTES from './routes'
import {withAuthentication} from './components/Session'
import Creator, { CreatorWorks } from './components/Creator'

const App = () => (
  <Router>
    <Navigation />
    <Route path={ROUTES.SIGNIN} exact component={SignIn} />
    <Route path={ROUTES.CREATOR} exact component={Creator} />
    <Route path={ROUTES.CREATORWORKS} exact component={CreatorWorks} />
  </Router>
)

export default withAuthentication(App)
