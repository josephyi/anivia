import React from 'react'
import { Navbar, FormGroup, FormControl, Button } from 'react-bootstrap'

const Header = props => {
  return(
      <header>
          <Navbar>
              <Navbar.Header>
                  <Navbar.Brand>
                      <a href="/">Anivia</a>
                  </Navbar.Brand>
                  <Navbar.Toggle />
              </Navbar.Header>
          </Navbar>
      </header>
  )
}

export default Header