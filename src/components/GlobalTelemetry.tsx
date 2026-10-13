import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface RegionStatus {
  region: string;
  latency: number;
  status: 'OPTIMAL' | 'DEGRADED' | 'CRITICAL';
  packetLoss: number;
  bgpRoutes: string;
}

function GlobalTelemetry() {
  const [globalLoad, setGlobalLoad] = useState<number>(44);
  const [activeAttacks, setActiveAttacks] = useState<number>(1420);

  // تحديثات حية تحاكي حركة البيانات العالمية
  useEffect(() => {
    const interval = setInterval(() => {
      setGlobalLoad(prev => Math.min(96, Math.max(25, prev + Math.floor(Math.random() * 5) - 2)));
      setActiveAttacks(prev => prev + Math.floor(Math.random() * 16) - 8);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const regions: RegionStatus[] = [
    { region: 'North America (US-East IX)', latency: 12, status: 'OPTIMAL', packetLoss: 0.00, bgpRoutes: '915,200' },
    { region: 'Europe (Frankfurt Core)', latency: 16, status: 'OPTIMAL', packetLoss: 0.01, bgpRoutes: '849,310' },
    { region: 'Asia-Pacific (Tokyo Hub)', latency: 39, status: 'DEGRADED', packetLoss: 1.10, bgpRoutes: '764,120' },
    { region: 'Middle East (Dubai Exchange)', latency: 24, status: 'OPTIMAL', packetLoss: 0.02, bgpRoutes: '314,500' },
    { region: 'South America (São Paulo)', latency: 65, status: 'OPTIMAL', packetLoss: 0.15, bgpRoutes: '218,400' }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-mono p-6 md:p-10 select-none overflow-x-hidden">
      
      {/* شبكة خلفية تكنولوجية */}
      <div className="absolute inset-0 z-0 opacity-15 pointer-events-none"
           style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #06b6d4 1.5px, transparent 0)', backgroundSize: '40px 40px' }}>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        
        {/* شريط علوي مستقل مع زر الرجوع */}
        <header className="flex flex-wrap justify-between items-center gap-4 mb-8 bg-slate-900/80 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl shadow-2xl">
          <div className="flex items-center gap-4">
            <Link 
              to="/dashboard" 
              className="bg-slate-950 hover:bg-slate-800 text-cyan-400 border border-cyan-500/30 px-4 py-2 rounded-xl text-xs transition-all flex items-center gap-2 cursor-pointer font-bold"
            >
              <span>←</span> Return to Dashboard
            </Link>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] mb-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                <span>GLOBAL NETWORK OPERATIONS CENTER (NOC)</span>
              </div>
              <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">Global Internet Telemetry & BGP Status</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-950 px-4 py-2.5 rounded-2xl border border-slate-800 text-right">
              <span className="block text-[9px] text-slate-500">BACKBONE CAPACITY</span>
              <span className="text-xs font-bold text-cyan-400">{globalLoad}% LOAD</span>
            </div>
            <div className="bg-slate-950 px-4 py-2.5 rounded-2xl border border-slate-800 text-right">
              <span className="block text-[9px] text-slate-500">MITIGATED THREATS</span>
              <span className="text-xs font-bold text-emerald-400">{activeAttacks} / min</span>
            </div>
          </div>
        </header>

        {/* بطاقات الإحصائيات السريعة */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-3xl backdrop-blur shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>
            <span className="text-xs text-slate-500 block mb-1">STP & LOOP AVOIDANCE</span>
            <h3 className="text-lg font-black text-emerald-400 mb-2">STABLE (0 BLOCKED)</h3>
            <p className="text-xs text-slate-400 font-sans">Spanning Tree Protocol across major tier-1 exchanges is operating smoothly with zero root bridge changes.</p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-3xl backdrop-blur shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none"></div>
            <span className="text-xs text-slate-500 block mb-1">ANYCAST DNS HEALTH</span>
            <h3 className="text-lg font-black text-cyan-400 mb-2">100% OPERATIONAL</h3>
            <p className="text-xs text-slate-400 font-sans">Global root name server response time averaging 13.8ms with zero query drops recorded.</p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-3xl backdrop-blur shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>
            <span className="text-xs text-slate-500 block mb-1">SUBMARINE CABLE STATUS</span>
            <h3 className="text-lg font-black text-amber-400 mb-2">1 ROUTING NOTICE</h3>
            <p className="text-xs text-slate-400 font-sans">Scheduled maintenance on Trans-Pacific cable; autonomous systems automatically shifted via redundant paths.</p>
          </div>

        </div>

        {/* جدول الأقاليم العالمية */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-bold text-white">Live Regional Exchange Latency & BGP Status</h3>
            <span className="text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              ● Live Feed Connected
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500">
                  <th className="pb-3 font-bold">REGION / EXCHANGE</th>
                  <th className="pb-3 font-bold">AVG LATENCY</th>
                  <th className="pb-3 font-bold">PACKET LOSS</th>
                  <th className="pb-3 font-bold">ACTIVE BGP ROUTES</th>
                  <th className="pb-3 font-bold">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {regions.map((reg, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 font-bold text-white">{reg.region}</td>
                    <td className="py-4 text-cyan-400">{reg.latency} ms</td>
                    <td className="py-4 text-slate-300">{reg.packetLoss}%</td>
                    <td className="py-4 text-slate-300">{reg.bgpRoutes}</td>
                    <td className="py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        reg.status === 'OPTIMAL' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {reg.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

export default GlobalTelemetry;