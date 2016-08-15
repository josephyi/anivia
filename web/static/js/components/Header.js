import React from 'react'
import SearchForm from './SearchForm'
import { Nav, NavItem, Navbar, FormGroup, FormControl, Button } from 'react-bootstrap'
import { Link } from 'react-router'

const Header = ({ handleSubmit }) => {
  return(
      <header>
          <Navbar>
              <Navbar.Header>
                  <Navbar.Brand>
                      <Link to="/">Anivia</Link>
                  </Navbar.Brand>
              </Navbar.Header>
              <Nav>
                  <li><Link to="/about">About</Link></li>
              </Nav>
              <SearchForm onSubmit={ handleSubmit } />
          </Navbar>
      </header>
  )
}

export default Header