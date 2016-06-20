import React from 'react'
import SearchForm from './SearchForm'
import { Navbar, FormGroup, FormControl, Button } from 'react-bootstrap'

const Header = ({ handleSubmit }) => {
  return(
      <header>
          <Navbar inverse>
              <Navbar.Header>
                  <Navbar.Brand>
                      <a href="/">Anivia</a>
                  </Navbar.Brand>
              </Navbar.Header>
              <SearchForm onSubmit={ handleSubmit } />
          </Navbar>
      </header>
  )
}

export default Header