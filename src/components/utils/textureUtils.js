// src/components/3d/utils/textureUtils.js
import { TextureLoader } from 'three';

// Cache de texturas para performance
const textureCache = new Map();

export const loadTextureWithCache = (url) => {
  if (textureCache.has(url)) {
    return textureCache.get(url);
  }
  
  const loader = new TextureLoader();
  const texture = loader.load(url);
  textureCache.set(url, texture);
  return texture;
};

// Criar textura de placeholder
export const createPlaceholderTexture = (color = '#8B0000') => {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  
  // Fundo
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 256, 256);
  
  // Texto
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '20px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Carregando...', 128, 128);
  
  const texture = new TextureLoader().load(canvas.toDataURL());
  return texture;
};

// Aplicar efeito sépia (para versão vintage)
export const applySepiaEffect = (imageUrl) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      
      ctx.drawImage(img, 0, 0);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
        data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
        data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
      }
      
      ctx.putImageData(imageData, 0, 0);
      resolve(canvas);
    };
  });
};