import { useMemo, useState } from "react";
import {
  Activity,
  Bell,
  Bot,
  ChevronDown,
  CircleAlert,
  Cloud,
  Droplets,
  Filter,
  Gauge,
  GitBranch,
  Grid2X2,
  Layers3,
  Lightbulb,
  Map,
  Menu,
  MoreHorizontal,
  Plus,
  Radio,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  TriangleAlert,
  UserRound,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

/**
 * Visual spec: dark mission-control dashboard inspired by the supplied Aquaintel reference.
 * Keep the composition asymmetric, signal colors purposeful, and typography compact.
 */

const navItems = [
  { label: "Command Center", icon: Grid2X2 },
  { label: "Network Map", icon: Map },
  { label: "AI Insights", icon: Sparkles },
  { label: "Leak Alerts", icon: Bell, badge: "23" },
  { label: "Work Orders", icon: Wrench },
  { label: "Field Operations", icon: Radio },
  { label: "Sensors", icon: Activity },
  { label: "Analytics", icon: GitBranch },
  { label: "Reports", icon: SlidersHorizontal },
  { label: "Settings", icon: Settings2 },
];

const alerts = [
  { zone: "Zone 1 - Westlands", detail: "Kangemi Pipeline Section", probability: "92%", loss: "3.2M L/day", level: "HIGH", age: "2 min ago", color: "red" },
  { zone: "Zone 6 - Embakasi", detail: "Pipeline near Pipeline Stage", probability: "88%", loss: "2.9M L/day", level: "HIGH", age: "7 min ago", color: "red" },
  { zone: "Zone 3 - CBD", detail: "Tom Mboya Street Area", probability: "74%", loss: "1.6M L/day", level: "MEDIUM", age: "12 min ago", color: "amber" },
  { zone: "Zone 7 - Kasarani", detail: "Mwiki Pipeline Section", probability: "65%", loss: "1.8M L/day", level: "MEDIUM", age: "18 min ago", color: "amber" },
  { zone: "Zone 4 - Kilimani", detail: "Yaya Centre Area", probability: "58%", loss: "980K L/day", level: "LOW", age: "25 min ago", color: "yellow" },
];

const workOrders = [
  ["WO-2024-0519-001", "Zone 1 - Westlands", "Investigating", "10 min ago", "blue"],
  ["WO-2024-0519-002", "Zone 6 - Embakasi", "En Route", "24 min ago", "amber"],
  ["WO-2024-0519-003", "Zone 3 - CBD", "On Site", "45 min ago", "green"],
  ["WO-2024-0519-004", "Zone 2 - Parklands", "Completed", "1 hr ago", "teal"],
];

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`panel ${className}`}>{children}</section>;
}

function MetricCard({ icon: Icon, label, value, helper, tone, trend }: { icon: any; label: string; value: string; helper: string; tone: string; trend?: string }) {
  return (
    <Panel className="metric-card">
      <div className={`metric-icon ${tone}`}><Icon size={17} strokeWidth={1.8} /></div>
      <div className="metric-copy"><p>{label}</p><strong>{value}</strong><span className={trend?.startsWith("▼") ? "down" : "up"}>{trend || ""}{trend ? " " : ""}{helper}</span></div>
      <MoreHorizontal size={16} className="muted metric-more" />
    </Panel>
  );
}

function NetworkMap() {
  const nodes = useMemo(() => Array.from({ length: 92 }, (_, i) => ({
    cx: 24 + ((i * 67) % 890), cy: 35 + ((i * 47) % 355), r: i % 11 === 0 ? 4 : 2.5,
    fill: i % 10 === 0 ? "#21d4b2" : i % 7 === 0 ? "#2b77e8" : "#35a27f",
  })), []);
  const paths = [
    "M18 372 C145 296 112 132 255 168 S389 298 489 228 S653 128 889 154",
    "M42 76 C171 126 193 302 318 272 S424 84 578 98 S732 292 934 246",
    "M112 342 C202 290 242 184 336 154 S478 154 558 203 S719 316 860 296",
    "M294 36 C300 112 412 132 438 194 S469 342 571 376",
    "M692 32 C637 120 704 188 748 222 S838 288 930 350",
  ];
  return (
    <Panel className="map-panel">
      <div className="map-header"><div><h2>Nairobi Water Network</h2><span className="live-dot" /> <small>Live</small></div><div className="map-actions"><button aria-label="layers"><Layers3 size={16} /></button><button aria-label="filter"><Filter size={16} /></button><button aria-label="settings"><Settings2 size={16} /></button></div></div>
      <div className="map-stage">
        <svg viewBox="0 0 960 420" preserveAspectRatio="none" className="network-svg" aria-label="Stylized Nairobi water network map">
          <defs><pattern id="grid" width="36" height="36" patternUnits="userSpaceOnUse"><path d="M36 0H0V36" fill="none" stroke="#14304c" strokeWidth="0.6" /></pattern><filter id="glow"><feGaussianBlur stdDeviation="4" result="coloredBlur" /><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
          <rect width="960" height="420" fill="url(#grid)" />
          {Array.from({ length: 24 }, (_, i) => <path key={i} d={`M${(i * 43) % 960} 0 C${70 + ((i * 59) % 650)} 100 ${90 + ((i * 83) % 650)} 220 ${120 + ((i * 71) % 700)} 420`} fill="none" stroke="#183a55" strokeWidth="1" opacity=".65" />)}
          {paths.map((path, i) => <path key={i} d={path} fill="none" stroke={i % 2 ? "#1b75dc" : "#1c967d"} strokeWidth="1.4" opacity=".8" />)}
          {nodes.map((node, i) => <circle key={i} {...node} opacity=".9" />)}
          <g className="zone-labels"><text x="58" y="112">ZONE 1</text><text x="60" y="127">Westlands</text><text x="286" y="82">ZONE 2</text><text x="286" y="97">Parklands</text><text x="280" y="224">ZONE 3</text><text x="280" y="239">CBD</text><text x="106" y="284">ZONE 4</text><text x="106" y="299">Kilimani</text><text x="436" y="324">ZONE 5</text><text x="436" y="339">Embakasi</text><text x="690" y="126">ZONE 8</text><text x="690" y="141">Ruiru</text><text x="632" y="300">ZONE 7</text><text x="632" y="315">Kasarani</text></g>
          {[[187,164,"red"],[504,247,"red"],[544,115,"amber"],[228,270,"amber"]].map(([x,y,color], i) => <g key={i} className={`map-alert ${color}`} transform={`translate(${x}, ${y})`}><circle r="11"/><circle r="5"/><path d="M0 -16 V-10"/></g>)}
          <g className="map-tooltip" transform="translate(80 86)"><rect width="174" height="82" rx="6"/><text x="12" y="19" className="tooltip-title">● High Probability Leak</text><text x="12" y="38">Zone 1 · Westlands</text><text x="12" y="54">Probability: <tspan className="red-text">92%</tspan></text><text x="12" y="69">Est. Loss: <tspan className="red-text">3.2M L/day</tspan></text></g>
          <g className="map-tooltip" transform="translate(540 76)"><rect width="170" height="78" rx="6"/><text x="12" y="19" className="tooltip-title amber-text">● Medium Probability Leak</text><text x="12" y="38">Zone 7 · Kasarani</text><text x="12" y="54">Probability: <tspan className="amber-text">65%</tspan></text><text x="12" y="69">Est. Loss: <tspan className="amber-text">1.8M L/day</tspan></text></g>
          <g className="map-tooltip" transform="translate(488 258)"><rect width="174" height="78" rx="6"/><text x="12" y="19" className="tooltip-title">● High Probability Leak</text><text x="12" y="38">Zone 6 · Embakasi</text><text x="12" y="54">Probability: <tspan className="red-text">88%</tspan></text><text x="12" y="69">Est. Loss: <tspan className="red-text">2.9M L/day</tspan></text></g>
        </svg>
        <div className="map-legend"><strong>Legend</strong><span><i className="legend-dot red" />High Probability Leak</span><span><i className="legend-dot amber" />Medium Probability Leak</span><span><i className="legend-dot yellow" />Low Probability Leak</span><span><i className="legend-dot green" />Normal</span><span><i className="legend-square" />Valve</span><span><i className="legend-square blue" />Reservoir</span></div>
        <div className="map-scale"><span>Pressure</span><span>Flow</span><div className="scale-bar" /><small>Low <b>High</b></small></div>
      </div>
    </Panel>
  );
}

function AlertRail() {
  return <Panel className="alert-rail"><div className="rail-title"><div><h2>Active Leak Alerts</h2><span>23 incidents requiring review</span></div><a>View All</a></div><div className="alert-tabs"><button className="active">All <b>23</b></button><button>High <b>8</b></button><button>Medium <b>10</b></button><button>Low <b>5</b></button></div><div className="alert-list">{alerts.map((alert) => <button className={`alert-item ${alert.color}`} key={alert.zone} onClick={() => toast(`${alert.zone} selected`)}><div className="alert-head"><span><CircleAlert size={13} /> {alert.zone}</span><em>{alert.level}</em></div><p>{alert.detail}</p><small>Probability: <b>{alert.probability}</b> <span>•</span> Est. Loss: <b>{alert.loss}</b></small><time>{alert.age} <ChevronDown size={12} /></time></button>)}</div><button className="view-alerts" onClick={() => toast("Opening all alert incidents")}>View All Alerts</button></Panel>;
}

function TrendPanel() {
  return <Panel className="trend-panel"><div className="panel-heading"><div><h2>NRW Trend <span>(30 Days)</span></h2><strong>42.6% <small>▲ 1.8% vs yesterday</small></strong></div><a>View Report</a></div><svg viewBox="0 0 370 150" className="chart-svg"><path d="M0 116H370M0 76H370M0 38H370" stroke="#214157" strokeDasharray="3 4"/><path d="M0 92 C18 78 26 108 42 96 S61 104 72 85 S90 102 102 84 S122 102 137 93 S151 111 165 92 S183 94 197 76 S220 104 235 88 S255 105 270 83 S291 101 304 76 S330 93 343 84 S360 92 370 80" fill="none" stroke="#2c7ef4" strokeWidth="2.5"/><path d="M0 115 C72 114 112 114 182 114 S274 114 370 114" fill="none" stroke="#13c49d" strokeDasharray="6 4"/><text x="327" y="110" fill="#13c49d">Target: 30%</text><text x="0" y="145">Apr 21</text><text x="78" y="145">Apr 28</text><text x="158" y="145">May 5</text><text x="237" y="145">May 12</text><text x="322" y="145">May 19</text></svg></Panel>;
}

function LossPanel() {
  return <Panel className="loss-panel"><div className="panel-heading"><div><h2>Water Loss Breakdown</h2><span>Today · by source</span></div><MoreHorizontal size={17} className="muted" /></div><div className="loss-body"><div className="donut"><div><strong>18.7M L</strong><span>Lost Today</span></div></div><div className="loss-legend"><span><i style={{ background: "#2e8af6" }} />Leakage on Transmission <b>45% (8.4M L)</b></span><span><i style={{ background: "#18c7ae" }} />Leakage on Distribution <b>35% (6.5M L)</b></span><span><i style={{ background: "#f2b43e" }} />Unauthorized Consumption <b>10% (1.9M L)</b></span><span><i style={{ background: "#ef654f" }} />Metering Inaccuracies <b>10% (1.9M L)</b></span></div></div></Panel>;
}

function WorkOrders() {
  return <Panel className="orders-panel"><div className="panel-heading"><div><h2>Recent Work Orders</h2><span>Dispatch queue · 4 active</span></div><a>View All</a></div><div className="orders-list">{workOrders.map(([id, zone, status, time, tone]) => <button className="order-row" key={id} onClick={() => toast(`${id} opened`)}><div><strong>{id}</strong><span>{zone}</span></div><em className={tone}>{status}</em><time>{time}</time></button>)}</div></Panel>;
}

function AIWorker() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(["Hello! I'm your AI Water Coworker. How can I help you today?"]);
  const send = () => { if (!input.trim()) return; setMessages((items) => [...items, input.trim(), "I found 3 priority zones. Westlands is currently the highest-confidence intervention."]); setInput(""); };
  return <Panel className="ai-panel"><div className="panel-heading"><div className="ai-title"><div className="ai-orb"><Bot size={16} /></div><div><h2>AI Coworker</h2><span>Operational copilot · ready</span></div></div><MoreHorizontal size={17} className="muted" /></div><div className="chat-body">{messages.map((message, i) => <div key={i} className={i % 2 ? "chat-bubble user" : "chat-bubble"}>{message}</div>)}{messages.length === 1 && <div className="suggestions"><button onClick={() => setInput("Show me the biggest water losses today")}>Show me the biggest water losses today</button><button onClick={() => setInput("Which zones need immediate attention?")}>Which zones need immediate attention?</button><button onClick={() => setInput("What caused the leak in Zone 1 last week?")}>What caused the leak in Zone 1 last week?</button></div>}</div><div className="chat-input"><input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Ask anything..." /><button aria-label="Send message" onClick={send}><Send size={15} /></button></div></Panel>;
}

export default function Home() {
  const [activeNav, setActiveNav] = useState("Command Center");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return <div className="dashboard-shell">
    <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}><div className="brand"><div className="brand-mark"><Droplets size={22} /></div><div><strong>AQUAINTEL</strong><span>Every Drop Counts</span></div><button className="close-mobile" onClick={() => setSidebarOpen(false)}><X size={17} /></button></div><nav>{navItems.map(({ label, icon: Icon, badge }) => <button key={label} className={activeNav === label ? "active" : ""} onClick={() => { setActiveNav(label); setSidebarOpen(false); if (label !== "Command Center") toast(`${label} view selected`); }}><Icon size={17} /><span>{label}</span>{badge && <b>{badge}</b>}</button>)}</nav><div className="system-status"><h3>System Status</h3><p><i className="status-green" />Sensors Online <b>1,248 / 1,387</b></p><p><i className="status-teal" />Network Zones <b>78 / 78</b></p><p><i className="status-red" />Active Alerts <b>23</b></p><p><i className="status-blue" />Work Orders <b>12</b></p><p><i className="status-green" />Data Quality <b className="green-text">98%</b></p></div><footer>AQUAINTEL v1.0.0<br/><span>© 2024 All rights reserved</span></footer></aside>
    <main className="main-stage"><header className="topbar"><button className="mobile-menu" onClick={() => setSidebarOpen(true)}><Menu size={19} /></button><div className="title-block"><h1>Nairobi Water Intelligence Center</h1><p>AI-Powered Leak Detection &amp; Non-Revenue Water Management</p></div><div className="top-actions"><div className="live-status"><i className="status-green" /><div><strong>Live</strong><span>Real-time Monitoring</span></div></div><div className="weather"><Cloud size={18} /><div><strong>22°C</strong><span>Nairobi, Kenya</span></div></div><button className="icon-button"><Bell size={18} /><b>8</b></button><button className="operator"><span className="avatar">JM</span><div><strong>Operator</strong><span>Water Operations</span></div><ChevronDown size={15} /></button></div></header><div className="content"><div className="action-row"><div className="breadcrumbs"><span>Command Center</span><span>/</span><strong>Live Overview</strong></div><div><button className="ghost-btn" onClick={() => toast("AI Coworker opened")}> <Sparkles size={15} /> AI Coworker</button><button className="primary-btn" onClick={() => toast("New work order created")}> <Plus size={15} /> New Work Order</button></div></div><div className="metrics"><MetricCard icon={Droplets} label="NRW Today" value="42.6%" helper="vs yesterday" tone="teal" trend="▲ 1.8%" /><MetricCard icon={TriangleAlert} label="Water Lost Today" value="18.7M L" helper="vs 2.3M" tone="red" trend="▼ 12%" /><MetricCard icon={Bell} label="Active Leak Alerts" value="23" helper="vs yesterday" tone="red" trend="▲ 5" /><MetricCard icon={ShieldCheck} label="Resolved This Week" value="17" helper="vs last week" tone="green" trend="▲ 7" /><MetricCard icon={Droplets} label="Water Recovered" value="56.3M L" helper="This month" tone="blue" /></div><div className="dashboard-grid"><NetworkMap /><AlertRail /><TrendPanel /><LossPanel /><WorkOrders /><AIWorker /></div></div></main>
  </div>;
}
