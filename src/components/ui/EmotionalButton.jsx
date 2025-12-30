// src/components/ui/EmotionalButton.jsx
import { motion } from 'framer-motion';

export default function EmotionalButton({ 
  children, 
  onClick, 
  variant = 'romantic',
  size = 'medium',
  className = '',
  disabled = false 
}) {
  const baseClasses = "relative overflow-hidden rounded-full font-cinzel font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-bg-dark)]";
  
  const variants = {
    romantic: "bg-gradient-to-r from-[var(--color-love-red)] to-[var(--color-passion-pink)] text-white hover:from-[var(--color-passion-pink)] hover:to-[var(--color-accent-love)] focus:ring-[var(--color-passion-pink)]",
    golden: "bg-gradient-to-r from-[var(--color-golden-glow)] to-[var(--color-romantic-gold)] text-black hover:from-[var(--color-romantic-gold)] hover:to-[#FFEC8B] focus:ring-[var(--color-golden-glow)]",
    soft: "bg-gradient-to-r from-[var(--color-soft-pink)] to-[#FFE4E1] text-[var(--color-deep-burgundy)] hover:from-[#FFE4E1] hover:to-white focus:ring-[var(--color-soft-pink)]",
  };
  
  const sizes = {
    small: "px-4 py-2 text-sm",
    medium: "px-6 py-3 text-base",
    large: "px-8 py-4 text-lg",
  };
  
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";
  
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.05, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`}
    >
      {/* Efeito de brilho */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
      </div>
      
      {/* Conteúdo */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
      
      {/* Efeito de sombra */}
      <div className="absolute inset-0 rounded-full shadow-lg" />
    </motion.button>
  );
}