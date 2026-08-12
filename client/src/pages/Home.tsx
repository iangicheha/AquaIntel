import { useMemo, useState } from "react";
import {
  Activity,
  Bell,
  ChevronDown,
  CircleAlert,
  Cloud,
  Droplets,
  Filter,
  Gauge,
  GitBranch,
  Grid2X2,
  Layers3,
  Map,
  Menu,
  MoreHorizontal,
  Plus,
  Radio,
  Search,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  TriangleAlert,
  Wrench,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { toast } from "sonner";

/**
 * Visual spec: dark mission-control dashboard inspired by the supplied Aquaintel reference.
 * This page intentionally uses simulated/demo telemetry and a topology-first hydraulic network diagram.
 */

const navItems = [
  { label: "Command Center", icon: Grid2X2 }, { label: "Network Map", icon: Map },
  { label: "AI Insights", icon: Sparkles }, { label: "Leak Alerts", icon: Bell, badge: "23" },
  { label: "Work Orders", icon: Wrench }, { label: "Field Operations", icon: Radio },
  { label: "Sensors", icon: Activity }, { label: "Analytics", icon: GitBranch },
  { label: "Reports", icon: SlidersHorizontal }, { label: "Settings", icon: Settings2 },
];

const alerts = [
  { zone: "Zone 1 - Westlands", detail: "Kangemi Pipeline Section", probability: "92%", loss: "3.2M L/day", level: "HIGH", age: "2 min ago", color: "red", pipe: "TM-01" },
  { zone: "Zone 6 - Embakasi", detail: "Pipeline Section 6B-143", probability: "88%", loss: "2.9M L/day", level: "HIGH", age: "7 min ago", color: "red", pipe: "DP-6B-143" },
  { zone: "Zone 3 - CBD", detail: "Tom Mboya Street Area", probability: "74%", loss: "1.6M L/day", level: "MEDIUM", age: "12 min ago", color: "amber", pipe: "DP-03-018" },
  { zone: "Zone 7 - Kasarani", detail: "Mwiki Pipeline Section", probability: "65%", loss: "1.8M L/day", level: "MEDIUM", age: "18 min ago", color: "amber", pipe: "DP-07-091" },
  { zone: "Zone 4 - Kilimani", detail: "Yaya Centre Area", probability: "58%", loss: "980K L/day", level: "LOW", age: "25 min ago", color: "yellow", pipe: "DP-04-022" },
];

const workOrders = [
  ["WO-2024-0519-001", "Zone 1 - Westlands", "Investigating", "10 min ago", "blue"],
  ["WO-2024-0519-002", "Zone 6 - Embakasi", "En Route", "24 min ago", "amber"],
  ["WO-2024-0519-003", "Zone 3 - CBD", "On Site", "45 min ago", "green"],
  ["WO-2024-0519-004", "Zone 2 - Parklands", "Completed", "1 hr ago", "teal"],
];

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) { return <section className={`panel ${className}`}>{children}</section>; }
function MetricCard({ icon: Icon, label, value, helper, tone, trend }: { icon: any; label: string; value: string; helper: string; tone: string; trend?: string }) {
  return <Panel className="metric-card"><div className={`metric-icon ${tone}`}><Icon size={17} strokeWidth={1.8} /></div><div className="metric-copy"><p>{label}</p><strong>{value}</strong><span className={trend?.startsWith("▼") ? "down" : "up"}>{trend || ""}{trend ? " " : ""}{helper}</span></div><MoreHorizontal size={16} className="muted metric-more" /></Panel>;
}

type MapMode = "pressure" | "flow";
function NetworkMap() {
  const [mode, setMode] = useState<MapMode>("pressure");
  const [selected, setSelected] = useState("DP-6B-143");
  const [zoom, setZoom] = useState(1); const [showEvidence, setShowEvidence] = useState(false); const [showIntel, setShowIntel] = useState(true);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const selectedAlert = alerts.find((a) => a.pipe === selected) || alerts[1];
  const nodes = useMemo(() => [
    [92, 92, "sensor"], [154, 92, "sensor"], [218, 92, "valve"], [284, 92, "sensor"], [354, 92, "sensor"], [430, 92, "reservoir"], [510, 92, "sensor"], [590, 92, "valve"], [678, 92, "sensor"], [770, 92, "sensor"],
    [154, 166, "sensor"], [218, 166, "sensor"], [284, 166, "valve"], [354, 166, "sensor"], [430, 166, "sensor"], [510, 166, "sensor"], [590, 166, "sensor"], [678, 166, "valve"], [770, 166, "sensor"],
    [92, 246, "sensor"], [154, 246, "valve"], [218, 246, "sensor"], [284, 246, "sensor"], [354, 246, "sensor"], [430, 246, "valve"], [510, 246, "sensor"], [590, 246, "sensor"], [678, 246, "sensor"], [770, 246, "valve"],
    [154, 326, "sensor"], [284, 326, "sensor"], [430, 326, "sensor"], [590, 326, "sensor"], [770, 326, "sensor"],
  ] as [number, number, string][], []);
  const pipes = [
    { id: "TM-01", d: "M42 92 H430 H820", type: "transmission" },
    { id: "TM-02", d: "M430 92 V326", type: "transmission" },
    { id: "DP-01", d: "M92 92 V246 H284 V326", type: "distribution" },
    { id: "DP-02", d: "M154 92 V166 H354 V246 H510", type: "distribution" },
    { id: "DP-03-018", d: "M218 166 H284 V92", type: "feeder" },
    { id: "DP-6B-143", d: "M510 92 V166 H590 V246 H678", type: "distribution", leak: true },
    { id: "DP-07-091", d: "M590 166 H770 V326", type: "feeder" },
    { id: "DP-04-022", d: "M92 246 H154 V326 H430", type: "feeder" },
    { id: "DP-08", d: "M678 92 V166 H820", type: "distribution" },
  ];
  const pipeClass = (pipe: typeof pipes[number]) => `${pipe.type} ${pipe.leak ? "leak-pipe" : ""} ${pipe.id === selected ? "selected-pipe" : ""} ${mode}`;
  return <Panel className="map-panel">
    <div className="map-header"><div><h2>Nairobi County Water Network <span className="demo-chip">SIMULATED DEMO DATA</span></h2><span className="live-dot" /> <small>Topology view · {mode === "pressure" ? "Pressure" : "Flow"}</small></div><div className="map-actions"><button aria-label="zoom in" onClick={() => setZoom((v) => Math.min(1.5, v + .1))}><ZoomIn size={15} /></button><button aria-label="zoom out" onClick={() => setZoom((v) => Math.max(.8, v - .1))}><ZoomOut size={15} /></button><button aria-label="layers"><Layers3 size={16} /></button><button aria-label="filter"><Filter size={16} /></button></div></div>
    <div className="map-stage"><img className="reference-map-image" src="/manus-storage/nairobi-county-water-network-reference_6752eab7.png" alt="Nairobi County water network reference map" />
      <div className="reference-map-shade" aria-hidden="true" />
      <svg viewBox="0 0 860 380" className="network-svg" aria-label="Interactive Nairobi County hydraulic distribution network overlay" onPointerDown={(e) => { const startX = e.clientX; const startY = e.clientY; const sx = offset.x; const sy = offset.y; const move = (ev: PointerEvent) => setOffset({ x: sx + ev.clientX - startX, y: sy + ev.clientY - startY }); const up = () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); }; window.addEventListener("pointermove", move); window.addEventListener("pointerup", up); }}>
        <defs><pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="#183a55" strokeWidth=".65" /></pattern></defs>
        <rect width="860" height="380" fill="url(#grid)" />
        <g className="county-context"><path className="county-boundary" d="M72 70 L166 38 L274 48 L366 30 L488 50 L604 35 L742 68 L812 132 L786 214 L816 286 L754 344 L638 356 L534 340 L428 366 L308 344 L204 360 L104 316 L48 238 L66 156 Z" /><path className="county-subdivision" d="M166 38 L204 154 L104 316 M274 48 L320 170 L308 344 M366 30 L430 150 L428 366 M488 50 L520 176 L534 340 M604 35 L626 164 L638 356 M742 68 L700 176 L754 344 M66 156 L320 170 L626 164 L786 214 M48 238 L308 244 L638 248 L816 286" /><text x="344" y="202" className="county-label">NAIROBI COUNTY · DISTRIBUTION EXTENT</text></g>
        <g transform={`translate(${offset.x} ${offset.y}) scale(${zoom})`} className="topology-layer">
          <g className="network-pipes">{pipes.map((pipe) => <path key={pipe.id} d={pipe.d} className={pipeClass(pipe)} onClick={() => setSelected(pipe.id)} />)}</g>
          <g className="network-nodes">{nodes.map(([x, y, kind], i) => kind === "valve" ? <rect key={i} x={x - 4} y={y - 4} width="8" height="8" className="valve-node" onClick={() => toast(`Valve ${i + 1} selected`)} /> : kind === "reservoir" ? <g key={i} onClick={() => toast("Kabete Reservoir selected")}><rect x={x - 10} y={y - 7} width="20" height="14" rx="2" className="reservoir-node" /><path d={`M${x - 7} ${y - 2}h14`} className="reservoir-water" /></g> : <circle key={i} cx={x} cy={y} r="3" className={i % 7 === 0 ? "sensor-node warning" : "sensor-node"} onClick={() => toast(`Pressure sensor PS-${i + 1} selected`)} />)}</g>
          <g className="zone-labels"><text x="54" y="136">ZONE 1 · WESTLANDS</text><text x="240" y="52">ZONE 2 · PARKLANDS</text><text x="238" y="216">ZONE 3 · CBD</text><text x="55" y="300">ZONE 4 · KILIMANI</text><text x="398" y="360">ZONE 6 · EMBAKASI</text><text x="672" y="214">ZONE 7 · KASARANI</text><text x="710" y="52">ZONE 8 · RUIRU</text></g>
          <g className="map-alert red" transform="translate(590 246)" onClick={() => setSelected("DP-6B-143")}><circle r="12" /><circle r="5" /><path d="M0 -17 V-11" /></g>
          <g className="map-alert amber" transform="translate(284 92)" onClick={() => setSelected("DP-03-018")}><circle r="10" /><circle r="4" /><path d="M0 -14 V-9" /></g>
          <g className="map-selected-label" transform="translate(604 260)"><rect width="150" height="58" rx="4" /><text x="10" y="16">SELECTED PIPE</text><text x="10" y="31" className="selected-value">{selectedAlert.pipe}</text><text x="10" y="46">Leak probability {selectedAlert.probability}</text></g>
        </g>
      </svg>
      <div className="map-legend"><strong>Hydraulic legend</strong><span><i className="legend-line transmission" />Transmission main</span><span><i className="legend-line distribution" />Distribution pipe</span><span><i className="legend-line feeder" />Local distributor / feeder</span><span><i className="legend-dot green" />Healthy sensor</span><span><i className="legend-square" />Valve</span><span><i className="legend-reservoir" />Reservoir / tank</span><span><i className="legend-dot red" />Leak segment</span></div>
      <div className="map-scale"><div className="metric-toggle"><button className={mode === "pressure" ? "active" : ""} onClick={() => setMode("pressure")}>Pressure</button><button className={mode === "flow" ? "active" : ""} onClick={() => setMode("flow")}>Flow</button></div><div className={`scale-bar ${mode}`} /><small>Low <b>High</b></small></div>
      <div className="map-help">Drag to pan · scroll controls via buttons · click pipe or sensor</div>
    </div>
    {showIntel && <div className="leak-intel-card"><div className="intel-card-heading"><div><span className="eyebrow">AI PRIORITY EVENT · {selectedAlert.pipe}</span><h3>{selectedAlert.zone.toUpperCase()}</h3></div><div className="intel-heading-actions"><em>HIGH</em><button className="intel-close" aria-label="Dismiss AI priority event" onClick={() => setShowIntel(false)}><X size={13} /></button></div></div><div className="intel-grid"><span>Leak Probability <b>{selectedAlert.probability}</b></span><span>Estimated Loss <b>{selectedAlert.loss}</b></span><span>Pipe <b>200 mm DI</b></span><span>Pressure Anomaly <b>-18%</b></span><span>Flow Anomaly <b>+16%</b></span><span>Detected <b>14 min ago</b></span></div><p><strong>Why AQUAINTEL flagged this location</strong> Flow increased by 17% while downstream consumption remained stable. Pressure dropped across two adjacent sensors; the combined pattern is consistent with a probable pipe leak.</p><div className="intel-actions"><button onClick={() => setShowEvidence((v) => !v)}><Search size={13} /> {showEvidence ? "Hide Evidence" : "View Evidence"}</button><button className="primary-btn" onClick={() => toast(`Work order created for ${selectedAlert.pipe}`)}><Plus size={13} /> Create Work Order</button></div>{showEvidence && <div className="evidence-strip"><span><b>PS-26</b> Pressure 31.4 m</span><span><b>FM-26</b> Flow +16%</span><span><b>7-day baseline</b> Stable consumption</span><span><b>Confidence</b> 91%</span></div>}</div>}
  </Panel>;
}

function AlertRail() { return <Panel className="alert-rail"><div className="rail-title"><div><h2>Active Leak Alerts</h2><span>23 simulated incidents requiring review</span></div><a>View All</a></div><div className="alert-tabs"><button className="active">All <b>23</b></button><button>High <b>8</b></button><button>Medium <b>10</b></button><button>Low <b>5</b></button></div><div className="alert-list">{alerts.map((alert) => <button className={`alert-item ${alert.color}`} key={alert.zone} onClick={() => toast(`${alert.pipe} selected on map`)}><div className="alert-head"><span><CircleAlert size={13} /> {alert.zone}</span><em>{alert.level}</em></div><p>{alert.detail}</p><small>Probability: <b>{alert.probability}</b> <span>•</span> Est. Loss: <b>{alert.loss}</b></small><time>{alert.age} <ChevronDown size={12} /></time></button>)}</div><button className="view-alerts" onClick={() => toast("Opening all simulated alert incidents")}>View All Alerts</button></Panel>; }
function TrendPanel() { return <Panel className="trend-panel"><div className="panel-heading"><div><h2>NRW Trend <span>(30 Days)</span></h2><strong>42.6% <small>▲ 1.8% vs yesterday</small></strong></div><a>View Report</a></div><svg viewBox="0 0 370 150" className="chart-svg"><path d="M0 116H370M0 76H370M0 38H370" stroke="#214157" strokeDasharray="3 4"/><path d="M0 92 C18 78 26 108 42 96 S61 104 72 85 S90 102 102 84 S122 102 137 93 S151 111 165 92 S183 94 197 76 S220 104 235 88 S255 105 270 83 S291 101 304 76 S330 93 343 84 S360 92 370 80" fill="none" stroke="#2c7ef4" strokeWidth="2.5"/><path d="M0 115 C72 114 112 114 182 114 S274 114 370 114" fill="none" stroke="#13c49d" strokeDasharray="6 4"/><text x="327" y="110" fill="#13c49d">Target: 30%</text><text x="0" y="145">Apr 21</text><text x="78" y="145">Apr 28</text><text x="158" y="145">May 5</text><text x="237" y="145">May 12</text><text x="322" y="145">May 19</text></svg></Panel>; }
function LossPanel() { return <Panel className="loss-panel"><div className="panel-heading"><div><h2>Water Loss Breakdown</h2><span>Simulated telemetry · by source</span></div><MoreHorizontal size={17} className="muted" /></div><div className="loss-body"><div className="donut"><div><strong>18.7M L</strong><span>Lost Today</span></div></div><div className="loss-legend"><span><i style={{ background: "#2e8af6" }} />Leakage on Transmission <b>45% (8.4M L)</b></span><span><i style={{ background: "#18c7ae" }} />Leakage on Distribution <b>35% (6.5M L)</b></span><span><i style={{ background: "#f2b43e" }} />Unauthorized Consumption <b>10% (1.9M L)</b></span><span><i style={{ background: "#ef654f" }} />Metering Inaccuracies <b>10% (1.9M L)</b></span></div></div></Panel>; }
function WorkOrders() { return <Panel className="orders-panel"><div className="panel-heading"><div><h2>Recent Work Orders</h2><span>Dispatch queue · 4 active</span></div><a>View All</a></div><div className="orders-list">{workOrders.map(([id, zone, status, time, tone]) => <button className="order-row" key={id} onClick={() => toast(`${id} opened`)}><div><strong>{id}</strong><span>{zone}</span></div><em className={tone}>{status}</em><time>{time}</time></button>)}</div></Panel>; }
function AICoworker() { return <Panel className="ai-panel"><div className="panel-heading"><div><h2><Sparkles size={14} /> AI Coworker</h2><span>Operational reasoning layer · demo</span></div><span className="ai-status">ANALYSIS READY</span></div><div className="ai-thread"><div className="ai-message operator-message">Show me the biggest water losses today.</div><div className="ai-message"><strong>Priority finding</strong> Zone 6 — Embakasi is currently the highest-priority event. Estimated loss is 2.9M L/day with an 88% leak probability. I recommend dispatching a field crew to Pipeline Section 6B-143.</div></div><button className="primary-btn ai-work-order" onClick={() => toast("Work order created for Pipeline Section 6B-143")}><Plus size={13} /> Create Work Order</button></Panel>; }

export default function Home() {
  const [activeNav, setActiveNav] = useState("Command Center"); const [sidebarOpen, setSidebarOpen] = useState(false);
  return <div className="dashboard-shell"><aside className={`sidebar ${sidebarOpen ? "open" : ""}`}><div className="brand"><div className="brand-mark" aria-label="Aquaintel water droplet logo"><svg viewBox="0 0 42 40" role="img" aria-hidden="true"><path className="droplet-large" d="M14 2C11.4 6.8 4 13.9 4 21.6 4 29.3 8.4 35 14 35s10-5.7 10-13.4C24 13.9 16.6 6.8 14 2Z" /><path className="droplet-small" d="M31 14c-1.6 3-5.5 6.6-5.5 11.2 0 4.2 2.4 6.8 5.5 6.8s5.5-2.6 5.5-6.8C36.5 20.6 32.6 17 31 14Z" /><path className="droplet-highlight" d="M10.5 14.5c-1.7 2.3-2.8 4.5-2.8 6.8 0 1.4.3 2.6.8 3.6M29.5 22c-.7 1.2-1.1 2.3-1.1 3.4" /></svg></div><div><strong>AQUAINTEL</strong><span>Every Drop Counts</span></div><button className="close-mobile" onClick={() => setSidebarOpen(false)}><X size={17} /></button></div><nav>{navItems.map(({ label, icon: Icon, badge }) => <button key={label} className={activeNav === label ? "active" : ""} onClick={() => { setActiveNav(label); setSidebarOpen(false); if (label !== "Command Center") toast(`${label} view selected`); }}><Icon size={17} /><span>{label}</span>{badge && <b>{badge}</b>}</button>)}</nav><div className="system-status"><h3>System Status · Demo</h3><p><i className="status-green" />Sensors Online <b>1,248 / 1,387</b></p><p><i className="status-teal" />Network Zones <b>78 / 78</b></p><p><i className="status-red" />Active Alerts <b>23</b></p><p><i className="status-blue" />Work Orders <b>12</b></p><p><i className="status-green" />Data Quality <b className="green-text">98%</b></p></div><footer>AQUAINTEL v1.0.0<br /><span>© 2024 · Prototype telemetry</span></footer></aside><main className="main-stage"><header className="topbar"><button className="mobile-menu" onClick={() => setSidebarOpen(true)}><Menu size={19} /></button><div className="title-block"><h1>Nairobi Water Intelligence Center</h1><p>AI-Powered Leak Detection &amp; Non-Revenue Water Management</p></div><div className="top-actions"><div className="live-status"><i className="status-green" /><div><strong>Simulation</strong><span>Demo telemetry only</span></div></div><div className="weather"><Cloud size={18} /><div><strong>22°C</strong><span>Nairobi, Kenya</span></div></div><button className="icon-button"><Bell size={18} /><b>8</b></button><button className="operator"><span className="avatar">JM</span><div><strong>Operator</strong><span>Water Operations</span></div><ChevronDown size={15} /></button></div></header><div className="content"><div className="action-row"><div className="breadcrumbs"><span>Command Center</span><span>/</span><strong>Live Overview</strong></div><div className="demo-banner"><span>SIMULATED DATASET</span> Replaceable with SCADA · GIS · meter feeds <button className="primary-btn" onClick={() => toast("New work order created")}><Plus size={15} /> New Work Order</button></div></div><div className="metrics"><MetricCard icon={Droplets} label="NRW Today" value="42.6%" helper="vs yesterday" tone="teal" trend="▲ 1.8%" /><MetricCard icon={TriangleAlert} label="Water Lost Today" value="18.7M L" helper="vs 2.3M" tone="red" trend="▼ 12%" /><MetricCard icon={Bell} label="Active Leak Alerts" value="23" helper="vs yesterday" tone="red" trend="▲ 5" /><MetricCard icon={ShieldCheck} label="Resolved This Week" value="17" helper="vs last week" tone="green" trend="▲ 7" /><MetricCard icon={Droplets} label="Water Recovered" value="56.3M L" helper="This month" tone="blue" /></div><div className="dashboard-grid"><NetworkMap /><AlertRail /><TrendPanel /><LossPanel /><WorkOrders /><AICoworker /></div></div></main></div>;
}
