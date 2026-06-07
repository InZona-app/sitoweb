(function () {
  const APP_SCHEME = 'inzona';
  const WEB_ORIGIN = window.location.origin;

  function getPostIdFromLocation() {
    const params = new URLSearchParams(window.location.search);
    const fromQuery = params.get('id');
    if (fromQuery && fromQuery.trim()) return fromQuery.trim();

    const match = window.location.pathname.match(/\/post\/([^/]+)/);
    return match?.[1]?.trim() || null;
  }

  function buildWebPostUrl(postId) {
    return `${WEB_ORIGIN}/post/${postId}`;
  }

  function buildAppPostUrl(postId) {
    return `${APP_SCHEME}://post/${postId}`;
  }

  const postId = getPostIdFromLocation();
  const openAppBtn = document.getElementById('open-app');
  const postNote = document.getElementById('post-note');

  if (!postId) {
    if (postNote) {
      postNote.textContent = 'Link non valido. Torna alla home e scarica InZona.';
    }
    if (openAppBtn) {
      openAppBtn.textContent = 'Vai alla home';
      openAppBtn.href = 'index.html';
    }
    return;
  }

  const webUrl = buildWebPostUrl(postId);
  const appUrl = buildAppPostUrl(postId);

  try {
    localStorage.setItem('inzona_pending_post_id', postId);
  } catch {
    // storage non disponibile
  }

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
