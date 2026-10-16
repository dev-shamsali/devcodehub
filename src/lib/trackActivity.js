/**
 * Tells the server that the signed-in user did something to a snippet, so it
 * lands in the admin activity log. Fire and forget: a failure here must never
 * get in the way of the action. The server takes the name and email from the
 * session, so only what happened and to which snippet is sent.
 */
export function trackActivity(action, targetId, targetName = '') {
  try {
    fetch('/api/activity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, targetId, targetName }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* ignore */
  }
}
