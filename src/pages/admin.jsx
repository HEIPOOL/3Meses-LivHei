// src/pages/admin.jsx
'use client'; // ADICIONE ESTA LINHA NO TOPO

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/firebase-auth';
import ImageUploader from '@/components/ui/ImageUploader';
import GalleryManager from '@/components/ui/GalleryManager';
import dynamic from 'next/dynamic';

// Ou use dynamic import para evitar problemas de SSR
// const ImageUploader = dynamic(() => import('@/components/ui/ImageUploader'), { ssr: false });
// const GalleryManager = dynamic(() => import('@/components/ui/GalleryManager'), { ssr: false });

export default function AdminPage() {
  // CORREÇÃO: useAuth provavelmente retorna um objeto
  const auth = useAuth?.() || {}; // Adicione verificação de segurança
  const user = auth.user;
  const loading = auth.loading;
  
  // OU se useAuth for um hook customizado:
  // const { user, loading } = useAuth?.() || {};
  
  const [photos, setPhotos] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState('Sala do Amor');
  
  // Adicione verificação de client-side
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) {
    return <div className="min-h-screen bg-gray-900 text-white p-8">Carregando...</div>;
  }
  
  if (loading) return <div className="min-h-screen bg-gray-900 text-white p-8">Carregando autenticação...</div>;
  if (!user) return <div className="min-h-screen bg-gray-900 text-white p-8">Acesso restrito. Faça login.</div>;
  
  const handleUploadComplete = (newPhoto) => {
    setPhotos([...photos, newPhoto]);
    saveToDatabase(newPhoto);
  };
  
  const saveToDatabase = async (photo) => {
    // Implementar conexão com Firebase/Supabase
    console.log('Salvando foto:', photo);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 md:p-8">
      <h1 className="font-cinzel text-3xl md:text-4xl mb-6 md:mb-8">Administração da Galeria</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-4 md:p-6 rounded-2xl border border-white/10">
          <h2 className="font-playfair text-xl md:text-2xl mb-4">Adicionar Nova Foto</h2>
          <ImageUploader
            onUploadComplete={handleUploadComplete}
            room={selectedRoom}
          />
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Selecionar Sala:</label>
            <select 
              value={selectedRoom} 
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
            >
              <option value="Sala do Amor">Sala do Amor</option>
              <option value="Sala dos Momentos">Sala dos Momentos</option>
              <option value="Sala dos Sorrisos">Sala dos Sorrisos</option>
              <option value="Sala Vermelha">Sala Vermelha</option>
              <option value="Sala Golden Hour">Sala Golden Hour</option>
            </select>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-4 md:p-6 rounded-2xl border border-white/10">
          <h2 className="font-playfair text-xl md:text-2xl mb-4">Gerenciar Galeria</h2>
          <GalleryManager
            photos={photos}
            onPhotoUpdate={(id, updates) => {
              console.log('Atualizando foto:', id, updates);
            }}
            onPhotoDelete={(id) => {
              console.log('Removendo foto:', id);
            }}
          />
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-2xl border border-white/10">
        <h3 className="font-inter text-lg md:text-xl mb-4">Estatísticas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-pink-500/20 to-rose-500/20 p-4 rounded-xl">
            <p className="text-sm text-gray-300">Total de Fotos</p>
            <p className="text-2xl font-bold">{photos.length}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500/20 to-indigo-500/20 p-4 rounded-xl">
            <p className="text-sm text-gray-300">Sala Atual</p>
            <p className="text-lg font-medium">{selectedRoom}</p>
          </div>
        </div>
      </div>
    </div>
  );
}