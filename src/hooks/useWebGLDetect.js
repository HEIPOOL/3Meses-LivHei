// src/hooks/useWebGLDetect.js
import { useEffect, useState } from 'react';

export default function useWebGLDetect() {
  const [hasWebGL, setHasWebGL] = useState(true);
  const [webGLError, setWebGLError] = useState(null);
  const [capabilities, setCapabilities] = useState({});

  useEffect(() => {
    const detectWebGL = () => {
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!gl) {
          setHasWebGL(false);
          setWebGLError('WebGL não suportado pelo navegador');
          return;
        }

        // Detectar capacidades
        const detectedCapabilities = {
          maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
          maxRenderBufferSize: gl.getParameter(gl.MAX_RENDERBUFFER_SIZE),
          maxTextureUnits: gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS),
          maxVaryingVectors: gl.getParameter(gl.MAX_VARYING_VECTORS),
          maxVertexUniforms: gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS),
          maxFragmentUniforms: gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS),
          shaderPrecision: {
            vertex: gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT),
            fragment: gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT)
          }
        };

        setCapabilities(detectedCapabilities);
        
        // Verificar limitações importantes
        if (detectedCapabilities.maxTextureSize < 2048) {
          console.warn('Texturas limitadas a', detectedCapabilities.maxTextureSize);
        }

        // Verificar se é mobile e ajustar qualidade
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile) {
          console.log('Dispositivo móvel detectado - otimizando WebGL');
        }

      } catch (error) {
        setHasWebGL(false);
        setWebGLError(error.message);
      }
    };

    // Executar detecção
    detectWebGL();

    // Detectar mudanças de contexto (perda de contexto WebGL)
    const handleWebGLContextLost = (event) => {
      event.preventDefault();
      console.warn('Contexto WebGL perdido');
      setHasWebGL(false);
      setWebGLError('Contexto WebGL perdido. Recarregue a página.');
    };

    const handleWebGLContextRestored = () => {
      console.log('Contexto WebGL restaurado');
      setHasWebGL(true);
      setWebGLError(null);
      detectWebGL();
    };

    const canvas = document.createElement('canvas');
    canvas.addEventListener('webglcontextlost', handleWebGLContextLost);
    canvas.addEventListener('webglcontextrestored', handleWebGLContextRestored);

    return () => {
      canvas.removeEventListener('webglcontextlost', handleWebGLContextLost);
      canvas.removeEventListener('webglcontextrestored', handleWebGLContextRestored);
    };
  }, []);

  return {
    hasWebGL,
    webGLError,
    capabilities,
    // Função para sugerir qualidade baseada nas capacidades
    getSuggestedQuality: () => {
      if (!hasWebGL) return 'none';
      
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      if (isMobile) {
        if (capabilities.maxTextureSize >= 4096) return 'high';
        if (capabilities.maxTextureSize >= 2048) return 'medium';
        return 'low';
      }
      
      // Desktop
      if (capabilities.maxTextureSize >= 8192) return 'ultra';
      if (capabilities.maxTextureSize >= 4096) return 'high';
      if (capabilities.maxTextureSize >= 2048) return 'medium';
      return 'low';
    }
  };
}