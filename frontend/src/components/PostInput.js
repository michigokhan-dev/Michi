export function PostInput(){
  return `
  <div class="max-w-2xl mx-auto px-3 pb-3">
    <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-3">
      <div class="flex gap-3 items-center">
        <img id="postInputAvatar" src="./IMG_3700.jpeg" class="w-9 h-9 rounded-full border border-yellow-600 object-cover">
        <input id="postInput" placeholder="What's on your luxury mind?" class="flex-1 bg-zinc-800 rounded-full px-4 py-2.5 text-sm outline-none">
        <label for="postPhotoInput" class="text-zinc-400 hover:text-yellow-500 cursor-pointer text-xl" title="Add photos/videos">📷</label>
        <input type="file" id="postPhotoInput" accept="image/*,video/*" multiple hidden>
        <button id="shareBtn" class="bg-yellow-500 text-black px-4 py-2 rounded-full font-bold text-sm hover:bg-yellow-400">Share</button>
      </div>
      <div id="postPhotoPreview" class="mt-3 hidden">
        <div id="previewGrid" class="grid grid-cols-2 gap-2"></div>
        <button id="removePhotoBtn" class="text-xs text-red-400 mt-2">Remove all</button>
      </div>
    </div>
  </div>`
}
