/**
 * 사이트 전역 콘텐츠 데이터
 * ─────────────────────────────────────────────
 * 텍스트·링크·갤러리 항목을 한 곳에서 관리합니다.
 * 콘텐츠 수정 시 이 파일만 고치면 모든 페이지에 반영됩니다.
 */

export interface NavLink {
  label: string;
  href: string;
}

export interface GalleryItem {
  src: string;
  alt: string;
  category: string;
  ratio: string;
}

/* 브랜드 기본 정보 */
export const site = {
  brand: 'HEJ',
  brandSub: 'Film',
  brandFull: 'HEJ FILM',
  titleSuffix: 'HEJ Film — 헤이필름 | 홈스냅',
  description:
    '순식간에 흘러가는 우리의 시간을 붙잡으려 아름답고도 황홀한 순간을 기록합니다. 헤이필름 홈스냅',
  photographer: 'hej.u',
  location: 'SEOUL',
  copyright: '© 2026 HEJ FILM · ALL RECORDS RESERVED',
};

/* 외부 연락처 링크 — Contact 버튼에서 사용 */
export const contactLinks = {
  instagram: 'https://www.instagram.com/hej___u',
  instagramLabel: 'Instagram @hej___u',
  kakao: 'https://pf.kakao.com/hejfilm_',
  kakaoLabel: 'KakaoTalk hejfilm_',
};

/* 상단 내비게이션 (원페이지 섹션 앵커) */
export const navLinks: NavLink[] = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Guide', href: '#guide' },
  { label: 'Contact', href: '#contact' },
];

/* 히어로 이미지 슬롯 */
export const hero = {
  main: '/images/hero-1.jpg',
  rightTop: ['/images/hero-2.jpg', '/images/work-6.jpg'],
  rightBottom: ['/images/hero-3.jpg', '/images/work-2.jpg', '/images/work-3.jpg'],
};

/* 작품 갤러리 */
export const galleryItems: GalleryItem[] = [
  { src: '/images/work-1.jpg', alt: '비 오는 날 창가의 가족', category: 'family', ratio: '3 / 4' },
  { src: '/images/work-2.jpg', alt: '도넛으로 장난치는 커플', category: 'couple', ratio: '1 / 1' },
  { src: '/images/work-3.jpg', alt: '흑백 침대 위의 가족', category: 'home', ratio: '3 / 4' },
  { src: '/images/work-4.jpg', alt: '역광 속 가족', category: 'family', ratio: '1 / 1' },
  { src: '/images/hero-2.jpg', alt: '크리스마스 임산부', category: 'maternity', ratio: '2 / 3' },
  { src: '/images/work-6.jpg', alt: '복도의 어린이', category: 'home', ratio: '3 / 4' },
];

export const categories = [
  { key: 'all', label: 'All' },
  { key: 'home', label: 'Home Snap' },
  { key: 'couple', label: 'Couple' },
  { key: 'family', label: 'Family' },
  { key: 'maternity', label: 'Maternity' },
  { key: 'wedding', label: 'Wedding' },
];

/* 촬영 안내(Guide) */
export const guidePackage = {
  title: 'Home Snap',
  ko: '홈스냅',
  types: '홈스냅 · 만삭스냅 · 세미웨딩 · 웨딩홈스냅',
  features: [
    '1차 셀렉 원본, 작가 셀렉 색감+보정본 30장 제공',
    '촬영 시간: 1시간 ~ 1시간 반',
    '실내 촬영 후 집 근처 야외 촬영 가능',
    '자연광 아래 진행, 빛이 가장 길게 들어오는 시간대 추천',
    '보정본 수정 2회까지 가능',
  ],
};

export const guideDetails = [
  {
    title: 'Time',
    ko: '시간',
    desc: '평일 오전 11시 전후, 주말 9시-3시. 계절과 날씨, 콘셉트와 컨디션을 고려하여 진행됩니다.',
  },
  {
    title: 'Location',
    ko: '장소',
    desc: '집과 에어비앤비, 스튜디오 대관 등 실내촬영으로 진행합니다. 서울 경기 남부 지역 위주.',
  },
];

/* About 본문 */
export const about = {
  tagline: '우리의 그림같은 시간을 그려요 :)',
  body: [
    '자연스럽고 담백한 모습 그대로를 담아요.',
    '과한 보정 대신, 흐린 날 부드럽게 퍼지는 빛의 결까지 그대로 남깁니다.',
    '빛바랠수록 더 아름다운 시간 —',
    '헤이필름이 함께 담아드릴게요.',
  ],
};

/* Philosophy 본문 */
export const philosophy = [
  '자연스러운 채광이 드는 집,',
  '아이와 가족이 함께하는',
  '가장 아늑하고 따뜻한',
  '찰나의 순간을 기록합니다.',
];
