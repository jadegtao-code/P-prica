import React from 'react';

export const PapricaLogo: React.FC<{
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'icon' | 'badge';
  className?: string;
}> = ({ size = 'md', variant = 'full', className = '' }) => {
  // Dimensions
  const iconDimensions = {
    sm: 'w-7 h-7 text-sm',
    md: 'w-9 h-9 text-base',
    lg: 'w-12 h-12 text-xl',
  }[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Icon Badge: Fundo vermelho com a letra "á" minúscula em branco e o acento + ponto em verde */}
      <div
        className={`${iconDimensions} shrink-0 bg-[#881337] rounded-md shadow-xs flex items-center justify-center relative overflow-hidden`}
        title="Páprica Arquitetura e Interiores"
      >
        {/* Subtly textured background */}
        <div className="absolute inset-0 bg-radial from-red-600/30 via-transparent to-black/20 pointer-events-none" />
        
        {/* Letra 'á' com acento verde e ponto final verde */}
        <div className="relative font-serif font-bold text-white tracking-tighter leading-none flex items-baseline select-none">
          {/* Stem/Accent in vivid green */}
          <span className="relative">
            <span className="font-sans font-bold">a</span>
            {/* Cabinho verde da páprica (acento agudo estilizado) */}
            <span
              className="absolute -top-1 right-0 text-[#16A34A] font-extrabold text-[1.1em] transform -rotate-12 select-none"
              style={{ textShadow: '0 0 1px #16A34A' }}
            >
              ´
            </span>
          </span>
          {/* Ponto final em verde */}
          <span className="text-[#16A34A] font-bold text-[0.9em] ml-0.5 leading-none">.</span>
        </div>
      </div>

      {variant === 'full' && (
        <div className="flex flex-col justify-center">
          <div className="flex items-baseline gap-1">
            <span className="font-bold tracking-tight text-stone-900 text-sm md:text-base leading-tight font-sans">
              páprica
            </span>
            <span className="text-[#16A34A] font-bold text-xs">.</span>
          </div>
          <span className="text-[10px] tracking-wider uppercase text-stone-500 font-medium">
            Arquitetura & Interiores
          </span>
        </div>
      )}
    </div>
  );
};

export const UrbanoLogo: React.FC<{
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'icon' | 'badge';
  className?: string;
}> = ({ size = 'md', variant = 'full', className = '' }) => {
  const iconDimensions = {
    sm: 'w-7 h-7 text-[10px]',
    md: 'w-9 h-9 text-xs',
    lg: 'w-12 h-12 text-sm',
  }[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Icon Badge: Fundo cinza-chumbo com textura pontilhada, "URBANO.S" em verde-limão */}
      <div
        className={`${iconDimensions} shrink-0 bg-[#18181B] rounded-md shadow-xs flex flex-col items-center justify-center relative border border-stone-800 overflow-hidden`}
        title="Urbano.s Apartamentos por Temporada"
      >
        {/* Textura pontilhada sutil */}
        <div
          className="absolute inset-0 opacity-25 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#84CC16 0.8px, transparent 0.8px)',
            backgroundSize: '4px 4px',
          }}
        />

        <div className="relative flex flex-col items-center justify-center leading-tight">
          <span className="font-mono font-black text-[#84CC16] tracking-tight">
            U.S
          </span>
        </div>
      </div>

      {variant === 'full' && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-0.5">
            <span className="font-black tracking-tight text-stone-900 text-sm md:text-base leading-tight font-sans">
              URBANO
            </span>
            <span className="text-[#84CC16] font-black text-sm">.S</span>
          </div>
          <span className="text-[9px] tracking-widest uppercase text-stone-500 font-mono font-medium">
            Apartment for Seasons
          </span>
        </div>
      )}
    </div>
  );
};

export const GroupUnifiedLogo: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      <div className="flex items-center gap-1.5">
        <PapricaLogo size="sm" variant="icon" />
        <span className="text-xs font-semibold text-stone-800">Páprica</span>
      </div>
      <span className="text-stone-300 font-light">+</span>
      <div className="flex items-center gap-1.5">
        <UrbanoLogo size="sm" variant="icon" />
        <span className="text-xs font-semibold text-stone-800">Urbano.s</span>
      </div>
    </div>
  );
};
