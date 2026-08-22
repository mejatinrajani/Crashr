export default function Button({ 
  children, 
  variant = 'rectangular', 
  color = 'gold', 
  className = '', 
  ...props 
}) {
  const baseStyle = 
    "px-6 py-2.5 font-bold transition-all duration-300 ease-out flex items-center justify-center tracking-tight active:scale-95 shadow-sm";

  // Palette: Cinematic Gold and Warm Espresso
  const colorStyles = color === 'gold' || color === 'green'
    ? "bg-[#D97706] text-white hover:bg-[#B45309] shadow-amber-900/10 hover:shadow-md hover:shadow-amber-900/20"
    : color === 'espresso' || color === 'lavender'
    ? "bg-[#292524] text-[#FDFBF7] hover:bg-[#1C1917] shadow-stone-950/10 hover:shadow-md"
    : "bg-white/80 backdrop-blur-md text-[#292524] border border-[#292524]/10 hover:bg-white";

  // Interactive morphing:
  // - 'rectangular': Starts sharp (rounded-none) -> softens on hover (rounded-xl)
  // - 'rounded': Starts softened (rounded-2xl) -> sharpens on hover (rounded-none)
  const shapeStyles = variant === 'rectangular'
    ? "rounded-none hover:rounded-xl"
    : "rounded-2xl hover:rounded-none";

  return (
    <button 
      className={`${baseStyle} ${colorStyles} ${shapeStyles} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
}