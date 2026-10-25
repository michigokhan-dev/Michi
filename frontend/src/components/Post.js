export function PostList(posts){
  return posts.map((post, index) => {
    let mediaHtml = ''
    if(post.media && post.media.length > 0){
      mediaHtml = `<div class="mt-3 grid ${post.media.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-2">` +
        post.media.map(m => {
          if(m.type === 'video'){
            return `<video src="${m.src}" controls class="rounded-xl w-full max-h-96 bg-black"></video>`
          } else {
            return `<img src="${m.src}" class="rounded-xl w-full max-h-96 object-cover">`
          }
        }).join('') + `</div>`
    } else if(post.photo){
      mediaHtml = `<img src="${post.photo}" class="mt-3 rounded-xl w-full max-h-96 object-cover">`
    }
    
    return `
  <div class="max-w-2xl mx-auto px-3 pb-3">
    <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
      <div class="flex gap-3 items-center">
        <img src="./IMG_3700.jpeg" class="w-10 h-10 rounded-full border border-yellow-600 object-cover">
        <div>
          <p class="font-semibold text-sm">You</p>
          <p class="text-xs text-zinc-500">Now • Luxury</p>
        </div>
      </div>
      <p class="mt-3 text-sm">${post.text || ''}</p>
      ${mediaHtml}
      <div class="flex gap-6 mt-4 text-sm border-t border-zinc-800 pt-3">
        <button data-index="${index}" class="likeBtn ${post.liked ? 'text-yellow-500 font-bold' : 'text-zinc-400'} hover:text-yellow-500">
          ${post.liked ? '♥ Liked' : '♡ Like'} ${post.likes > 0 ? `(${post.likes})` : ''}
        </button>
        <span class="text-zinc-400">💬 Comment</span>
        <span class="text-zinc-400">↗ Share</span>
      </div>
    </div>
  </div>
  `}).join('')
}
