import { Navbar } from './components/Navbar.js'
import { SearchBar } from './components/SearchBar.js'
import { Feed } from './pages/Feed.js'

document.getElementById('app').innerHTML = `
  ${Navbar()}
  ${SearchBar()}
  ${Feed()}
`
