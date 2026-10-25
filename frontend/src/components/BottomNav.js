export function BottomNav(activePage){
  const isFeed = !activePage || activePage === 'feed'
  const isProfile = activePage === 'profile'
  return `
  <div class="fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-800 flex justify-around py-3 z-50">
    <button onclick="location.hash='feed'" class="flex flex-col items-center ${isFeed ? 'text-yellow-500' : 'text-zinc-500'}">
      <span class="text-xl">⌂</span>
      <span class="text-xs">Feed</span>
    </button>
    <button class="flex flex-col items-center text-zinc-500">
      <span class="text-xl">🔍</span>
      <span class="text-xs">Search</span>
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
