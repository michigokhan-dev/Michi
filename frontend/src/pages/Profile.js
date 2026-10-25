import { PostInput } from '../components/PostInput.js'

export function Profile(posts){
  return `
  <div class="max-w-2xl mx-auto">
    <!-- Profile Header -->
    <div class="bg-zinc-900 border-b border-zinc-800 p-6">
      <div class="flex gap-4 items-start">
        <img src="./IMG_3700.jpeg" class="w-20 h-20 rounded-full border-2 border-yellow-500 object-cover">
        <div class="flex-1">
          <h1 class="text-xl font-bold">MICHI User</h1>
          <p class="text-zinc-400 text-sm mt-1">Luxury mind • Black & Gold soul ✨</p>
          <div class="flex gap-6 mt-3 text-sm">
            <span><b>${posts.length}</b> Posts</span>
            <span><b>342</b> Followers</span>
            <span><b>128</b> Following</span>
          </div>
        </div>
        <button class="border border-zinc-700 px-4 py-1.5 rounded-full text-sm">Edit Profile</button>
      </div>
    </div>

    <!-- Post from your own page - goes to Feed automatically -->
    ${PostInput()}

    <!-- Your Posts - all posts until today -->
    <div class="px-3 pb-3">
      <h2 class="font-bold mb-3 text-sm">Your Posts - Visible to Everyone in Feed</h2>
      ${posts.map(post => `
        <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-3">
          <p class="text-sm">${post.text}</p>
          <p class="text-xs text-zinc-500 mt-2">${post.likes || 0} likes • Now • Visible in Feed</p>
        </div>
      `).join('')}
    </div>
  </div>`
}
