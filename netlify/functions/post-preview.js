const CATEGORY_LABELS = {
  incidente: 'Incidente',
  soccorso: 'Soccorso',
  allagamento: 'Allagamento',
  evento: 'Evento',
  traffico: 'Traffico',
  lavori: 'Lavori',
  incendio: 'Incendio',
  maltempo: 'Maltempo',
  altro: 'Segnalazione',
};

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function getStringField(fields, name) {
  const value = fields?.[name];
  if (!value || value.nullValue !== undefined) return undefined;
  if (value.stringValue !== undefined) return value.stringValue;
  return undefined;
}

async function fetchPost(postId) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const apiKey = process.env.FIREBASE_API_KEY;
  if (!projectId || !apiKey) return null;

  const url =
    `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}` +
    `/databases/(default)/documents/posts/${encodeURIComponent(postId)}` +
    `?key=${encodeURIComponent(apiKey)}`;

  const response = await fetch(url);
  if (response.status === 404) return null;
  if (!response.ok) return null;

  const doc = await response.json();
  const fields = doc.fields ?? {};

  return {
    category: getStringField(fields, 'category'),
    description: getStringField(fields, 'description'),
    mediaType: getStringField(fields, 'mediaType'),
    mediaUrl: getStringField(fields, 'mediaUrl'),
    thumbnailUrl: getStringField(fields, 'thumbnailUrl'),
  };
}

function buildPostPage({ postId, webUrl, post }) {
  const categoryLabel = post
    ? (CATEGORY_LABELS[post.category] ?? CATEGORY_LABELS.altro)
    : 'Segnalazione';
  const title = `${categoryLabel} · InZona`;
  const description =
    post?.description?.trim().slice(0, 200) ||
    'Apri questa segnalazione su InZona — segnalazioni locali vicino a te.';
  const previewImage = post?.thumbnailUrl || post?.mediaUrl;
  const isVideo = post?.mediaType === 'video' && post?.mediaUrl;
  const appUrl = `inzona://post/${postId}`;

  const ogVideoTags = isVideo
    ? `
    <meta property="og:type" content="video.other" />
    <meta property="og:video" content="${escapeHtml(post.mediaUrl)}" />
    <meta property="og:video:secure_url" content="${escapeHtml(post.mediaUrl)}" />
    <meta property="og:video:type" content="video/mp4" />`
    : `<meta property="og:type" content="website" />`;

  const imageTags = previewImage
    ? `
    <meta property="og:image" content="${escapeHtml(previewImage)}" />
    <meta property="og:image:secure_url" content="${escapeHtml(previewImage)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content="${escapeHtml(previewImage)}" />`
    : `<meta name="twitter:card" content="summary" />`;

  const mediaBlock = isVideo
    ? `<video class="post-media" controls playsinline preload="metadata"${
        previewImage ? ` poster="${escapeHtml(previewImage)}"` : ''
      }>
        <source src="${escapeHtml(post.mediaUrl)}" type="video/mp4" />
      </video>`
    : previewImage
      ? `<img class="post-media" src="${escapeHtml(previewImage)}" alt="" loading="lazy" />`
      : '';

  const message = post?.description?.trim()
    ? escapeHtml(post.description.trim())
    : 'Qualcuno ha condiviso una segnalazione locale. Apri l\'app per vederla nel feed geolocalizzato.';

  return `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#000000" />
    <meta name="apple-itunes-app" content="app-id=0000000000, app-argument=${escapeHtml(webUrl)}" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta property="og:site_name" content="InZona" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${escapeHtml(webUrl)}" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    ${ogVideoTags}
    ${imageTags}
    <link rel="icon" href="/assets/favicon.png" type="image/png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="/styles.css" />
    <style>
      .post-landing {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 2rem 1.5rem 3rem;
        text-align: center;
      }
      .post-card {
        width: min(420px, 100%);
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 1.5rem;
        padding: 2rem 1.75rem;
        margin-top: 2rem;
      }
      .post-card h1 {
        font-size: 1.5rem;
        margin: 1rem 0 0.75rem;
      }
      .post-card p {
        color: var(--muted);
        line-height: 1.6;
        margin-bottom: 1.5rem;
      }
      .post-media {
        width: 100%;
        max-height: 280px;
        object-fit: cover;
        border-radius: 1rem;
        margin-bottom: 1.25rem;
        border: 1px solid var(--border);
        background: #0a0a0a;
      }
      .post-actions {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
      .post-note {
        margin-top: 1.25rem;
        font-size: 0.875rem;
        color: var(--muted);
        line-height: 1.5;
      }
      .post-logo {
        display: inline-flex;
        align-items: center;
        gap: 0.6rem;
        font-weight: 700;
        font-size: 1.125rem;
        color: var(--text);
        text-decoration: none;
      }
      .post-logo img {
        border-radius: 0.5rem;
      }
    </style>
  </head>
  <body>
    <div class="bg-glow" aria-hidden="true"></div>
    <div class="bg-grid" aria-hidden="true"></div>

    <main class="post-landing">
      <a class="post-logo" href="/">
        <img src="/assets/icon.png" alt="" width="40" height="40" />
        <span>InZona</span>
      </a>

      <div class="post-card">
        <p class="eyebrow" style="justify-content: center">
          <span class="pulse-dot"></span>
          ${escapeHtml(categoryLabel)}
        </p>
        ${mediaBlock}
        <h1>Apri in InZona</h1>
        <p id="post-message">${message}</p>
        <div class="post-actions">
          <a class="btn" href="${escapeHtml(appUrl)}" id="open-app">Apri nell'app</a>
          <a class="btn btn-ghost" href="/#scarica">Scarica InZona</a>
        </div>
        <p class="post-note" id="post-note">
          Se l'app non si apre, scaricala e poi tocca di nuovo questo link dopo l'accesso.
        </p>
      </div>
    </main>

    <script>
      (function () {
        var postId = ${JSON.stringify(postId)};
        var appUrl = ${JSON.stringify(appUrl)};
        var webUrl = ${JSON.stringify(webUrl)};

        try {
          localStorage.setItem('inzona_pending_post_id', postId);
        } catch (e) {}

        var openAppBtn = document.getElementById('open-app');
        if (openAppBtn) {
          openAppBtn.addEventListener('click', function (event) {
            event.preventDefault();
            window.location.href = appUrl;
            window.setTimeout(function () {
              window.location.href = webUrl;
            }, 1500);
          });
        }

        if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
          window.setTimeout(function () {
            window.location.href = appUrl;
          }, 400);
        }
      })();
    </script>
  </body>
</html>`;
}

exports.handler = async (event) => {
  const postId = event.queryStringParameters?.id?.trim();
  if (!postId) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      body: 'ID segnalazione mancante',
    };
  }

  const host = event.headers.host || event.headers.Host || 'inzona.netlify.app';
  const webUrl = `https://${host}/post/${postId}`;

  let post = null;
  try {
    post = await fetchPost(postId);
  } catch {
    // anteprima opzionale: pagina di atterraggio funziona comunque
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=60, s-maxage=300',
    },
    body: buildPostPage({ postId, webUrl, post }),
  };
};
