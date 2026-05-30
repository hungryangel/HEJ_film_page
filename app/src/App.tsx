import { useState, useEffect, useRef, useCallback } from 'react'

/* ── Types ── */
interface GalleryItem {
  src: string
  alt: string
  category: string
  ratio: string
}

/* ── Data ── */
const galleryItems: GalleryItem[] = [
  { src: '/images/work-1.jpg', alt: '비 오는 날 창가의 가족', category: 'family', ratio: '3/4' },
  { src: '/images/work-2.jpg', alt: '도넛으로 장난치는 커플', category: 'couple', ratio: '1/1' },
  { src: '/images/work-3.jpg', alt: '흑백 침대 위의 가족', category: 'home', ratio: '3/4' },
  { src: '/images/work-4.jpg', alt: '역광 속 가족', category: 'family', ratio: '1/1' },
  { src: '/images/hero-2.jpg', alt: '크리스마스 임산부', category: 'maternity', ratio: '2/3' },
  { src: '/images/work-6.jpg', alt: '복도의 어린이', category: 'home', ratio: '3/4' },
]

const categories = [
  { key: 'all', label: 'All' },
  { key: 'home', label: 'Home Snap' },
  { key: 'couple', label: 'Couple' },
  { key: 'family', label: 'Family' },
  { key: 'maternity', label: 'Maternity' },
  { key: 'wedding', label: 'Wedding' },
]

const navLinks = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Guide', href: '#guide' },
  { label: 'Contact', href: '#contact' },
]

/* ── Hero crossfade slot ── */
function HeroSlot({
  images,
  interval = 12000,
  className = '',
  style = {},
  children,
}: {
  images: string[]
  interval?: number
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}) {
  const [index, setIndex] = useState(0)
  useEffect(() => {
    if (images.length <= 1) return
    const timer = setInterval(() => setIndex((p) => (p + 1) % images.length), interval)
    return () => clearInterval(timer)
  }, [images.length, interval])
  return (
    <div className={`relative overflow-hidden ${className}`} style={style}>
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: i === index ? 1 : 0, transition: 'opacity 4s ease-in-out' }}
        />
      ))}
      {children}
    </div>
  )
}

/* ── Scroll reveal hook ── */
function useScrollReveal(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, visible }
}

/* ── Lightbox Component ── */
function Lightbox({
  src,
  alt,
  onClose,
}: {
  src: string
  alt: string
  onClose: () => void
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: 'rgba(26, 26, 26, 0.95)', animation: 'fadeIn 0.3s ease-out forwards' }}
      onClick={onClose}
    >
      <img
        src={src}
        alt={alt}
        className="max-h-[90vh] max-w-[90vw] object-contain"
        style={{ animation: 'scaleIn 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards' }}
        onClick={(e) => e.stopPropagation()}
      />
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white text-3xl leading-none hover:opacity-70 transition-opacity"
        style={{ fontFamily: 'var(--font-serif)' }}
      >
        ×
      </button>
    </div>
  )
}

/* ── Main App ── */
export default function App() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  const heroRef = useRef<HTMLElement>(null)
  const workRef = useRef<HTMLElement>(null)
  const aboutRef = useRef<HTMLElement>(null)
  const guideRef = useRef<HTMLElement>(null)
  const contactRef = useRef<HTMLElement>(null)

  const philosophyReveal = useScrollReveal(0.2)
  const workReveal = useScrollReveal(0.15)
  const aboutReveal = useScrollReveal(0.15)
  const guideReveal = useScrollReveal(0.15)
  const contactReveal = useScrollReveal(0.15)

  /* Scroll listener for header + active section */
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)

      const sections = [
        { id: 'work', ref: workRef },
        { id: 'about', ref: aboutRef },
        { id: 'guide', ref: guideRef },
        { id: 'contact', ref: contactRef },
      ]
      const scrollPos = window.scrollY + 120
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = sections[i].ref.current
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sections[i].id)
          return
        }
      }
      setActiveSection('')
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const filteredItems =
    activeCategory === 'all'
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory)

  const scrollTo = useCallback((href: string) => {
    const id = href.replace('#', '')
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
    setMobileOpen(false)
  }, [])

  const headerTextColor = scrolled ? 'var(--color-ink)' : '#FFFFFF'
  const headerMutedColor = scrolled ? 'var(--color-muted)' : 'rgba(255,255,255,0.7)'
  const headerAccentColor = scrolled ? 'var(--color-accent)' : '#FFFFFF'

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      {/* ─── Header ─── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          height: 72,
          background: scrolled ? 'rgba(245, 240, 232, 0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(26, 26, 26, 0.06)' : '1px solid transparent',
          animation: 'fadeIn 0.6s ease-out 0.2s both',
        }}
      >
        <div className="mx-auto flex items-center justify-between h-full" style={{ maxWidth: 1200, padding: '0 24px' }}>
          {/* Wordmark */}
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-baseline gap-2">
            <span
              className="text-xl tracking-[0.12em]"
              style={{ fontFamily: 'var(--font-serif)', color: headerTextColor, fontWeight: 400, transition: 'color 0.5s' }}
            >
              HEJ
            </span>
            <span
              className="text-sm tracking-[0.08em]"
              style={{ fontFamily: 'var(--font-serif)', color: headerMutedColor, fontWeight: 300, transition: 'color 0.5s' }}
            >
              Film
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="relative group"
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 15,
                  fontWeight: 500,
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.08em',
                  color: activeSection === link.href.slice(1) ? headerAccentColor : headerTextColor,
                  transition: 'color 0.5s',
                }}
              >
                {link.label}
                <span
                  className="absolute bottom-0 left-0 h-[1px] bg-current transition-all duration-300"
                  style={{
                    width: activeSection === link.href.slice(1) ? '100%' : '0%',
                  }}
                />
              </button>
            ))}
          </nav>

          {/* Mobile Hamburger */}
          <button className="md:hidden flex flex-col gap-[5px] p-2" onClick={() => setMobileOpen(true)}>
            <span className="block w-5 h-[1.5px] transition-colors duration-500" style={{ background: headerTextColor }} />
            <span className="block w-5 h-[1.5px] transition-colors duration-500" style={{ background: headerTextColor }} />
            <span className="block w-3 h-[1.5px] transition-colors duration-500" style={{ background: headerTextColor }} />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[90] flex flex-col items-center justify-center gap-8"
          style={{ background: 'var(--color-bg)', animation: 'fadeIn 0.3s ease-out' }}
        >
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute top-6 right-6 text-3xl"
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}
          >
            ×
          </button>
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className="text-2xl"
              style={{
                fontFamily: 'var(--font-serif)',
                fontWeight: 300,
                letterSpacing: '0.08em',
                color: 'var(--color-ink)',
              }}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}

      {/* ─── Hero ─── */}
      <section ref={heroRef} className="relative w-full" style={{ height: '100vh', overflow: 'hidden' }}>
        {/* Asymmetric Grid with crossfade */}
        <div className="absolute inset-0 flex" style={{ gap: 3 }}>
          {/* Left 65% - landscape flagship */}
          <HeroSlot
            images={['/images/hero-1.jpg']}
            interval={12000}
            className="w-full h-full"
            style={{ width: '65%' }}
          >
            {/* Overlay gradient */}
            <div
              className="absolute inset-0 z-10"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 55%)' }}
            />
            {/* Text overlay */}
            <div
              className="absolute bottom-12 left-8 md:bottom-16 md:left-12 z-20"
              style={{ animation: 'fadeInUp 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.8s both' }}
            >
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(48px, 8vw, 80px)', fontWeight: 300, color: '#FFFFFF', lineHeight: 1, textShadow: '0 2px 40px rgba(0,0,0,0.35)' }}>
                HEJ
              </h1>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(18px, 3vw, 28px)', fontWeight: 300, color: '#FFFFFF', marginTop: 4 }}>
                Film
              </p>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 18, fontWeight: 300, color: '#FFFFFF', opacity: 0.9, marginTop: 16 }}>
                안녕한 기록,
              </p>
            </div>
          </HeroSlot>

          {/* Right 35% */}
          <div className="flex flex-col" style={{ width: '35%', gap: 3 }}>
            {/* Right Top 60% - rotating portrait */}
            <HeroSlot
              images={['/images/hero-2.jpg', '/images/work-6.jpg']}
              interval={12000}
              className="w-full"
              style={{ height: '60%' }}
            />
            {/* Right Bottom 40% - rotating portrait */}
            <HeroSlot
              images={['/images/hero-3.jpg', '/images/work-2.jpg', '/images/work-3.jpg']}
              interval={12000}
              className="w-full"
              style={{ height: '40%' }}
            />
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce-down"
          style={{ animationDelay: '1.5s', opacity: 0.6 }}
        >
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#FFFFFF' }}>
            scroll
          </span>
          <div className="w-[1px] h-10" style={{ background: 'rgba(255,255,255,0.6)' }} />
        </div>
      </section>

      {/* ─── Philosophy ─── */}
      <section
        ref={philosophyReveal.ref}
        className="mx-auto"
        style={{ maxWidth: 1200, padding: '160px 24px' }}
      >
        <div
          className="text-center"
          style={{
            opacity: philosophyReveal.visible ? 1 : 0,
            transform: philosophyReveal.visible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        >
          <div style={{ width: 40, height: 1, background: 'var(--color-accent)', margin: '0 auto 48px' }} />

          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 11,
              fontWeight: 500,
              textTransform: 'uppercase' as const,
              letterSpacing: '0.2em',
              color: 'var(--color-muted)',
            }}
          >
            Philosophy
          </p>

          <p
            className="mx-auto"
            style={{
              maxWidth: 480,
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(16px, 2vw, 20px)',
              fontWeight: 300,
              lineHeight: 2,
              color: 'var(--color-ink)',
              marginTop: 32,
            }}
          >
            자연스러운 채광이 드는 집,
            <br />
            아이와 가족이 함께하는
            <br />
            가장 아늑하고 따뜻한
            <br />
            찰나의 순간을 기록합니다.
          </p>
        </div>
      </section>

      {/* ─── Work ─── */}
      <section
        id="work"
        ref={workRef}
        className="mx-auto"
        style={{ maxWidth: 1200, padding: '120px 24px' }}
      >
        <div ref={workReveal.ref}>
          {/* Section Title */}
          <div
            className="text-center mb-12"
            style={{
              opacity: workReveal.visible ? 1 : 0,
              transform: workReveal.visible ? 'translateY(0)' : 'translateY(40px)',
              transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}
          >
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(36px, 5vw, 48px)', fontWeight: 300, fontStyle: 'italic', color: 'var(--color-ink)' }}>
              Work
            </h2>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 400, color: 'var(--color-muted)', marginTop: 8 }}>
              함께한 기록들
            </p>
            <div style={{ width: 40, height: 1, background: 'var(--color-accent)', margin: '20px auto 0' }} />
          </div>

          {/* Category Tabs */}
          <div
            className="flex flex-wrap justify-center gap-6 mb-12"
            style={{
              opacity: workReveal.visible ? 1 : 0,
              transform: workReveal.visible ? 'translateY(0)' : 'translateY(40px)',
              transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.15s',
            }}
          >
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className="relative pb-1 transition-colors duration-300"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 14,
                  fontWeight: 400,
                  color: activeCategory === cat.key ? 'var(--color-ink)' : 'var(--color-muted)',
                }}
              >
                {cat.label}
                <span
                  className="absolute bottom-0 left-0 h-[1px] transition-all duration-300"
                  style={{
                    width: activeCategory === cat.key ? '100%' : '0%',
                    background: 'var(--color-accent)',
                  }}
                />
              </button>
            ))}
          </div>

          {/* Masonry Grid */}
          <div className="columns-1 md:columns-2 lg:columns-3" style={{ gap: 12 }}>
            {filteredItems.map((item, i) => (
              <div
                key={item.src + activeCategory}
                className="break-inside-avoid mb-3 cursor-pointer overflow-hidden"
                style={{
                  opacity: workReveal.visible ? 1 : 0,
                  transform: workReveal.visible ? 'translateY(0)' : 'translateY(30px)',
                  transition: `all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${0.1 + i * 0.1}s`,
                }}
                onClick={() => setLightbox({ src: item.src, alt: item.alt })}
              >
                <div className="overflow-hidden">
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="w-full object-cover transition-all duration-500 hover:scale-[1.02] hover:brightness-105"
                    style={{ aspectRatio: item.ratio }}
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── About ─── */}
      <section
        id="about"
        ref={aboutRef}
        className="mx-auto"
        style={{ maxWidth: 1200, padding: '120px 24px' }}
      >
        <div ref={aboutReveal.ref}>
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
            {/* Left: Photo */}
            <div
              className="w-full md:w-[45%] flex justify-center"
              style={{
                opacity: aboutReveal.visible ? 1 : 0,
                transform: aboutReveal.visible ? 'translateX(0)' : 'translateX(-40px)',
                transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              }}
            >
              <img
                src="/images/profile.png"
                alt="헤이필름 작가"
                className="w-full max-w-[420px] object-cover"
                style={{ aspectRatio: '1/1' }}
                loading="lazy"
              />
            </div>

            {/* Right: Text */}
            <div
              className="w-full md:w-[55%]"
              style={{
                opacity: aboutReveal.visible ? 1 : 0,
                transform: aboutReveal.visible ? 'translateX(0)' : 'translateX(40px)',
                transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.15s',
              }}
            >
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(36px, 5vw, 48px)', fontWeight: 300, fontStyle: 'italic', color: 'var(--color-ink)' }}>
                About
              </h2>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 18, fontWeight: 300, color: 'var(--color-muted)', marginTop: 24 }}>
                우리의 그림같은 시간을 그려요 :)
              </p>
              <div style={{ width: 40, height: 1, background: 'var(--color-accent)', marginTop: 20 }} />
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 16, fontWeight: 300, lineHeight: 1.9, color: 'var(--color-ink)', marginTop: 24 }}>
                자연스럽고 담책한 모습 그대로를 담아요.
                <br />
                과한 보정 대신, 흐린 날 부드럽게 퍼지는 빛의 결까지 그대로 남깁니다.
                <br />
                빛바랠수록 더 아름다운 시간 —
                <br />
                헤이필름이 함께 담아드릴게요.
              </p>
              <div style={{ marginTop: 48 }}>
                <p style={{ fontFamily: 'var(--font-serif)', fontSize: 11, fontWeight: 500, textTransform: 'uppercase' as const, letterSpacing: '0.2em', color: 'var(--color-muted)' }}>
                  Photographer
                </p>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 400, color: 'var(--color-ink)', marginTop: 8, letterSpacing: '0.02em' }}>
                  hej.u
                </p>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 300, color: 'var(--color-muted)', marginTop: 4, letterSpacing: '0.08em' }}>
                  · SEOUL
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Guide ─── */}
      <section
        id="guide"
        ref={guideRef}
        className="mx-auto"
        style={{ maxWidth: 1200, padding: '120px 24px' }}
      >
        <div ref={guideReveal.ref}>
          {/* Section Title */}
          <div
            className="text-center mb-12"
            style={{
              opacity: guideReveal.visible ? 1 : 0,
              transform: guideReveal.visible ? 'translateY(0)' : 'translateY(40px)',
              transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}
          >
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(36px, 5vw, 48px)', fontWeight: 300, fontStyle: 'italic', color: 'var(--color-ink)' }}>
              Guide
            </h2>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 400, color: 'var(--color-muted)', marginTop: 8 }}>
              촬영 안내
            </p>
            <div style={{ width: 40, height: 1, background: 'var(--color-accent)', margin: '20px auto 0' }} />
          </div>

          {/* Package Card */}
          <div
            className="mx-auto"
            style={{
              maxWidth: 640,
              background: 'var(--color-card)',
              border: '1px solid rgba(26, 26, 26, 0.06)',
              padding: '56px 48px',
              opacity: guideReveal.visible ? 1 : 0,
              transform: guideReveal.visible ? 'scale(1)' : 'scale(0.98)',
              transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.15s',
            }}
          >
            <div className="flex items-baseline gap-3">
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 32, fontWeight: 400, fontStyle: 'italic', color: 'var(--color-ink)' }}>
                Home Snap
              </h3>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--color-muted)' }}>홈스냅</span>
            </div>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 16, fontWeight: 400, color: 'var(--color-ink)', marginTop: 12 }}>
              홈스냅 · 만삭스냅 · 세미웨딩 · 웨딩홈스냅
            </p>

            <div style={{ width: '100%', height: 1, background: 'rgba(26, 26, 26, 0.08)', margin: '32px 0' }} />

            <ul style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                '1차 셀렉 원본, 작가 셀렉 색감+보정본 30장 제공',
                '촬영 시간: 1시간 ~ 1시간 반',
                '실내 촬영 후 집 근처 야외 촬영 가능',
                '자연광 아래 진행, 빛이 가장 길게 들어오는 시간대 추천',
                '보정본 수정 2회까지 가능',
              ].map((item, i) => (
                <li key={i} style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--color-muted)', lineHeight: 2.0 }}>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Detail Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-auto" style={{ maxWidth: 800, marginTop: 48 }}>
            {[
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
            ].map((card, i) => (
              <div
                key={card.title}
                className="p-8"
                style={{
                  background: 'var(--color-card)',
                  border: '1px solid rgba(26, 26, 26, 0.06)',
                  opacity: guideReveal.visible ? 1 : 0,
                  transform: guideReveal.visible ? 'translateY(0)' : 'translateY(30px)',
                  transition: `all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${0.3 + i * 0.15}s`,
                }}
              >
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 400, fontStyle: 'italic', color: 'var(--color-ink)' }}>
                  {card.title}
                </h4>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--color-muted)', marginTop: 4 }}>{card.ko}</p>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--color-muted)', lineHeight: 1.7, marginTop: 12 }}>
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Contact ─── */}
      <section
        id="contact"
        ref={contactRef}
        className="mx-auto"
        style={{ maxWidth: 1200, padding: '120px 24px' }}
      >
        <div ref={contactReveal.ref} className="text-center">
          <div
            style={{
              opacity: contactReveal.visible ? 1 : 0,
              transform: contactReveal.visible ? 'translateY(0)' : 'translateY(40px)',
              transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}
          >
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(36px, 5vw, 48px)', fontWeight: 300, fontStyle: 'italic', color: 'var(--color-ink)' }}>
              Contact
            </h2>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 400, color: 'var(--color-muted)', marginTop: 8 }}>
              문의
            </p>
            <div style={{ width: 40, height: 1, background: 'var(--color-accent)', margin: '20px auto 0' }} />
          </div>

          <p
            className="mx-auto"
            style={{
              maxWidth: 480,
              fontFamily: 'var(--font-sans)',
              fontSize: 16,
              fontWeight: 300,
              lineHeight: 1.8,
              color: 'var(--color-ink)',
              marginTop: 40,
              opacity: contactReveal.visible ? 1 : 0,
              transform: contactReveal.visible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.15s',
            }}
          >
            소중한 순간을 함께 기록하고 싶으시다면
            <br />
            언제든지 연락주세요.
          </p>

          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            style={{
              marginTop: 48,
              opacity: contactReveal.visible ? 1 : 0,
              transform: contactReveal.visible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.25s',
            }}
          >
            <a
              href="https://www.instagram.com/hej___u"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto text-center transition-all duration-300 hover:bg-[var(--color-ink)] hover:text-[var(--color-bg)]"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 14,
                fontWeight: 400,
                color: 'var(--color-ink)',
                border: '1px solid var(--color-ink)',
                padding: '16px 40px',
              }}
            >
              Instagram @hej___u
            </a>
            <a
              href="https://pf.kakao.com/hejfilm_"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto text-center transition-all duration-300 hover:brightness-90"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 14,
                fontWeight: 400,
                color: '#FFFFFF',
                background: 'var(--color-accent)',
                padding: '16px 40px',
              }}
            >
              KakaoTalk hejfilm_
            </a>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer
        className="w-full"
        style={{
          background: '#EDE8DF',
          borderTop: '1px solid rgba(196, 168, 130, 0.25)',
        }}
      >
        <div
          className="mx-auto flex flex-col items-center justify-center text-center"
          style={{
            maxWidth: 1200,
            padding: '64px 24px',
            minHeight: 200,
            gap: 24,
          }}
        >
          {/* Film edge marks */}
          <div className="flex items-center gap-3">
            <div style={{ width: 24, height: 1, background: 'var(--color-accent)', opacity: 0.5 }} />
            <div style={{ width: 4, height: 4, background: 'var(--color-accent)', opacity: 0.4, transform: 'rotate(45deg)' }} />
            <div style={{ width: 24, height: 1, background: 'var(--color-accent)', opacity: 0.5 }} />
          </div>

          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 14,
              fontWeight: 400,
              letterSpacing: '0.15em',
              color: 'var(--color-ink)',
              textTransform: 'uppercase' as const,
            }}
          >
            HEJ FILM
          </p>

          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 12,
              fontWeight: 300,
              letterSpacing: '0.1em',
              color: 'var(--color-muted)',
            }}
          >
            © 2026 HEJ FILM · ALL RECORDS RESERVED
          </p>

          <a
            href="https://www.velnoc.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-300"
            style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--color-muted)', opacity: 0.7 }}
          >
            Made with VELNOC
          </a>
        </div>
      </footer>

      {/* ─── Lightbox ─── */}
      {lightbox && (
        <Lightbox
          src={lightbox.src}
          alt={lightbox.alt}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  )
}
