// src/components/ui/NavigationMenu.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NavigationMenu({ 
  rooms = [], 
  currentRoom, 
  onRoomChange,
  onViewModeChange 
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [viewMode, setViewMode] = useState('free'); // free, guided, auto

  const roomIcons = {
    'Sala do Amor': '❤️',
    'Sala dos Momentos': '⏳',
    'Sala dos Sorrisos': '😊',
    'Sala das Memórias': '📸',
    'Sala Vermelha': '🔴',
    'Sala Golden Hour': '🌟'
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    onViewModeChange?.(mode);
  };

  const handleRoomSelect = (room) => {
    onRoomChange(room);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Botão principal do menu */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="fixed top-6 left-6 z-40 px-4 py-3 bg-black/50 backdrop-blur-xl 
                   rounded-full text-white flex items-center gap-3 hover:bg-black/70 
                   transition-colors border border-white/10 shadow-lg"
        aria-label="Menu de navegação"
      >
        <div className="flex flex-col gap-1">
          <div className="w-6 h-0.5 bg-white"></div>
          <div className="w-6 h-0.5 bg-white"></div>
          <div className="w-6 h-0.5 bg-white"></div>
        </div>
        <span className="font-cinzel text-sm">Explorar</span>
      </motion.button>

      {/* Overlay do menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
            />
            
            {/* Menu principal */}
            <motion.div
              initial={{ opacity: 0, x: -300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ type: "spring", damping: 30 }}
              className="fixed top-0 left-0 h-screen w-80 bg-black/90 backdrop-blur-xl 
                       border-r border-white/10 z-40 overflow-y-auto"
            >
              {/* Cabeçalho */}
              <div className="p-6 border-b border-white/10">
                <h2 className="font-cinzel text-2xl text-white mb-2 flex items-center gap-2">
                  <span className="text-[var(--color-passion-pink)]">🗺️</span>
                  Navegação
                </h2>
                <p className="text-sm text-gray-400">
                  Explore nossas salas de memórias
                </p>
              </div>

              {/* Modos de visualização */}
              <div className="p-6 border-b border-white/10">
                <h3 className="font-cinzel text-white mb-4">Modo de Visualização</h3>
                <div className="space-y-3">
                  {[
                    { id: 'free', label: 'Livre', icon: '🕹️', desc: 'Navegue livremente' },
                    { id: 'guided', label: 'Guiado', icon: '🧭', desc: 'Tour automático' },
                    { id: 'auto', label: 'Automático', icon: '🤖', desc: 'Passeio contínuo' }
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => handleViewModeChange(mode.id)}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        viewMode === mode.id 
                          ? 'bg-gradient-to-r from-[var(--color-love-red)]/30 to-[var(--color-passion-pink)]/30 border border-[var(--color-passion-pink)]/50' 
                          : 'bg-white/5 hover:bg-white/10 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{mode.icon}</span>
                        <div>
                          <div className="font-semibold text-white">{mode.label}</div>
                          <div className="text-xs text-gray-400">{mode.desc}</div>
                        </div>
                        {viewMode === mode.id && (
                          <div className="ml-auto w-3 h-3 rounded-full bg-[var(--color-passion-pink)] animate-pulse" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Lista de salas */}
              <div className="p-6">
                <h3 className="font-cinzel text-white mb-4">Salas da Galeria</h3>
                <div className="space-y-2">
                  {rooms.map((room) => {
                    const isActive = currentRoom === room;
                    return (
                      <motion.button
                        key={room}
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleRoomSelect(room)}
                        className={`w-full p-4 rounded-xl text-left transition-all group ${
                          isActive 
                            ? 'bg-gradient-to-r from-[var(--color-love-red)] to-[var(--color-passion-pink)]' 
                            : 'bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{roomIcons[room] || '📁'}</span>
                          <div className="flex-1">
                            <div className="font-semibold text-white">{room}</div>
                            <div className="text-xs opacity-75">
                              {room === 'Sala do Amor' && 'Memórias do coração'}
                              {room === 'Sala dos Momentos' && 'Instantes especiais'}
                              {room === 'Sala dos Sorrisos' && 'Risadas eternas'}
                              {room === 'Sala das Memórias' && 'Lembranças guardadas'}
                              {room === 'Sala Vermelha' && 'Paixão e romance'}
                              {room === 'Sala Golden Hour' && 'Horas douradas'}
                            </div>
                          </div>
                          {isActive && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-2 h-2 rounded-full bg-white"
                            />
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Estatísticas */}
                <div className="mt-8 p-4 bg-white/5 rounded-xl">
                  <div className="text-sm text-gray-400 mb-2">Progresso da Galeria</div>
                  <div className="space-y-2">
                    {rooms.map((room) => (
                      <div key={room} className="flex items-center justify-between">
                        <span className="text-sm text-white">{room}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.random() * 40 + 60}%` }}
                              transition={{ delay: 0.5 }}
                              className="h-full bg-gradient-to-r from-[var(--color-love-red)] to-[var(--color-passion-pink)]"
                            />
                          </div>
                          <span className="text-xs text-gray-400">
                            {Math.floor(Math.random() * 5) + 8}fotos
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Rodapé do menu */}
              <div className="p-6 border-t border-white/10">
                <div className="text-center text-sm text-gray-400">
                  <p>✨ Cada sala é uma nova descoberta</p>
                  <p className="mt-1 text-xs">Use as setas do teclado ou arraste para navegar</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Indicador de sala atual (mini) */}
      {!isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-6 left-24 z-30"
        >
          <div className="px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full 
                        border border-white/10 flex items-center gap-2">
            <span className="text-lg">{roomIcons[currentRoom] || '📍'}</span>
            <span className="font-inter text-sm text-white">{currentRoom}</span>
            <div className="w-2 h-2 rounded-full bg-[var(--color-passion-pink)] animate-pulse" />
          </div>
        </motion.div>
      )}
    </>
  );
}