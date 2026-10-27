export function Navbar(notifCount) {
  return `
  <nav class="sticky top-0 z-50 bg-black border-b border-zinc-800 px-4 py-3 flex justify-between items-center relative">

    <span class="text-xl font-bold text-yellow-500 tracking-widest">
      MICHI
    </span>

    <img
      src="./IMG_3700.jpeg"
      alt="MICHI logo"
      class="absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-lg border border-yellow-600 object-cover"
    >

    <div class="flex items-center">
      <button
        id="michiAuthButton"
        onclick="window.michiAuthButtonClick && window.michiAuthButtonClick()"
        class="border border-yellow-500 text-yellow-500 px-3 py-2 rounded-full font-bold text-xs sm:text-sm whitespace-nowrap hover:bg-yellow-500 hover:text-black transition"
      >
        Sign in / Sign up
      </button>
    </div>

  </nav>`;
}
