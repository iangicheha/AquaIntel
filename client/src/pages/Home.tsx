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
import { nairobiCountyBoundaryPath, nairobiCountyBoundarySource } from "@/lib/nairobiBoundary";

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
  { zone: "Westlands", detail: "Kangemi area anomaly", probability: "92%", loss: "3.2M L/day", level: "HIGH", age: "2 min ago", color: "red" },
  { zone: "Embakasi", detail: "East Nairobi pressure anomaly", probability: "88%", loss: "2.9M L/day", level: "HIGH", age: "7 min ago", color: "red" },
  { zone: "CBD", detail: "Central Nairobi consumption anomaly", probability: "74%", loss: "1.6M L/day", level: "MEDIUM", age: "12 min ago", color: "amber" },
  { zone: "Kasarani", detail: "Mwiki area anomaly", probability: "65%", loss: "1.8M L/day", level: "MEDIUM", age: "18 min ago", color: "amber" },
  { zone: "Kilimani", detail: "Yaya Centre area anomaly", probability: "58%", loss: "980K L/day", level: "LOW", age: "25 min ago", color: "yellow" },
];

const workOrders = [
  ["WO-2024-0519-001", "Zone 1 - Westlands", "Investigating", "10 min ago", "blue"],
  ["WO-2024-0519-002", "Zone 6 - Embakasi", "En Route", "24 min ago", "amber"],
  ["WO-2024-0519-003", "Zone 3 - CBD", "On Site", "45 min ago", "green"],
  ["WO-2024-0519-004", "Zone 2 - Parklands", "Completed", "1 hr ago", "teal"],
];

const demoNetworkMeta = {
  source: "Simulated GeoJSON-ready demo network",
  boundary: "Nairobi County extent · illustrative until verified GIS is connected",
  lastUpdated: "12 Aug 2026 · demo telemetry",
};

const dmaMetrics: Record<string, { inflow: string; consumption: string; nightFlow: string; nrw: string; pressure: string; alerts: string; balance: string; risk: string }> = {
  Embakasi: { inflow: "42.8 ML/day", consumption: "31.2 ML/day", nightFlow: "9.8 ML/day", nrw: "27.1%", pressure: "31.4 m", alerts: "8 active", balance: "-11.6 ML/day", risk: "HIGH" },
  CBD: { inflow: "28.4 ML/day", consumption: "23.7 ML/day", nightFlow: "4.2 ML/day", nrw: "16.5%", pressure: "36.2 m", alerts: "3 active", balance: "-4.7 ML/day", risk: "MEDIUM" },
  Westlands: { inflow: "34.1 ML/day", consumption: "29.9 ML/day", nightFlow: "3.1 ML/day", nrw: "12.3%", pressure: "41.8 m", alerts: "2 active", balance: "-4.2 ML/day", risk: "LOW" },
};

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) { return <section className={`panel ${className}`}>{children}</section>; }
function MetricCard({ icon: Icon, label, value, helper, tone, trend }: { icon: any; label: string; value: string; helper: string; tone: string; trend?: string }) {
  return <Panel className="metric-card"><div className={`metric-icon ${tone}`}><Icon size={17} strokeWidth={1.8} /></div><div className="metric-copy"><p>{label}</p><strong>{value}</strong><span className={trend?.startsWith("▼") ? "down" : "up"}>{trend || ""}{trend ? " " : ""}{helper}</span></div><MoreHorizontal size={16} className="muted metric-more" /></Panel>;
}

type MapMode = "pressure" | "flow";
function NetworkMap() {
  const [mode, setMode] = useState<MapMode>("pressure");
  const [selected, setSelected] = useState("Embakasi");
  const [zoom, setZoom] = useState(1); const [showEvidence, setShowEvidence] = useState(false); const [showIntel, setShowIntel] = useState(true); const [showLayers, setShowLayers] = useState(false); const [showPipeDetails, setShowPipeDetails] = useState(true); const [selectedDMA, setSelectedDMA] = useState("Embakasi"); const [layers, setLayers] = useState({ pipes: true, valves: true, reservoirs: true, sensors: true, alerts: true, dmas: true, ai: true });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const selectedAlert = alerts.find((a) => a.zone === selected) || alerts[1];
  const selectedDmaMetrics = dmaMetrics[selectedDMA];
  const nodes = useMemo(() => [
    [92, 92, "sensor"], [154, 92, "sensor"], [218, 92, "valve"], [284, 92, "sensor"], [354, 92, "sensor"], [430, 92, "reservoir"], [510, 92, "sensor"], [590, 92, "valve"], [678, 92, "sensor"], [770, 92, "sensor"],
    [154, 166, "sensor"], [218, 166, "sensor"], [284, 166, "valve"], [354, 166, "sensor"], [430, 166, "sensor"], [510, 166, "sensor"], [590, 166, "sensor"], [678, 166, "valve"], [770, 166, "sensor"],
    [92, 246, "sensor"], [154, 246, "valve"], [218, 246, "sensor"], [284, 246, "sensor"], [354, 246, "sensor"], [430, 246, "valve"], [510, 246, "sensor"], [590, 246, "sensor"], [678, 246, "sensor"], [770, 246, "valve"],
    [154, 326, "sensor"], [284, 326, "sensor"], [430, 326, "sensor"], [590, 326, "sensor"], [770, 326, "sensor"],
  ] as [number, number, string][], []);
  const toggleLayer = (key: keyof typeof layers) => setLayers((current) => ({ ...current, [key]: !current[key] }));
  return <Panel className="map-panel">
    <div className="map-header"><div><h2>Nairobi County <span className="demo-chip">VERIFIED COUNTY BOUNDARY</span></h2><span className="live-dot" /> <small>County geography · {mode === "pressure" ? "Pressure alerts" : "Flow alerts"}</small></div><div className="map-actions"><button aria-label="zoom in" onClick={() => setZoom((v) => Math.min(1.5, v + .1))}><ZoomIn size={15} /></button><button aria-label="zoom out" onClick={() => setZoom((v) => Math.max(.8, v - .1))}><ZoomOut size={15} /></button><button aria-label="layers" className={showLayers ? "active" : ""} onClick={() => setShowLayers((v) => !v)}><Layers3 size={16} /></button><button aria-label="filter"><Filter size={16} /></button></div></div>
    {showLayers && <div className="layer-control-panel"><div className="layer-control-head"><div><strong>Map layers</strong><small>Toggle simulated digital-twin overlays</small></div><X size={14} onClick={() => setShowLayers(false)} /></div><div className="layer-group"><span>County context</span><button className={layers.dmas ? "on" : ""} onClick={() => toggleLayer("dmas")}>Nairobi County</button><button className={layers.reservoirs ? "on" : ""} onClick={() => toggleLayer("reservoirs")}>Water facilities</button></div><div className="layer-group"><span>Monitoring</span><button className={layers.sensors ? "on" : ""} onClick={() => toggleLayer("sensors")}>Pressure sensors</button><button className={layers.alerts ? "on" : ""} onClick={() => toggleLayer("alerts")}>Leak alerts</button></div><div className="layer-group"><span>AI overlays</span><button className={layers.ai ? "on" : ""} onClick={() => toggleLayer("ai")}>Leak probability</button><button className={layers.dmas ? "on" : ""} onClick={() => toggleLayer("dmas")}>DMAs</button></div></div>}<div className="map-stage"><svg viewBox="0 0 860 380" className="network-svg" aria-label="Nairobi County verified boundary and high-level water alerts" onPointerDown={(e) => { const startX = e.clientX; const startY = e.clientY; const sx = offset.x; const sy = offset.y; const move = (ev: PointerEvent) => setOffset({ x: sx + ev.clientX - startX, y: sy + ev.clientY - startY }); const up = () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); }; window.addEventListener("pointermove", move); window.addEventListener("pointerup", up); }}>
        <defs><pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="#183a55" strokeWidth=".65" /></pattern><marker id="flowArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#8ee9ff" /></marker></defs>
        <rect width="860" height="380" fill="url(#grid)" />
        <g className="county-context"><path className="county-boundary" d={nairobiCountyBoundaryPath}><title>{nairobiCountyBoundarySource}</title></path><text x="344" y="202" className="county-label">NAIROBI COUNTY</text></g>
        <g transform={`translate(${offset.x} ${offset.y}) scale(${zoom})`} className="topology-layer">
          
          {false && <g className="network-nodes">{nodes.map(([x, y, kind], i) => kind === "valve" && layers.valves ? <rect key={i} x={x - 4} y={y - 4} width="8" height="8" className="valve-node" onClick={() => toast(`Valve ${i + 1} selected`)} /> : kind === "reservoir" && layers.reservoirs ? <g key={i} onClick={() => toast("Demo reservoir selected")}><rect x={x - 10} y={y - 7} width="20" height="14" rx="2" className="reservoir-node" /><path d={`M${x - 7} ${y - 2}h14`} className="reservoir-water" /></g> : kind === "sensor" && layers.sensors ? <circle key={i} cx={x} cy={y} r="3" className={i % 7 === 0 ? "sensor-node warning" : "sensor-node"} onClick={() => toast(`Pressure sensor PS-${i + 1} selected`)} /> : null)}</g>}

          {layers.alerts && <g className="map-alert red live-alert-marker" transform="translate(590 246)" onClick={() => setSelected("Embakasi")}><circle r="12" /><circle r="5" /><path d="M0 -17 V-11" /><title>Embakasi · high-priority county alert · 88% probability</title></g>}<g className="map-alert amber" transform="translate(284 92)" onClick={() => setSelected("CBD")}><circle r="10" /><circle r="4" /><path d="M0 -14 V-9" /></g>
          <g className="map-selected-label" transform="translate(604 260)"><rect width="150" height="58" rx="4" /><text x="10" y="16">SELECTED COUNTY ALERT</text><text x="10" y="31" className="selected-value">{selectedAlert.zone}</text><text x="10" y="46">Probability {selectedAlert.probability}</text></g>
        </g>
      </svg>
      <div className="map-legend"><strong>County view legend</strong><span><i className="legend-boundary" />Nairobi County boundary</span><span><i className="legend-dot red" />Priority alert</span><span><i className="legend-dot amber" />Watch alert</span></div>
      <div className="map-scale"><div className="metric-toggle"><button className={mode === "pressure" ? "active" : ""} onClick={() => setMode("pressure")}>Pressure</button><button className={mode === "flow" ? "active" : ""} onClick={() => setMode("flow")}>Flow</button></div><div className={`scale-bar ${mode}`} /><small>Low <b>High</b></small></div>
      <div className="map-help">Drag to pan · use the controls to inspect Nairobi County alerts</div><div className="demo-network-stamp"><span className="live-dot" /> NAIROBI COUNTY VIEW · Simulated alert data</div>
    </div><div className="map-bottom-dock"><div className="dma-inspector county-inspector"><div className="dock-heading"><div><span className="eyebrow">NAIROBI COUNTY ZONE · SIMULATED</span><h3>{selectedDMA} <em className={`risk-${selectedDmaMetrics.risk.toLowerCase()}`}>{selectedDmaMetrics.risk}</em></h3></div><select value={selectedDMA} onChange={(event) => setSelectedDMA(event.target.value)}><option>Embakasi</option><option>CBD</option><option>Westlands</option></select></div><div className="dma-grid"><span>Area inflow <b>{selectedDmaMetrics.inflow}</b></span><span>Consumption <b>{selectedDmaMetrics.consumption}</b></span><span>Minimum night flow <b>{selectedDmaMetrics.nightFlow}</b></span><span>NRW estimate <b>{selectedDmaMetrics.nrw}</b></span><span>Pressure <b>{selectedDmaMetrics.pressure}</b></span><span>Active alerts <b>{selectedDmaMetrics.alerts}</b></span><span>Water balance <b>{selectedDmaMetrics.balance}</b></span><span>County risk score <b>{selectedDmaMetrics.risk}</b></span></div></div></div>
    {showIntel && <div className="leak-intel-card"><div className="intel-card-heading"><div><span className="eyebrow">AI PRIORITY EVENT · NAIROBI COUNTY</span><h3>{selectedAlert.zone.toUpperCase()}</h3></div><div className="intel-heading-actions"><em>HIGH</em><button className="intel-close" aria-label="Dismiss AI priority event" onClick={() => setShowIntel(false)}><X size={13} /></button></div></div><div className="intel-grid"><span>Alert Probability <b>{selectedAlert.probability}</b></span><span>Estimated Loss <b>{selectedAlert.loss}</b></span><span>County Area <b>{selectedAlert.zone}</b></span><span>Pressure Anomaly <b>-18%</b></span><span>Consumption Anomaly <b>+16%</b></span><span>Detected <b>14 min ago</b></span></div><p><strong>Why AQUAINTEL flagged this location</strong> Flow increased by 17% while downstream consumption remained stable. Pressure dropped across two adjacent sensors; the combined pattern is consistent with a probable water-loss event in this Nairobi County zone.</p><div className="intel-actions"><button onClick={() => setShowEvidence((v) => !v)}><Search size={13} /> {showEvidence ? "Hide Evidence" : "View Evidence"}</button><button className="primary-btn" onClick={() => toast(`County response task created for ${selectedAlert.zone}`)}><Plus size={13} /> Create Work Order</button></div>{showEvidence && <div className="evidence-strip"><span><b>PS-26</b> Pressure 31.4 m</span><span><b>FM-26</b> Flow +16%</span><span><b>7-day baseline</b> Stable consumption</span><span><b>Confidence</b> 91%</span></div>}</div>}
  </Panel>;
}

function AlertRail() { return <Panel className="alert-rail"><div className="rail-title"><div><h2>Active Leak Alerts</h2><span>23 simulated incidents requiring review</span></div><a>View All</a></div><div className="alert-tabs"><button className="active">All <b>23</b></button><button>High <b>8</b></button><button>Medium <b>10</b></button><button>Low <b>5</b></button></div><div className="alert-list">{alerts.map((alert) => <button className={`alert-item ${alert.color}`} key={alert.zone} onClick={() => toast(`${alert.zone} selected in Nairobi County`)}><div className="alert-head"><span><CircleAlert size={13} /> {alert.zone}</span><em>{alert.level}</em></div><p>{alert.detail}</p><small>Probability: <b>{alert.probability}</b> <span>•</span> Est. Loss: <b>{alert.loss}</b></small><time>{alert.age} <ChevronDown size={12} /></time></button>)}</div><button className="view-alerts" onClick={() => toast("Opening all simulated alert incidents")}>View All Alerts</button></Panel>; }
function TrendPanel() { return <Panel className="trend-panel"><div className="panel-heading"><div><h2>NRW Trend <span>(30 Days)</span></h2><strong>42.6% <small>▲ 1.8% vs yesterday</small></strong></div><a>View Report</a></div><svg viewBox="0 0 370 150" className="chart-svg"><path d="M0 116H370M0 76H370M0 38H370" stroke="#214157" strokeDasharray="3 4"/><path d="M0 92 C18 78 26 108 42 96 S61 104 72 85 S90 102 102 84 S122 102 137 93 S151 111 165 92 S183 94 197 76 S220 104 235 88 S255 105 270 83 S291 101 304 76 S330 93 343 84 S360 92 370 80" fill="none" stroke="#2c7ef4" strokeWidth="2.5"/><path d="M0 115 C72 114 112 114 182 114 S274 114 370 114" fill="none" stroke="#13c49d" strokeDasharray="6 4"/><text x="327" y="110" fill="#13c49d">Target: 30%</text><text x="0" y="145">Apr 21</text><text x="78" y="145">Apr 28</text><text x="158" y="145">May 5</text><text x="237" y="145">May 12</text><text x="322" y="145">May 19</text></svg></Panel>; }
function LossPanel() { return <Panel className="loss-panel"><div className="panel-heading"><div><h2>Water Loss Breakdown</h2><span>Simulated telemetry · by source</span></div><MoreHorizontal size={17} className="muted" /></div><div className="loss-body"><div className="donut"><div><strong>18.7M L</strong><span>Lost Today</span></div></div><div className="loss-legend"><span><i style={{ background: "#2e8af6" }} />Area anomalies <b>45% (8.4M L)</b></span><span><i style={{ background: "#18c7ae" }} />Consumption variance <b>35% (6.5M L)</b></span><span><i style={{ background: "#f2b43e" }} />Unauthorized Consumption <b>10% (1.9M L)</b></span><span><i style={{ background: "#ef654f" }} />Metering Inaccuracies <b>10% (1.9M L)</b></span></div></div></Panel>; }
function WorkOrders() { return <Panel className="orders-panel"><div className="panel-heading"><div><h2>Recent Work Orders</h2><span>Dispatch queue · 4 active</span></div><a>View All</a></div><div className="orders-list">{workOrders.map(([id, zone, status, time, tone]) => <button className="order-row" key={id} onClick={() => toast(`${id} opened`)}><div><strong>{id}</strong><span>{zone}</span></div><em className={tone}>{status}</em><time>{time}</time></button>)}</div></Panel>; }
function AICoworker() { return <Panel className="ai-panel"><div className="panel-heading"><div><h2><Sparkles size={14} /> AI Water Coworker</h2><span>GIS → sensors → AI → field operations · demo</span></div><span className="ai-status">NETWORK AWARE</span></div><div className="ai-thread"><div className="ai-message operator-message">Show me the highest-risk water-loss zone.</div><div className="ai-message"><strong>Priority finding · Embakasi, Nairobi County</strong> Simulated pressure and consumption signals show an abnormal deviation from baseline in the Embakasi area. Leak probability is 88%, estimated loss is 2.9M L/day, and the county risk score is HIGH.</div></div><div className="ai-actions"><button onClick={() => toast("Inspecting the Embakasi alert in Nairobi County")}><Search size={12} /> Inspect Network</button><button onClick={() => toast("County response task created for Embakasi")}><Plus size={12} /> Create Work Order</button><button onClick={() => toast("Reviewing nearby Nairobi County signals")}><Search size={12} /> Review Area</button></div></Panel>; }

export default function Home() {
  const [activeNav, setActiveNav] = useState("Command Center"); const [sidebarOpen, setSidebarOpen] = useState(false);
  return <div className="dashboard-shell"><aside className={`sidebar ${sidebarOpen ? "open" : ""}`}><div className="brand"><div className="brand-mark" aria-label="Aquaintel water droplet logo"><svg viewBox="0 0 42 40" role="img" aria-hidden="true"><path className="droplet-large" d="M14 2C11.4 6.8 4 13.9 4 21.6 4 29.3 8.4 35 14 35s10-5.7 10-13.4C24 13.9 16.6 6.8 14 2Z" /><path className="droplet-small" d="M31 14c-1.6 3-5.5 6.6-5.5 11.2 0 4.2 2.4 6.8 5.5 6.8s5.5-2.6 5.5-6.8C36.5 20.6 32.6 17 31 14Z" /><path className="droplet-highlight" d="M10.5 14.5c-1.7 2.3-2.8 4.5-2.8 6.8 0 1.4.3 2.6.8 3.6M29.5 22c-.7 1.2-1.1 2.3-1.1 3.4" /></svg></div><div><strong>AQUAINTEL</strong><span>Every Drop Counts</span></div><button className="close-mobile" onClick={() => setSidebarOpen(false)}><X size={17} /></button></div><nav>{navItems.map(({ label, icon: Icon, badge }) => <button key={label} className={activeNav === label ? "active" : ""} onClick={() => { setActiveNav(label); setSidebarOpen(false); if (label !== "Command Center") toast(`${label} view selected`); }}><Icon size={17} /><span>{label}</span>{badge && <b>{badge}</b>}</button>)}</nav><div className="system-status"><h3>System Status · Demo</h3><p><i className="status-green" />Sensors Online <b>1,248 / 1,387</b></p><p><i className="status-teal" />Network Zones <b>78 / 78</b></p><p><i className="status-red" />Active Alerts <b>23</b></p><p><i className="status-blue" />Work Orders <b>12</b></p><p><i className="status-green" />Data Quality <b className="green-text">98%</b></p></div><footer>AQUAINTEL v1.0.0<br /><span>© 2024 · Prototype telemetry</span></footer></aside><main className="main-stage"><header className="topbar"><button className="mobile-menu" onClick={() => setSidebarOpen(true)}><Menu size={19} /></button><div className="title-block"><h1>Nairobi Water Intelligence Center</h1><p>AI-Powered Leak Detection &amp; Non-Revenue Water Management</p></div><div className="top-actions"><div className="live-status"><i className="status-green" /><div><strong>Simulation</strong><span>Demo telemetry only</span></div></div><div className="weather"><Cloud size={18} /><div><strong>22°C</strong><span>Nairobi, Kenya</span></div></div><button className="icon-button"><Bell size={18} /><b>8</b></button><button className="operator"><span className="avatar">JM</span><div><strong>Operator</strong><span>Water Operations</span></div><ChevronDown size={15} /></button></div></header><div className="content"><div className="action-row"><div className="breadcrumbs"><span>Command Center</span><span>/</span><strong>Live Overview</strong></div><div className="demo-banner"><span>SIMULATED DATASET</span> Replaceable with SCADA · GIS · meter feeds <button className="primary-btn" onClick={() => toast("New work order created")}><Plus size={15} /> New Work Order</button></div></div><div className="metrics"><MetricCard icon={Droplets} label="NRW Today" value="42.6%" helper="vs yesterday" tone="teal" trend="▲ 1.8%" /><MetricCard icon={TriangleAlert} label="Water Lost Today" value="18.7M L" helper="vs 2.3M" tone="red" trend="▼ 12%" /><MetricCard icon={Bell} label="Active Leak Alerts" value="23" helper="vs yesterday" tone="red" trend="▲ 5" /><MetricCard icon={ShieldCheck} label="Resolved This Week" value="17" helper="vs last week" tone="green" trend="▲ 7" /><MetricCard icon={Droplets} label="Water Recovered" value="56.3M L" helper="This month" tone="blue" /></div><div className="dashboard-grid"><NetworkMap /><AlertRail /><TrendPanel /><LossPanel /><WorkOrders /><AICoworker /></div></div></main></div>;
}
