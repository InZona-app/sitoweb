(function () {
  const header = document.querySelector('.site-header');
  const menuToggle = document.getElementById('menu-toggle');
  const navMobile = document.getElementById('nav-mobile');
  const yearEl = document.getElementById('year');

  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  function onScroll() {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 8);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function closeMobileNav() {
    if (!menuToggle || !navMobile) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    navMobile.hidden = true;
    document.body.style.overflow = '';
  }

  function openMobileNav() {
    if (!menuToggle || !navMobile) return;
    menuToggle.setAttribute('aria-expanded', 'true');
    navMobile.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  if (menuToggle && navMobile) {
    menuToggle.addEventListener('click', () => {
      const open = menuToggle.getAttribute('aria-expanded') === 'true';
      if (open) closeMobileNav();
      else openMobileNav();
    });

    navMobile.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMobileNav);
    });
  }

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReduced) {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    reveals.forEach((el) => observer.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'));
  }
})();
