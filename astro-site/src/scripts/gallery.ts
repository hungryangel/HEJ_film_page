/**
 * gallery.ts — 작품 갤러리 카테고리 필터 + 라이트박스
 * Gallery.astro 가 있는 페이지에서만 ui.ts 가 동적으로 import 합니다.
 */

function initFilter() {
  const tabs = document.querySelectorAll<HTMLButtonElement>('.cat-tab');
  const items = document.querySelectorAll<HTMLElement>('.gallery-item');
  const empty = document.getElementById('gallery-empty');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const filter = tab.dataset.filter || 'all';

      tabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', active ? 'true' : 'false');
      });

      let visible = 0;
      items.forEach((item) => {
        const show = filter === 'all' || item.dataset.category === filter;
        item.classList.toggle('is-hidden', !show);
        if (show) visible++;
      });

      // 결과가 없는 카테고리(예: Wedding)일 때 안내 문구 표시
      if (empty) empty.hidden = visible !== 0;
    });
  });
}

function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img') as HTMLImageElement | null;
  const closeBtn = document.getElementById('lightbox-close');
  if (!lightbox || !lbImg) return;

  const open = (src: string, alt: string) => {
    lbImg.src = src;
    lbImg.alt = alt;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };

  document.querySelectorAll<HTMLElement>('.gallery-item').forEach((item) => {
    item.addEventListener('click', () =>
      open(item.dataset.src || '', item.dataset.alt || '')
    );
  });

  closeBtn?.addEventListener('click', close);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
}

initFilter();
initLightbox();
