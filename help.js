(function () {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('contact-submit');
  const errorEl = document.getElementById('contact-form-error');
  const successEl = document.getElementById('contact-form-success');

  if (!form || !submitBtn) return;

  function showError(message) {
    if (!errorEl || !successEl) return;
    errorEl.textContent = message;
    errorEl.classList.remove('hidden');
    successEl.classList.add('hidden');
  }

  function showSuccess(message) {
    if (!errorEl || !successEl) return;
    successEl.textContent = message;
    successEl.classList.remove('hidden');
    errorEl.classList.add('hidden');
  }

  function clearMessages() {
    errorEl?.classList.add('hidden');
    successEl?.classList.add('hidden');
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function getFirestore() {
    const config = window.INZONA_FIREBASE_CONFIG;
    if (!config?.apiKey || config.apiKey === 'your-api-key') {
      throw new Error('Configurazione Firebase mancante sul sito.');
    }
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }
    return firebase.firestore();
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearMessages();

    const nome = form.nome.value.trim();
    const email = form.email.value.trim();
    const messaggio = form.messaggio.value.trim();

    if (!nome || !email || !messaggio) {
      showError('Compila nome, email e messaggio.');
      return;
    }

    if (!isValidEmail(email)) {
      showError('Inserisci un indirizzo email valido.');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Invio in corso…';

    try {
      const db = getFirestore();
      await db.collection('contacts').add({
        nome,
        email: email.toLowerCase(),
        messaggio,
        source: 'website',
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      form.reset();
      showSuccess('Messaggio inviato. Ti risponderemo al più presto.');
    } catch (err) {
      console.error(err);
      showError(
        err instanceof Error && err.message
          ? err.message
          : 'Invio non riuscito. Riprova o scrivi a savoa22@gmail.com.'
      );
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Invia messaggio';
    }
  });
})();
