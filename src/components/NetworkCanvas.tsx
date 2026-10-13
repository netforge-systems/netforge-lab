import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

interface NetworkNode {
  id: string;
  type: 'Router' | 'Switch' | 'PC' | 'Firewall' | 'Cloud';
  name: string;
  x: number;
  y: number;
  ip: string;
}

interface Connection {
  from: string;
  to: string;
}

interface Stroke {
  points: { x: number; y: number }[];
}

function NetworkCanvas() {
  const [nodes, setNodes] = useState<NetworkNode[]>([
    { id: '1', type: 'Router', name: 'Core-RTR1', x: 200, y: 150, ip: '192.168.1.1' },
    { id: '2', type: 'Switch', name: 'Access-SW1', x: 450, y: 150, ip: '192.168.1.2' },
    { id: '3', type: 'PC', name: 'Workstation', x: 700, y: 150, ip: '192.168.1.50' }
  ]);

  const [connections, setConnections] = useState<Connection[]>([
    { from: '1', to: '2' },
    { from: '2', to: '3' }
  ]);

  // الأدوات المتاحة (تشمل قلم الرسم الحر Pen)
  const [selectedTool, setSelectedTool] = useState<'Router' | 'Switch' | 'PC' | 'Firewall' | 'Cloud' | 'Pen'>('Pen');
  const [connectSource, setConnectSource] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string>('');

  // حالات الرسم اليدوي
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [currentPoints, setCurrentPoints] = useState<{ x: number; y: number }[]>([]);

  // بدء الرسم بالماوس
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (selectedTool !== 'Pen') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsDrawing(true);
    setCurrentPoints([{ x, y }]);
  };

  // تحريك الماوس أثناء الرسم (معاينة حية للخط)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawing || selectedTool !== 'Pen') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCurrentPoints(prev => [...prev, { x, y }]);
  };

  // إنهاء الرسم وحفظ الخط في الـ strokes
  const handleMouseUp = () => {
    if (!isDrawing || selectedTool !== 'Pen') return;
    setIsDrawing(false);
    if (currentPoints.length > 1) {
      setStrokes(prev => [...prev, { points: currentPoints }]);
    }
    setCurrentPoints([]);
  };

  // إضافة جهاز عند النقر (إذا لم تكن أداة القلم مفعلة)
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (selectedTool === 'Pen') return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newNode: NetworkNode = {
      id: Date.now().toString(),
      type: selectedTool,
      name: `${selectedTool}-${nodes.length + 1}`,
      x: Math.max(50, x - 40),
      y: Math.max(50, y - 40),
      ip: `192.168.${nodes.length + 1}.1`
    };

    setNodes([...nodes, newNode]);
  };

  const handleDeleteNode = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNodes(nodes.filter(n => n.id !== id));
    setConnections(connections.filter(c => c.from !== id && c.to !== id));
  };

  const handleNodeClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedTool === 'Pen') return;
    if (!connectSource) {
      setConnectSource(id);
    } else {
      if (connectSource !== id) {
        setConnections([...connections, { from: connectSource, to: id }]);
      }
      setConnectSource(null);
    }
  };

  const handleSaveTopology = () => {
    const customTopology = {
      name: `Custom Hand-Drawn Network (${new Date().toLocaleDateString()})`,
      nodes,
      connections,
      strokes,
      date: new Date().toISOString()
    };
    
    const saved = JSON.parse(localStorage.getItem('netforge_custom_topologies') || '[]');
    localStorage.setItem('netforge_custom_topologies', JSON.stringify([...saved, customTopology]));
    
    setSaveMessage('✓ Custom Topology & Drawings Saved Successfully!');
    setTimeout(() => setSaveMessage(''), 4000);
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'Router': return '🌐';
      case 'Switch': return '🖧';
      case 'PC': return '💻';
      case 'Firewall': return '🧱';
      case 'Cloud': return '☁️';
      default: return '💻';
    }
  };

  // تحويل النقاط إلى مسار SVG
  const pointsToPath = (pts: { x: number; y: number }[]) => {
    return pts.reduce((acc, pt, idx) => {
      return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
    }, '');
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-300 font-sans flex overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900/40 backdrop-blur-xl border-r border-slate-800/60 flex flex-col justify-between h-screen shrink-0 z-20">
        <div className="p-6">
          <Link to="/" className="text-xl font-bold text-blue-400 mb-10 tracking-widest uppercase block hover:opacity-80 transition-opacity">
            NETFORGE
          </Link>
          
          <nav className="space-y-1">
            <Link to="/dashboard" className="flex items-center gap-3 text-slate-400 hover:text-white hover:bg-slate-800/30 px-4 py-2.5 rounded-lg transition-colors">
              Dashboard
            </Link>
            <Link to="/lab" className="flex items-center gap-3 text-slate-400 hover:text-white hover:bg-slate-800/30 px-4 py-2.5 rounded-lg transition-colors mt-2">
              Network Lab
            </Link>
            <Link to="/canvas" className="flex items-center gap-3 text-white bg-slate-800/50 px-4 py-2.5 rounded-lg border border-slate-700/50 font-medium shadow-lg shadow-cyan-900/10">
              Drawing Studio ✏️
            </Link>
            <Link to="/challenges" className="flex items-center gap-3 text-slate-400 hover:text-white hover:bg-slate-800/30 px-4 py-2.5 rounded-lg transition-colors">
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
            {JSON.parse(localStorage.getItem('netforge_user') || '{"initial":"N"}').initial}
          </div>
          <div>
            <h4 className="text-white font-medium text-sm leading-tight">
              {JSON.parse(localStorage.getItem('netforge_user') || '{"name":"Network Engineer"}').name}
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">Drawing Workspace</p>
          </div>
        </div>
      </aside>

      {/* Main Drawing Area */}
      <main className="flex-1 p-8 flex flex-col h-screen relative">
        
        {/* Top Toolbar */}
        <header className="flex flex-wrap justify-between items-center gap-4 mb-6 bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl backdrop-blur-md z-10">
          <div>
            <h2 className="text-xl font-bold text-white mb-0.5">Freehand & Network Sketch Studio</h2>
            <p className="text-xs text-slate-400">Select the ✏️ Freehand Pen tool to draw sketches, or select network devices to place them.</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-400 font-medium">Tools:</span>
            
            {/* أداة القلم مميزة وبارزة */}
            <button
              onClick={() => setSelectedTool('Pen')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border flex items-center gap-1.5 ${
                selectedTool === 'Pen'
                  ? 'bg-cyan-400 text-slate-950 border-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.5)]'
                  : 'bg-slate-950 text-cyan-400 border-cyan-500/50 hover:bg-slate-900'
              }`}
            >
              <span>✏️</span>
              <span>Freehand Pen (Draw)</span>
            </button>

            {(['Router', 'Switch', 'PC', 'Firewall', 'Cloud'] as const).map((tool) => (
              <button
                key={tool}
                onClick={() => setSelectedTool(tool)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center gap-1.5 ${
                  selectedTool === tool
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <span>{getNodeIcon(tool)}</span>
                <span>{tool}</span>
              </button>
            ))}

            <button
              onClick={() => {
                setStrokes([]);
                setNodes([]);
                setConnections([]);
              }}
              className="bg-slate-800 hover:bg-slate-700 text-rose-400 border border-rose-500/30 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Clear All 🗑️
            </button>

            <button
              onClick={handleSaveTopology}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-all cursor-pointer shadow-lg ml-2"
            >
              💾 Save Drawing
            </button>
          </div>
        </header>

        {saveMessage && (
          <div className="mb-4 p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-xs font-mono text-emerald-300">
            {saveMessage}
          </div>
        )}

        {/* The Interactive Canvas */}
        <div 
          onClick={handleCanvasClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className={`flex-1 bg-slate-950/95 border border-slate-800/80 rounded-3xl relative overflow-hidden shadow-2xl ${
            selectedTool === 'Pen' ? 'cursor-crosshair' : 'cursor-pointer'
          }`}
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #1e293b 1px, transparent 0)', backgroundSize: '30px 30px' }}
        >
          {/* طبقة الـ SVG لعرض الروابط والخطوط الحرة */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {/* روابط الأجهزة */}
            {connections.map((conn, idx) => {
              const nodeA = nodes.find(n => n.id === conn.from);
              const nodeB = nodes.find(n => n.id === conn.to);
              if (!nodeA || !nodeB) return null;
              return (
                <line
                  key={`conn-${idx}`}
                  x1={nodeA.x + 40}
                  y1={nodeA.y + 40}
                  x2={nodeB.x + 40}
                  y2={nodeB.y + 40}
                  stroke="#06b6d4"
                  strokeWidth="3"
                  strokeDasharray="4"
                  className="animate-pulse"
                />
              );
            })}

            {/* الخطوط المرسومة مسبقاً */}
            {strokes.map((stroke, sIdx) => (
              <path
                key={`stroke-${sIdx}`}
                d={pointsToPath(stroke.points)}
                stroke="#38bdf8"
                strokeWidth="3.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}

            {/* الخط الحالي أثناء رسمه بالماوس (Live Preview) */}
            {isDrawing && currentPoints.length > 1 && (
              <path
                d={pointsToPath(currentPoints)}
                stroke="#f43f5e"
                strokeWidth="3.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </svg>

          {/* Render Nodes */}
          {nodes.map((node) => {
            const isConnecting = connectSource === node.id;
            return (
              <div
                key={node.id}
                onClick={(e) => handleNodeClick(node.id, e)}
                style={{ left: node.x, top: node.y }}
                className={`absolute w-20 h-20 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all select-none border group z-10 ${
                  isConnecting 
                    ? 'bg-amber-500/30 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.5)]' 
                    : 'bg-slate-900/90 border-slate-700 hover:border-cyan-400 shadow-lg'
                }`}
              >
                <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">{getNodeIcon(node.type)}</span>
                <span className="text-[10px] font-bold text-white truncate max-w-[70px]">{node.name}</span>
                <span className="text-[9px] font-mono text-cyan-400">{node.ip}</span>

                <button
                  onClick={(e) => handleDeleteNode(node.id, e)}
                  className="absolute -top-2 -right-2 bg-rose-600 hover:bg-rose-500 text-white w-5 h-5 rounded-full text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                  title="Delete Device"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>

      </main>
    </div>
  );
}

export default NetworkCanvas;