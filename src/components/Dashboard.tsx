import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  // الحالات الافتراضية (أصبحت عامة الآن لحماية خصوصيتك)
  const [userName, setUserName] = useState('Network Engineer');
  const [userInitial, setUserInitial] = useState('N');
  const [xp, setXp] = useState(0); 
  const [progress, setProgress] = useState(0); 
  const [completedModulesCount, setCompletedModulesCount] = useState(0);

  // دالة لجلب البيانات الحقيقية من المتصفح وحساب النسبة
  useEffect(() => {
    // 1. جلب اسم المستخدم (إن وجد، وإلا سيستخدم القيمة العامة)
    const savedUser = localStorage.getItem('netforge_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUserName(parsed.name || 'Network Engineer');
      setUserInitial(parsed.initial || 'N');
    }

    // 2. جلب نقاط الخبرة
    const savedXp = localStorage.getItem('netforge_xp');
    if (savedXp) setXp(Number(savedXp));

    // 3. حساب نسبة التعلم والدروس المنجزة
    const savedCourses = localStorage.getItem('netforge_courses_pure_net');
    if (savedCourses) {
      const courses = JSON.parse(savedCourses);
      let totalMods = 0;
      let doneMods = 0;

      courses.forEach((course: any) => {
        totalMods += course.modules.length;
        doneMods += course.modules.filter((m: any) => m.completed).length;
      });

      setCompletedModulesCount(doneMods);
      if (totalMods > 0) {
        setProgress(Math.round((doneMods / totalMods) * 100));
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#070B19] text-slate-300 font-sans flex overflow-hidden select-none">
      
      {/* 1. الشريط الجانبي */}
      <aside className="w-64 bg-slate-900/40 backdrop-blur-xl border-r border-slate-800/60 flex flex-col justify-between h-screen shrink-0 z-20">
        <div className="p-6">
          <Link to="/" className="text-xl font-bold text-blue-400 mb-10 tracking-widest uppercase block hover:opacity-80 transition-opacity">
            NETFORGE
          </Link>

          <nav className="space-y-1">
            <Link to="/dashboard" className="flex items-center gap-3 text-white bg-slate-800/50 px-4 py-2.5 rounded-lg border border-slate-700/50 font-medium shadow-lg shadow-blue-900/10">
              Dashboard
            </Link>
            <Link to="/lab" className="flex items-center gap-3 text-slate-400 hover:text-white hover:bg-slate-800/30 px-4 py-2.5 rounded-lg transition-colors mt-2">
              Network Lab
            </Link>
            <Link to="/canvas" className="flex items-center gap-3 text-slate-400 hover:text-white hover:bg-slate-800/30 px-4 py-2.5 rounded-lg transition-colors">
              Drawing Studio ✏️
            </Link>
            {/* رابط مراقبة الشبكات العالمية الجديد */}
            <Link to="/global-telemetry" className="flex items-center gap-3 text-cyan-400 hover:bg-cyan-500/10 px-4 py-2.5 rounded-lg transition-colors mt-2 font-bold border border-cyan-500/20">
              🌍 Global Telemetry NOC
            </Link>
            <Link to="/challenges" className="flex items-center gap-3 text-slate-400 hover:text-white hover:bg-slate-800/30 px-4 py-2.5 rounded-lg transition-colors mt-2">
              Challenges
            </Link>
            <Link to="/learn" className="flex items-center gap-3 text-slate-400 hover:text-white hover:bg-slate-800/30 px-4 py-2.5 rounded-lg transition-colors">
              Learn
            </Link>
            <Link to="/networks" className="flex items-center gap-3 text-slate-400 hover:text-white hover:bg-slate-800/30 px-4 py-2.5 rounded-lg transition-colors mt-4">
              My Networks
            </Link>
            <Link to="/progress" className="flex items-center gap-3 text-slate-400 hover:text-white hover:bg-slate-800/30 px-4 py-2.5 rounded-lg transition-colors">
              Progress
            </Link>
            <Link to="/settings" className="flex items-center gap-3 text-slate-400 hover:text-white hover:bg-slate-800/30 px-4 py-2.5 rounded-lg transition-colors mt-4">
              Settings
            </Link>
          </nav>
        </div>

        <div className="p-6 border-t border-slate-800/60 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-red-600 flex items-center justify-center text-white font-bold text-lg shadow-lg border border-white/10">
            {userInitial}
          </div>
          <div>
            <h4 className="text-white font-medium text-sm leading-tight">
              {userName}
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">Network Engineering<br/>Workspace</p>
          </div>
        </div>
      </aside>

      {/* 2. مساحة العمل */}
      <main className="flex-1 p-10 overflow-y-auto h-screen relative">
        <div className="absolute inset-0 z-0 opacity-[0.03]"
             style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          
          <header className="flex justify-between items-end mb-10">
            <div>
              <h1 className="text-4xl font-black text-white tracking-tight mb-2">Workspace Overview</h1>
              <p className="text-slate-400 text-sm">Welcome back, {userName}. Your engineering environment is ready.</p>
            </div>
            
            <div className="hidden md:flex items-center gap-2 text-xs font-mono bg-slate-900/60 border border-slate-800 px-4 py-2 rounded-lg text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              API Connection Secure
            </div>
          </header>

          {/* بطاقة الدخول السريع لمراقبة الشبكات العالمية (Global Telemetry Card البارزة للعين) */}
          <div className="w-full bg-gradient-to-r from-cyan-950/60 via-slate-900 to-blue-950/60 border-2 border-cyan-500/50 rounded-3xl p-8 mb-10 relative overflow-hidden shadow-[0_0_40px_rgba(6,182,212,0.2)]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400 text-cyan-300 text-xs font-mono mb-4">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                <span>NEW FEATURE // LIVE GLOBAL NOC</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white mb-3">Global Internet & BGP Telemetry Center</h2>
              <p className="text-xs md:text-sm text-slate-300 mb-6 font-mono leading-relaxed">
                Monitor live internet backbone exchanges, regional latencies across North America, Europe, Asia, and submarine cable health in real-time.
              </p>
              <Link 
                to="/global-telemetry"
                className="inline-flex items-center gap-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black px-6 py-3 rounded-2xl text-xs uppercase transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer"
              >
                <span>Launch Global Telemetry Screen 🌍</span>
              </Link>
            </div>
          </div>

          {/* البطاقات الديناميكية */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            
            <div className="bg-slate-900/40 border-l-4 border-blue-500 rounded-3xl p-7 backdrop-blur-sm border-y border-r border-slate-800/60 hover:bg-slate-800/40 hover:-translate-y-1 transition-all group">
              <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Learning Progress</h3>
              <div className="text-5xl font-black text-white mb-6">
                {progress}<span className="text-2xl text-blue-500 ml-1">%</span>
              </div>
              <Link to="/learn" className="text-blue-400 text-sm font-bold flex items-center gap-2 group-hover:text-blue-300">
                Continue Track <span className="text-lg transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>

            <div className="bg-slate-900/40 border-l-4 border-red-500 rounded-3xl p-7 backdrop-blur-sm border-y border-r border-slate-800/60 hover:bg-slate-800/40 hover:-translate-y-1 transition-all group">
              <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Experience Points</h3>
              <div className="text-5xl font-black text-white mb-6">
                {xp} <span className="text-xl text-red-500 font-bold ml-1">XP</span>
              </div>
              <Link to="/progress" className="text-red-400 text-sm font-bold flex items-center gap-2 group-hover:text-red-300">
                View Global Rank <span className="text-lg transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>

            <div className="bg-slate-900/40 border-l-4 border-white rounded-3xl p-7 backdrop-blur-sm border-y border-r border-slate-800/60 hover:bg-slate-800/40 hover:-translate-y-1 transition-all group">
              <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Modules Mastered</h3>
              <div className="text-5xl font-black text-white mb-6">
                {completedModulesCount}
              </div>
              <Link to="/learn" className="text-slate-300 text-sm font-bold flex items-center gap-2 group-hover:text-white">
                View Completed <span className="text-lg transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-slate-900/30 border border-slate-800 rounded-3xl p-8">
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-blue-500">⚡</span> Quick Actions
              </h2>
              
              <div className="space-y-4">
                <Link to="/lab" className="flex items-center justify-between bg-slate-950/50 border border-slate-800 p-5 rounded-2xl hover:border-blue-500/50 transition-all group">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 text-xl group-hover:bg-blue-500 group-hover:text-white transition-all shadow-inner">
                      🧪
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm mb-1">Build New Topology</h4>
                      <p className="text-xs text-slate-400">Launch the advanced network simulator</p>
                    </div>
                  </div>
                  <span className="text-slate-600 group-hover:text-blue-400 transition-colors">➔</span>
                </Link>

                <Link to="/learn" className="flex items-center justify-between bg-slate-950/50 border border-slate-800 p-5 rounded-2xl hover:border-red-500/50 transition-all group">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 text-xl group-hover:bg-red-500 group-hover:text-white transition-all shadow-inner">
                      📚
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm mb-1">Continue Learning</h4>
                      <p className="text-xs text-slate-400">Master Routing & Switching Protocols</p>
                    </div>
                  </div>
                  <span className="text-slate-600 group-hover:text-red-400 transition-colors">➔</span>
                </Link>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-black border border-slate-800 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-32 bg-gradient-to-br from-blue-500/10 to-red-500/10 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <div className="relative z-10">
                <span className="px-3 py-1 bg-white/5 text-white text-[10px] font-mono uppercase tracking-widest rounded-full border border-white/10 mb-6 inline-block">
                  Netforge OS v2.0
                </span>
                <h2 className="text-3xl font-black text-white mb-4 leading-tight">Engineered for<br/>Global Scale.</h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-sm">
                  Your workspace is fully optimized. Access network simulations, track routing protocols, and deploy virtual infrastructure instantly.
                </p>
              </div>
              
              <div className="relative z-10">
                <Link to="/networks" className="inline-block bg-white text-slate-950 text-sm font-bold px-6 py-3 rounded-xl hover:bg-slate-200 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)]">
                  View Saved Networks
                </Link>
              </div>
            </div>

          </div>
        </div>
      </main>

    </div>
  );
}

export default Dashboard;