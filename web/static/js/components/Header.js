import React from 'react'
import SearchForm from './SearchForm'
import { Navbar, FormGroup, FormControl, Button } from 'react-bootstrap'
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
              <SearchForm onSubmit={ handleSubmit } />
          </Navbar>
      </header>
  )
}

export default Header