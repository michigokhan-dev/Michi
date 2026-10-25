export function BottomNav(){
  return `
  <div class="fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-800 flex justify-around py-3 z-50">
    <button onclick="location.hash='feed'" class="flex flex-col items-center text-yellow-500">
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
    <button onclick="location.hash='profile'" class="flex flex-col items-center text-zinc-500 hover:text-yellow-500">
      <span class="text-xl">◉</span>
      <span class="text-xs">Profile</span>
    </button>
  </div>`
}
