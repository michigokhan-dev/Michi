import { Navbar } from './components/Navbar.js?v=401'
import { SearchBar } from './components/SearchBar.js?v=401'
import { PostInput } from './components/PostInput.js?v=401'
import { Story } from './components/Story.js?v=401'
import { PostList } from './components/Post.js?v=401'
import { Profile } from './pages/Profile.js?v=401'
import { BottomNav } from './components/BottomNav.js?v=401'

let posts = [
  { text: "Welcome to MICHI - Black background, Gold soul. This is luxury social. ✨", liked: false, likes: 0 }
]

function render(){
  const page = location.hash.replace('#','') || 'feed'
  
  let content = ''
  if(page === 'profile'){
    content = Profile(posts)
  } else {
    content = `
      ${SearchBar()}
      ${Story()}
      ${PostInput()}
      ${PostList(posts)}
    `
  }

  document.getElementById('app').innerHTML = `
    ${Navbar()}
    <div class="pb-20">${content}</div>
    ${BottomNav()}
  `
  
  const input = document.getElementById('postInput')
  const btn = document.getElementById('shareBtn')
  
  function addPost(){
    const text = input?.value.trim()
    if(!text) return
    posts.unshift({ text, liked: false, likes: 0 })
    if(input) input.value = ''
    render()
  }
  
  if(btn && input){
    btn.onclick = addPost
    input.onkeydown = (e) => { if(e.key === 'Enter') addPost() }
  }
  
  document.querySelectorAll('.likeBtn').forEach(button => {
    button.onclick = () => {
      const index = button.getAttribute('data-index')
      posts[index].liked = !posts[index].liked
      posts[index].likes += posts[index].liked ? 1 : -1
      render()
    }
  })
}

window.addEventListener('hashchange', render)
render()
