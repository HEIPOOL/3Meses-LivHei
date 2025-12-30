// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      keyframes: {
        'float-heart': {
          '0%': {
            opacity: '0',
            transform: 'translateY(100vh) rotate(0deg) scale(0.5)'
          },
          '10%': {
            opacity: '0.7'
          },
          '90%': {
            opacity: '0.7'
          },
          '100%': {
            opacity: '0',
            transform: 'translateY(-100px) rotate(360deg) scale(1.2)'
          }
        }
      },
      animation: {
        'float-heart': 'float-heart linear infinite'
      },
      colors: {
        'passion-pink': 'var(--color-passion-pink)',
        'love-red': 'var(--color-love-red)',
        'romantic-gold': 'var(--color-romantic-gold)',
        'golden-glow': 'var(--color-golden-glow)'
      }
    }
  },
  plugins: []
}