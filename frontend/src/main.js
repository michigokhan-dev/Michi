import { Navbar } from './components/Navbar.js'
import { SearchBar } from './components/SearchBar.js'
import { PostInput } from './components/PostInput.js'
import { Story } from './components/Story.js'
import { PostList } from './components/Post.js'

let posts = [
  { text: "Welcome to MICHI - Black background, Gold soul. This is luxury social. ✨", liked: false, likes: 0 }
]

function render(){
  document.getElementById('app').innerHTML = `
    ${Navbar()}
    ${SearchBar()}
    ${Story()}
    ${PostInput()}
    ${PostList(posts)}
  `
  
  const input = document.getElementById('postInput')
  const btn = document.getElementById('shareBtn')
  
  function addPost(){
    const text = input.value.trim()
    if(!text) return
    posts.unshift({ text, liked: false, likes: 0 })
    input.value = ''
    render()
  }
  
  if(btn && input){
    btn.onclick = addPost
    input.onkeydown = (e) => { if(e.key === 'Enter') addPost() }
  }
  
  // Like butonu sarı olsun
  document.querySelectorAll('.likeBtn').forEach(button => {
    button.onclick = () => {
      const index = button.getAttribute('data-index')
      posts[index].liked = !posts[index].liked
      posts[index].likes += posts[index].liked ? 1 : -1
      render()
    }
  })
}

render()
