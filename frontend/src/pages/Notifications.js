export function NotificationsPage(notifications){
  if(!notifications || notifications.length === 0){
    return `
    <div class="max-w-2xl mx-auto p-6 text-center">
      <p class="text-zinc-500">No notifications yet</p>
      <p class="text-xs text-zinc-600 mt-2">When friends change profile photo, you'll see it here</p>
    </div>`
  }
  
  return `
  <div class="max-w-2xl mx-auto">
    <div class="p-4 border-b border-zinc-800">
      <h1 class="text-xl font-bold">Notifications</h1>
    </div>
    <div class="p-3">
      ${notifications.map((notif, index) => `
        <div class="bg-zinc-900 border border-yellow-600/30 rounded-2xl p-4 mb-3 relative">
          <button data-index="${index}" class="closeNotifBtn absolute top-3 right-3 text-zinc-500 hover:text-white w-6 h-6 flex items-center justify-center rounded-full hover:bg-zinc-800">✕</button>
          
          <div class="flex gap-3 items-start">
            <img src="${notif.photo}" onclick="location.hash='profile'" class="w-10 h-10 rounded-full border border-yellow-600 object-cover cursor-pointer">
            <div class="flex-1">
              <p class="text-sm">
                <span onclick="location.hash='profile'" class="font-bold hover:underline cursor-pointer">${notif.userName}</span> 
                <span class="text-zinc-400">changed profile photo</span>
              </p>
              <p class="text-xs text-zinc-500 mt-1">Just now</p>
              
              <div class="mt-3 rounded-xl overflow-hidden border border-zinc-800 bg-black">
                <img src="${notif.photo}" onclick="location.hash='profile'" class="w-full max-h-96 object-contain cursor-pointer">
              </div>
              
              <div class="flex gap-6 mt-3 text-sm">
                <button data-index="${index}" class="likeNotifBtn ${notif.liked ? 'text-yellow-500 font-bold' : 'text-zinc-400'} hover:text-yellow-500">
                  ${notif.liked ? '♥ Liked' : '♡ Like'} ${notif.likes > 0 ? `(${notif.likes})` : ''}
                </button>
              </div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  </div>`
}
