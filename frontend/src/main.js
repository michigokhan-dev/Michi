import { Navbar } from './components/Navbar.js?v=402'
import { SearchBar } from './components/SearchBar.js?v=402'
import { PostInput } from './components/PostInput.js?v=402'
import { Story } from './components/Story.js?v=402'
import { PostList } from './components/Post.js?v=402'
import { Profile } from './pages/Profile.js?v=402'
import { BottomNav } from './components/BottomNav.js?v=402'

let posts = [
  { text: "Welcome to MICHI - Black background, Gold soul. This is luxury social. ✨", liked: false, likes: 0 }
]

let profileData = {
  name: "MICHI User",
  bio: "Luxury mind • Black & Gold soul ✨",
  followers: 342,
  following: 128
}

function render(){
  const page = location.hash.replace('#','') || 'feed'
  
  let content = ''
  if(page === 'profile'){
    content = Profile(posts, profileData)
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
  
  // Add Post
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
  
  // Like
  document.querySelectorAll('.likeBtn').forEach(button => {
    button.onclick = () => {
      const index = button.getAttribute('data-index')
      posts[index].liked = !posts[index].liked
      posts[index].likes += posts[index].liked ? 1 : -1
      render()
    }
  })

  // Delete Post - only you can see
  document.querySelectorAll('.deletePostBtn').forEach(button => {
    button.onclick = () => {
      const index = button.getAttribute('data-index')
      if(confirm('Delete this post?')){
        posts.splice(index, 1)
        render()
      }
    }
  })

  // Edit Post
  document.querySelectorAll('.editPostBtn').forEach(button => {
    button.onclick = () => {
      const index = button.getAttribute('data-index')
      const newText = prompt('Edit your post:', posts[index].text)
      if(newText !== null && newText.trim() !== ''){
        posts[index].text = newText.trim()
        render()
      }
    }
  })

  // Edit Profile
  const editProfileBtn = document.getElementById('editProfileBtn')
  if(editProfileBtn){
    editProfileBtn.onclick = () => {
      const newName = prompt('Edit your name:', profileData.name)
      if(newName !== null && newName.trim() !== '') profileData.name = newName.trim()
      
      const newBio = prompt('Edit your bio:', profileData.bio)
      if(newBio !== null && newBio.trim() !== '') profileData.bio = newBio.trim()
      
      render()
    }
  }
}

window.addEventListener('hashchange', render)
render()
