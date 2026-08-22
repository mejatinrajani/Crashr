export default function Footer() {
  return (
    <footer className="w-full py-12 mt-auto border-t border-[#292524]/5">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#78716C]/60 hover:text-[#D97706] transition-colors duration-300">
          © {new Date().getFullYear()} CRASHR. All rights reserved.
        </p>
      </div>
    </footer>
  );
}