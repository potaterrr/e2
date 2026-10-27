/* =========================================================
   The world of E2 · site settings
   Edit these values. Everything else updates on its own.
   ========================================================= */

// TODO(potaterrr): paste E2's permanent Discord invite link here,
// e.g. 'https://discord.gg/your-code'. While it's '#', the Join buttons
// show a "link coming soon" note instead of going anywhere.
const INVITE_URL = '#';

// Road to 1,000: update MEMBER_COUNT whenever E2 grows.
const MEMBER_COUNT = 700;
const MEMBER_GOAL = 1000;

/* ========================================================= */

(function () {
  'use strict';
  const root = document.documentElement;
  const fmt = (n) => n.toLocaleString('en-US');

  /* ---------- Invite links ---------- */
  const hasInvite = INVITE_URL && INVITE_URL !== '#';
  document.querySelectorAll('[data-invite]').forEach((a) => {
    if (hasInvite) {
      a.href = INVITE_URL;
      a.target = '_blank';
      a.rel = 'noopener';
    } else {
      a.href = '#';
      a.addEventListener('click', (e) => {
        e.preventDefault();
        // Show the note closest to this button (hero, final CTA), or the hero one by default.
        const scope = a.closest('section');
        const note = (scope && scope.querySelector('.invite-note')) || document.querySelector('.invite-note');
        if (!note) return;
        note.textContent = 'Our invite link is coming soon. Check back shortly! 💛';
        note.hidden = false;
        if (!scope || !scope.contains(note)) note.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }
  });

  /* ---------- Road to 1,000 ---------- */
  const pct = Math.max(0, Math.min(100, (MEMBER_COUNT / MEMBER_GOAL) * 100));
  document.querySelectorAll('[data-members]').forEach((el) => (el.textContent = fmt(MEMBER_COUNT)));
  document.querySelectorAll('[data-goal]').forEach((el) => (el.textContent = fmt(MEMBER_GOAL)));
  const bar = document.querySelector('.progress');
  if (bar) {
    bar.setAttribute('aria-valuenow', String(MEMBER_COUNT));
    bar.setAttribute('aria-valuemax', String(MEMBER_GOAL));
    bar.setAttribute('aria-valuetext', `${fmt(MEMBER_COUNT)} of ${fmt(MEMBER_GOAL)} members`);
    const fill = bar.querySelector('.progress-fill');
    if (fill) {
      // Grow the bar from 0 on load (skipped when the user prefers reduced motion).
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce) {
        fill.style.width = pct + '%';
      } else {
        fill.style.width = '0%';
        requestAnimationFrame(() => requestAnimationFrame(() => (fill.style.width = pct + '%')));
      }
    }
  }

  /* ---------- Light / dark theme ---------- */
  const toggle = document.querySelector('.theme-toggle');
  const favicon = document.getElementById('favicon');
  const themeMeta = document.querySelector('meta[name="theme-color"]');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    document.querySelectorAll('img[data-src-dark][data-src-light]').forEach((img) => {
      const src = img.getAttribute(theme === 'dark' ? 'data-src-dark' : 'data-src-light');
      if (img.getAttribute('src') !== src) img.setAttribute('src', src);
    });
    if (favicon) favicon.href = `assets/favicon-${theme}.png`;
    if (themeMeta) themeMeta.content = theme === 'dark' ? '#1F1630' : '#FFF4E6';
    if (toggle) {
      const next = theme === 'dark' ? 'light' : 'dark';
      toggle.setAttribute('aria-label', `Switch to ${next} mode`);
      toggle.title = `Switch to ${next} mode`;
    }
  }

  applyTheme(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem('e2-theme', next); } catch (e) {}
    });
  }

  /* ---------- Mobile menu ---------- */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.getElementById('nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
    navLinks.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      })
    );
  }

  /* ---------- Kindness Streak: highlight today's prompt (Philippine Time) ---------- */
  try {
    const todayPH = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Manila' }).format(new Date()); // YYYY-MM-DD
    const today = document.querySelector(`.streak-day[data-date="${todayPH}"]`);
    if (today) {
      today.classList.add('is-today');
      today.setAttribute('aria-current', 'date');
    }
  } catch (e) {}

  /* ---------- Footer year ---------- */
  const y = document.querySelector('[data-year]');
  if (y) y.textContent = String(new Date().getFullYear());
})();
