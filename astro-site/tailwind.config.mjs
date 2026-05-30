/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,ts,jsx,tsx,md,mdx}'],
  theme: {
    extend: {
      colors: {
        // 브랜드 팔레트 (CSS 변수와 1:1 매핑 — JS 없이도 사용 가능)
        bg: 'var(--color-bg)',
        ink: 'var(--color-ink)',
        accent: 'var(--color-accent)',
        muted: 'var(--color-muted)',
        card: 'var(--color-card)',
        'photo-paper': 'var(--color-photo-paper)',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        script: ['Parisienne', 'cursive'],
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(40px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        bounceDown: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(8px)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-in-up': 'fadeInUp 1s cubic-bezier(0.25,0.46,0.45,0.94) forwards',
        'bounce-down': 'bounceDown 2s ease-in-out infinite',
        'scale-in': 'scaleIn 0.4s cubic-bezier(0.25,0.46,0.45,0.94) forwards',
      },
    },
  },
  plugins: [],
};
