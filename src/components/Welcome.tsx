import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Welcome() {
  const navigate = useNavigate();
  
  // قيم افتراضية مطابقة لتصميمك
  const [email, setEmail] = useState('engineer@netforge.io');
  const [password, setPassword] = useState('********');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // حفظ بيانات المستخدم الافتراضي لتعمل المنصة بشكل صحيح
    localStorage.setItem('netforge_user', JSON.stringify({ 
      name: 'Network Engineer', 
      role: 'Network Engineering Student', 
      email: email,
      initial: 'N' 
    }));
    
    // الانتقال فوراً إلى مساحة العمل (Dashboard) بعد تسجيل الدخول
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#070B19] flex flex-col font-sans relative overflow-hidden select-none">
      
      {/* خلفية شبكية خفيفة جداً لجمالية هندسية */}
      <div className="absolute inset-0 z-0 opacity-[0.02]"
           style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}>
      </div>

      {/* الشريط العلوي - نظيف وعالمي (يحتوي فقط على الشعار) */}
      <header className="w-full px-8 py-6 flex justify-between items-center absolute top-0 left-0 z-20">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-black text-cyan-400 tracking-widest uppercase">NETFORGE</h1>
          <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono border border-slate-700">
            v2.4.0-INS
          </span>
        </div>
      </header>

      {/* منطقة تسجيل الدخول بالمنتصف */}
      <main className="flex-1 flex items-center justify-center relative z-10 px-4">
        
        {/* صندوق الـ Authenticate */}
        <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-8 shadow-[0_0_40px_rgba(6,182,212,0.05)] flex flex-col items-center">
          
          <h2 className="text-2xl font-black text-white tracking-widest uppercase mb-1">NETFORGE</h2>
          <p className="text-xs text-slate-400 mb-8 font-medium">Authenticate to access your engineering workspace</p>

          <form onSubmit={handleLogin} className="w-full space-y-5">
            {/* إدخال الإيميل */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1.5 ml-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-cyan-500/50 transition-colors"
                required
              />
            </div>

            {/* إدخال كلمة المرور */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1.5 ml-1">Security Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-cyan-500/50 transition-colors"
                required
              />
            </div>

            {/* زر الدخول */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black tracking-wide px-6 py-3.5 rounded-xl text-sm transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] cursor-pointer"
              >
                Access Workspace
              </button>
            </div>
          </form>

        </div>
      </main>

    </div>
  );
}

export default Welcome;