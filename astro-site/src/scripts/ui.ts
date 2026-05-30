/**
 * ui.ts — 모든 페이지 공통 인터랙션
 *  1) 헤더: 스크롤 40px 이상이면 solid 전환 (투명 헤더 페이지에서만)
 *  2) 스크롤 등장: .reveal 요소를 IntersectionObserver로 표시
 *  3) 모바일 메뉴: 햄버거 열기/닫기
 *  4) HeroSlot: 이미지 크로스페이드 순환
 *  5) 갤러리 스크립트 동적 로드 (해당 요소가 있을 때만)
 */

/* ── 1) 헤더 스크롤 전환 ───────────────────────── */
function initHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;
  // 투명 헤더가 아닌 페이지는 항상 solid → 처리 불필요
  if (header.dataset.transparent !== 'true') return;

  const onScroll = () => {
    if (window.scrollY > 40) {
      header.classList.remove('is-top');
      header.classList.add('scrolled');
    } else {
      header.classList.add('is-top');
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ── 2) 스크롤 등장 ─────────────────────────────── */
function initReveal() {
  const els = document.querySelectorAll<HTMLElement>('.reveal');
  if (!els.length) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) {
    els.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  els.forEach((el) => io.observe(el));
}

/* ── 3) 모바일 메뉴 ─────────────────────────────── */
function initMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const openBtn = document.getElementById('menu-open');
  const closeBtn = document.getElementById('menu-close');
  if (!menu || !openBtn) return;

  const open = () => {
    menu.classList.add('open');
    openBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    menu.classList.remove('open');
    openBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  openBtn.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  // 링크 클릭 시 닫기
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
}

/* ── 4) HeroSlot 크로스페이드 ───────────────────── */
function initHeroSlots() {
  const slots = document.querySelectorAll<HTMLElement>('.hero-slot');
  slots.forEach((slot) => {
    const slides = slot.querySelectorAll<HTMLImageElement>('[data-slide]');
    if (slides.length <= 1) return;
    const interval = Number(slot.dataset.interval) || 12000;
    let idx = 0;
    setInterval(() => {
      slides[idx].style.opacity = '0';
      idx = (idx + 1) % slides.length;
      slides[idx].style.opacity = '1';
    }, interval);
  });
}

/* ── 5) 갤러리 (페이지에 있을 때만 로드) ─────────── */
function initGalleryIfPresent() {
  if (document.getElementById('gallery-grid')) {
    import('./gallery.ts');
  }
}

/* ── 부트 ───────────────────────────────────────── */
function boot() {
  initHeader();
  initReveal();
  initMobileMenu();
  initHeroSlots();
  initGalleryIfPresent();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
