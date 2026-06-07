# Sito InZona

Landing page statica con gli stessi colori dell'app (`#2F4F4F`, nero, card `#141414`, ecc.).

## Anteprima locale

```bash
npx serve website
```

Apri l'URL indicato (di solito http://localhost:3000).

## Deploy

Carica la cartella `website/` su qualsiasi hosting statico (Firebase Hosting, Netlify, Vercel, GitHub Pages).

Prima della pubblicazione:

1. Sostituisci i link `#` dei pulsanti App Store / Google Play in `index.html` con gli URL reali.
2. Se cambi l'email di supporto nell'app (`.env`), aggiorna anche il footer del sito.

## Link condivisi post

Gli URL hanno la forma `https://inzona.netlify.app/post/ID`.

- `post.html` + `post.js` — pagina di atterraggio: prova ad aprire l'app, altrimenti invita a scaricarla
- `_redirects` — rewrite Netlify `/post/*` → `post.html`
- `.well-known/apple-app-site-association` — Universal Links iOS (sostituisci `TEAMID`)
- `.well-known/assetlinks.json` — App Links Android (sostituisci l'impronta SHA256 del keystore)

Dopo il deploy, verifica che `https://inzona.netlify.app/.well-known/apple-app-site-association` risponda senza redirect e con `Content-Type: application/json`.

## File

- `index.html` — landing page
- `post.html` — link condivisi segnalazioni
- `privacy.html` — informativa sulla privacy (GDPR)
- `termini.html` — termini e condizioni d'uso
- `styles.css` — tema allineato a `constants/theme.ts`
- `main.js` — menu mobile e animazioni scroll
- `assets/` — icona e favicon dell'app

Prima della pubblicazione su App Store / Play Store, verifica i testi legali con un professionista e inserisci i link a `privacy.html` e `termini.html` nelle schede store.
