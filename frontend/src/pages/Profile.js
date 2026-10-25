import { PostInput } from '../components/PostInput.js'

export function Profile(posts, profileData){
  const photo = profileData.photo || "./IMG_3700.jpeg"
  return `
  <div class="max-w-2xl mx-auto">
    <div class="bg-zinc-900 border-b border-zinc-800 p-6">
      <div class="flex gap-4 items-start">
        <div class="relative">
          <img src="${photo}" class="w-20 h-20 rounded-full border-2 border-yellow-500 object-cover">
          <button id="changePhotoBtn" class="absolute bottom-0 right-0 bg-yellow-500 text-black w-6 h-6 rounded-full text-xs font-bold">+</button>
          <input type="file" id="profilePhotoInput" accept="image/*" hidden>
        </div>
        <div class="flex-1">
          <h1 class="text-xl font-bold">${profileData.name}</h1>
          <p class="text-zinc-400 text-sm mt-1">${profileData.bio}</p>
          <div class="flex gap-6 mt-3 text-sm">
            <span><b>${posts.length}</b> Posts</span>
            <span><b>${profileData.followers}</b> Followers</span>
            <span><b>${profileData.following}</b> Following</span>
          </div>
        </div>
        <button id="editProfileBtn" class="border border-zinc-700 px-4 py-1.5 rounded-full text-sm hover:border-yellow-500 hover:text-yellow-500">Edit Profile</button>
      </div>
    </div>

    ${PostInput()}

    <div class="px-3 pb-3">
      <h2 class="font-bold mb-3 text-sm">Your Posts</h2>
      ${posts.map((post, index) => {
        let mediaHtml = ''
        if(post.media && post.media.length > 0){
          mediaHtml = `<div class="mt-3 grid ${post.media.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-2">` +
            post.media.map(m => {
              if(m.type === 'video'){
                return `<video src="${m.src}" controls class="rounded-xl w-full max-h-80 bg-black"></video>`
              } else {
                return `<img src="${m.src}" class="rounded-xl w-full max-h-80 object-cover">`
              }
            }).join('') + `</div>`
        } else if(post.photo){
          mediaHtml = `<img src="${post.photo}" class="mt-3 rounded-xl w-full max-h-80 object-cover">`
        }
        
        return `
        <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-3">
          <p class="text-sm">${post.text || ''}</p>
          ${mediaHtml}
          <div class="flex justify-between items-center mt-3">
            <p class="text-xs text-zinc-500">${post.likes || 0} likes • Now</p>
            <div class="flex gap-3 text-xs">
              <button data-index="${index}" class="editPostBtn text-zinc-400 hover:text-yellow-500">Edit</button>
              <button data-index="${index}" class="deletePostBtn text-zinc-400 hover:text-red-500">Delete</button>
            </div>
          </div>
        </div>`
      }).join('')}
    </div>
  </div>`
}
