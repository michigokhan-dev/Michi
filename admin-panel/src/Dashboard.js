export function Dashboard(){
  return `
  <div class="bg-black text-yellow-500 p-6 min-h-screen">
    <h1 class="text-2xl font-bold">MICHI Admin Panel</h1>
    <div class="grid grid-cols-3 gap-4 mt-6">
      <div class="bg-zinc-900 border border-yellow-600 rounded-xl p-4">
        <p class="text-zinc-400 text-sm">Total Users</p>
        <p class="text-2xl font-bold">1,342</p>
      </div>
      <div class="bg-zinc-900 border border-yellow-600 rounded-xl p-4">
        <p class="text-zinc-400 text-sm">Posts</p>
        <p class="text-2xl font-bold">8,921</p>
      </div>
      <div class="bg-zinc-900 border border-yellow-600 rounded-xl p-4">
        <p class="text-zinc-400 text-sm">Gold Members</p>
        <p class="text-2xl font-bold">342</p>
      </div>
    </div>
  </div>`
}
