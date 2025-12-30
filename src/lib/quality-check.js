const QUALITY_CHECKS = [
  {
    id: 'door-animation',
    name: 'Animação da Porta',
    test: () => {
      return document.querySelector('.door-3d') !== null;
    }
  },
  {
    id: 'photos-loaded',
    name: 'Fotos Carregadas',
    test: async () => {
      const images = document.querySelectorAll('img[data-gallery]');
      return Array.from(images).every(img => img.complete);
    }
  },
  {
    id: 'webgl-support',
    name: 'Suporte WebGL',
    test: () => {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      return gl && gl instanceof WebGLRenderingContext;
    }
  },
  {
    id: 'mobile-performance',
    name: 'Performance Mobile',
    test: () => {
      if (!navigator.userAgent.match(/iPhone|Android/)) return true;
      return window.performance.memory.usedJSHeapSize < 50000000;
    }
  },
  {
    id: 'accessibility',
    name: 'Acessibilidade',
    test: () => {
      return document.querySelector('[role="main"]') !== null &&
             document.querySelector('nav[aria-label]') !== null;
    }
  }
];