export default function Header({ isCollapsed }) {
  return (
    <header 
      className={`fixed top-0 right-0 h-20 flex items-center justify-end px-6 bg-surface/80 backdrop-blur-md border-b border-black/5 z-20 transition-all duration-300 ${
        isCollapsed ? 'left-[80px]' : 'left-[280px]'
      }`}
    >
      {/* Search and Add buttons were removed as they are non-functional globally */}
    </header>
  );
}
