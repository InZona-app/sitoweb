# Sito InZona

Landing page statica con gli stessi colori dell'app (`#2F4F4F`, nero, card `#141414`, ecc.).

## Anteprima locale

```bash
npx serve .
```

Apri l'URL indicato (di solito http://localhost:3000).

## Deploy

Carica la root del repo su qualsiasi hosting statico (Firebase Hosting, Netlify, Vercel, GitHub Pages).

Prima della pubblicazione:

1. Sostituisci i link `#` dei pulsanti App Store / Google Play in `index.html` con gli URL reali.
2. Se cambi l'email di supporto nell'app (`.env`), aggiorna anche il footer del sito.

## Link condivisi post

Gli URL hanno la forma `https://inzona.netlify.app/post/ID`.

- `netlify/functions/post-preview.js` — pagina dinamica con anteprima (thumbnail/video) e meta Open Graph per WhatsApp, iMessage, ecc.
- `netlify.toml` — rewrite `/post/:id` → function
- `post.html` + `post.js` — fallback statico per anteprima locale (`npx serve .` non esegue le function)

**Variabile Netlify (Site settings → Environment variables):**

- `FIREBASE_API_KEY` — stessa chiave di `EXPO_PUBLIC_FIREBASE_API_KEY` nel progetto app (Firestore read pubblico)
- `.well-known/apple-app-site-association` — Universal Links iOS (sostituisci `TEAMID`)
- `.well-known/assetlinks.json` — App Links Android (sostituisci l'impronta SHA256 del keystore)

Dopo il deploy, verifica che `https://inzona.netlify.app/.well-known/apple-app-site-association` risponda senza redirect e con `Content-Type: application/json`.

## File

- `index.html` — landing page
- `post.html` — link condivisi segnalazioni
- `help.html` — aiuto, FAQ e modulo contatti (stessa collection Firestore `contacts` dell'app)
- `privacy.html` — informativa sulla privacy (GDPR)
- `termini.html` — termini e condizioni d'uso
- `firebase-config.js` — chiavi Firebase per il modulo contatti sul sito (vedi `firebase-config.example.js`)
- `styles.css` — tema allineato a `constants/theme.ts`
- `main.js` — menu mobile e animazioni scroll
- `assets/` — icona e favicon dell'app

Prima della pubblicazione su App Store / Play Store, verifica i testi legali con un professionista e inserisci i link a `privacy.html` e `termini.html` nelle schede store.
