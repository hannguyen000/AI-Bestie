/** define personal design system */

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Nunito"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        aura: {
          pink:       '#F7C5D8',
          'pink-mid': '#EFA0BE',
          'pink-dark':'#C45C86',
          lav:        '#DDD5F7',
          'lav-mid':  '#B8ABEC',
          'lav-dark': '#7B6CC8',
          peach:      '#FFD9C4',
          'peach-mid':'#FFC5A0',
          'peach-dark':'#D47A44',
          mint:       '#C8EDD8',
          'mint-dark':'#3FA870',
          cream:      '#FEF7F2',
        },
      },
      backgroundImage: {
        'pastel-gradient': 'linear-gradient(135deg, #fce4ec 0%, #f3e5f5 25%, #e8eaf6 50%, #e0f2fe 75%, #e8f5e9 100%)',
        'pastel-hero':     'linear-gradient(160deg, #FDEAF4 0%, #EDE8FA 40%, #DAF0F7 100%)',
        'pink-lav':        'linear-gradient(135deg, #F7C5D8, #DDD5F7)',
        'lav-mint':        'linear-gradient(135deg, #DDD5F7, #C8EDD8)',
        'peach-pink':      'linear-gradient(135deg, #FFD9C4, #F7C5D8)',
      },
      animation: {
        'float':        'float 3s ease-in-out infinite',
        'float-slow':   'float 4.5s ease-in-out infinite',
        'fade-up':      'fadeUp 0.6s ease forwards',
        'fade-in':      'fadeIn 0.5s ease forwards',
        'slide-in':     'slideIn 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards',
        'bounce-soft':  'bounceSoft 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards',
        'shimmer':      'shimmer 2.5s linear infinite',
        'spin-slow':    'spin 8s linear infinite',
        'pulse-soft':   'pulseSoft 2s ease-in-out infinite',
        'carousel-in':  'carouselIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards',
        'carousel-out': 'carouselOut 0.3s ease forwards',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-12px)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateY(30px) scale(0.96)' },
          to:   { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        bounceSoft: {
          from: { opacity: '0', transform: 'scale(0.85)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        pulseSoft: {
          '0%,100%': { opacity: '0.7' },
          '50%':     { opacity: '1' },
        },
        carouselIn: {
          from: { opacity: '0', transform: 'translateX(40px) scale(0.92)' },
          to:   { opacity: '1', transform: 'translateX(0) scale(1)' },
        },
        carouselOut: {
          from: { opacity: '1', transform: 'translateX(0) scale(1)' },
          to:   { opacity: '0', transform: 'translateX(-40px) scale(0.92)' },
        },
      },
      dropShadow: {
        'soft':  '0 4px 20px rgba(180,100,140,0.15)',
        'glow':  '0 0 20px rgba(196,92,134,0.35)',
        'glow-lav': '0 0 20px rgba(123,108,200,0.35)',
      },
      boxShadow: {
        'pastel': '0 8px 32px rgba(180,100,140,0.15)',
        'pastel-lg': '0 16px 48px rgba(180,100,140,0.2)',
        'inset-soft': 'inset 0 1px 0 rgba(255,255,255,0.6)',
      },
    },
  },
  plugins: [],
}