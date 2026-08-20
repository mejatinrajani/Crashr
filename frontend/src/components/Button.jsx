export default function Button({ children, variant = 'rectangular', color = 'green', className = '', ...props }) {
  const baseStyle = "px-6 py-2.5 font-semibold transition-all duration-300 ease-in-out flex items-center justify-center shadow-sm";
  
  // Using arbitrary values for exact colors
  const colorStyles = color === 'green' 
    ? "bg-[#10B981] text-white hover:bg-emerald-600"
    : "bg-[#E9D5FF] text-[#6B21A8] hover:bg-purple-300";

  // The shape morphing logic
  const shapeStyles = variant === 'rectangular'
    ? "rounded-md hover:rounded-full"
    : "rounded-full hover:rounded-md";

  return (
    <button className={`${baseStyle} ${colorStyles} ${shapeStyles} ${className}`} {...props}>
      {children}
    </button>
  );
}