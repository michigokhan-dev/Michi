import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// Use the same values as signin.html
const SUPABASE_URL = 'https://txfusknysukvfujpiemi.supabase.co';
const SUPABASE_KEY = 'sb_publishable_F6BDYU87xNKou69jz6JnLA_GkU7c1x_';

const michiSupabase = createClient(SUPABASE_URL, SUPABASE_KEY);

let michiAuthSession = null;


let michiCurrentProfile = null;

async function loadMichiUserProfile(session) {
  if (!session?.user) {
    michiCurrentProfile = null;
    return;
  }

  const user = session.user;

  const { data, error } = await michiSupabase
    .from('Profiles')
    .select('id, username, full_name, avatar_url, bio')
    .eq('id', user.id)
    .maybeSingle();

  if (error) {
    console.error('MICHI profile loading error:', error);
  }

  michiCurrentProfile = {
    id: user.id,
    username: data?.username || user.user_metadata?.username || '',
    full_name:
      data?.full_name ||
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split('@')[0] ||
      'MICHI User',
    avatar_url: data?.avatar_url || null,
    bio: data?.bio || ''
  };

  profileData.name = michiCurrentProfile.full_name;

  if (michiCurrentProfile.bio) {
    profileData.bio = michiCurrentProfile.bio;
  }

  await saveProfile();
}


window.michiAuthButtonClick = async function () {
  const { data, error } = await michiSupabase.auth.getSession();

  if (error) {
    alert('Unable to check sign-in status. Please try again.');
    return;
  }

  if (!data.session) {
    window.location.href = './signin.html';
    return;
  }

  const { error: signOutError } = await michiSupabase.auth.signOut();

  if (signOutError) {
    alert('Sign out failed. Please try again.');
  }
};


michiSupabase.auth.onAuthStateChange(async (_event, session) => {
  michiAuthSession = session;

  const authButton = document.getElementById('michiAuthButton');

  if (authButton) {
    authButton.textContent = session
      ? 'Sign out'
      : 'Sign in / Sign up';
  }

  await loadMichiUserProfile(session);
  await loadSupabaseNotifications();

  if (typeof render === 'function') {
    render();
  }
});



let defaultPosts = [{ text: "Welcome to MICHI - Black background, Gold soul. This is luxury social. ✨", liked: false, likes: 0, media: [], comments: [] }]
let defaultProfile = { name: "Michi Ayaydin", bio: "Luxury mind • Black & Gold soul ✨", followers: 342, following: 128, photo: null }

let posts = [...defaultPosts]
let profileData = {...defaultProfile}
let notifications = []
let draftMedia = []

async function loadSupabaseNotifications() {
  if (!michiAuthSession?.user) {
    notifications = [];
    return;
  }

  const { data, error } = await michiSupabase
    .from('Notifications')
    .select(`
      id,
      user_id,
      actor_id,
      type,
      post_id,
      comment_id,
      message,
      is_read,
      created_at,
      actor:Profiles!Notifications_actor_id_fkey (
        username,
        full_name,
        avatar_url
      )
    `)
    .eq('user_id', michiAuthSession.user.id)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('MICHI notifications loading error:', error);
    return;
  }

  notifications = data || [];
}

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


async function savePosts() {
  try {
    await idbSet('michi_posts', posts);

    localStorage.setItem(
      'michi_posts_backup',
      JSON.stringify(
        posts.map(p => ({
          text: p.text,
          liked: p.liked,
          likes: p.likes,
          media: [],
          comments: p.comments || []
        }))
      )
    );

    if (!michiAuthSession?.user) {
      console.warn('MICHI: Sign in to sync posts with Supabase.');
      return;
    }

    const rows = posts
      .filter(p => p.supabaseId)
      .map(p => ({
        Id: p.supabaseId,
        user_id: michiAuthSession.user.id,
        content: p.text || '',
        media_url: null,
        likes_count: p.likes || 0
      }));

    if (rows.length > 0) {
      const { error } = await michiSupabase
        .from('Posts')
        .upsert(rows, { onConflict: 'Id' });

      if (error) {
        console.error('MICHI posts sync error:', error);
      }
    }
  } catch (e) {
    console.error('MICHI savePosts error:', e);
  }
}

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




async function loadSupabasePosts() {
  if (!michiAuthSession?.user) return;

  const { data, error } = await michiSupabase
    .from('Posts')
    .select('Id, user_id, content, media_url, likes_count, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('MICHI posts loading error:', error);
    return;
  }

  posts = (data || []).map(post => ({
    supabaseId: post.Id,
    user_id: post.user_id,
    text: post.content || '',
    media: [],
    liked: false,
    likes: post.likes_count || 0,
    comments: [],
    created_at: post.created_at
  }));

  await idbSet('michi_posts', posts);
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
  else { content = `${Comps.SearchBar()}${Comps.Story()}${Comps.PostInput()}${Comps.PostList(posts, profileData)}` }

  const unreadCount = notifications.filter(n => !n.is_read).length;

document.getElementById('app').innerHTML =
  `${Comps.Navbar(unreadCount)}<div class="pb-20">${content}</div>${Comps.BottomNav(page, unreadCount)}`;
  const authButton = document.getElementById('michiAuthButton');

if (authButton) {
  authButton.textContent = michiAuthSession
    ? 'Sign out'
    : 'Sign in / Sign up';
}
  
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
  
  
async function addPost() {
  if (!michiAuthSession?.user) {
    alert('Please sign in to create a post.');
    window.location.href = './signin.html';
    return;
  }

  const text = input?.value.trim();

  if (!text && draftMedia.length === 0) return;

  const { data, error } = await michiSupabase
    .from('Posts')
    .insert({
      user_id: michiAuthSession.user.id,
      content: text || '',
      media_url: null,
      likes_count: 0
    })
    .select('Id, user_id, content, media_url, likes_count, created_at')
    .single();

  if (error) {
    console.error('MICHI post creation error:', error);
    alert('Could not publish your post. Please try again.');
    return;
  }

  posts.unshift({
    supabaseId: data.Id,
    user_id: data.user_id,
    text: data.content,
    media: [...draftMedia],
    liked: false,
    likes: data.likes_count || 0,
    comments: [],
    created_at: data.created_at
  });

  await savePosts();

  draftMedia = [];

  if (input) input.value = '';
  if (postPhotoPreview) postPhotoPreview.classList.add('hidden');
  if (previewGrid) previewGrid.innerHTML = '';

  const fileInput = document.getElementById('postPhotoInput');
  if (fileInput) fileInput.value = '';

  render();
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

    // Mark one notification as read
  document.querySelectorAll('.markNotificationRead').forEach(button => {
    button.onclick = async (event) => {
      event.stopPropagation();

      const notificationId = button.dataset.id;

      if (!michiAuthSession?.user) {
        window.location.href = './signin.html';
        return;
      }

      const { error } = await michiSupabase
        .from('Notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('user_id', michiAuthSession.user.id);

      if (error) {
        console.error('Mark notification read error:', error);
        alert('Could not update notification. Please try again.');
        return;
      }

      await loadSupabaseNotifications();
      render();
    };
  });

  // Mark all notifications as read
  const markAllButton = document.getElementById('markAllNotificationsRead');

  if (markAllButton) {
    markAllButton.onclick = async () => {
      if (!michiAuthSession?.user) return;

      const { error } = await michiSupabase
        .from('Notifications')
        .update({ is_read: true })
        .eq('user_id', michiAuthSession.user.id)
        .eq('is_read', false);

      if (error) {
        console.error('Mark all notifications read error:', error);
        alert('Could not update notifications. Please try again.');
        return;
      }

      await loadSupabaseNotifications();
      render();
    };
  }

    // Open notification and navigate to its post
  document.querySelectorAll('.openNotification').forEach(button => {
    button.onclick = async () => {
      const index = Number(button.dataset.index);
      const notification = notifications[index];
      if (!notification) return;

      if (!notification.is_read && michiAuthSession?.user) {
        const { error } = await michiSupabase
          .from('Notifications')
          .update({ is_read: true })
          .eq('id', notification.id)
          .eq('user_id', michiAuthSession.user.id);

        if (error) {
          console.error('Mark notification read error:', error);
        } else {
          notification.is_read = true;
        }
      }

      await loadSupabaseNotifications();

      if (notification.post_id) {
        location.hash = 'feed';
        render();
      } else {
        location.hash = 'notifications';
        render();
      }
    };
  });
  
  document.querySelectorAll('.likeNotifBtn').forEach(b=>{ b.onclick=()=>{ const i=b.getAttribute('data-index'); notifications[i].liked=!notifications[i].liked; notifications[i].likes+=notifications[i].liked?1:-1; saveNotifications(); render() } })
  document.querySelectorAll('.closeNotifBtn').forEach(b=>{ b.onclick=()=>{ const i=b.getAttribute('data-index'); notifications.splice(i,1); saveNotifications(); render() } })
}

// GALERIYI AC - TIKLAYINCA DIKEY FULL EKRAN
window.openMediaGallery = (postIndex, mediaIndex)=>{
  const post = posts[postIndex]
  const content = document.getElementById('galleryContent')
  const gallery = document.getElementById('mediaGallery')
  
  content.innerHTML = post.media.map((m, mi)=>`
    <div class="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800" id="g-item-${mi}">
      ${m.type==='video'
        ? `<video src="${m.src}" controls class="w-full max-h-[75vh] object-contain bg-black"></video>`
        : `<img src="${m.src}" class="w-full max-h-[75vh] object-contain bg-black">`
      }
      <div class="p-4">
        <div class="flex gap-6 text-sm text-white">
          <button class="likeMediaBtn font-semibold" data-post="${postIndex}" data-media="${mi}">${m.liked?'♥':'♡'} ${m.likes||0} Like</button>
          <button class="text-gray-400">💬 ${m.comments?.length||0} Yorum</button>
        </div>
        <div class="mt-3 space-y-2 text-sm text-white">
          ${(m.comments||[]).map(c=>`<div><span class="font-bold">${c.user}</span> ${c.text}</div>`).join('')}
        </div>
        <div class="mt-4 flex gap-2">
          <input id="mComment-${postIndex}-${mi}" placeholder="Yorum yaz..." class="flex-1 bg-black border border-zinc-700 rounded-full px-4 py-2 text-sm text-white">
          <button class="postMediaCommentBtn bg-[#D4AF37] text-black px-5 rounded-full text-sm font-bold" data-post="${postIndex}" data-media="${mi}">Gönder</button>
        </div>
      </div>
    </div>
  `).join('')
  
  gallery.classList.remove('hidden')
  document.body.style.overflow='hidden'
  setTimeout(()=> document.getElementById(`g-item-${mediaIndex}`)?.scrollIntoView({behavior:'smooth', block:'center'}), 150)
  
  // Like ve comment eventleri
  content.querySelectorAll('.likeMediaBtn').forEach(b=>{
    b.onclick=()=>{
      const pi=b.dataset.post, mi=b.dataset.media
      const media = posts[pi].media[mi]
      media.liked=!media.liked
      media.likes=(media.likes||0)+(media.liked?1:-1)
      savePosts(); openMediaGallery(pi, mi); render()
    }
  })
  content.querySelectorAll('.postMediaCommentBtn').forEach(b=>{
    b.onclick=()=>{
      const pi=b.dataset.post, mi=b.dataset.media
      const inp=document.getElementById(`mComment-${pi}-${mi}`)
      if(!inp.value.trim()) return
      const media = posts[pi].media[mi]
      if(!media.comments) media.comments=[]
      media.comments.push({ user: profileData.name, text: inp.value.trim() })
      savePosts(); openMediaGallery(pi, mi); render()
    }
  })
}

document.getElementById('closeGallery').onclick=()=>{
  document.getElementById('mediaGallery').classList.add('hidden')
  document.body.style.overflow='auto'
}


loadAll().then(async () => {
  await load();

  const { data, error } = await michiSupabase.auth.getSession();

  if (error) {
    console.error('MICHI session loading error:', error);
  }

  michiAuthSession = data?.session || null;

if (michiAuthSession) {
  await loadMichiUserProfile(michiAuthSession);
  await loadSupabasePosts();
  await loadSupabaseNotifications();
}

render();
});

window.addEventListener('hashchange', render);

