import React from 'react'
import ROUTES from '../../routes'
import { Nav, Navbar } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import {AuthUserContext} from '../Session'
import {SignOut} from '../Auth'

export default () => (
    <>
    <AuthUserContext.Consumer>
        { authUser =>
             authUser
                ? <NavigationAuth />
                : <NavigationNonAuth />
        }
    </AuthUserContext.Consumer>
    </>
)

const NavigationAuth = () => (
    <Navbar variant="dark" expand="md" bg="dark">
      <Navbar.Brand href="/" className="font-weight-bold"><span className="text-warning">raadaa</span> QPortal</Navbar.Brand>
      <Navbar.Toggle aria-controls="navigation-bar" />
      <Navbar.Collapse id="navigation-bar">
        <Nav className="mr-auto">
            {/*<NavLink to={ROUTES.MANAGETESTS} className="nav-link font-weight-bold">Manage tests</NavLink>*/}
        </Nav>
        <SignOut />
      </Navbar.Collapse>
    </Navbar>
)
const NavigationNonAuth = () => (
    <Navbar variant="light" expand="md" bg="light">
      <Navbar.Toggle aria-controls="navigation-bar" />
      <Navbar.Collapse id="navigation-bar" className="text-right">
          <NavLink to={ROUTES.SIGNIN} className="nav-link text-dark font-weight-bold">Sign In</NavLink>
      </Navbar.Collapse>
    </Navbar>
)
