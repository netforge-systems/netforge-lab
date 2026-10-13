import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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
    cliHints: `Router-01(config)# interface gigabitEthernet 0/1
Router-01(config-if)# ip ospf hello-interval 10
Router-01(config-if)# ip ospf dead-interval 40`,
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
    cliHints: `ABR-Router(config)# router ospf 1
ABR-Router(config-router)# area 20 stub no-summary`,
    taskQuestion: 'Enter the OSPF router sub-command on the ABR to configure Area 20 as a Totally Stubby Area:',
    expectedKeywords: ['area 20 stub no-summary'],
    sampleSolution: 'area 20 stub no-summary',
    diagram: (
      <div className="relative w-full h-40 flex items-center justify-center bg-slate-950/80 rounded-xl overflow-hidden border border-slate-800">
        <div className="absolute left-4 w-1/3 h-28 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-start p-2 text-[10px] font-bold text-amber-500/60 uppercase tracking-widest">Area 20</div>
        <div className="absolute right-4 w-1/2 h-28 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-start justify-end p-2 text-[10px] font-bold text-emerald-500/60 uppercase tracking-widest">Area 0 (Backbone)</div>
        <div className="absolute w-40 h-0.5 bg-slate-600"></div>
        <div className="absolute -translate-x-28 flex flex-col items-center z-10">
          <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-amber-500/50 flex items-center justify-center text-xs font-bold text-white mb-1">BR1</div>
          <span className="text-[9px] text-slate-400 bg-slate-900 px-1 rounded font-mono">Branch</span>
        </div>
        <div className="absolute translate-x-12 flex flex-col items-center z-10">
          <div className="w-12 h-12 rounded-full bg-indigo-500/20 border-2 border-indigo-400 flex items-center justify-center text-xs font-bold text-white mb-1 shadow-[0_0_15px_rgba(99,102,241,0.4)]">ABR</div>
          <span className="text-[9px] text-indigo-300 font-mono bg-slate-900 px-1 rounded border border-indigo-500/30">Target Router</span>
        </div>
      </div>
    )
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
    cliHints: `Edge-RTR(config)# route-map PRIMARY_ISP permit 10
Edge-RTR(config-route-map)# set local-preference 200`,
    taskQuestion: 'Enter the route-map command used to raise BGP Local Preference to 200:',
    expectedKeywords: ['set local-preference 200'],
    sampleSolution: 'set local-preference 200'
  },
  {
    id: 4,
    title: 'Multicast Routing: PIM Sparse-Mode & RP',
    category: 'Routing',
    difficulty: 'Expert',
    xp: 550,
    status: 'Not Started',
    description: 'Configure IP multicast routing across subnets using PIM Sparse-Mode and define the Rendezvous Point (RP) at 10.0.0.1.',
    symptoms: 'Multicast stream 239.1.1.10 fails to cross Router-01 because no Rendezvous Point (RP) is defined.',
    objectives: [
      'Enable global ip multicast-routing',
      'Configure the static PIM Rendezvous Point address as 10.0.0.1'
    ],
    cliHints: `Router-01(config)# ip multicast-routing
Router-01(config)# ip pim rp-address 10.0.0.1`,
    taskQuestion: 'Enter the global configuration command to set the PIM Rendezvous Point (RP) to 10.0.0.1:',
    expectedKeywords: ['ip pim rp-address 10.0.0.1'],
    sampleSolution: 'ip pim rp-address 10.0.0.1'
  },
  {
    id: 5,
    title: 'VLAN Segmentation, 802.1Q Trunking & Native VLAN',
    category: 'Switching',
    difficulty: 'Easy',
    xp: 150,
    status: 'Completed',
    description: 'Fix a Native VLAN mismatch on Switch-01 port Gi0/1 by setting the 802.1Q trunk native VLAN to 99.',
    symptoms: 'Console prints %CDP-4-NATIVE_VLAN_MISMATCH: Native VLAN mismatch discovered on GigabitEthernet0/1 (1), with Router-01 (99).',
    objectives: [
      'Configure Gi0/1 as a trunk port',
      'Align the Native VLAN to 99 to match the neighbor router'
    ],
    cliHints: `Switch-01(config)# interface gigabitEthernet 0/1
Switch-01(config-if)# switchport mode trunk
Switch-01(config-if)# switchport trunk native vlan 99`,
    taskQuestion: 'Enter the interface command on Switch-01 to set the trunk Native VLAN to 99:',
    expectedKeywords: ['switchport trunk native vlan 99'],
    sampleSolution: 'switchport trunk native vlan 99',
    diagram: (
      <div className="relative w-full h-40 flex items-center justify-center bg-slate-950/80 rounded-xl overflow-hidden border border-slate-800">
        <div className="absolute w-32 h-1 bg-rose-500/50"></div>
        <div className="absolute translate-y-3 font-mono text-[10px] text-rose-400 bg-slate-900 px-2 rounded-full border border-rose-500/30">VLAN Mismatch!</div>
        <div className="absolute -translate-x-28 flex flex-col items-center">
          <div className="w-16 h-8 bg-blue-500/20 border-2 border-blue-400 rounded flex items-center justify-center text-xs font-bold text-white mb-1">SW-01</div>
          <span className="text-[9px] text-slate-400 font-mono">Gi0/1</span>
          <span className="text-[9px] text-rose-400 font-mono font-bold">Native: 1</span>
        </div>
        <div className="absolute translate-x-28 flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-500 flex items-center justify-center text-xs font-bold text-white mb-1">R1</div>
          <span className="text-[9px] text-slate-400 font-mono">Gi0/0</span>
          <span className="text-[9px] text-emerald-400 font-mono font-bold">Native: 99</span>
        </div>
      </div>
    )
  },
  {
    id: 6,
    title: 'Rapid-PVST+ Root Bridge Election & PortFast',
    category: 'Switching',
    difficulty: 'Medium',
    xp: 300,
    status: 'Not Started',
    description: 'Force Core-SW1 to become the Spanning-Tree Root Bridge for VLAN 10 by lowering its priority to 4096.',
    symptoms: 'An old access switch with priority 32768 and a lower MAC address is currently acting as the STP Root Bridge.',
    objectives: [
      'Configure spanning-tree priority 4096 for VLAN 10 on Core-SW1'
    ],
    cliHints: `Core-SW1(config)# spanning-tree mode rapid-pvst
Core-SW1(config)# spanning-tree vlan 10 priority 4096`,
    taskQuestion: 'Enter the global command to set Spanning-Tree VLAN 10 priority to 4096:',
    expectedKeywords: ['spanning-tree vlan 10 priority 4096'],
    sampleSolution: 'spanning-tree vlan 10 priority 4096',
    diagram: (
      <div className="relative w-full h-48 flex items-center justify-center bg-slate-950/80 rounded-xl overflow-hidden border border-slate-800">
        <div className="absolute w-24 h-0.5 bg-cyan-500/40 rotate-45 -translate-x-12 translate-y-4"></div>
        <div className="absolute w-24 h-0.5 bg-rose-500/40 -rotate-45 translate-x-12 translate-y-4">
          <div className="absolute right-0 w-3 h-3 bg-rose-500 rounded-full -translate-y-1 translate-x-2 animate-pulse"></div>
        </div>
        <div className="absolute w-32 h-0.5 bg-cyan-500/40 translate-y-16"></div>
        <div className="absolute -translate-y-10 flex flex-col items-center z-10">
          <div className="w-14 h-8 bg-blue-500/20 border-2 border-blue-400 rounded flex items-center justify-center text-xs font-bold text-white mb-1 shadow-[0_0_15px_rgba(59,130,246,0.4)]">Core-SW1</div>
          <span className="text-[9px] text-slate-300 font-mono bg-slate-900 px-1 rounded">Pri: 32768</span>
          <span className="text-[9px] text-slate-500 font-mono">MAC: FF:FF</span>
        </div>
        <div className="absolute -translate-x-20 translate-y-16 flex flex-col items-center z-10">
          <div className="w-12 h-8 bg-slate-800 border-2 border-emerald-500/50 rounded flex items-center justify-center text-xs font-bold text-white mb-1">Acc-SW2</div>
          <span className="text-[9px] text-emerald-400 font-mono bg-slate-900 px-1 rounded border border-emerald-500/30">Current Root</span>
          <span className="text-[9px] text-slate-500 font-mono">MAC: AA:AA</span>
        </div>
        <div className="absolute translate-x-20 translate-y-16 flex flex-col items-center z-10">
          <div className="w-12 h-8 bg-slate-800 border-2 border-slate-600 rounded flex items-center justify-center text-xs font-bold text-white mb-1">Acc-SW3</div>
          <span className="text-[9px] text-slate-300 font-mono bg-slate-900 px-1 rounded">Pri: 32768</span>
        </div>
      </div>
    )
  },
  {
    id: 7,
    title: 'Layer 2 LACP EtherChannel Link Aggregation',
    category: 'Switching',
    difficulty: 'Medium',
    xp: 280,
    status: 'Not Started',
    description: 'Bundle dual Gigabit uplinks into Port-Channel 1 using active IEEE 802.3ad LACP negotiation.',
    symptoms: 'STP is blocking one of the two physical uplinks because they are not bundled into an EtherChannel.',
    objectives: [
      'Configure channel-group 1 in LACP active mode on the uplink interfaces'
    ],
    cliHints: `Switch-01(config-if-range)# channel-group 1 mode active`,
    taskQuestion: 'Enter the interface command to join channel-group 1 using active LACP mode:',
    expectedKeywords: ['channel-group 1 mode active'],
    sampleSolution: 'channel-group 1 mode active'
  },
  {
    id: 8,
    title: 'VLSM & CIDR Enterprise Address Planning',
    category: 'Addressing & Core',
    difficulty: 'Easy',
    xp: 150,
    status: 'Completed',
    description: 'Calculate the correct dotted-decimal Subnet Mask for an Engineering LAN requiring 50 hosts (/26 prefix).',
    symptoms: 'Router-01 interface Gig0/0 needs a /26 subnet mask on 192.168.10.1 to accommodate 62 usable hosts.',
    objectives: [
      'Convert /26 CIDR notation into its dotted-decimal IPv4 subnet mask'
    ],
    cliHints: `/24 = 255.255.255.0
/25 = 255.255.255.128
/26 = 255.255.255.192 (62 usable hosts)`,
    taskQuestion: 'What is the exact dotted-decimal Subnet Mask for a /26 network (or enter the ip address command)?',
    expectedKeywords: ['255.255.255.192'],
    sampleSolution: '255.255.255.192'
  },
  {
    id: 9,
    title: 'IPv6 Dual-Stack, SLAAC & EUI-64 Addressing',
    category: 'Addressing & Core',
    difficulty: 'Medium',
    xp: 320,
    status: 'Not Started',
    description: 'Enable IPv6 packet forwarding globally on Router-01 so it can send Router Advertisements (RA) and run OSPFv3.',
    symptoms: 'IPv6 addresses are configured on interfaces, but Router-01 is not routing IPv6 traffic between subnets.',
    objectives: [
      'Enable global IPv6 unicast routing in configuration mode'
    ],
    cliHints: `Router-01(config)# ipv6 unicast-routing`,
    taskQuestion: 'Enter the global Cisco IOS command required to enable IPv6 routing on a router:',
    expectedKeywords: ['ipv6 unicast-routing'],
    sampleSolution: 'ipv6 unicast-routing'
  },
  {
    id: 10,
    title: 'Dynamic PAT Overload & DMZ Static NAT',
    category: 'Addressing & Core',
    difficulty: 'Medium',
    xp: 300,
    status: 'Not Started',
    description: 'Configure PAT (Port Address Translation) overload on Router-01 so internal LAN hosts (ACL 1) share interface Gig0/1.',
    symptoms: 'Private LAN hosts (192.168.1.0/24) cannot reach the internet because NAT overload is missing.',
    objectives: [
      'Bind access-list 1 to outside interface gig0/1 with the overload keyword'
    ],
    cliHints: `Router-01(config)# ip nat inside source list 1 interface gig0/1 overload`,
    taskQuestion: 'Enter the NAT command to translate source list 1 using interface gig0/1 with PAT overload:',
    expectedKeywords: ['ip nat inside source list 1', 'overload'],
    sampleSolution: 'ip nat inside source list 1 interface gig0/1 overload'
  },
  {
    id: 11,
    title: 'TCP Windowing, 3-Way Handshake & MTU Clamping',
    category: 'Addressing & Core',
    difficulty: 'Hard',
    xp: 380,
    status: 'Not Started',
    description: 'Prevent TCP packet drops over an encrypted VPN tunnel by clamping the TCP Maximum Segment Size (MSS) to 1360 bytes.',
    symptoms: 'Large HTTPS payloads fragment and drop across Tunnel0 due to 24-byte GRE + IPsec encapsulation overhead.',
    objectives: [
      'Configure TCP MSS clamping to 1360 bytes on the tunnel interface'
    ],
    cliHints: `Router-01(config-if)# ip tcp adjust-mss 1360`,
    taskQuestion: 'Enter the Cisco IOS interface command to clamp the TCP MSS to 1360 bytes:',
    expectedKeywords: ['ip tcp adjust-mss 1360'],
    sampleSolution: 'ip tcp adjust-mss 1360'
  },
  {
    id: 12,
    title: 'Perimeter Firewall Extended ACLs & Stateful Filtering',
    category: 'Security',
    difficulty: 'Hard',
    xp: 400,
    status: 'Not Started',
    description: 'Permit external HTTPS (TCP port 443) traffic from any source to the DMZ Web Server (host 192.168.1.100).',
    symptoms: 'External users cannot establish TLS connections to the web server at 192.168.1.100 on port 443.',
    objectives: [
      'Write the Extended ACL entry permitting TCP from any source to host 192.168.1.100 eq 443'
    ],
    cliHints: `Firewall(config-ext-nacl)# permit tcp any host 192.168.1.100 eq 443`,
    taskQuestion: 'Enter the Extended ACL rule to permit TCP traffic from any source to host 192.168.1.100 on port 443:',
    expectedKeywords: ['permit tcp any host 192.168.1.100 eq 443'],
    sampleSolution: 'permit tcp any host 192.168.1.100 eq 443',
    diagram: (
      <div className="relative w-full h-40 flex items-center justify-center bg-slate-950/80 rounded-xl overflow-hidden border border-slate-800">
        <div className="absolute w-48 h-1 bg-cyan-500/30"></div>
        <div className="absolute -translate-x-32 flex flex-col items-center z-10">
          <div className="text-2xl mb-1">☁️</div>
          <span className="text-[10px] text-slate-400 font-bold uppercase">Internet</span>
          <span className="text-[9px] text-cyan-400 font-mono">Any Source</span>
        </div>
        <div className="absolute flex flex-col items-center z-10">
          <div className="w-8 h-12 bg-rose-500/20 border-2 border-rose-500 rounded flex items-center justify-center text-lg mb-1 shadow-[0_0_15px_rgba(244,63,94,0.4)]">🧱</div>
          <span className="text-[10px] text-rose-400 font-bold uppercase">Firewall</span>
          <span className="text-[9px] text-slate-400 font-mono">DENY TCP 443</span>
        </div>
        <div className="absolute translate-x-32 flex flex-col items-center z-10">
          <div className="text-2xl mb-1">🖥️</div>
          <span className="text-[10px] text-slate-400 font-bold uppercase">DMZ Web</span>
          <span className="text-[9px] text-emerald-400 font-mono">192.168.1.100</span>
        </div>
      </div>
    )
  },
  {
    id: 13,
    title: 'Layer 2 Port Security & CAM Table Overflow Mitigation',
    category: 'Security',
    difficulty: 'Medium',
    xp: 300,
    status: 'Not Started',
    description: 'Enable dynamic Sticky MAC address learning on Switch-01 access ports to prevent MAC spoofing.',
    symptoms: 'Switch ports are vulnerable to CAM table overflow attacks because MAC addresses are not locked to interfaces.',
    objectives: [
      'Enable sticky MAC learning on the switchport'
    ],
    cliHints: `Switch-01(config-if)# switchport port-security mac-address sticky`,
    taskQuestion: 'Enter the interface command to enable Sticky MAC learning in port-security:',
    expectedKeywords: ['switchport port-security mac-address sticky'],
    sampleSolution: 'switchport port-security mac-address sticky'
  },
  {
    id: 14,
    title: 'DHCP Snooping & Dynamic ARP Inspection (DAI)',
    category: 'Security',
    difficulty: 'Hard',
    xp: 450,
    status: 'Not Started',
    description: 'Mitigate ARP spoofing Man-in-the-Middle attacks on VLAN 10 by enabling Dynamic ARP Inspection.',
    symptoms: 'Unauthorized gratuitous ARP replies are poisoning the ARP cache of workstations in VLAN 10.',
    objectives: [
      'Enable Dynamic ARP Inspection globally for VLAN 10'
    ],
    cliHints: `Switch-01(config)# ip arp inspection vlan 10`,
    taskQuestion: 'Enter the global switch configuration command to enable Dynamic ARP Inspection on VLAN 10:',
    expectedKeywords: ['ip arp inspection vlan 10'],
    sampleSolution: 'ip arp inspection vlan 10'
  },
  {
    id: 15,
    title: 'Site-to-Site IPsec VPN Tunnel (IKEv2 / AES-256)',
    category: 'Security',
    difficulty: 'Expert',
    xp: 550,
    status: 'Not Started',
    description: 'Configure ISAKMP Phase 1 encryption to use 256-bit AES encryption for the Site-to-Site VPN policy.',
    symptoms: 'IKE Phase 1 negotiation fails because encryption strength is not set to AES-256.',
    objectives: [
      'Specify 256-bit AES encryption inside the ISAKMP policy'
    ],
    cliHints: `Router-01(config-isakmp)# encryption aes 256`,
    taskQuestion: 'Enter the ISAKMP policy sub-command to set encryption to 256-bit AES:',
    expectedKeywords: ['encryption aes 256'],
    sampleSolution: 'encryption aes 256'
  },
  {
    id: 16,
    title: 'SOC Active Response: SSH Brute-Force Firewall Block',
    category: 'SOC & Defense',
    difficulty: 'Expert',
    xp: 600,
    status: 'Not Started',
    description: 'Block attacker IP 185.220.101.45 performing a Hydra SSH brute-force attack on Server-01 using UFW or iptables.',
    symptoms: 'Wazuh SIEM triggered Rule 5712: High-rate SSH authentication failures from 185.220.101.45 on Port 22.',
    objectives: [
      'Execute a Linux firewall command (ufw or iptables) to drop traffic from 185.220.101.45'
    ],
    cliHints: `ufw deny from 185.220.101.45 to any
# OR:
iptables -I INPUT -s 185.220.101.45 -j DROP`,
    taskQuestion: 'Enter the Linux firewall command (UFW or iptables) to block attacker IP 185.220.101.45:',
    expectedKeywords: ['185.220.101.45'],
    sampleSolution: 'ufw deny from 185.220.101.45 to any'
  },
  {
    id: 17,
    title: 'Honeypot DMZ Isolation & SIEM Syslog Forwarding',
    category: 'SOC & Defense',
    difficulty: 'Hard',
    xp: 500,
    status: 'Not Started',
    description: 'Isolate the Honeypot switch port so it cannot communicate laterally with other Layer-2 neighbor ports.',
    symptoms: 'Compromised honeypot node is attempting lateral movement to adjacent servers on the same switch.',
    objectives: [
      'Enable protected port isolation on the Switch-01 interface connected to the Honeypot'
    ],
    cliHints: `Switch-01(config-if)# switchport protected`,
    taskQuestion: 'Enter the Cisco IOS interface command to isolate the port as a protected switchport:',
    expectedKeywords: ['switchport protected'],
    sampleSolution: 'switchport protected'
  }
];

const speedRunQuestions = [
  { q: 'What is the OSPF Hello packet destination multicast IP?', answer: '224.0.0.5' },
  { q: 'What IEEE standard defines VLAN trunking (dot1q)?', answer: '802.1q' },
  { q: 'Enter the command to save Cisco IOS running-config to startup-config:', answer: 'write' },
  { q: 'What is the default Administrative Distance (AD) of OSPF?', answer: '110' },
  { q: 'What TCP port is used securely for HTTPS web traffic?', answer: '443' }
];

function Challenges() {
  const [challenges, setChallenges] = useState<Challenge[]>(() => {
    const saved = localStorage.getItem('netforge_challenges_v4');
    if (saved) {
      return JSON.parse(saved);
    }
    localStorage.setItem('netforge_challenges_v4', JSON.stringify(masterChallengesList.map(c => ({...c, diagram: undefined}))));
    return masterChallengesList;
  });

  const [totalXp, setTotalXp] = useState<number>(() => {
    return Number(localStorage.getItem('netforge_xp') || 0);
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [activeSolverModal, setActiveSolverModal] = useState<Challenge | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [solverFeedback, setSolverFeedback] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [showHint, setShowHint] = useState<boolean>(false);

  // حالات سباق الحزم السريع (120 ثانية مع دعم زر Back)
  const [isSpeedRunOpen, setIsSpeedRunOpen] = useState<boolean>(false);
  const [currentSpeedIndex, setCurrentSpeedIndex] = useState<number>(0);
  const [speedAnswer, setSpeedAnswer] = useState<string>('');
  const [speedScore, setSpeedScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(120); // 120 ثانية (دقيقتين)
  const [speedRunEnded, setSpeedRunEnded] = useState<boolean>(false);

  const [isEmergencyActive, setIsEmergencyActive] = useState<boolean>(false);

  useEffect(() => {
    const dataToSave = challenges.map(c => ({...c, diagram: undefined}));
    localStorage.setItem('netforge_challenges_v4', JSON.stringify(dataToSave));
  }, [challenges]);

  // عداد زمني لمدة دقيقتين (120 ثانية)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSpeedRunOpen && !speedRunEnded && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !speedRunEnded) {
      setSpeedRunEnded(true);
    }
    return () => clearInterval(timer);
  }, [isSpeedRunOpen, timeLeft, speedRunEnded]);

  const filteredChallenges = challenges.filter(c => {
    const matchCategory = selectedCategory === 'All' || c.category === selectedCategory;
    const matchDifficulty = selectedDifficulty === 'All' || c.difficulty === selectedDifficulty;
    
    const query = searchQuery.toLowerCase().trim();
    const matchSearch = query === '' || 
      (c.title?.toLowerCase().includes(query)) ||
      (c.description?.toLowerCase().includes(query)) ||
      (c.symptoms?.toLowerCase().includes(query)) ||
      (c.category?.toLowerCase().includes(query));

    return matchCategory && matchDifficulty && matchSearch;
  });

  const handleVerifySolution = (e: React.FormEvent) => {
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

        const updated = challenges.map(ch => 
          ch.id === activeSolverModal.id ? { ...ch, status: 'Completed' as const } : ch
        );
        setChallenges(updated);
        setActiveSolverModal({ ...activeSolverModal, status: 'Completed' });
      }

      setSolverFeedback({
        type: 'success',
        message: `✓ Configuration Verified! Fault resolved and +${activeSolverModal.xp} XP awarded.`
      });
    } else {
      setSolverFeedback({
        type: 'error',
        message: `% Verification Failed: Command syntax or parameter did not resolve the fault. Check the CLI hint if needed.`
      });
    }
  };

  const handleSpeedAnswerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentQ = speedRunQuestions[currentSpeedIndex];
    if (speedAnswer.trim().toLowerCase() === currentQ.answer.toLowerCase()) {
      setSpeedScore(prev => prev + 50);
    }

    if (currentSpeedIndex + 1 < speedRunQuestions.length) {
      setCurrentSpeedIndex(prev => prev + 1);
      setSpeedAnswer('');
    } else {
      setSpeedRunEnded(true);
      const finalBonus = totalXp + speedScore + 50;
      setTotalXp(finalBonus);
      localStorage.setItem('netforge_xp', String(finalBonus));
    }
  };

  const getDifficultyStyle = (diff: string) => {
    if (diff === 'Easy') return 'text-emerald-400 bg-emerald-400/10 border-emerald-500/30';
    if (diff === 'Medium') return 'text-amber-400 bg-amber-400/10 border-amber-500/30';
    if (diff === 'Hard') return 'text-rose-400 bg-rose-400/10 border-rose-500/30';
    return 'text-purple-400 bg-purple-500/15 border-purple-500/40 shadow-[0_0_10px_rgba(168,85,247,0.2)]';
  };

  const completedCount = challenges.filter(c => c.status === 'Completed').length;

  return (
    <div className={`min-h-screen font-sans flex overflow-hidden transition-colors duration-500 ${isEmergencyActive ? 'bg-[#1a0507]' : 'bg-[#0B1120] text-slate-300'}`}>
      
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
            <Link to="/challenges" className="flex items-center gap-3 text-white bg-slate-800/50 px-4 py-2.5 rounded-lg border border-slate-700/50 font-medium shadow-lg shadow-blue-900/10">
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
            <p className="text-xs text-slate-500 mt-0.5">{totalXp.toLocaleString()} XP</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto h-screen relative">
        <div className="absolute inset-0 z-0 opacity-[0.03]"
             style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}>
        </div>

        <div className="relative z-10">
          
          <div className="flex justify-end items-center gap-3 mb-4">
            <button
              onClick={() => setIsEmergencyActive(!isEmergencyActive)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 cursor-pointer shadow-lg ${
                isEmergencyActive 
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.4)]' 
                  : 'bg-rose-600 border-rose-500 text-white animate-bounce shadow-[0_0_25px_rgba(244,63,94,0.6)]'
              }`}
            >
              <span className="text-sm">{isEmergencyActive ? '🟢 Resolve Emergency' : '🚨 TRIGGER NETWORK OUTAGE!'}</span>
            </button>

            <button
              onClick={() => {
                setIsSpeedRunOpen(true);
                setCurrentSpeedIndex(0);
                setSpeedScore(0);
                setTimeLeft(120); // 120 ثانية (دقيقتين)
                setSpeedRunEnded(false);
                setSpeedAnswer('');
              }}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 px-4 py-2 rounded-xl text-xs font-extrabold transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center gap-1.5 cursor-pointer"
            >
              <span>🚀 Packet Rush Speed Run</span>
            </button>
          </div>

          {isEmergencyActive && (
            <div className="mb-6 p-4 bg-rose-950/80 border-2 border-rose-600 rounded-2xl flex items-center gap-3 text-rose-200 font-mono text-xs shadow-[0_0_30px_rgba(244,63,94,0.3)] animate-pulse">
              <span className="text-2xl">⚠</span>
              <div>
                <strong className="block text-sm font-bold uppercase tracking-wider">CRITICAL ALERT: Global Outage Simulated</strong>
                <span>All core routing protocols are flagged red. Click "Resolve Emergency" to restore standard network operations.</span>
              </div>
            </div>
          )}

          <header className="flex flex-wrap justify-between items-end gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Interactive Auto-Graded Labs
                </span>
                <span className="text-[11px] font-mono text-slate-500">17 Scenarios • Real CLI Verification</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-1">Engineering Challenge Arena</h2>
              <p className="text-slate-400 text-sm">Click "⚡ Solve Challenge" on any scenario to diagnose the fault, enter the CLI fix, and claim your XP.</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 px-5 py-3 rounded-xl flex items-center gap-5">
              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Earned</div>
                <div className="text-xl font-bold text-cyan-400 font-mono">{totalXp.toLocaleString()} XP</div>
              </div>
              <div className="h-8 w-[1px] bg-slate-800"></div>
              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Solved</div>
                <div className="text-xl font-bold text-emerald-400 font-mono">{completedCount} / {challenges.length}</div>
              </div>
            </div>
          </header>

          <div className="flex flex-wrap justify-between items-center gap-4 mb-6 bg-slate-900/40 border border-slate-800/60 p-4 rounded-xl backdrop-blur-sm">
            <div className="relative w-96">
              <input 
                type="text"
                placeholder="Search challenges (e.g., OSPF, BGP, IPv6, ACL, Wazuh)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950/90 border border-slate-800 rounded-lg px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 mr-1 font-medium">Difficulty:</span>
              {['All', 'Easy', 'Medium', 'Hard', 'Expert'].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                    selectedDifficulty === diff
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                      : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-800/80 pb-4">
            {['All', 'Routing', 'Switching', 'Addressing & Core', 'Security', 'SOC & Defense'].map((cat) => {
              const count = cat === 'All' ? challenges.length : challenges.filter(c => c.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 border-transparent'
                      : 'bg-slate-900/40 text-slate-400 hover:text-white hover:bg-slate-800/50 border border-slate-800/60'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${selectedCategory === cat ? 'bg-blue-800 text-blue-200' : 'bg-slate-800 text-slate-400'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {filteredChallenges.map((challenge) => (
              <div 
                key={challenge.id} 
                className={`p-6 rounded-2xl backdrop-blur-sm flex flex-col justify-between transition-all group border ${
                  isEmergencyActive 
                    ? 'bg-rose-950/20 border-rose-600/60 shadow-[0_0_20px_rgba(244,63,94,0.15)]' 
                    : 'bg-slate-900/40 border-slate-800/60 hover:border-cyan-500/40'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-xs px-2.5 py-1 rounded-md font-semibold border ${getDifficultyStyle(challenge.difficulty)}`}>
                        {challenge.difficulty}
                      </span>
                      <span className="text-xs text-slate-300 bg-slate-800/80 border border-slate-700/60 px-2.5 py-1 rounded-md font-mono">
                        {challenge.category}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-cyan-400 font-mono bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-lg">
                      +{challenge.xp} XP
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                    {challenge.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-4">
                    {challenge.description}
                  </p>

                  <div className={`border rounded-xl p-3 mb-5 ${isEmergencyActive ? 'bg-rose-950/50 border-rose-500/40 text-rose-200' : 'bg-slate-950/70 border-slate-800/80'}`}>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-rose-400 font-bold mb-1">
                      ⚠ Detected Fault / Symptom:
                    </div>
                    <p className="text-xs text-slate-300 font-mono line-clamp-2">
                      {isEmergencyActive ? 'CRITICAL: Interface flapping and packet drops detected across all uplinks.' : challenge.symptoms}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-slate-800/60">
                  <span className={`text-xs font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${
                    challenge.status === 'Completed' 
                      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' 
                      : 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${
                      challenge.status === 'Completed' ? 'bg-emerald-400' : 'bg-amber-400'
                    }`}></span>
                    {challenge.status === 'Completed' ? 'Solved ✓' : 'Unsolved'}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setActiveSolverModal(challenge);
                        setUserAnswer('');
                        setSolverFeedback({ type: null, message: '' });
                        setShowHint(false);
                      }}
                      className="px-4 py-2 rounded-lg text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
                    >
                      ⚡ {challenge.status === 'Completed' ? 'Review Solution' : 'Solve Challenge'}
                    </button>

                    <Link 
                      to="/lab" 
                      className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
                    >
                      Open Sandbox →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* نافذة سباق الحزم السريع (دقيقتين مع زر Back) */}
      {isSpeedRunOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[#0B1120] border-2 border-cyan-500/50 rounded-2xl max-w-lg w-full p-7 shadow-[0_0_50px_rgba(6,182,212,0.3)] relative">
            
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xl">🚀</span>
                <h3 className="text-lg font-black text-cyan-400 tracking-wide">Packet Rush Speed Run</h3>
              </div>
              {!speedRunEnded && (
                <div className="bg-slate-900 border border-slate-700 px-3 py-1 rounded-full font-mono text-xs text-amber-400 font-bold">
                  ⏱ {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')} Left
                </div>
              )}
            </div>

            {!speedRunEnded ? (
              <div>
                <div className="flex justify-between items-center text-xs text-slate-400 font-mono mb-2">
                  <span>Question {currentSpeedIndex + 1} of {speedRunQuestions.length}</span>
                  <span className="text-cyan-400 font-bold">Score: {speedScore} XP</span>
                </div>

                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mb-6 border border-slate-800">
                  <div 
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-300"
                    style={{ width: `${((currentSpeedIndex + 1) / speedRunQuestions.length) * 100}%` }}
                  ></div>
                </div>

                <p className="text-sm font-bold text-white mb-5 bg-slate-950/70 p-4 rounded-xl border border-slate-800/80">
                  {speedRunQuestions[currentSpeedIndex].q}
                </p>

                <form onSubmit={handleSpeedAnswerSubmit} className="space-y-4">
                  <input
                    type="text"
                    autoFocus
                    placeholder="Type your fast answer..."
                    value={speedAnswer}
                    onChange={(e) => setSpeedAnswer(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-cyan-400"
                    required
                  />
                  
                  <div className="flex gap-3">
                    {/* زر الـ Back للرجوع للسؤال السابق */}
                    {currentSpeedIndex > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentSpeedIndex(prev => prev - 1);
                          setSpeedAnswer('');
                        }}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3 px-4 rounded-xl text-xs transition-all cursor-pointer"
                      >
                        ← Back
                      </button>
                    )}

                    <button
                      type="submit"
                      className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold py-3 rounded-xl text-xs transition-all cursor-pointer"
                    >
                      {currentSpeedIndex + 1 === speedRunQuestions.length ? 'Finish & Submit' : 'Next Question →'}
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsSpeedRunOpen(false)}
                      className="bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white font-bold py-3 px-3 rounded-xl text-xs transition-all cursor-pointer"
                    >
                      Exit
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="text-4xl mb-2">🏆</div>
                <h4 className="text-2xl font-black text-white">Speed Run Completed!</h4>
                <p className="text-xs text-slate-400">
                  You successfully navigated the fast-paced networking track.
                </p>
                <div className="bg-slate-950 border border-cyan-500/40 p-4 rounded-xl max-w-xs mx-auto">
                  <span className="block text-[10px] text-slate-500 uppercase tracking-widest font-mono">Total Earned Bonus</span>
                  <span className="text-2xl font-black text-cyan-400 font-mono">+{speedScore + 50} XP</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSpeedRunOpen(false)}
                  className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold py-3 rounded-xl text-xs transition-all cursor-pointer mt-4"
                >
                  Return to Challenge Arena →
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* نافذة الحل التفاعلي الأساسية */}
      {activeSolverModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0B1120] border-2 border-cyan-500/40 rounded-2xl max-w-2xl w-full p-7 shadow-[0_0_60px_rgba(6,182,212,0.25)] flex flex-col max-h-[90vh]">
            
            <div className="flex justify-between items-start pb-4 mb-4 border-b border-slate-800 shrink-0">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs px-2.5 py-0.5 rounded font-semibold border ${getDifficultyStyle(activeSolverModal.difficulty)}`}>
                    {activeSolverModal.difficulty}
                  </span>
                  <span className="text-xs font-mono text-cyan-400">{activeSolverModal.category}</span>
                  <span className="text-xs font-mono text-emerald-400">+{activeSolverModal.xp} XP</span>
                </div>
                <h3 className="text-xl font-bold text-white">{activeSolverModal.title}</h3>
              </div>
              <button 
                onClick={() => setActiveSolverModal(null)}
                className="text-slate-400 hover:text-white text-lg px-2 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 overflow-y-auto pr-2 flex-1">
              
              <div className="bg-rose-950/25 border border-rose-500/30 rounded-xl p-4">
                <h4 className="text-xs font-mono font-bold uppercase text-rose-400 mb-1">
                  ⚠ Live Fault Telemetry:
                </h4>
                <p className="text-xs text-slate-200 font-mono leading-relaxed">
                  {activeSolverModal.symptoms}
                </p>
              </div>

              {masterChallengesList.find(c => c.id === activeSolverModal.id)?.diagram && (
                <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4 mb-4">
                  <h4 className="text-xs font-mono font-bold uppercase text-slate-500 mb-3 flex items-center gap-2">
                    <span>🔍</span> Network Topology Diagram
                  </h4>
                  {masterChallengesList.find(c => c.id === activeSolverModal.id)?.diagram}
                </div>
              )}

              <div className="bg-slate-900/90 border border-cyan-500/30 rounded-xl p-5">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-mono font-bold uppercase text-cyan-400">
                    🎯 Interactive Resolution Terminal
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowHint(!showHint)}
                    className="text-xs font-mono text-amber-400 hover:underline cursor-pointer"
                  >
                    {showHint ? 'Hide Hint' : '💡 Need a Hint?'}
                  </button>
                </div>

                <p className="text-sm text-white font-medium mb-4">
                  {activeSolverModal.taskQuestion}
                </p>

                {showHint && (
                  <div className="bg-black/90 border border-amber-500/30 rounded-lg p-3.5 mb-4 font-mono text-xs">
                    <div className="flex justify-between items-center text-amber-400 mb-1.5">
                      <span>Reference CLI Hint:</span>
                      <button
                        type="button"
                        onClick={() => setUserAnswer(activeSolverModal.sampleSolution)}
                        className="text-[11px] bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30 cursor-pointer"
                      >
                        Auto-Fill Command ↵
                      </button>
                    </div>
                    <pre className="text-emerald-400 overflow-x-auto">{activeSolverModal.cliHints}</pre>
                  </div>
                )}

                <form onSubmit={handleVerifySolution} className="space-y-3">
                  <div className="flex items-center bg-black border border-slate-700 focus-within:border-cyan-400 rounded-xl px-4 py-3 font-mono text-sm">
                    <span className="text-cyan-400 font-bold mr-3 select-none">Netforge(config)#</span>
                    <input
                      type="text"
                      autoFocus
                      placeholder="Type the exact CLI command..."
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      className="flex-1 bg-transparent text-white focus:outline-none font-mono"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold px-6 py-2.5 rounded-xl text-xs shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all cursor-pointer"
                    >
                      ✓ Verify & Submit Solution
                    </button>
                  </div>
                </form>

                {solverFeedback.type && (
                  <div className={`mt-4 p-3.5 rounded-xl border font-mono text-xs flex items-center justify-between ${
                    solverFeedback.type === 'success'
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                      : 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                  }`}>
                    <span>{solverFeedback.message}</span>
                    {solverFeedback.type === 'success' && (
                      <button
                        onClick={() => setActiveSolverModal(null)}
                        className="bg-emerald-500 text-slate-950 font-sans font-bold px-3 py-1 rounded-lg text-xs cursor-pointer ml-3 shrink-0"
                      >
                        Done →
                      </button>
                    )}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Challenges;