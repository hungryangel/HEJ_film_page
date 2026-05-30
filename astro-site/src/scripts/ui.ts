/**
 * ui.ts — 원페이지 공통 인터랙션
 *  1) 헤더: 스크롤 40px 이상이면 solid 전환 (투명 헤더일 때만)
 *  2) 스크롤 등장: .reveal 요소를 IntersectionObserver로 표시
 *  3) 모바일 메뉴: 햄버거 열기/닫기
 *  4) HeroSlot: 이미지 크로스페이드 순환
 *  5) 갤러리 스크립트 동적 로드 (해당 요소가 있을 때만)
 *  6) 앵커 스무스 스크롤 + 스크롤 스파이(현재 섹션 활성 표시)
 */

/** 고정 헤더 높이(px) — 앵커 스크롤 시 가려지지 않도록 보정 */
const HEADER_OFFSET = 72;

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
    // 스크롤바가 사라지면서 생기는 레이아웃 시프트(흔들림)를 방지하기 위해
    // 사라질 스크롤바 폭만큼을 body padding으로 보정한다.
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.setProperty('--scrollbar-comp', `${scrollbarWidth}px`);
    }
    menu.classList.add('open');
    openBtn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-locked');
  };
  const close = () => {
    menu.classList.remove('open');
    openBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-locked');
    document.body.style.removeProperty('--scrollbar-comp');
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

/* ── 6) 앵커 스무스 스크롤 + 스크롤 스파이 ──────── */
function scrollToHash(hash: string) {
  const id = hash.replace('#', '');
  if (!id) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET + 1;
  window.scrollTo({ top, behavior: 'smooth' });
}

function initAnchorNav() {
  // 헤더·모바일메뉴·페이지 내 모든 해시 링크를 가로채 헤더 높이를 보정한 스무스 스크롤로 처리
  const links = document.querySelectorAll<HTMLAnchorElement>('a[href^="#"], a[href="/"]');
  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href') || '';
      const hash = href === '/' ? '' : href;
      e.preventDefault();
      scrollToHash(hash);
      // URL 해시 갱신(뒤로가기/공유용), 점프 없이
      history.replaceState(null, '', href === '/' ? location.pathname : href);
    });
  });
}

function initScrollSpy() {
  const navItems = Array.from(
    document.querySelectorAll<HTMLAnchorElement>('[data-nav]')
  );
  if (!navItems.length) return;

  const sections = navItems
    .map((a) => document.getElementById(a.dataset.nav || ''))
    .filter((el): el is HTMLElement => !!el);
  if (!sections.length) return;

  const setActive = (id: string) => {
    navItems.forEach((a) =>
      a.classList.toggle('is-current', a.dataset.nav === id)
    );
  };

  const onScroll = () => {
    const pos = window.scrollY + HEADER_OFFSET + 40;
    let current = '';
    for (const sec of sections) {
      if (sec.offsetTop <= pos) current = sec.id;
    }
    // 페이지 맨 아래 도달 시 마지막 섹션 강제 활성
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 2) {
      current = sections[sections.length - 1].id;
    }
    setActive(current);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ── 부트 ───────────────────────────────────────── */
function boot() {
  initHeader();
  initReveal();
  initMobileMenu();
  initHeroSlots();
  initGalleryIfPresent();
  initAnchorNav();
  initScrollSpy();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
