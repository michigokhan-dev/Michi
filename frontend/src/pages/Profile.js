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
            post.media.map(m => m.type === 'video' ? `<video src="${m.src}" controls class="rounded-xl w-full max-h-80 bg-black"></video>` : `<img src="${m.src}" class="rounded-xl w-full max-h-80 object-cover">`).join('') + `</div>`
        }
        const commentsCount = post.comments ? post.comments.length : 0
        const commentsHtml = post.comments && post.comments.length > 0 ? post.comments.map(c => `<div class="flex gap-2 text-xs"><span class="font-bold">${c.user}:</span><span class="text-zinc-300">${c.text}</span></div>`).join('') : '<p class="text-xs text-zinc-500">No comments yet</p>'
        
        return `
        <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-3">
          <p class="text-sm">${post.text || ''}</p>
          ${mediaHtml}
          <div class="flex justify-between items-center mt-3">
            <p class="text-xs text-zinc-500">${post.likes || 0} likes • ${commentsCount} comments</p>
            <div class="flex gap-3 text-xs">
              <button data-index="${index}" class="editPostBtn text-zinc-400 hover:text-yellow-500">Edit</button>
              <button data-index="${index}" class="deletePostBtn text-zinc-400 hover:text-red-500">Delete</button>
            </div>
          </div>
          <div class="flex gap-4 mt-3 text-xs border-t border-zinc-800 pt-2">
            <button data-index="${index}" class="commentBtn text-zinc-400 hover:text-white">💬 Comment ${commentsCount > 0 ? `(${commentsCount})` : ''}</button>
          </div>
          <div id="comments-${index}" class="hidden mt-3 border-t border-zinc-800 pt-3">
            <div class="space-y-2 mb-3 max-h-32 overflow-y-auto">${commentsHtml}</div>
            <div class="flex gap-2">
              <input id="commentInput-${index}" placeholder="Write a comment..." class="flex-1 bg-zinc-800 rounded-full px-3 py-1.5 text-xs outline-none">
              <button data-index="${index}" class="postCommentBtn bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold">Post</button>
            </div>
          </div>
        </div>`
      }).join('')}
    </div>
  </div>`
}
