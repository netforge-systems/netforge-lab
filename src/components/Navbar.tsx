import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <header className="h-20 border-b border-slate-800/60 bg-slate-950/70 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4">
<Link to="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 hover:opacity-80 transition-opacity">
  NETFORGE
</Link>
        <span className="hidden sm:inline-block text-[10px] font-mono bg-slate-900 text-slate-400 border border-slate-800 px-2.5 py-0.5 rounded-md">
          v2.4.0-IOS
        </span>
      </div>

      {/* جميع الروابط تفتح الآن صفحات المشروع الحقيقية مباشرةً */}
      <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
        <Link to="/lab" className="hover:text-cyan-400 transition-colors">
          Simulator Lab
        </Link>
        <Link to="/learn" className="hover:text-cyan-400 transition-colors">
          Learning Tracks
        </Link>
        <Link to="/challenges" className="hover:text-cyan-400 transition-colors">
          Challenges
        </Link>
        <Link to="/networks" className="hover:text-cyan-400 transition-colors">
          My Topologies
        </Link>
        <Link to="/progress" className="hover:text-cyan-400 transition-colors">
          Progress
        </Link>
      </nav>

      <div className="flex items-center gap-3">
   
      </div>
    </header>
  );
}

export default Navbar;