# HEJ Film — 헤이필름 홈스냅 (Astro SSG)

스냅사진 작가 **헤이필름**의 포트폴리오 웹사이트입니다.
Kimi로 1차 생성된 Vite + React 원페이지 앱을 **Astro 정적 사이트(SSG)** 구조로 리팩토링하여,
Cloudflare Pages에 백엔드 없이 배포할 수 있도록 최적화했습니다.

## 기술 스택

- **Astro 4** — `output: 'static'` (완전한 정적 빌드, JS 런타임 불필요)
- **Tailwind CSS 3** — 빌드 시 사용된 클래스만 추출(CDN 미사용)
- **Vanilla TypeScript** — 갤러리 필터·라이트박스·스크롤 인터랙션 (React 제거)

## 폴더 구조

```
astro-site/
├─ public/                 # 그대로 배포되는 정적 자산
│  ├─ images/              # 사진 9장 (hero, work, profile)
│  ├─ _headers             # Cloudflare Pages 캐시·보안 헤더
│  └─ robots.txt
├─ src/
│  ├─ data/
│  │  └─ site.ts           # 모든 텍스트·링크·갤러리 데이터 (단일 출처)
│  ├─ layouts/
│  │  └─ BaseLayout.astro  # 공통 <head>(SEO/OG) + Header + Footer
│  ├─ components/          # 재사용 컴포넌트
│  │  ├─ Header.astro      # 고정 헤더 + 데스크톱 내비
│  │  ├─ MobileMenu.astro  # 모바일 풀스크린 메뉴
│  │  ├─ Footer.astro
│  │  ├─ SectionHeading.astro
│  │  ├─ HeroSlot.astro    # 히어로 이미지 크로스페이드
│  │  └─ Gallery.astro     # 카테고리 필터 + 라이트박스
│  ├─ pages/               # 멀티페이지 라우트 (파일 = URL)
│  │  ├─ index.astro       # /        홈 (히어로 + Philosophy)
│  │  ├─ work.astro        # /work    포트폴리오
│  │  ├─ about.astro       # /about   작가 소개
│  │  ├─ guide.astro       # /guide   촬영 안내
│  │  ├─ contact.astro     # /contact 인스타·카카오 연결
│  │  └─ 404.astro
│  ├─ scripts/
│  │  ├─ ui.ts             # 공통 인터랙션 (헤더·스크롤·모바일메뉴·히어로)
│  │  └─ gallery.ts        # 갤러리 필터·라이트박스 (필요 페이지만 로드)
│  └─ styles/
│     └─ global.css        # 디자인 토큰 + 공통 유틸
├─ astro.config.mjs
├─ tailwind.config.mjs
└─ package.json
```

## 로컬 개발

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # dist/ 에 정적 파일 생성
npm run preview   # 빌드 결과 미리보기
```

> `dist/` 폴더에는 검증용으로 빌드된 결과물이 포함되어 있습니다.
> 재빌드 시 자동으로 갱신되며, 직접 커밋할 필요는 없습니다(`.gitignore` 처리됨).

## Cloudflare Pages 배포 설정

Cloudflare 대시보드 → **Workers & Pages → Create → Pages → Connect to Git** 후
프로젝트(저장소)를 연결하고 아래 값을 입력합니다.

| 항목 | 값 |
|------|----|
| **Framework preset** | `Astro` |
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |
| **Root directory** | `astro-site` *(저장소 루트에 astro-site 폴더가 있을 경우)* |
| **Node version** | `20` 이상 (환경변수 `NODE_VERSION=20` 권장) |

### 배포 시 주의사항

1. **루트 디렉터리** — 이 저장소는 `astro-site/` 하위에 사이트가 있으므로,
   Cloudflare 빌드 설정의 *Root directory*를 반드시 `astro-site`로 지정하세요.
   (저장소 자체를 astro-site 내용으로 만들면 비워둬도 됩니다.)
2. **출력 디렉터리는 `dist`** — Astro 기본 출력 폴더입니다.
3. **도메인 확정 후** `astro.config.mjs`의 `site` 값과 `public/robots.txt`의
   Sitemap URL을 실제 도메인으로 바꾸면 OG·canonical·robots가 정확해집니다.
4. **`_headers` 파일** — `public/_headers`가 빌드 시 `dist/_headers`로 복사되어
   Cloudflare Pages가 자동 적용합니다(캐시·보안 헤더).
5. 별도 서버·환경변수·API 키가 필요 없습니다. 문의는 인스타그램/카카오 외부 링크로 연결됩니다.

## 콘텐츠 수정 방법

대부분의 문구·링크·갤러리 항목은 **`src/data/site.ts`** 한 파일에서 관리됩니다.
사진 교체는 `public/images/`에 같은 파일명으로 덮어쓰거나, `site.ts`의 경로를 수정하세요.
