export function BottomNav(activePage, notifCount){
  const isFeed = !activePage || activePage === 'feed'
  const isProfile = activePage === 'profile'
  const isNotif = activePage === 'notifications'
  return `
  <div class="fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-800 flex justify-around py-3 z-50">
    <button onclick="location.hash='feed'" class="flex flex-col items-center ${isFeed ? 'text-yellow-500' : 'text-zinc-500'}">
      <span class="text-xl">⌂</span>
      <span class="text-xs">Feed</span>
    </button>
    <button onclick="location.hash='notifications'" class="flex flex-col items-center ${isNotif ? 'text-yellow-500' : 'text-zinc-500'} relative">
      <span class="text-xl">🔔</span>
      ${notifCount > 0 ? `<span class="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">${notifCount}</span>` : ''}
      <span class="text-xs">Alerts</span>
    </button>
    <button class="flex flex-col items-center text-zinc-500">
      <span class="text-xl">+</span>
      <span class="text-xs">Add</span>
    </button>
    <button onclick="location.hash='profile'" class="flex flex-col items-center ${isProfile ? 'text-yellow-500' : 'text-zinc-500'}">
      <span class="text-xl">◉</span>
      <span class="text-xs">Profile</span>
    </button>
  </div>`
}
