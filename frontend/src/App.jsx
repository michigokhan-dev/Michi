export default function App(){
  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="border-b border-zinc-800 p-4 flex justify-between">
        <span className="text-xl font-bold text-yellow-500">MICHI</span>
        <button className="bg-yellow-500 text-black px-4 py-1 rounded-full font-bold">Post</button>
      </nav>
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <p className="font-bold">Michi Official</p>
          <p className="mt-2">Welcome to MICHI - Black background. Gold soul. Luxury social network. ✨</p>
          <p className="mt-4 text-sm text-gray-400">♡ 342 Likes • 💬 Comment</p>
        </div>
      </div>
    </div>
  )
}
