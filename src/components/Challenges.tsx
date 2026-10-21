import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';

interface Challenge {
  id: number;
  title: string;
  category: 'Routing' | 'Switching' | 'Addressing & Core' | 'Security' | 'SOC & Defense';
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  xp: number;
  status: 'Completed' | 'In Progress' | 'Not Started';
  description: string;
  symptoms: string;
  objectives: string[];
  cliHints: string;
  taskQuestion: string;
  expectedKeywords: string[];
  sampleSolution: string;
  diagram?: React.ReactNode; 
}

const masterChallengesList: Challenge[] = [
  {
    id: 1,
    title: 'OSPFv2 Neighbor Adjacency & Timer Mismatch',
    category: 'Routing',
    difficulty: 'Medium',
    xp: 250,
    status: 'In Progress',
    description: 'Troubleshoot a broken OSPF Area 0 adjacency between Core-RTR1 and Edge-RTR2 caused by mismatched Hello/Dead intervals.',
    symptoms: 'OSPF neighbor state is stuck in INIT/DOWN. Console logs show %OSPF-4-ERRRCV: Invalid packet: mismatch hello/dead timers (Hello is 30s instead of 10s).',
    objectives: [
      'Inspect OSPF interface timers using show ip ospf interface',
      'Set the OSPF Hello interval to 10 seconds on Gig0/1',
      'Verify FULL neighbor adjacency'
    ],
    cliHints: `Router-01(config)# interface gigabitEthernet 0/1\nRouter-01(config-if)# ip ospf hello-interval 10\nRouter-01(config-if)# ip ospf dead-interval 40`,
    taskQuestion: 'Enter the Cisco IOS interface command to set the OSPF Hello timer to 10 seconds:',
    expectedKeywords: ['ip ospf hello-interval 10'],
    sampleSolution: 'ip ospf hello-interval 10'
  },
  {
    id: 2,
    title: 'Multi-Area OSPF, LSA Types & Totally Stubby Area',
    category: 'Routing',
    difficulty: 'Hard',
    xp: 450,
    status: 'Not Started',
    description: 'Optimize routing table size on branch routers in Area 20 by filtering Type 3, Type 4, and Type 5 LSAs.',
    symptoms: 'Branch router CPU utilization is high due to excessive external Type-5 LSAs and Type-3 summary LSAs in Area 20.',
    objectives: [
      'Configure Area 20 as a Totally Stubby Area on the ABR',
      'Verify Type-3 and Type-5 LSAs are replaced by a default route'
    ],
    cliHints: `ABR-Router(config)# router ospf 1\nABR-Router(config-router)# area 20 stub no-summary`,
    taskQuestion: 'Enter the OSPF router sub-command on the ABR to configure Area 20 as a Totally Stubby Area:',
    expectedKeywords: ['area 20 stub no-summary'],
    sampleSolution: 'area 20 stub no-summary'
  },
  {
    id: 3,
    title: 'eBGP Peering & Path Selection (Local-Pref)',
    category: 'Routing',
    difficulty: 'Expert',
    xp: 600,
    status: 'Not Started',
    description: 'Establish eBGP peering between AS 65001 and ISP AS 65002 and prefer the primary path by raising Local Preference to 200.',
    symptoms: 'Outbound traffic is taking the slow backup serial link because default Local Preference is tied at 100.',
    objectives: [
      'Create a route-map setting local-preference to 200',
      'Apply the route-map inbound on the primary eBGP neighbor'
    ],
    cliHints: `Edge-RTR(config)# route-map PRIMARY_ISP permit 10\nEdge-RTR(config-route-map)# set local-preference 200`,
    taskQuestion: 'Enter the route-map command used to raise BGP Local Preference to 200:',
    expectedKeywords: ['set local-preference 200'],
    sampleSolution: 'set local-preference 200'
  }
  // يمكنك إضافة باقي التحديات هنا بنفس التنسيق
];

function Challenges() {
  const [challenges, setChallenges] = useState<Challenge[]>(masterChallengesList);
  const [totalXp, setTotalXp] = useState<number>(0);
  const [activeSolverModal, setActiveSolverModal] = useState<Challenge | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [solverFeedback, setSolverFeedback] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [showHint, setShowHint] = useState<boolean>(false);

  // جلب البيانات أو إنشاء بروفايل افتراضي عند فتح الصفحة
  useEffect(() => {
    async function initUserAndXp() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase.from('profiles').select('xp').eq('id', user.id).single();
          if (data) setTotalXp(data.xp || 0);
        } else {
          // جلب من الذاكرة المحلية كبديلة مؤقتة في حال عدم تسجيل دخول نظام Auth
          const localXp = Number(localStorage.getItem('netforge_xp') || 0);
          setTotalXp(localXp);
        }
      } catch (err) {
        console.error('Error fetching profile XP:', err);
      }
    }
    initUserAndXp();
  }, []);

  const handleVerifySolution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSolverModal) return;

    const cleanInput = userAnswer.trim().toLowerCase().replace(/\s+/g, ' ');
    const isCorrect = activeSolverModal.expectedKeywords.every(kw => 
      cleanInput.includes(kw.toLowerCase())
    );

    if (isCorrect) {
      if (activeSolverModal.status !== 'Completed') {
        const newXp = totalXp + activeSolverModal.xp;
        setTotalXp(newXp);
        localStorage.setItem('netforge_xp', String(newXp));

        // محاولة التحديث في Supabase (جدول profiles)
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await supabase.from('profiles').update({ xp: newXp }).eq('id', user.id);
          }
        } catch (err) {
          console.error('Supabase update error:', err);
        }

        const updated = challenges.map(ch => 
          ch.id === activeSolverModal.id ? { ...ch, status: 'Completed' as const } : ch
        );
        setChallenges(updated);
        setActiveSolverModal({ ...activeSolverModal, status: 'Completed' });
      }

      setSolverFeedback({
        type: 'success',
        message: `✓ Configuration Verified! Fault resolved and +${activeSolverModal.xp} XP awarded & synced.`
      });
    } else {
      setSolverFeedback({
        type: 'error',
        message: `% Verification Failed: Command syntax did not resolve the fault.`
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-300 flex overflow-hidden">
      <aside className="w-64 bg-slate-900/40 border-r border-slate-800 p-6 flex flex-col justify-between">
        <div>
          <Link to="/" className="text-xl font-bold text-blue-400 mb-10 tracking-widest uppercase block">NETFORGE</Link>
          <nav className="space-y-1">
            <Link to="/dashboard" className="block text-slate-400 hover:text-white px-4 py-2.5 rounded-lg">Dashboard</Link>
            <Link to="/challenges" className="block text-white bg-slate-800/50 px-4 py-2.5 rounded-lg font-medium">Challenges</Link>
          </nav>
        </div>
        <div className="p-4 border-t border-slate-800">
          <p className="text-white font-medium text-sm">Network Engineer</p>
          <p className="text-xs text-cyan-400">{totalXp} XP (Cloud Synced)</p>
        </div>
      </aside>

      <main className="flex-1 p-10 overflow-y-auto">
        <h2 className="text-3xl font-bold text-white mb-4">Engineering Challenge Arena</h2>
        <p className="text-slate-400 text-sm mb-8">Solve challenges to earn XP and update cloud progress in Supabase.</p>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {challenges.map((challenge) => (
            <div key={challenge.id} className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/20">{challenge.category}</span>
                  <span className="text-sm font-bold text-cyan-400">+{challenge.xp} XP</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{challenge.title}</h3>
                <p className="text-sm text-slate-400 mb-4">{challenge.description}</p>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                <span className={`text-xs ${challenge.status === 'Completed' ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {challenge.status === 'Completed' ? 'Solved ✓' : 'Unsolved'}
                </span>
                <button
                  onClick={() => {
                    setActiveSolverModal(challenge);
                    setUserAnswer('');
                    setSolverFeedback({ type: null, message: '' });
                    setShowHint(false);
                  }}
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-cyan-500 text-slate-950 cursor-pointer"
                >
                  ⚡ Solve Challenge
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {activeSolverModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0B1120] border border-cyan-500/40 rounded-2xl max-w-lg w-full p-6">
            <h3 className="text-xl font-bold text-white mb-3">{activeSolverModal.title}</h3>
            <p className="text-sm text-slate-300 mb-4">{activeSolverModal.taskQuestion}</p>
            
            <form onSubmit={handleVerifySolution} className="space-y-4">
              <input
                type="text"
                autoFocus
                placeholder="Enter CLI command..."
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="w-full bg-black border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-cyan-400"
              />
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setActiveSolverModal(null)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs">Verify & Submit</button>
              </div>
            </form>

            {solverFeedback.type && (
              <div className={`mt-4 p-3 rounded-lg text-xs font-mono ${solverFeedback.type === 'success' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                {solverFeedback.message}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Challenges;