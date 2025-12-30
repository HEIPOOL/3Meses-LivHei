// src/pages/admin.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/firebase-auth';
import ImageUploader from '@/components/ui/ImageUploader';
import GalleryManager from '@/components/ui/GalleryManager';

export default function AdminPage() {
  const [user, loading] = useAuth();
  const [photos, setPhotos] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState('Sala do Amor');
  
  if (loading) return <div>Carregando...</div>;
  if (!user) return <div>Acesso restrito</div>;
  
  const handleUploadComplete = (newPhoto) => {
    setPhotos([...photos, newPhoto]);
    // Salvar no Firebase/Supabase
    saveToDatabase(newPhoto);
  };
  
  const saveToDatabase = async (photo) => {
    // Implementar conexão com Firebase/Supabase
  };
  
  return (
    <div className="min-h-screen bg-[var(--color-bg-dark)] text-white p-8">
      <h1 className="font-cinzel text-4xl mb-8">Administração da Galeria</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload de novas fotos */}
        <div className="bg-[var(--color-bg-muted)] p-6 rounded-2xl">
          <h2 className="font-playfair text-2xl mb-4">Adicionar Nova Foto</h2>
          <ImageUploader
            onUploadComplete={handleUploadComplete}
            room={selectedRoom}
          />
        </div>
        
        {/* Gerenciamento existente */}
        <div className="bg-[var(--color-bg-muted)] p-6 rounded-2xl">
          <h2 className="font-playfair text-2xl mb-4">Gerenciar Galeria</h2>
          <GalleryManager
            photos={photos}
            onPhotoUpdate={(id, updates) => {
              // Atualizar foto
            }}
            onPhotoDelete={(id) => {
              // Remover foto
            }}
          />
        </div>
      </div>
      
      {/* Pré-visualização 3D */}
      <div className="mt-8">
        <h3 className="font-inter text-xl mb-4">Pré-visualização da Sala</h3>
        {/* Mini visualizador 3D */}
      </div>
    </div>
  );
}