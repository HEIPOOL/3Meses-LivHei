// src/hooks/useFontLoader.js
import { useState, useEffect } from 'react';

export function useFontLoader() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [fontProgress, setFontProgress] = useState(0);

  useEffect(() => {
    const loadFonts = async () => {
      try {
        console.log('Iniciando carregamento de fontes...');
        
        // Fontes locais (preferidas)
        const fontsToLoad = [
          {
            name: 'Playfair Display',
            url: '/fonts/PlayfairDisplay-VariableFont_wght.ttf',
            fallback: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900&display=swap'
          },
          {
            name: 'Inter',
            url: '/fonts/Inter-VariableFont_slnt,wght.ttf',
            fallback: 'https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap'
          }
        ];

        let loadedCount = 0;
        const totalFonts = fontsToLoad.length;

        const updateProgress = () => {
          loadedCount++;
          const progress = Math.round((loadedCount / totalFonts) * 100);
          setFontProgress(progress);
          console.log(`Fonte carregada: ${loadedCount}/${totalFonts} (${progress}%)`);
          
          if (loadedCount === totalFonts) {
            console.log('Todas as fontes carregadas!');
            setFontsLoaded(true);
          }
        };

        // Tentar carregar fontes locais primeiro
        for (const font of fontsToLoad) {
          try {
            const fontFace = new FontFace(
              font.name,
              `url(${font.url}) format('truetype')`,
              { display: 'swap' }
            );
            
            const loadedFont = await fontFace.load();
            document.fonts.add(loadedFont);
            console.log(`Fonte local carregada: ${font.name}`);
            updateProgress();
          } catch (localError) {
            console.warn(`Falha ao carregar fonte local ${font.name}:`, localError);
            
            // Fallback para Google Fonts
            console.log(`Tentando fallback para ${font.name}...`);
            const link = document.createElement('link');
            link.href = font.fallback;
            link.rel = 'stylesheet';
            
            link.onload = () => {
              console.log(`Fallback carregado: ${font.name}`);
              updateProgress();
            };
            
            link.onerror = () => {
              console.error(`Falha no fallback para ${font.name}`);
              updateProgress(); // Avançar mesmo com erro
            };
            
            document.head.appendChild(link);
          }
        }

        // Timeout de segurança
        setTimeout(() => {
          if (!fontsLoaded) {
            console.warn('Timeout no carregamento de fontes, continuando...');
            setFontsLoaded(true);
            setFontProgress(100);
          }
        }, 5000);

      } catch (error) {
        console.error('Erro crítico no carregamento de fontes:', error);
        // Continuar mesmo sem fontes
        setFontsLoaded(true);
        setFontProgress(100);
      }
    };

    loadFonts();
  }, [fontsLoaded]);

  return { fontsLoaded, fontProgress };
}