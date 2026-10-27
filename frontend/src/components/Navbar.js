export function Navbar(notifCount = 0) {
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
    <div class="flex items-center gap-3">
      <button
        id="michiNotificationsButton"
        onclick="location.hash='notifications'"
        aria-label="Notifications"
        class="relative w-10 h-10 flex items-center justify-center rounded-full border border-zinc-700 text-yellow-500 hover:bg-zinc-900 transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
          viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/>
          <path d="M10 21h4"/>
        </svg>
        ${notifCount > 0 ? `
          <span class="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-yellow-500 text-black text-xs font-bold flex items-center justify-center">
            ${notifCount > 99 ? '99+' : notifCount}
          </span>
        ` : ''}
      </button>
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
