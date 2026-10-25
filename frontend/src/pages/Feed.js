import { Story } from '../components/Story.js'
import { PostInput } from '../components/PostInput.js'
import { Post } from '../components/Post.js'

export function Feed(){
  return `
    ${Story()}
    ${PostInput()}
    ${Post()}
    <div class="max-w-2xl mx-auto px-3 pb-10">
      <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
        <div class="flex gap-3">
          <img src="https://i.pravatar.cc/100?img=8" class="w-10 h-10 rounded-full">
          <div>
            <p class="font-semibold text-sm">Gokhan</p>
            <p class="text-xs text-zinc-500">5dk önce</p>
          </div>
        </div>
        <p class="mt-3 text-sm">İlk postum MICHI'de! Tasarım efsane, siyah + gold mükemmel. 🔥</p>
      </div>
    </div>
  `
}
