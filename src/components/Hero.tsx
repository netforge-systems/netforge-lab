import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Hero() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const generateStrongPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@$!%*?&';
    let strongPass = 'NF-';
    for (let i = 0; i < 10; i++) {
      strongPass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(strongPass);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('netforge_user', JSON.stringify({ 
      name: isSignUp && name ? name : 'Network Engineer', 
      role: 'Senior Network Architect', 
      email: email || 'engineer@netforge.io',
      initial: isSignUp && name ? name.charAt(0).toUpperCase() : 'N',
      xp: 500 
    }));
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#050B14] text-slate-100 font-sans flex flex-col items-center justify-between relative overflow-hidden select-none px-4 py-12">
      
      {/* خلفية شبكية سايبرانية متحركة للعين */}
      <div className="absolute inset-0 z-0 opacity-20"
           style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #06b6d4 1.5px, transparent 0)', backgroundSize: '35px 35px' }}>
      </div>

      {/* دوائر ليزرية خلفية متوهجة بشكل ناري */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>

      {/* شارة حالة النظام الحية (Cyber Badge) */}
      <div className="relative z-10 mb-2 mt-4 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/80 border border-cyan-500/40 text-cyan-400 text-xs font-mono shadow-[0_0_25px_rgba(6,182,212,0.2)]">
        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
        <span className="tracking-widest uppercase font-bold">NETFORGE KERNEL: SECURE & OPERATIONAL</span>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="w-full max-w-xl mx-auto relative z-10 flex flex-col items-center my-auto">
        
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight text-center mb-3 drop-shadow-[0_0_25px_rgba(6,182,212,0.3)]">
          NET<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-600">FORGE</span>
        </h1>
        <p className="text-xs md:text-sm text-slate-400 text-center max-w-md mb-8 leading-relaxed font-mono">
          The ultimate interactive network engineering workspace. Design, simulate, and conquer challenges.
        </p>

        {/* صندوق التوثيق (CLI Terminal Authentication Box) مع إطار نيون متوهج */}
        <div className="w-full bg-slate-900/85 backdrop-blur-2xl border border-cyan-500/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(6,182,212,0.15)] relative group hover:border-cyan-400/60 transition-all duration-500">
          
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-mono text-slate-400 ml-2">auth-gateway.sh</span>
            </div>
            
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${!isSignUp ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20' : 'text-slate-400 hover:text-white'}`}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${isSignUp ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20' : 'text-slate-400 hover:text-white'}`}
              >
                Sign Up
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 font-mono">
            {isSignUp && (
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1.5">ENGINEER_NAME</label>
                <input
                  type="text"
                  placeholder="e.g. Zain Obeidat"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                  required={isSignUp}
                />
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1.5">USER_EMAIL</label>
              <input
                type="email"
                placeholder="engineer@netforge.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[11px] font-bold text-slate-400">ACCESS_KEY / PASSWORD</label>
                <button
                  type="button"
                  onClick={generateStrongPassword}
                  className="text-[10px] text-cyan-400 hover:underline cursor-pointer"
                >
                  Generate Secure Key 🔑
                </button>
              </div>
              <input
                type="password"
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                required
              />
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-black tracking-wider py-4 rounded-2xl text-xs uppercase transition-all shadow-[0_0_25px_rgba(6,182,212,0.4)] cursor-pointer flex items-center justify-center gap-2"
              >
                <span>🚀</span>
                <span>{isSignUp ? 'Initialize Engineering Account' : 'Authenticate & Enter Workspace'}</span>
              </button>
            </div>
          </form>

        </div>

        {/* إحصائيات سفلية بصرية مميزة */}
        <div className="grid grid-cols-3 gap-4 w-full mt-8 text-center font-mono">
          <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl backdrop-blur hover:border-cyan-500/40 transition-colors">
            <span className="block text-xl font-black text-cyan-400">17+</span>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest">Challenges</span>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl backdrop-blur hover:border-emerald-500/40 transition-colors">
            <span className="block text-xl font-black text-emerald-400">Studio</span>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest">Custom Canvas</span>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl backdrop-blur hover:border-amber-500/40 transition-colors">
            <span className="block text-xl font-black text-amber-400">CLI</span>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest">Auto Grader</span>
          </div>
        </div>

      </div>

      {/* روابط التواصل المهني في أسفل الصفحة (جاهزة للربط لاحقاً) */}
      <footer className="w-full max-w-xl mx-auto relative z-10 mt-12 pt-6 border-t border-slate-800/80 flex flex-wrap justify-between items-center text-xs text-slate-500 font-mono">
        <div>
          <span>© 2026 NETFORGE Platform. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-4 mt-2 sm:mt-0">
          <a href="#" className="hover:text-cyan-400 transition-colors flex items-center gap-1 cursor-pointer">
            <span>💼</span> LinkedIn
          </a>
          <a href="#" className="hover:text-cyan-400 transition-colors flex items-center gap-1 cursor-pointer">
            <span>📸</span> Instagram
          </a>
          <a href="#" className="hover:text-cyan-400 transition-colors flex items-center gap-1 cursor-pointer">
            <span>💻</span> GitHub
          </a>
        </div>
      </footer>

    </div>
  );
}

export default Hero;