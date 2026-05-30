// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  // 완전한 정적 사이트(SSG)로 빌드 → dist/ 폴더에 순수 HTML/CSS/JS 출력
  output: 'static',

  // 배포 도메인이 확정되면 SEO(사이트맵/OG)용으로 채워주세요.
  // 예) site: 'https://hejfilm.pages.dev',
  site: 'https://hejfilm.pages.dev',

  integrations: [tailwind()],

  build: {
    // CSS를 head에 인라인하지 않고 별도 파일로 분리(캐싱 유리)
    inlineStylesheets: 'auto',
  },
});
