let defaultPosts = [
  { text: "Welcome to MICHI - Black background, Gold soul. This is luxury social. ✨", liked: false, likes: 0 }
]

let defaultProfile = {
  name: "Michi Ayaydin",
  bio: "Luxury mind • Black & Gold soul ✨",
  followers: 342,
  following: 128,
  photo: null
}

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

function loadNotifications(){
  try{
    const saved = localStorage.getItem('michi_notifications')
    return saved ? JSON.parse(saved) : []
  }catch(e){ return [] }
}

let posts = loadPosts()
let profileData = loadProfile()
let notifications = loadNotifications()

function savePosts(){ localStorage.setItem('michi_posts', JSON.stringify(posts)) }
function saveProfile(){ localStorage.setItem('michi_profile', JSON.stringify(profileData)) }
function saveNotifications(){ localStorage.setItem('michi_notifications', JSON.stringify(notifications)) }

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
  Comps.NotificationList = (await import(`./components/Notification.js?t=${t}`)).NotificationList
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
      ${Comps.NotificationList(notifications)}
      ${Comps.Story()}
      ${Comps.PostInput()}
      ${Comps.PostList(posts)}
    `
  }

  document.getElementById('app').innerHTML = `
    ${Comps.Navbar(notifications.length)}
    <div class="pb-20">${content}</div>
    ${Comps.BottomNav(page)}
  `
  
  const input = document.getElementById('postInput')
  const btn = document.getElementById('shareBtn')
  
  function addPost(){
    const text = input?.value.trim()
    const photo = window.selectedPostPhoto
    if(!text && !photo) return
    posts.unshift({ text: text || '', photo: photo || null, liked: false, likes: 0 })
    savePosts()
    window.selectedPostPhoto = null
    if(input) input.value = ''
    const preview = document.getElementById('postPhotoPreview')
    if(preview) preview.classList.add('hidden')
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

  // Profile photo change -> Notification to friends
  const changePhotoBtn = document.getElementById('changePhotoBtn')
  const profilePhotoInput = document.getElementById('profilePhotoInput')
  if(changePhotoBtn && profilePhotoInput){
    changePhotoBtn.onclick = () => profilePhotoInput.click()
    profilePhotoInput.onchange = (e) => {
      const file = e.target.files[0]
      if(!file) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        const newPhoto = ev.target.result
        profileData.photo = newPhoto
        saveProfile()
        localStorage.setItem('michi_profile_photo', newPhoto)
        
        // Create notification for friends
        const notif = {
          id: Date.now(),
          userName: profileData.name,
          photo: newPhoto,
          text: `${profileData.name} changed profile photo`,
          likes: 0,
          liked: false,
          time: new Date().toISOString()
        }
        notifications.unshift(notif)
        saveNotifications()
        render()
        
        // Show toast
        alert(`Notification sent to friends: ${profileData.name} changed profile photo`)
      }
      reader.readAsDataURL(file)
    }
  }

  const postInputAvatar = document.getElementById('postInputAvatar')
  if(postInputAvatar){
    const savedPhoto = localStorage.getItem('michi_profile_photo') || profileData.photo
    if(savedPhoto) postInputAvatar.src = savedPhoto
  }

  // Post photo upload
  const postPhotoInput = document.getElementById('postPhotoInput')
  const postPhotoPreview = document.getElementById('postPhotoPreview')
  const previewImg = document.getElementById('previewImg')
  const removePhotoBtn = document.getElementById('removePhotoBtn')

  if(postPhotoInput){
    postPhotoInput.onchange = (e) => {
      const file = e.target.files[0]
      if(!file) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        window.selectedPostPhoto = ev.target.result
        previewImg.src = ev.target.result
        postPhotoPreview.classList.remove('hidden')
      }
      reader.readAsDataURL(file)
    }
  }

  if(removePhotoBtn){
    removePhotoBtn.onclick = () => {
      window.selectedPostPhoto = null
      postPhotoPreview.classList.add('hidden')
      postPhotoInput.value = ''
    }
  }

  // Notification actions
  document.querySelectorAll('.likeNotifBtn').forEach(button => {
    button.onclick = () => {
      const index = button.getAttribute('data-index')
      notifications[index].liked = !notifications[index].liked
      notifications[index].likes += notifications[index].liked ? 1 : -1
      saveNotifications()
      render()
    }
  })

  document.querySelectorAll('.closeNotifBtn').forEach(button => {
    button.onclick = () => {
      const index = button.getAttribute('data-index')
      notifications.splice(index, 1)
      saveNotifications()
      render()
    }
  })
}

window.addEventListener('hashchange', render)
render()
