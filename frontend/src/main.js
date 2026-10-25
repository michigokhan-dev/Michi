let defaultPosts = [{ text: "Welcome to MICHI - Black background, Gold soul. This is luxury social. ✨", liked: false, likes: 0, media: [] }]
let defaultProfile = { name: "Michi Ayaydin", bio: "Luxury mind • Black & Gold soul ✨", followers: 342, following: 128, photo: null }

function loadPosts(){ try{ const s=localStorage.getItem('michi_posts'); return s?JSON.parse(s):defaultPosts }catch(e){ return defaultPosts } }
function loadProfile(){ try{ const s=localStorage.getItem('michi_profile'); return s?JSON.parse(s):defaultProfile }catch(e){ return defaultProfile } }
function loadNotifications(){ try{ const s=localStorage.getItem('michi_notifications'); return s?JSON.parse(s):[] }catch(e){ return [] } }

let posts = loadPosts()
let profileData = loadProfile()
let notifications = loadNotifications()

function savePosts(){ localStorage.setItem('michi_posts', JSON.stringify(posts)) }
function saveProfile(){ localStorage.setItem('michi_profile', JSON.stringify(profileData)) }
function saveNotifications(){ localStorage.setItem('michi_notifications', JSON.stringify(notifications)) }

let Comps = {}
async function load(){
  const t=Date.now()
  Comps.Navbar = (await import(`./components/Navbar.js?t=${t}`)).Navbar
  Comps.SearchBar = (await import(`./components/SearchBar.js?t=${t}`)).SearchBar
  Comps.PostInput = (await import(`./components/PostInput.js?t=${t}`)).PostInput
  Comps.Story = (await import(`./components/Story.js?t=${t}`)).Story
  Comps.PostList = (await import(`./components/Post.js?t=${t}`)).PostList
  Comps.Profile = (await import(`./pages/Profile.js?t=${t}`)).Profile
  Comps.BottomNav = (await import(`./components/BottomNav.js?t=${t}`)).BottomNav
  Comps.NotificationsPage = (await import(`./pages/Notifications.js?t=${t}`)).NotificationsPage
}

async function render(){
  if(!Comps.Navbar) await load()
  const page = location.hash.replace('#','') || 'feed'
  
  let content = ''
  if(page === 'profile'){ content = Comps.Profile(posts, profileData) }
  else if(page === 'notifications'){ content = Comps.NotificationsPage(notifications) }
  else { content = `${Comps.SearchBar()}${Comps.Story()}${Comps.PostInput()}${Comps.PostList(posts)}` }

  document.getElementById('app').innerHTML = `${Comps.Navbar(notifications.length)}<div class="pb-20">${content}</div>${Comps.BottomNav(page, notifications.length)}`
  
  const input=document.getElementById('postInput')
  const btn=document.getElementById('shareBtn')
  
  window.selectedMedia = window.selectedMedia || []
  
  function addPost(){
    const text=input?.value.trim()
    const media=window.selectedMedia
    if(!text && media.length===0) return
    posts.unshift({ text: text||'', media: [...media], liked: false, likes: 0 })
    savePosts()
    window.selectedMedia=[]
    if(input) input.value=''
    const preview=document.getElementById('postPhotoPreview')
    if(preview) preview.classList.add('hidden')
    document.getElementById('previewGrid').innerHTML=''
    render()
  }
  
  if(btn && input){ btn.onclick=addPost; input.onkeydown=(e)=>{ if(e.key==='Enter') addPost() } }
  
  document.querySelectorAll('.likeBtn').forEach(b=>{ b.onclick=()=>{ const i=b.getAttribute('data-index'); posts[i].liked=!posts[i].liked; posts[i].likes+=posts[i].liked?1:-1; savePosts(); render() } })
  document.querySelectorAll('.deletePostBtn').forEach(b=>{ b.onclick=()=>{ const i=b.getAttribute('data-index'); if(confirm('Delete this post?')){ posts.splice(i,1); savePosts(); render() } } })
  document.querySelectorAll('.editPostBtn').forEach(b=>{ b.onclick=()=>{ const i=b.getAttribute('data-index'); const nt=prompt('Edit your post:', posts[i].text); if(nt!==null && nt.trim()!==''){ posts[i].text=nt.trim(); savePosts(); render() } } })
  
  const editProfileBtn=document.getElementById('editProfileBtn')
  if(editProfileBtn){ editProfileBtn.onclick=()=>{ const nn=prompt('Edit your name:', profileData.name); if(nn!==null && nn.trim()!=='') profileData.name=nn.trim(); const nb=prompt('Edit your bio:', profileData.bio); if(nb!==null && nb.trim()!=='') profileData.bio=nb.trim(); saveProfile(); render() } }

  const changePhotoBtn=document.getElementById('changePhotoBtn')
  const profilePhotoInput=document.getElementById('profilePhotoInput')
  if(changePhotoBtn && profilePhotoInput){
    changePhotoBtn.onclick=()=>profilePhotoInput.click()
    profilePhotoInput.onchange=(e)=>{
      const file=e.target.files[0]; if(!file) return
      const reader=new FileReader()
      reader.onload=(ev)=>{
        const newPhoto=ev.target.result
        profileData.photo=newPhoto; saveProfile(); localStorage.setItem('michi_profile_photo', newPhoto)
        const notif={ id: Date.now(), userName: profileData.name, photo: newPhoto, likes: 0, liked: false }
        notifications.unshift(notif); saveNotifications(); render()
      }
      reader.readAsDataURL(file)
    }
  }

  const postInputAvatar=document.getElementById('postInputAvatar')
  if(postInputAvatar){ const sp=localStorage.getItem('michi_profile_photo')||profileData.photo; if(sp) postInputAvatar.src=sp }

  const postPhotoInput=document.getElementById('postPhotoInput')
  const postPhotoPreview=document.getElementById('postPhotoPreview')
  const previewGrid=document.getElementById('previewGrid')
  const removePhotoBtn=document.getElementById('removePhotoBtn')

  if(postPhotoInput){
    postPhotoInput.onchange=(e)=>{
      const files=Array.from(e.target.files); if(files.length===0) return
      window.selectedMedia=window.selectedMedia||[]
      let loaded=0
      files.forEach(file=>{
        const reader=new FileReader()
        reader.onload=(ev)=>{
          const type=file.type.startsWith('video')?'video':'image'
          window.selectedMedia.push({ type, src: ev.target.result })
          loaded++
          if(loaded===files.length){
            previewGrid.innerHTML=window.selectedMedia.map((m,i)=>`
              <div class="relative">
                ${m.type==='video'?`<video src="${m.src}" class="rounded-xl w-full h-32 object-cover"></video>`:`<img src="${m.src}" class="rounded-xl w-full h-32 object-cover">`}
                <button data-i="${i}" class="removeSingleMedia absolute top-1 right-1 bg-black/70 text-white w-5 h-5 rounded-full text-xs">✕</button>
              </div>`).join('')
            postPhotoPreview.classList.remove('hidden')
            document.querySelectorAll('.removeSingleMedia').forEach(b=>{
              b.onclick=()=>{ const idx=parseInt(b.getAttribute('data-i')); window.selectedMedia.splice(idx,1); b.closest('.grid').innerHTML=window.selectedMedia.map((m,i2)=>`
                <div class="relative">${m.type==='video'?`<video src="${m.src}" class="rounded-xl w-full h-32 object-cover"></video>`:`<img src="${m.src}" class="rounded-xl w-full h-32 object-cover">`}
                <button data-i="${i2}" class="removeSingleMedia absolute top-1 right-1 bg-black/70 text-white w-5 h-5 rounded-full text-xs">✕</button></div>`).join(''); if(window.selectedMedia.length===0) postPhotoPreview.classList.add('hidden')
              }
            })
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  if(removePhotoBtn){ removePhotoBtn.onclick=()=>{ window.selectedMedia=[]; postPhotoPreview.classList.add('hidden'); previewGrid.innerHTML=''; postPhotoInput.value='' } }

  document.querySelectorAll('.likeNotifBtn').forEach(b=>{ b.onclick=()=>{ const i=b.getAttribute('data-index'); notifications[i].liked=!notifications[i].liked; notifications[i].likes+=notifications[i].liked?1:-1; saveNotifications(); render() } })
  document.querySelectorAll('.closeNotifBtn').forEach(b=>{ b.onclick=()=>{ const i=b.getAttribute('data-index'); notifications.splice(i,1); saveNotifications(); render() } })
}

window.addEventListener('hashchange', render)
render()
