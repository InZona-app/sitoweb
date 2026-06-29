(function () {
  const APP_SCHEME = 'inzona';
  const WEB_ORIGIN = window.location.origin;
  const UID_PATTERN = /^[a-zA-Z0-9]{20,128}$/;

  function getInviterIdFromLocation() {
    const params = new URLSearchParams(window.location.search);
    const fromQuery = params.get('ref');
    if (fromQuery && UID_PATTERN.test(fromQuery.trim())) return fromQuery.trim();

    const match = window.location.pathname.match(/\/invite\/([^/]+)/);
    return match?.[1]?.trim() && UID_PATTERN.test(match[1].trim()) ? match[1].trim() : null;
  }

  function buildWebInviteUrl(inviterId) {
    return `${WEB_ORIGIN}/invite?ref=${encodeURIComponent(inviterId)}`;
  }

  function buildAppInviteUrl(inviterId) {
    return `${APP_SCHEME}://invite?ref=${encodeURIComponent(inviterId)}`;
  }

  const inviterId = getInviterIdFromLocation();
  const openAppBtn = document.getElementById('open-app');
  const inviteNote = document.getElementById('invite-note');

  if (!inviterId) {
    if (inviteNote) {
      inviteNote.textContent = 'Link non valido. Torna alla home e scarica InZona.';
    }
    if (openAppBtn) {
      openAppBtn.textContent = 'Vai alla home';
      openAppBtn.href = 'index.html';
    }
    return;
  }

  const webUrl = buildWebInviteUrl(inviterId);
  const appUrl = buildAppInviteUrl(inviterId);

  if (openAppBtn) {
    openAppBtn.href = appUrl;
    openAppBtn.addEventListener('click', (event) => {
      event.preventDefault();
      window.location.href = appUrl;
      window.setTimeout(() => {
        window.location.href = webUrl;
      }, 1500);
    });
  }

  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (isMobile) {
    window.setTimeout(() => {
      window.location.href = appUrl;
    }, 400);
  }
})();
