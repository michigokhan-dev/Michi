export function NotificationsPage(notifications = []) {
  const unreadCount = notifications.filter(n => !n.is_read).length;

  const escapeHTML = (value = '') =>
    String(value).replace(/[&<>"']/g, char => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[char]);

  if (!notifications.length) {
    return `
      <div class="max-w-2xl mx-auto p-6 text-center">
        <h1 class="text-xl font-bold text-white mb-2">Notifications</h1>
        <p class="text-zinc-500">No notifications yet</p>
        <p class="text-xs text-zinc-600 mt-2">
          Likes, comments and replies will appear here.
        </p>
      </div>`;
  }

  const notificationText = {
    post_like: 'liked your post.',
    post_comment: 'commented on your post.',
    comment_like: 'liked your comment.',
    comment_reply: 'replied to your comment.'
  };

  return `
    <div class="max-w-2xl mx-auto">
      <div class="p-4 border-b border-zinc-800 flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold text-white">Notifications</h1>
          <p class="text-xs text-zinc-500 mt-1">
            ${unreadCount} unread
          </p>
        </div>
        <button
          id="markAllNotificationsRead"
          class="text-xs text-yellow-500 hover:text-yellow-400">
          Mark all as read
        </button>
      </div>

      <div class="p-3">
        ${notifications.map((notif, index) => {
          const name = escapeHTML(notif.actor?.full_name || notif.actor?.username || 'MICHI user');
          const message = escapeHTML(
            notif.message || notificationText[notif.type] || 'interacted with you.'
          );
          const time = notif.created_at
            ? new Date(notif.created_at).toLocaleString()
            : '';

          return `
            <div
              class="border rounded-2xl p-4 mb-3 relative ${
                notif.is_read
                  ? 'bg-zinc-950 border-zinc-800'
                  : 'bg-zinc-900 border-yellow-600/50'
              }">

              <button
                data-id="${escapeHTML(notif.id)}"
                class="markNotificationRead absolute top-3 right-3 text-xs text-zinc-500 hover:text-yellow-500">
                ${notif.is_read ? 'Read' : 'Mark read'}
              </button>

              <button
                data-index="${index}"
                class="openNotification text-left flex gap-3 items-start w-full pr-14">

                <div class="w-10 h-10 shrink-0 rounded-full border border-yellow-600 bg-black flex items-center justify-center text-yellow-500 font-bold">
                  ${name.charAt(0).toUpperCase()}
                </div>

                <div class="flex-1 min-w-0">
                  <p class="text-sm text-white">
                    <span class="font-bold">${name}</span>
                    <span class="text-zinc-300">${message}</span>
                  </p>
                  <p class="text-xs text-zinc-500 mt-2">${escapeHTML(time)}</p>
                  ${
                    notif.post_id
                      ? '<p class="text-xs text-yellow-500 mt-2">View post →</p>'
                      : ''
                  }
                </div>
              </button>
            </div>`;
        }).join('')}
      </div>
    </div>`;
}
