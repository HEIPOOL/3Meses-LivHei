// src/pages/_app.jsx - VERSÃO COM CORREÇÕES WEBGL
import { useEffect } from 'react';
import '@/styles/globals.css';
import '@/styles/emotional-theme.css';
import Head from 'next/head';
import { FloatingHearts } from '@/components/ui/FloatingHearts';

// Garantir que THREE seja carregado globalmente
if (typeof window !== 'undefined') {
  try {
    window.THREE = require('three');
    console.log('✅ THREE carregado globalmente');
  } catch (error) {
    console.error('❌ Erro ao carregar THREE:', error);
  }
}

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // Verificar se THREE está disponível
    if (typeof window !== 'undefined' && !window.THREE) {
      try {
        window.THREE = require('three');
        console.log('✅ THREE carregado via useEffect');
      } catch (error) {
        console.error('❌ Erro ao carregar THREE no useEffect:', error);
      }
    }
    
    // Configurações de WebGL/Canvas
    const setupWebGL = () => {
      try {
        // Verificar suporte a WebGL
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!gl) {
          console.warn('⚠️ WebGL não suportado pelo navegador');
          // Adicionar classe para fallback
          document.documentElement.classList.add('no-webgl');
          return;
        }
        
        console.log('✅ WebGL suportado:', {
          renderer: gl.getParameter(gl.RENDERER),
          vendor: gl.getParameter(gl.VENDOR),
          version: gl.getParameter(gl.VERSION)
        });
        
        document.documentElement.classList.add('webgl-supported');
        
      } catch (error) {
        console.error('❌ Erro ao configurar WebGL:', error);
        document.documentElement.classList.add('no-webgl');
      }
    };
    
    // Adicionar classe para estilização
    document.body.classList.add('three-loaded');
    
    // Configurar WebGL
    setupWebGL();
    
    // Pré-carregar fontes críticas
    const preloadFonts = async () => {
      try {
        const playfair = new FontFace(
          'Playfair Display',
          'url(https://fonts.gstatic.com/s/playfairdisplay/v30/nuFiD-vYSZviVYUb_rj3ij__anPXDTjYgFE_.woff2)'
        );
        
        const inter = new FontFace(
          'Inter',
          'url(https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek.woff2)'
        );

        await Promise.all([playfair.load(), inter.load()]);
        document.fonts.add(playfair);
        document.fonts.add(inter);
        console.log('✅ Fontes carregadas com sucesso');
      } catch (error) {
        console.warn('⚠️ Erro ao carregar fontes:', error);
      }
    };
    
    preloadFonts();
    
    // Adicionar suporte para prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      document.documentElement.classList.add('reduced-motion');
    }
    
    mediaQuery.addEventListener('change', (event) => {
      if (event.matches) {
        document.documentElement.classList.add('reduced-motion');
      } else {
        document.documentElement.classList.remove('reduced-motion');
      }
    });
    
    // Log de performance
    const performanceMonitor = () => {
      window.addEventListener('load', () => {
        const timing = performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        console.log(`📊 Tempo de carregamento: ${loadTime}ms`);
        
        // Verificar memória se disponível
        if (performance.memory) {
          console.log('📊 Uso de memória:', {
            used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) + 'MB',
            total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024) + 'MB',
            limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024) + 'MB'
          });
        }
      });
    };
    
    performanceMonitor();
    
  }, []);

  return (
    <>
      <Head>
        <title>❤️ Heitor & Livia — Galeria Imersiva 3D</title>
        <meta name="description" content="Uma experiência cinematográfica em 3D dedicada ao amor de Heitor e Livia. Entre na galeria das memórias eternas." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Pré-conectar para melhor performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Fontes críticas */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900&family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" 
          rel="stylesheet"
        />
        
        {/* Open Graph */}
        <meta property="og:title" content="❤️ Heitor & Livia — Galeria Imersiva 3D" />
        <meta property="og:description" content="Uma experiência cinematográfica em 3D com nossas memórias mais preciosas." />
        <meta property="og:image" content="https://i.ibb.co/placeholder/og-image.jpg" />
        <meta property="og:url" content="https://heitor-livia.com/galeria" />
        <meta property="og:type" content="website" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="❤️ Heitor & Livia — Galeria Imersiva 3D" />
        <meta name="twitter:description" content="Uma experiência cinematográfica em 3D com nossas memórias mais preciosas." />
        <meta name="twitter:image" content="https://i.ibb.co/placeholder/og-image.jpg" />
        
        {/* Cor tema para navegadores mobile */}
        <meta name="theme-color" content="#8B0000" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* Meta tags para PWA */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Heitor & Livia" />
        
        {/* Meta tags de performance */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="robots" content="index, follow" />
        
        {/* Meta tags para evitar zoom em input no iOS */}
        <meta name="format-detection" content="telephone=no" />
        
        {/* Critical CSS inline para WebGL */}
        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          html, body, #__next {
            width: 100%;
            height: 100%;
            overflow: hidden;
          }
          
          body {
            font-family: 'Inter', sans-serif;
            background: #000;
            color: white;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          
          /* Canvas WebGL fix */
          canvas {
            display: block !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            z-index: 10 !important;
            outline: none !important;
            pointer-events: auto !important;
            image-rendering: -webkit-optimize-contrast;
            image-rendering: crisp-edges;
            image-rendering: pixelated;
          }
          
          /* Fallback para quando WebGL não funciona */
          .no-webgl canvas {
            opacity: 0 !important;
            pointer-events: none !important;
          }
          
          .no-webgl::after {
            content: "⚠️ Seu navegador não suporta WebGL. A experiência 3D não está disponível.";
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 2rem;
            border-radius: 1rem;
            text-align: center;
            z-index: 1000;
            max-width: 90%;
          }
          
          .reduced-motion *,
          .reduced-motion *::before,
          .reduced-motion *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
          
          /* Garantir que o Canvas do Three.js seja renderizado corretamente */
          .three-loaded canvas[data-engine*="three.js"] {
            opacity: 1 !important;
            visibility: visible !important;
          }
        `}</style>
      </Head>
      
      {/* Efeito de partículas flutuantes */}
      <FloatingHearts />
      
      {/* Conteúdo principal */}
      <main className="min-h-screen relative z-10">
        <Component {...pageProps} />
      </main>
      
      {/* Efeito de vinheta cinematográfica */}
      <div className="fixed inset-0 pointer-events-none z-20"
           style={{
             background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.5) 100%)'
           }}
      />
      
      {/* Overlay de brilho emocional */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-[var(--color-love-red)]/20 to-[var(--color-passion-pink)]/20 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-[var(--color-golden-glow)]/15 to-[var(--color-romantic-gold)]/15 blur-3xl" />
      </div>
      
      {/* Script de diagnóstico e correção */}
      <script dangerouslySetInnerHTML={{
        __html: `
          (function() {
            // Log de erros globais
            window.__errorLog = [];
            const originalError = window.onerror;
            window.onerror = function(message, source, lineno, colno, error) {
              window.__errorLog.push({
                message: message,
                source: source,
                line: lineno,
                column: colno,
                error: error?.stack,
                timestamp: new Date().toISOString()
              });
              
              if (originalError) {
                return originalError(message, source, lineno, colno, error);
              }
              return false;
            };
            
            // Corrigir Canvas após carregamento
            window.addEventListener('load', function() {
              setTimeout(function() {
                console.log('🔧 Verificando Canvas...');
                
                const canvas = document.querySelector('canvas[data-engine*="three.js"]');
                if (canvas) {
                  // Forçar dimensões corretas
                  canvas.width = window.innerWidth * window.devicePixelRatio;
                  canvas.height = window.innerHeight * window.devicePixelRatio;
                  
                  // Forçar estilos
                  canvas.style.cssText = \`
                    position: fixed !important;
                    top: 0 !important;
                    left: 0 !important;
                    width: 100vw !important;
                    height: 100vh !important;
                    z-index: 10 !important;
                    display: block !important;
                    opacity: 1 !important;
                    pointer-events: auto !important;
                    image-rendering: -webkit-optimize-contrast;
                    image-rendering: crisp-edges;
                  \`;
                  
                  console.log('✅ Canvas otimizado');
                  
                  // Verificar contexto WebGL
                  try {
                    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
                    if (!gl) {
                      console.warn('⚠️ Canvas não tem contexto WebGL ativo');
                      // Tentar recriar
                      canvas.getContext = null;
                    } else {
                      console.log('✅ Contexto WebGL ativo no canvas');
                    }
                  } catch (error) {
                    console.error('❌ Erro ao verificar WebGL:', error);
                  }
                } else {
                  console.warn('⚠️ Canvas do Three.js não encontrado');
                }
                
                // Forçar redraw
                window.dispatchEvent(new Event('resize'));
              }, 500);
            });
            
            // Comandos de debug
            window.debugWebGL = {
              forceContext: function() {
                const canvas = document.querySelector('canvas');
                if (canvas) {
                  const ctx = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
                  if (ctx) {
                    console.log('✅ Contexto WebGL forçado');
                    return ctx;
                  }
                }
                console.log('❌ Não foi possível criar contexto');
                return null;
              },
              reloadPage: function() {
                window.location.reload(true);
              },
              showErrors: function() {
                console.log('📋 Últimos erros:', window.__errorLog);
              }
            };
            
            console.log('🚀 Sistema de debug carregado');
            console.log('Comandos: debugWebGL.forceContext(), debugWebGL.reloadPage(), debugWebGL.showErrors()');
          })();
        `
      }} />
    </>
  );
}