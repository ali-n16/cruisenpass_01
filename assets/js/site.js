/* Cruise'N'Pass — shared site interactions (mobile menu, dropdown, footer year).
   Loaded on every page; every feature degrades gracefully if its elements
   are absent. */
(function () {
  'use strict';

  // ---- Mobile menu toggle ----
  var menuBtn = document.getElementById('mobile-menu-btn');
  var menuPanel = document.getElementById('mobile-menu');

  function closeMobileMenu() {
    if (!menuBtn || !menuPanel) return;
    menuPanel.classList.add('hidden');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
  }

  if (menuBtn && menuPanel) {
    menuBtn.addEventListener('click', function () {
      var isHidden = menuPanel.classList.contains('hidden');
      menuPanel.classList.toggle('hidden');
      menuBtn.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
      menuBtn.innerHTML = isHidden
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';
    });
    menuPanel.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  // ---- "Join Cruise'N'Pass" dropdown: click + keyboard + aria state ----
  // Visual open/close is driven by CSS (hover + focus-within); JS keeps
  // aria-expanded in sync and adds Escape / click-outside handling.
  document.querySelectorAll('[data-dropdown]').forEach(function (btn) {
    var panel = document.getElementById(btn.getAttribute('aria-controls'));
    if (!panel) return;

    var setOpen = function (open) {
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    };

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = btn.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        btn.blur();
        setOpen(false);
      } else {
        btn.focus();
        setOpen(true);
      }
    });

    // Close when clicking anywhere outside the dropdown (including touch taps).
    document.addEventListener('click', function (e) {
      if (!btn.contains(e.target)) {
        setOpen(false);
        if (document.activeElement === btn) btn.blur();
      }
    });

    btn.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        btn.blur();
        setOpen(false);
      }
    });
  });

  // ---- Footer year ----
  var yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
