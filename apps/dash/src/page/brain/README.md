## QDrantGraph — usage and layout controls

QDrantGraph visualizes the result set from Qdrant as a graph. It helps you quickly understand clusters and relationships between blocks.

### What you see
- **Nodes**
  - Components (blue): result items from Qdrant (IDs).
  - Tags (green) and Categories (orange): only in Topology mode.
- **Edges**
  - Topology mode: component → tag/category, plus frequent tag↔tag co‑occurrences.
  - Cosine mode: component ↔ component similarity edges (from Qdrant recommend / vector proximity).

Distances on the canvas are driven by the layout (ForceAtlas2). Closer nodes = more/better connections according to the selected mode. The table’s Score column still represents the initial Qdrant ranking; the graph layout is an additional visual aid, not the ranking itself.

### Modes
- **Topology** (default)
  - Shows structure by metadata (tags, categories). Good for exploring taxonomy and co‑occurrence patterns.
  - Edge weights are not applied to the layout (edgeWeightInfluence = 0).
- **Cosine**
  - Shows vector similarity between components (component↔component edges built via Qdrant recommend). Good for seeing “look‑alike” clusters.
  - Edge weights are applied to the layout (edgeWeightInfluence = 1).

Switching modes fundamentally changes which relationships are considered, so the layout can change dramatically. That’s expected.

### Layout controls (ForceAtlas2)
All changes are applied live.

- **Gravity** (default 1)
  - Pulls nodes toward the center. Higher = tighter, more compact graph; lower = more spread out, risk of fragmentation.
  - Try 0.5–2.0. If the graph flies apart, increase gravity or enable strong gravity.

- **Scaling** (Scaling Ratio, default 1)
  - Sets the global “repulsion scale”. Higher = nodes push each other more (graph expands); lower = nodes sit closer.
  - Try 0.5–3.0. If labels overlap too much, increase scaling; if the graph is too empty, decrease.

- **SlowDown** (default 1)
  - Dampens the physics for a more stable convergence. Higher = slower motion but fewer oscillations.
  - Try 0.5–5.0. If the layout jitters, increase; if it’s too sluggish, decrease.

- **Strong gravity** (checkbox)
  - Uses a stronger gravity model that prevents nodes from escaping the center in sparse graphs.
  - Enable when the graph fragments or looks hollow; disable when the center becomes too dense.

### Typical workflows
- Start in Topology mode to understand the semantic structure (categories/tags) of the current result set.
- Switch to Cosine to inspect “look‑alike” clusters of components.
- Adjust Gravity/Scaling until label readability is good and clusters are clear. Use SlowDown and Strong gravity to stabilize or tighten the layout when needed.

### Notes and limits
- Initial map shows up to 100 points across all collections (to keep the UI responsive).
- In Cosine mode, per‑collection “seed” size is capped to avoid heavy recommend calls.
- Table rows and node count are aligned; the graph only reflects what’s currently in the table.

### Troubleshooting
- Labels overlap: increase Scaling or slightly raise Gravity.
- Graph too sparse or fragmented: enable Strong gravity and/or increase Gravity.
- Layout jittery: increase SlowDown.
- Mode switch reshapes everything: expected — you changed the relationship model (metadata vs vector similarity).


