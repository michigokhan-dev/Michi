let defaultPosts = [{ text: "Welcome to MICHI - Black background, Gold soul. This is luxury social. ✨", liked: false, likes: 0, media: [], comments: [] }]
let defaultProfile = { name: "Michi Ayaydin", bio: "Luxury mind • Black & Gold soul ✨", followers: 342, following: 128, photo: null }

let posts = [...defaultPosts]
let profileData = {...defaultProfile}
let notifications = []
let draftMedia = []

// === SIKISTIRMA - OTOMATIK ===
function compressImage(dataUrl, maxW=800, quality=0.7){
  return new Promise((resolve)=>{
    const img = new Image()
    img.onload = ()=>{
      let w = img.width, h = img.height
      if(w > maxW){ h = h * maxW / w; w = maxW }
      const canvas = document.createElement('canvas')
      canvas.width = w; canvas.height = h
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, w, h)
      resolve(canvas.toDataURL('image/jpeg', quality))
    }
    img.src = dataUrl
  })
}

// === INDEXEDDB - 50MB YER ===
const DB_NAME = 'michi_db'
function getDB(){
  return new Promise((res, rej)=>{
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = ()=>{ req.result.createObjectStore('kv') }
    req.onsuccess = ()=> res(req.result)
    req.onerror = ()=> rej(req.error)
  })
}
async function idbSet(k, v){
  const db = await getDB()
  return new Promise((res, rej)=>{
    const tx = db.transaction('kv','readwrite')
    tx.objectStore('kv').put(v, k)
    tx.oncomplete = ()=> res()
    tx.onerror = ()=> rej(tx.error)
  })
}
async function idbGet(k){
  const db = await getDB()
  return new Promise((res, rej)=>{
    const tx = db.transaction('kv','readonly')
    const req = tx.objectStore('kv').get(k)
    req.onsuccess = ()=> res(req.result)
    req.onerror = ()=> rej(req.error)
  })
}

async function savePosts(){ try{ await idbSet('michi_posts', posts); localStorage.setItem('michi_posts_backup', JSON.stringify(posts.map(p=>({text:p.text, liked:p.liked, likes:p.likes, media:[], comments:p.comments||[]})))) }catch(e){} }
async function saveProfile(){ try{ await idbSet('michi_profile', profileData); localStorage.setItem('michi_profile', JSON.stringify(profileData)) }catch(e){} }
async function saveNotifications(){ try{ await idbSet('michi_notifications', notifications); localStorage.setItem('michi_notifications', JSON.stringify(notifications)) }catch(e){} }

async function loadAll(){
  try{
    const p = await idbGet('michi_posts')
    const pr = await idbGet('michi_profile')
    const n = await idbGet('michi_notifications')
    if(p) posts = p
    else { const s=localStorage.getItem('michi_posts'); if(s) posts = JSON.parse(s) }
    if(pr) profileData = pr
    else { const s=localStorage.getItem('michi_profile'); if(s) profileData = JSON.parse(s) }
    if(n) notifications = n
    else { const s=localStorage.getItem('michi_notifications'); if(s) notifications = JSON.parse(s) }
  }catch(e){
    try{ const s=localStorage.getItem('michi_posts'); if(s) posts = JSON.parse(s) }catch{}
  }
}

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
  
  const previewGrid = document.getElementById('previewGrid')
  const postPhotoPreview = document.getElementById('postPhotoPreview')
  if(previewGrid && draftMedia.length > 0){
    postPhotoPreview.classList.remove('hidden')
    previewGrid.innerHTML = draftMedia.map((m,i)=>`
      <div class="relative">
        ${m.type==='video'?`<video src="${m.src}" class="rounded-xl w-full h-32 object-cover"></video>`:`<img src="${m.src}" class="rounded-xl w-full h-32 object-cover">`}
        <button data-i="${i}" class="removeSingleMedia absolute top-1 right-1 bg-black/70 text-white w-5 h-5 rounded-full text-xs">✕</button>
      </div>`).join('')
  }
  
  const input=document.getElementById('postInput')
  const btn=document.getElementById('shareBtn')
  
  function addPost(){
    const text=input?.value.trim()
    if(!text && draftMedia.length===0) return
    posts.unshift({ text: text||'', media: [...draftMedia], liked: false, likes: 0, comments: [] })
    savePosts()
    draftMedia = []
    if(input) input.value=''
    if(postPhotoPreview) postPhotoPreview.classList.add('hidden')
    if(previewGrid) previewGrid.innerHTML=''
    const fileInput=document.getElementById('postPhotoInput')
    if(fileInput) fileInput.value=''
    render()
  }
  
  if(btn && input){ btn.onclick=addPost; input.onkeydown=(e)=>{ if(e.key==='Enter') addPost() } }
  
  document.querySelectorAll('.likeBtn').forEach(b=>{ b.onclick=()=>{ const i=b.getAttribute('data-index'); posts[i].liked=!posts[i].liked; posts[i].likes+=posts[i].liked?1:-1; savePosts(); render() } })
  document.querySelectorAll('.deletePostBtn').forEach(b=>{ b.onclick=()=>{ const i=b.getAttribute('data-index'); if(confirm('Delete this post?')){ posts.splice(i,1); savePosts(); render() } } })
  document.querySelectorAll('.editPostBtn').forEach(b=>{ b.onclick=()=>{ const i=b.getAttribute('data-index'); const nt=prompt('Edit your post:', posts[i].text); if(nt!==null && nt.trim()!==''){ posts[i].text=nt.trim(); savePosts(); render() } } })
  
  document.querySelectorAll('.commentBtn').forEach(b=>{
    b.onclick=()=>{
      const i=b.getAttribute('data-index')
      const box=document.getElementById(`comments-${i}`)
      if(box) box.classList.toggle('hidden')
    }
  })

  function addComment(index, text){
    if(!text.trim()) return
    if(!posts[index].comments) posts[index].comments = []
    posts[index].comments.push({ user: profileData.name, text: text.trim(), time: 'Now' })
    savePosts()
    render()
    setTimeout(()=>{
      const box=document.getElementById(`comments-${index}`)
      if(box) box.classList.remove('hidden')
    },100)
  }

  document.querySelectorAll('.postCommentBtn').forEach(b=>{
    b.onclick=()=>{
      const i=b.getAttribute('data-index')
      const inp=document.getElementById(`commentInput-${i}`)
      if(inp){ addComment(i, inp.value); inp.value='' }
    }
  })

  document.querySelectorAll('[id^="commentInput-"]').forEach(inp=>{
    inp.onkeydown=(e)=>{
      if(e.key==='Enter'){
        const i=inp.id.split('-')[1]
        addComment(i, inp.value)
        inp.value=''
      }
    }
  })
  
  const editProfileBtn=document.getElementById('editProfileBtn')
  if(editProfileBtn){ editProfileBtn.onclick=()=>{ const nn=prompt('Edit your name:', profileData.name); if(nn!==null && nn.trim()!=='') profileData.name=nn.trim(); const nb=prompt('Edit your bio:', profileData.bio); if(nb!==null && nb.trim()!=='') profileData.bio=nb.trim(); saveProfile(); render() } }

  const changePhotoBtn=document.getElementById('changePhotoBtn')
  const profilePhotoInput=document.getElementById('profilePhotoInput')
  if(changePhotoBtn && profilePhotoInput){
    changePhotoBtn.onclick=()=>profilePhotoInput.click()
    profilePhotoInput.onchange=(e)=>{
      const file=e.target.files[0]; if(!file) return
      const reader=new FileReader()
      reader.onload=async (ev)=>{
        let newPhoto=ev.target.result
        // OTOMATIK SIKISTIRMA
        newPhoto = await compressImage(newPhoto, 400, 0.8)
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
  if(postPhotoInput){
    postPhotoInput.onchange=(e)=>{
      const files=Array.from(e.target.files); if(files.length===0) return
      files.forEach(file=>{
        const reader=new FileReader()
        reader.onload=async (ev)=>{
          let src = ev.target.result
          const type=file.type.startsWith('video')?'video':'image'
          // OTOMATIK SIKISTIRMA - user 5MB atsa 200KB oluyor
          if(type==='image'){
            src = await compressImage(src, 800, 0.7)
          }
          draftMedia.push({ type, src })
          const grid=document.getElementById('previewGrid')
          const preview=document.getElementById('postPhotoPreview')
          if(grid && preview){
            preview.classList.remove('hidden')
            grid.innerHTML=draftMedia.map((m,i)=>`
              <div class="relative">
                ${m.type==='video'?`<video src="${m.src}" class="rounded-xl w-full h-32 object-cover"></video>`:`<img src="${m.src}" class="rounded-xl w-full h-32 object-cover">`}
                <button data-i="${i}" class="removeSingleMedia absolute top-1 right-1 bg-black/70 text-white w-5 h-5 rounded-full text-xs">✕</button>
              </div>`).join('')
            document.querySelectorAll('.removeSingleMedia').forEach(btn=>{
              btn.onclick=()=>{ const idx=parseInt(btn.getAttribute('data-i')); draftMedia.splice(idx,1); render() }
            })
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removePhotoBtn=document.getElementById('removePhotoBtn')
  if(removePhotoBtn){ removePhotoBtn.onclick=()=>{ draftMedia=[]; const p=document.getElementById('postPhotoPreview'); const g=document.getElementById('previewGrid'); if(p) p.classList.add('hidden'); if(g) g.innerHTML=''; const fi=document.getElementById('postPhotoInput'); if(fi) fi.value='' } }

  document.querySelectorAll('.removeSingleMedia').forEach(btn=>{
    btn.onclick=()=>{
      const idx=parseInt(btn.getAttribute('data-i'))
      draftMedia.splice(idx,1)
      render()
    }
  })

  document.querySelectorAll('.likeNotifBtn').forEach(b=>{ b.onclick=()=>{ const i=b.getAttribute('data-index'); notifications[i].liked=!notifications[i].liked; notifications[i].likes+=notifications[i].liked?1:-1; saveNotifications(); render() } })
  document.querySelectorAll('.closeNotifBtn').forEach(b=>{ b.onclick=()=>{ const i=b.getAttribute('data-index'); notifications.splice(i,1); saveNotifications(); render() } })
}

loadAll().then(()=>{
  load().then(render)
})
window.addEventListener('hashchange', render)
