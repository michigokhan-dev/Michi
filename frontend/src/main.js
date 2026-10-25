let defaultPosts = [
  { text: "Welcome to MICHI - Black background, Gold soul. This is luxury social. ✨", liked: false, likes: 0 }
]

let defaultProfile = {
  name: "MICHI User",
  bio: "Luxury mind • Black & Gold soul ✨",
  followers: 342,
  following: 128
}

// Load from localStorage - so posts don't disappear on refresh
function loadPosts(){
  try{
    const saved = localStorage.getItem('michi_posts')
    return saved ? JSON.parse(saved) : defaultPosts
  }catch(e){ return defaultPosts }
}

function loadProfile(){
  try{
    const saved = localStorage.getItem('michi_profile')
    return saved ? JSON.parse(saved) : defaultProfile
  }catch(e){ return defaultProfile }
}

let posts = loadPosts()
let profileData = loadProfile()

function savePosts(){
  localStorage.setItem('michi_posts', JSON.stringify(posts))
}

function saveProfile(){
  localStorage.setItem('michi_profile', JSON.stringify(profileData))
}

let Comps = {}

async function load(){
  const t = Date.now()
  Comps.Navbar = (await import(`./components/Navbar.js?t=${t}`)).Navbar
  Comps.SearchBar = (await import(`./components/SearchBar.js?t=${t}`)).SearchBar
  Comps.PostInput = (await import(`./components/PostInput.js?t=${t}`)).PostInput
  Comps.Story = (await import(`./components/Story.js?t=${t}`)).Story
  Comps.PostList = (await import(`./components/Post.js?t=${t}`)).PostList
  Comps.Profile = (await import(`./pages/Profile.js?t=${t}`)).Profile
  Comps.BottomNav = (await import(`./components/BottomNav.js?t=${t}`)).BottomNav
}

async function render(){
  if(!Comps.Navbar) await load()
  
  const page = location.hash.replace('#','') || 'feed'
  
  let content = ''
  if(page === 'profile'){
    content = Comps.Profile(posts, profileData)
  } else {
    content = `
      ${Comps.SearchBar()}
      ${Comps.Story()}
      ${Comps.PostInput()}
      ${Comps.PostList(posts)}
    `
  }

  document.getElementById('app').innerHTML = `
    ${Comps.Navbar()}
    <div class="pb-20">${content}</div>
    ${Comps.BottomNav(page)}
  `
  
  const input = document.getElementById('postInput')
  const btn = document.getElementById('shareBtn')
  
  function addPost(){
    const text = input?.value.trim()
    if(!text) return
    posts.unshift({ text, liked: false, likes: 0 })
    savePosts()
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
      savePosts()
      render()
    }
  })

  document.querySelectorAll('.deletePostBtn').forEach(button => {
    button.onclick = () => {
      const index = button.getAttribute('data-index')
      if(confirm('Delete this post?')){
        posts.splice(index, 1)
        savePosts()
        render()
      }
    }
  })

  document.querySelectorAll('.editPostBtn').forEach(button => {
    button.onclick = () => {
      const index = button.getAttribute('data-index')
      const newText = prompt('Edit your post:', posts[index].text)
      if(newText !== null && newText.trim() !== ''){
        posts[index].text = newText.trim()
        savePosts()
        render()
      }
    }
  })

  const editProfileBtn = document.getElementById('editProfileBtn')
  if(editProfileBtn){
    editProfileBtn.onclick = () => {
      const newName = prompt('Edit your name:', profileData.name)
      if(newName !== null && newName.trim() !== '') profileData.name = newName.trim()
      const newBio = prompt('Edit your bio:', profileData.bio)
      if(newBio !== null && newBio.trim() !== '') profileData.bio = newBio.trim()
      saveProfile()
      render()
    }
  }
}

window.addEventListener('hashchange', render)
render()
