// Novo componente: src/components/ProxyImage.jsx
'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ProxyImage({ src, alt, ...props }) {
  const [error, setError] = useState(false);
  
  // Função para criar URL proxy
  const createProxyUrl = (url) => {
    // Usando um serviço de proxy público (CORS-anywhere)
    // ATENÇÃO: Para produção, use seu próprio proxy
    return `https://corsproxy.io/?${encodeURIComponent(url)}`;
  };

  return (
    <>
      {!error ? (
        <Image
          src={createProxyUrl(src)}
          alt={alt}
          {...props}
          onError={() => {
            console.log('Erro com proxy, tentando URL original');
            setError(true);
          }}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          {...props}
          onError={() => {
            console.log('Falha total, usando fallback');
            setError(true);
          }}
        />
      )}
    </>
  );
}