document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.querySelector('.dashboard-sidebar');
  const toggle = document.getElementById('sidebar-toggle');
  const scrim = document.getElementById('sidebar-scrim');

  // Below this width the sidebar becomes an off-canvas drawer (see style.css)
  const DRAWER_BREAKPOINT = 1024;
  const isDrawer = () => window.innerWidth < DRAWER_BREAKPOINT;

  const setDrawer = (open) => {
    if (!sidebar) return;
    sidebar.classList.toggle('open', open);
    if (scrim) {
      scrim.classList.toggle('open', open);
      scrim.hidden = !open;
    }
    if (toggle) toggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  };

  if (toggle) {
    toggle.addEventListener('click', () => setDrawer(!sidebar.classList.contains('open')));
  }
  if (scrim) {
    scrim.addEventListener('click', () => setDrawer(false));
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setDrawer(false);
  });

  // Snap the drawer shut when the viewport grows back to the two-pane layout
  window.addEventListener('resize', () => {
    if (!isDrawer()) setDrawer(false);
  });

  // Tab switching
  const navLinks = document.querySelectorAll('.dashboard-nav .dashboard-link');
  const sections = document.querySelectorAll('.dashboard-section');

  const activateSection = (hash) => {
    if (!hash || hash.charAt(0) !== '#') return false;
    const target = document.getElementById(hash.substring(1));
    if (!target) return false;

    navLinks.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === hash);
    });

    sections.forEach(sec => { sec.style.display = 'none'; });
    target.style.display = 'block';
    target.classList.remove('in-view');
    void target.offsetWidth;
    target.classList.add('in-view');

    if (isDrawer()) setDrawer(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return true;
  };

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href') || '';
      if (href.charAt(0) !== '#') return; // e.g. logout
      e.preventDefault();
      activateSection(href);
    });
  });

  document.querySelectorAll('.dashboard-content a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href') || '';
      if (href.length > 1 && activateSection(href)) {
        e.preventDefault();
      }
    });
  });

  // Initial tab
  if (sections.length) {
    sections.forEach(sec => { sec.style.display = 'none'; });
    sections[0].style.display = 'block';
    sections[0].classList.add('in-view');
  }
});
