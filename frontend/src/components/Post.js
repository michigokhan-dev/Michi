export function PostList(posts, profileData){
  const displayName = profileData?.name || 'MICHI User';
  const profilePhoto = profileData?.photo || './IMG_3700.jpeg';

  return posts.map((post, index) => {
    let mediaHtml = '';

    if(post.media && post.media.length > 0){
      mediaHtml = `<div class="mt-3 grid ${post.media.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-2">` +
        post.media.map((m, mi) => {
          const mLikes = m.likes || 0;
          const mComments = m.comments ? m.comments.length : 0;
          const mLiked = m.liked ? '♥' : '♡';

          if(m.type === 'video'){
            return `<div class="relative cursor-pointer group" onclick="openMediaGallery(${index}, ${mi})">
              <video src="${m.src}" class="rounded-xl w-full max-h-96 bg-black pointer-events-none"></video>
              <div class="absolute bottom-2 left-2 bg-black/70 text-white text-[11px] px-2.5 py-1 rounded-full">${mLiked} ${mLikes} • 💬 ${mComments}</div>
              <div class="absolute inset-0 bg-white/0 group-hover:bg-white/5 rounded-xl transition"></div>
            </div>`;
          } else {
            return `<div class="relative cursor-pointer group" onclick="openMediaGallery(${index}, ${mi})">
              <img src="${m.src}" class="rounded-xl w-full max-h-96 object-cover group-hover:brightness-110 transition">
              <div class="absolute bottom-2 left-2 bg-black/70 text-white text-[11px] px-2.5 py-1 rounded-full">${mLiked} ${mLikes} • 💬 ${mComments}</div>
            </div>`;
          }
        }).join('') + `</div>`;
    }

    const commentsCount = post.comments ? post.comments.length : 0;

    const commentsHtml = post.comments && post.comments.length > 0
      ? post.comments.map(c => `<div class="flex gap-2 text-xs"><span class="font-bold">${c.user || 'MICHI User'}:</span><span class="text-zinc-300">${c.text || ''}</span></div>`).join('')
      : '<p class="text-xs text-zinc-500">No comments yet</p>';

    return `
      <div class="max-w-2xl mx-auto px-3 pb-3">
        <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <div class="flex gap-3 items-center">
            <img src="${profilePhoto}" class="w-10 h-10 rounded-full border border-yellow-600 object-cover">
            <div>
              <p class="font-semibold text-sm">${displayName}</p>
              <p class="text-xs text-zinc-500">Now • Luxury</p>
            </div>
          </div>

          <p class="mt-3 text-sm">${post.text || ''}</p>
          ${mediaHtml}

          <div class="flex gap-6 mt-4 text-sm border-t border-zinc-800 pt-3">
            <button data-index="${index}" class="likeBtn ${post.liked ? 'text-yellow-500 font-bold' : 'text-zinc-400'} hover:text-yellow-500">
              ${post.liked ? '♥ Liked' : '♡ Like'} ${post.likes > 0 ? `(${post.likes})` : ''}
            </button>
            <button data-index="${index}" class="commentBtn text-zinc-400 hover:text-white">💬 Comment ${commentsCount > 0 ? `(${commentsCount})` : ''}</button>
            <span class="text-zinc-400">↗ Share</span>
          </div>

          <div id="comments-${index}" class="hidden mt-3 border-t border-zinc-800 pt-3">
            <div class="space-y-2 mb-3 max-h-40 overflow-y-auto">${commentsHtml}</div>
            <div class="flex gap-2">
              <input id="commentInput-${index}" placeholder="Write a comment..." class="flex-1 bg-zinc-800 rounded-full px-3 py-2 text-xs outline-none border border-transparent focus:border-zinc-700">
              <button data-index="${index}" class="postCommentBtn bg-yellow-500 text-black px-4 py-1.5 rounded-full text-xs font-bold hover:bg-yellow-400">Post</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}
