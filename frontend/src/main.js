import { Navbar } from './components/Navbar.js'
import { SearchBar } from './components/SearchBar.js'
import { PostInput } from './components/PostInput.js'
import { Story } from './components/Story.js'
import { PostList } from './components/Post.js'

let posts = [
  { text: "Welcome to MICHI - Black background, Gold soul. This is luxury social. ✨" }
]

function render(){
  document.getElementById('app').innerHTML = `
    ${Navbar()}
    ${SearchBar()}
    ${Story()}
    ${PostInput()}
    ${PostList(posts)}
  `
  
  // Post button çalışsın
  const input = document.getElementById('postInput')
  const btn = document.getElementById('shareBtn')
  
  function addPost(){
    const text = input.value.trim()
    if(!text) return
    posts.unshift({ text })
    input.value = ''
    render()
  }
  
  btn.onclick = addPost
  input.onkeydown = (e) => { if(e.key === 'Enter') addPost() }
}

render()
