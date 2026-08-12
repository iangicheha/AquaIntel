# Aquaintel Water Intelligence Dashboard — Ground-Truth Design Spec

The provided reference image is the ground truth for this build. Fidelity to its dark operational-console aesthetic, asymmetric dashboard layout, deep navy surfaces, electric blue navigation, cyan/green telemetry, alert red/orange accents, dense but legible cards, left sidebar, top status bar, central network map, right alert rail, and lower analytics/work-order panels takes priority over generic dashboard conventions.

## Chosen Direction

### Design Movement
Contemporary mission-control interface design with civic-tech instrumentation: dense information architecture, high contrast, restrained glass surfaces, and map-led operations.

### Core Principles
- Prioritize live operational awareness over decorative content.
- Use deep navy and blue-black surfaces to create a calm night-shift control-room mood.
- Reserve cyan, electric blue, green, amber, and red for signal hierarchy and status.
- Compose the page as an asymmetric command surface: persistent rail, wide map stage, and alert rail.

### Color Philosophy
The base is almost-black blue to reduce glare and make telemetry colors legible. Electric blue indicates navigation and active controls; aqua-green signals healthy network flow; amber and red are used sparingly for escalating risk. A cool slate type scale keeps long sessions comfortable.

### Layout Paradigm
A fixed-height operations viewport on desktop with a persistent navigation rail and a 12-column content field. The central map is the visual anchor; cards are compact, aligned, and slightly raised. On smaller screens, the side rails collapse into stacked sections without losing the information hierarchy.

### Signature Elements
- A stylized blue water-drop brand mark paired with a compact uppercase wordmark.
- A glowing network-map surface with traced pipe paths, node dots, zone labels, and pulsing leak markers.
- Compact telemetry cards with mono numerals, thin borders, and status chips.

### Interaction Philosophy
Every control should suggest an operational action. Hover states lift the surface slightly, active navigation uses a clear blue fill, alert rows respond like selectable incidents, and the AI coworker feels like a docked assistant rather than a chatbot landing page.

### Animation
Use short, low-amplitude transitions under 220ms for hover, tab, and alert states. Map markers may pulse subtly; KPI cards can fade in with a 40ms stagger. Respect reduced-motion preferences and avoid distracting loops.

### Typography System
Use Space Grotesk for interface headlines and labels, IBM Plex Mono for telemetry numerals, status timestamps, and engineering metadata. Headings should be compact and semibold; body copy should use a muted slate tone with high contrast.

### Brand Essence
The operations console for water teams who need to see loss, risk, and response in one place. Personality: precise, vigilant, calm.

### Brand Voice
Headlines are direct and operational. CTAs are verbs. Microcopy is concise and evidence-oriented.
Example lines: “See where water is disappearing.” “Dispatch the next best action.”

### Wordmark & Logo
Use a bold water-drop symbol with three internal signal marks, paired with the AQUAINTEL wordmark in a compact geometric sans treatment. The mark should remain legible as a standalone favicon.

### Signature Brand Color
Signal Aqua: #17D7C4 — an ownable green-cyan used for healthy network states and telemetry accents.

## Implementation Notes

The experience is frontend-only and uses representative operational data for the interface presentation. The central network map is a stylized SVG/CSS visualization rather than a live GIS layer, matching the visual density and intent of the supplied reference without requiring an external map key.

## Style Decisions

- All telemetry values, probabilities, timestamps, flow/loss units, and engineering metadata use IBM Plex Mono; Space Grotesk is reserved for navigation, headings, labels, and command language.
- Signal Aqua `#17D7C4` is used for healthy network flow, recovery, live status, and positive telemetry; alert severity uses amber/red without decorative reuse.
- Copy sounds like an operations center, never a marketing landing page: short evidence-led lines such as “23 incidents requiring review.”
- The central map is the signature surface, combining the generated network texture with SVG pipe paths, zone annotations, flow markers, and probability callouts.
- Lower analytics panels follow a strict stacked instrument-panel rhythm so the AI coworker never overlaps the trend, loss, or work-order surfaces.
