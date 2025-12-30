// src/components/ui/RomanticCard.jsx
import { motion } from 'framer-motion';

export default function RomanticCard({ 
  children, 
  title, 
  subtitle,
  glow = true,
  className = '',
  onClick 
}) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      onClick={onClick}
      className={`relative p-6 rounded-2xl overflow-hidden group cursor-pointer ${className}`}
      style={{
        background: 'rgba(26, 0, 0, 0.7)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(139, 0, 0, 0.3)',
      }}
    >
      {/* Efeito de brilho no hover */}
      {glow && (
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-love-red)]/0 via-[var(--color-passion-pink)]/10 to-[var(--color-love-red)]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      )}
      
      {/* Borda superior decorativa */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--color-passion-pink)] to-transparent" />
      
      {/* Conteúdo */}
      <div className="relative z-10">
        {title && (
          <h3 className="font-cinzel text-xl text-white mb-2">
            {title}
          </h3>
        )}
        
        {subtitle && (
          <p className="font-inter text-sm text-[var(--color-text-soft)] mb-4">
            {subtitle}
          </p>
        )}
        
        {children}
      </div>
      
      {/* Decoração nos cantos */}
      <div className="absolute top-3 left-3 w-2 h-2 rounded-full bg-[var(--color-passion-pink)] opacity-50" />
      <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[var(--color-passion-pink)] opacity-50" />
      <div className="absolute bottom-3 left-3 w-2 h-2 rounded-full bg-[var(--color-passion-pink)] opacity-50" />
      <div className="absolute bottom-3 right-3 w-2 h-2 rounded-full bg-[var(--color-passion-pink)] opacity-50" />
    </motion.div>
  );
}