import { useState } from "react";

const COLORS = {
  GRAY_1: "#232222",
  GRAY_2: "#2D2C2C",
  GRAY_3: "#434343",
  GRAY_4: "#696969",
  GRAY_5: "#727272",
  GRAY_6: "#9D9D9D",
  WHITE: "#FFFFFF",
  BLUE: "#426BF3",
  PINK: "#B61F73",
  GREEN: "#0CAF74",
  RED: "#ED2F2F",
  YELLOW: "#FCE03D",
  ORANGE: "#F85F0A",
};

const FONT = {
  ui: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif",
  mono: "source-code-pro, Menlo, Monaco, Consolas, monospace",
};

const scanners = [
  { name: "Lumafield", model: "Neptune", formula: "±(7 + L/20)", a: 7, b: 20, highlight: true },
  { name: "Zeiss", model: "METROTOM 1", formula: "±(9 + L/50)", a: 9, b: 50 },
  { name: "Nikon", model: "MCT225", formula: "±(9 + L/50)", a: 9, b: 50 },
  { name: "Waygate", model: "v|tome|x M", formula: "±(4.5 + L/100)", a: 4.5, b: 100 },
];

const PanelHeader = ({ children }) => (
  <div style={{
    height: 32, display: "flex", alignItems: "center", paddingLeft: 10,
    background: COLORS.GRAY_2, color: COLORS.GRAY_6, fontSize: 13,
    fontWeight: 500, textTransform: "capitalize", fontFamily: FONT.ui,
  }}>{children}</div>
);

const Label = ({ children }) => (
  <span style={{ fontSize: 11, color: COLORS.GRAY_6, fontFamily: FONT.ui }}>{children}</span>
);

const Value = ({ children, color }) => (
  <span style={{
    fontFamily: FONT.mono, fontSize: 11, color: color || COLORS.BLUE,
    minWidth: "2.5em", whiteSpace: "nowrap", textAlign: "right",
  }}>{children}</span>
);

export default function App() {
  const [L, setL] = useState(100);
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const data = scanners.map(s => ({
    ...s,
    fixed: s.a,
    lengthDep: L / s.b,
    total: s.a + L / s.b,
  })).sort((a, b) => a.total - b.total);

  const maxTotal = Math.max(...data.map(d => d.total));

  return (
    <div style={{
      fontFamily: FONT.ui, background: COLORS.GRAY_1, color: COLORS.WHITE,
      minHeight: "100vh", display: "flex", flexDirection: "column",
    }}>
      {/* Toolbar */}
      <div style={{
        height: 56, background: COLORS.GRAY_2, display: "flex",
        alignItems: "center", padding: "0 16px", gap: 16,
        borderBottom: `1px solid ${COLORS.GRAY_4}`,
      }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.WHITE }}>
          CT Scanner Accuracy Comparison
        </span>
        <span style={{ fontSize: 11, color: COLORS.GRAY_6 }}>
          VDI/VDE 2630 · ±(a + L/b) µm
        </span>
      </div>

      <div style={{ display: "flex", flex: 1 }}>
        {/* Left Panel – Controls */}
        <div style={{ width: 240, flexShrink: 0, borderRight: `1px solid ${COLORS.GRAY_4}` }}>
          <PanelHeader>parameters</PanelHeader>
          <div style={{ padding: 10, display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Part Length Slider */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ display: "grid", gridTemplateColumns: "60px 1fr", alignItems: "center", gap: 8 }}>
                <Label>Length</Label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8, alignItems: "center" }}>
                  <input
                    type="range" min={10} max={500} step={10} value={L}
                    onChange={e => setL(Number(e.target.value))}
                    style={{ width: "100%", accentColor: COLORS.BLUE }}
                  />
                  <Value>{L} mm</Value>
                </div>
              </div>
            </div>

            {/* Scanner List */}
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Label>Scanners</Label>
              <div style={{ marginTop: 4, display: "flex", flexDirection: "column", gap: 4 }}>
                {data.map((s, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "4px 6px", fontSize: 11, color: s.highlight ? COLORS.BLUE : COLORS.WHITE,
                    background: s.highlight ? COLORS.GRAY_3 : "transparent",
                    borderRadius: 0,
                  }}>
                    <span style={{
                      width: 8, height: 8, borderRadius: 0, flexShrink: 0,
                      background: s.highlight ? COLORS.BLUE : i === 0 ? COLORS.GREEN : COLORS.GRAY_5,
                    }} />
                    <span style={{ fontWeight: s.highlight ? 700 : 400 }}>{s.name}</span>
                    <span style={{ color: COLORS.GRAY_6, marginLeft: "auto", fontFamily: FONT.mono }}>
                      ±{s.total.toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Canvas Area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <PanelHeader>comparison</PanelHeader>
          <div style={{ flex: 1, padding: 16, display: "flex", flexDirection: "column", gap: 24 }}>

            {/* Table */}
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, fontFamily: FONT.ui }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${COLORS.GRAY_4}` }}>
                  {["Manufacturer", "Model", "Formula (µm)", "Fixed (a)", "Length (L/b)", "Total ±µm"].map((h, i) => (
                    <th key={i} style={{
                      padding: "8px 8px", color: COLORS.GRAY_6, fontWeight: 500,
                      fontSize: 9, textTransform: "uppercase", textAlign: i >= 3 ? "right" : "left",
                      letterSpacing: "0.5px",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((s, i) => (
                  <tr
                    key={i}
                    onMouseEnter={() => setHoveredIdx(i)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    style={{
                      borderBottom: `1px solid ${COLORS.GRAY_3}`,
                      background: hoveredIdx === i
                        ? "rgba(255,255,255,0.05)"
                        : s.highlight ? "rgba(66,107,243,0.06)" : "transparent",
                      transition: "background 0.15s",
                    }}
                  >
                    <td style={{ padding: "10px 8px", fontWeight: s.highlight ? 700 : 400, color: s.highlight ? COLORS.BLUE : COLORS.WHITE }}>
                      {s.name}
                      {s.highlight && (
                        <span style={{
                          fontSize: 9, background: COLORS.PINK, color: COLORS.WHITE,
                          padding: "1px 5px", marginLeft: 8, textTransform: "uppercase",
                          fontWeight: 700, letterSpacing: "0.5px",
                        }}>you</span>
                      )}
                    </td>
                    <td style={{ padding: "10px 8px", color: COLORS.GRAY_6 }}>{s.model}</td>
                    <td style={{ padding: "10px 8px", fontFamily: FONT.mono, color: COLORS.WHITE }}>{s.formula}</td>
                    <td style={{ padding: "10px 8px", textAlign: "right", fontFamily: FONT.mono, color: COLORS.GRAY_6 }}>{s.fixed.toFixed(1)}</td>
                    <td style={{ padding: "10px 8px", textAlign: "right", fontFamily: FONT.mono, color: COLORS.GRAY_6 }}>{s.lengthDep.toFixed(1)}</td>
                    <td style={{ padding: "10px 8px", textAlign: "right", fontFamily: FONT.mono, fontWeight: 700, fontSize: 13, color: s.highlight ? COLORS.BLUE : i === 0 ? COLORS.GREEN : COLORS.WHITE }}>
                      ±{s.total.toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Bar Chart */}
            <div>
              <div style={{ fontSize: 9, textTransform: "uppercase", color: COLORS.GRAY_6, marginBottom: 10, letterSpacing: "0.5px", fontWeight: 500 }}>
                Error Breakdown at L = {L} mm
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {data.map((s, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "80px 1fr auto", alignItems: "center", gap: 8 }}>
                    <span style={{
                      fontSize: 11, textAlign: "right",
                      color: s.highlight ? COLORS.BLUE : COLORS.GRAY_6,
                      fontWeight: s.highlight ? 700 : 400,
                    }}>{s.name}</span>
                    <div style={{
                      height: 24, background: COLORS.GRAY_3, position: "relative",
                      overflow: "hidden",
                    }}>
                      {/* Fixed error portion */}
                      <div style={{
                        position: "absolute", left: 0, top: 0, height: "100%",
                        width: `${(s.fixed / maxTotal) * 100}%`,
                        background: s.highlight ? COLORS.BLUE : i === 0 ? COLORS.GREEN : COLORS.GRAY_5,
                        opacity: 0.9, transition: "width 0.3s ease",
                      }} />
                      {/* Length-dependent portion */}
                      <div style={{
                        position: "absolute", top: 0, height: "100%",
                        left: `${(s.fixed / maxTotal) * 100}%`,
                        width: `${(s.lengthDep / maxTotal) * 100}%`,
                        background: s.highlight ? COLORS.BLUE : i === 0 ? COLORS.GREEN : COLORS.GRAY_5,
                        opacity: 0.45, transition: "all 0.3s ease",
                      }} />
                    </div>
                    <Value color={s.highlight ? COLORS.BLUE : i === 0 ? COLORS.GREEN : COLORS.WHITE}>
                      ±{s.total.toFixed(1)}
                    </Value>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: 9, color: COLORS.GRAY_5, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ width: 10, height: 10, background: COLORS.GRAY_5, opacity: 0.9, display: "inline-block" }} /> Fixed error (a)
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ width: 10, height: 10, background: COLORS.GRAY_5, opacity: 0.45, display: "inline-block" }} /> Length-dependent (L/b)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel – Details */}
        <div style={{ width: 240, flexShrink: 0, borderLeft: `1px solid ${COLORS.GRAY_4}` }}>
          <PanelHeader>details</PanelHeader>
          <div style={{ padding: 10, display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                ["Part Size", `${L} mm`],
                ["Best Total", `±${Math.min(...data.map(d => d.total)).toFixed(1)} µm`],
                ["Your Total", `±${data.find(d => d.highlight)?.total.toFixed(1)} µm`],
                ["Delta", `${(data.find(d => d.highlight)?.total - Math.min(...data.map(d => d.total))).toFixed(1)} µm`],
              ].map(([label, val], i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "60px 1fr", gap: 8, alignItems: "center" }}>
                  <Label>{label}</Label>
                  <span style={{
                    fontFamily: FONT.mono, fontSize: 11,
                    color: i === 3
                      ? (parseFloat(val) === 0 ? COLORS.GREEN : COLORS.ORANGE)
                      : i === 2 ? COLORS.BLUE : COLORS.WHITE,
                  }}>{val}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: `1px solid ${COLORS.GRAY_3}`, paddingTop: 10 }}>
              <div style={{ fontSize: 9, textTransform: "uppercase", color: COLORS.GRAY_6, marginBottom: 8, letterSpacing: "0.5px" }}>
                Ranking
              </div>
              {data.map((s, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "4px 0", fontSize: 11,
                }}>
                  <span style={{
                    width: 18, height: 18, display: "flex", alignItems: "center",
                    justifyContent: "center", fontFamily: FONT.mono, fontSize: 11,
                    fontWeight: 700, background: COLORS.GRAY_3,
                    color: i === 0 ? COLORS.GREEN : COLORS.GRAY_6,
                  }}>{i + 1}</span>
                  <span style={{ color: s.highlight ? COLORS.BLUE : COLORS.WHITE, fontWeight: s.highlight ? 700 : 400 }}>
                    {s.name}
                  </span>
                </div>
              ))}
            </div>

            <div style={{
              borderTop: `1px solid ${COLORS.GRAY_3}`, paddingTop: 10,
              fontSize: 11, color: COLORS.GRAY_6, lineHeight: 1.5,
            }}>
              Specs are approximate, based on publicly available data. Confirm with manufacturer datasheets.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
