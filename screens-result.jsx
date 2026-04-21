// screens-result.jsx - matched funds, fund detail

// ---- Generate "why this fund" reasons based on answers ----
function buildReasons(answers, fund) {
 const reasons = [];
 const p = PURPOSES.find(x => x.id === answers.purpose);
 const h = HORIZONS.find(x => x.id === answers.horizon);
 const r = REASSURES.find(x => x.id === answers.reassure);

 if (p) reasons.push({ t: `Built for ${p.title.toLowerCase()}`, s: `Matches your reason for investing.` });
 if (h) reasons.push({ t: `Fits a ${h.title.toLowerCase()} horizon`, s: `Your timeline lines up with this fund's sweet spot.` });

 const riskMap = {
 worried: "a measured risk level that protects the downside",
 neutral: "a balanced risk profile that rides the cycle",
 confident: "a higher risk level that leans into long-term upside",
 };
 if (r) reasons.push({ t: "Right risk profile", s: `You told us you'd ${r.title.toLowerCase()}, so we've chosen ${riskMap[r.id]}.` });

 if (answers.values && answers.values.length) {
 const matched = answers.values.filter(v => fund.tags.values.includes(v));
 if (matched.length) {
 reasons.push({ t: "Reflects what matters to you", s: `Hits on ${matched.join(", ")}, the values you highlighted.` });
 }
 }

 return reasons.slice(0, 4);
}

const MatchIcon = ({ name, size = 18 }) => {
 const paths = {
 purpose: "M12 3l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z",
 horizon: "M3 12h18M12 3v18",
 risk: "M12 3L3 21h18L12 3z",
 values: "M20.84 4.6a5.5 5.5 0 00-7.78 0L12 5.66l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.85a5.5 5.5 0 000-7.78z",
 };
 return (
 <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
 <path d={paths[name] || paths.purpose} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
 </svg>
 );
};

// Circular progress ring showing match percentage. The teal arc sweeps
// clockwise from 12 o'clock for `pct`% of the circumference; the number sits
// centred inside and a small "match" label sits beneath.
const MatchRing = ({ pct, size = 60 }) => {
 const stroke = 2;
 const r = (size - stroke) / 2;
 const c = 2 * Math.PI * r;
 const filled = (Math.max(0, Math.min(100, pct)) / 100) * c;
 const cx = size / 2;
 const cy = size / 2;
 return (
 <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
 <div style={{ position: "relative", width: size, height: size }}>
 <svg width={size} height={size} aria-hidden="true" style={{ display: "block", transform: "rotate(-90deg)" }}>
 <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(0,64,72,0.16)" strokeWidth={stroke}/>
 <circle
 cx={cx} cy={cy} r={r}
 fill="none"
 stroke="var(--color-primary-600, #003036)"
 strokeWidth={stroke}
 strokeLinecap="round"
 strokeDasharray={`${filled} ${c}`}
 />
 </svg>
 <div
 style={{
 position: "absolute", inset: 0,
 display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
 color: "var(--color-primary-600, #003036)",
 gap: 1,
 }}
 >
 <div style={{ font: "500 15px/16px var(--font-display)", letterSpacing: "-0.3px" }}>
 {Math.round(pct)}<span style={{ fontSize: 11, letterSpacing: 0, marginLeft: 0.5 }}>%</span>
 </div>
 <div style={{ font: "500 9px/10px var(--font-body)", letterSpacing: "0.6px", textTransform: "uppercase", color: "var(--fg-3)" }}>
 match
 </div>
 </div>
 </div>
 </div>
 );
};

// ---- Result screen - three fund options ----
const ARCHETYPE_META = {
 retirement: { label: "Retire by 2040", sub: "BlackRock LifePath 2040 · target-date fund" },
 ai: { label: "Invest in AI companies", sub: "L&G Artificial Intelligence UCITS ETF" },
 pe: { label: "Invest in private equity", sub: "Partners Group Listed Private Equity" },
};

// Editorial line-art marks for each fund. No tile, no fill - just a
// single quiet teal glyph at a modest size.
const ArchetypeIcon = ({ kind, size = 40 }) => {
 const stroke = "var(--color-primary-600, #003036)";
 const sw = 1.75;
 const vb = 40;

 const glyphs = {
 // Retirement - glidepath: line that bends from steep to flat, with a target dot.
 retirement: (
 <g fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
 <path d="M6 30 Q18 30 22 20 Q26 10 34 10"/>
 <circle cx="34" cy="10" r="2.25" fill={stroke} stroke="none"/>
 </g>
 ),
 // AI - nodes-and-edges network (three nodes in a triangle, connected).
 ai: (
 <g fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
 <line x1="10" y1="10" x2="30" y2="10"/>
 <line x1="10" y1="10" x2="20" y2="30"/>
 <line x1="30" y1="10" x2="20" y2="30"/>
 <circle cx="10" cy="10" r="2.5" fill={stroke} stroke="none"/>
 <circle cx="30" cy="10" r="2.5" fill={stroke} stroke="none"/>
 <circle cx="20" cy="30" r="2.5" fill={stroke} stroke="none"/>
 </g>
 ),
 // Private Equity - locked vault / key aperture (stacked blocks with a keyhole).
 pe: (
 <g fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
 <rect x="6" y="8" width="12" height="10"/>
 <rect x="22" y="8" width="12" height="10"/>
 <rect x="14" y="22" width="12" height="10"/>
 <circle cx="20" cy="27" r="1.5" fill={stroke} stroke="none"/>
 </g>
 ),
 };

 return (
 <svg width={size} height={size} viewBox={`0 0 ${vb} ${vb}`} aria-hidden="true">
 {glyphs[kind]}
 </svg>
 );
};

const ResultScreen = ({ answers, onBack, onRestart, onPickAlt, onInvest, onOpenDetail }) => {
 // Stable order - retirement, AI, PE. No "best match" ranking.
 const portfolio = portfolioMatches(answers);

 return (
 <div className="screen" data-screen-label="11 Result">
 <div className="phone-body" style={{ display: "flex", flexDirection: "column", background: "var(--color-secondary-100, #F5F1E8)" }}>
 <TopBar onBack={onBack}/>

 <div style={{ padding: "8px 24px 28px" }}>
 <div style={{ font: "500 34px/38px var(--font-display)", letterSpacing: "-1px", color: "var(--fg-1)" }}>
 Three options for you
 </div>
 <p style={{ font: "400 16px/22px var(--font-body)", color: "var(--fg-2)", marginTop: 14, textWrap: "pretty" }}>
 Based on your answers, these three stood out. Open any one to see what's inside.
 </p>
 </div>

 {/* Fund cards - spaced out on the canvas */}
 <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "0 16px 28px" }}>
 {portfolio.map((m) => {
 const meta = ARCHETYPE_META[m.archetype];
 return (
 <div
 key={m.fund.id}
 style={{
 position: "relative",
 background: "var(--color-secondary-200, #ECE4D3)",
 padding: "24px",
 display: "flex",
 flexDirection: "column",
 gap: 20,
 }}
 >
 <div>
 <div
 style={{
 width: 56, height: 56,
 borderRadius: "50%",
 background: "var(--color-secondary-100, #FDFAF5)",
 display: "inline-flex",
 alignItems: "center",
 justifyContent: "center",
 }}
 >
 <ArchetypeIcon kind={m.archetype} size={28}/>
 </div>
 <div style={{ marginTop: 16 }}>
 <div style={{ font: "500 24px/28px var(--font-display)", letterSpacing: "-0.4px", color: "var(--fg-1)" }}>
 {meta.label}
 </div>
 <div style={{ font: "400 14px/20px var(--font-body)", color: "var(--fg-2)", marginTop: 6 }}>
 {meta.sub}
 </div>
 </div>
 </div>

 <div>
 <div style={{ font: "500 28px/32px var(--font-display)", color: "var(--fg-1)", letterSpacing: "-0.5px" }}>
 {fmtPct(m.fund.fiveYr, 1)}
 </div>
 <div style={{ font: "400 13px/17px var(--font-body)", color: "var(--fg-3)", marginTop: 4 }}>
 Average return per year
 </div>
 </div>

 <button
 onClick={() => onOpenDetail(m.fund.id)}
 style={{
 background: "transparent",
 border: "1px solid var(--color-primary-500)",
 color: "var(--color-primary-600)",
 padding: "14px 18px",
 font: "600 15px/18px var(--font-body)",
 fontFamily: "inherit",
 cursor: "pointer",
 textAlign: "center",
 }}
 >
 View fund
 </button>
 </div>
 );
 })}
 </div>

 <div style={{ padding: "0 24px 32px" }}>
 <p style={{ font: "400 13px/18px var(--font-body)", color: "var(--fg-3)", textWrap: "pretty" }}>
 Capital at risk. Past performance isn't a guide to future results. You could get back less than you invest.
 </p>
 </div>
 </div>
 </div>
 );
};

// ---- Fund Detail Screen (renders a Portfolio) ----
// Tabbed composition card - horizontal tabs (Top 10 / Sector / Region / Assets).
const BreakdownCard = ({ groups }) => {
 const [active, setActive] = React.useState(groups[0]?.id);
 const current = groups.find(g => g.id === active) || groups[0];

 return (
 <div className="pd-card pd-breakdown-card">
 <div className="pd-breakdown-tabs" role="tablist">
 {groups.map(g => (
 <button
 key={g.id}
 role="tab"
 aria-selected={active === g.id}
 onClick={() => setActive(g.id)}
 className={"pd-breakdown-tab" + (active === g.id ? " is-active" : "")}
 >
 {g.label}
 </button>
 ))}
 </div>

 <div className="pd-breakdown-list">
 {current.rows.map((r, i) => (
 <div key={i} className="pd-breakdown-row">
 <div className="pd-breakdown-row-head">
 <span className="pd-breakdown-label">{r.label}</span>
 <span className="pd-breakdown-pct">{r.pct}%</span>
 </div>
 <div className="pd-breakdown-track">
 <div className="pd-breakdown-fill" style={{ width: `${Math.min(100, r.pct)}%` }}/>
 </div>
 </div>
 ))}
 </div>

 {current.footnote && (
 <div className="pd-footnote" style={{ marginTop: 14 }}>{current.footnote}</div>
 )}
 </div>
 );
};

const FundDetail = ({ fundId, amount, onBack, onInvest }) => {
 const fund = FUNDS.find(f => f.id === fundId);
 const [tab, setTab] = React.useState("performance");
 const [range, setRange] = React.useState("5Y"); // 6M / 1Y / 2Y / 5Y
 const [cursor, setCursor] = React.useState(null); // scrub index, or null = default
 if (!fund) return null;

 const invested = amount || 25000;

 // ---- 10-year projection series ----
 const years = Array.from({ length: 11 }, (_, i) => i); // 0..10
 const values = years.map(y => Math.round(projectGrowth(invested, fund, y)));
 const projMin = values[0];
 const projMax = values[values.length - 1];

 // ---- Performance series - deterministic wobble around a trend, per range ----
 // Generate N+1 points across the window. Each range has a distinct number of
 // samples so scrubbing feels denser on longer windows.
 const RANGES = {
 "6M": { months: 6, samples: 60, axis: ["6m", "5m", "4m", "3m", "2m", "1m", "Now"] },
 "1Y": { months: 12, samples: 60, axis: ["1y", "10m", "8m", "6m", "4m", "2m", "Now"] },
 "2Y": { months: 24, samples: 80, axis: ["2y", "20m", "16m", "12m", "8m", "4m", "Now"] },
 "5Y": { months: 60, samples: 100, axis: ["2021", "2022", "2023", "2024", "2025", "Now"] },
 };
 const rCfg = RANGES[range];
 const perfSeries = React.useMemo(() => {
 const n = rCfg.samples;
 const totalReturn = (fund.fiveYr / 100) * (rCfg.months / 60); // proportional trend
 const vol = (fund.risk / 5) * 0.12 * Math.sqrt(rCfg.months / 60);
 const pts = [];
 for (let i = 0; i <= n; i++) {
 const t = i / n;
 const trend = totalReturn * t;
 // Multi-scale sin wobble for an organic shape, deterministic per fund + range
 const seed = fund.risk + rCfg.months / 10;
 const wob =
 Math.sin(i * 0.25 + seed) * vol * 0.55 +
 Math.sin(i * 0.07 + seed * 1.3) * vol * 0.9 +
 Math.sin(i * 0.5 + seed * 0.7) * vol * 0.2;
 pts.push(1 + trend + wob); // fractional value, 1 = starting principal
 }
 return pts;
 }, [fund.id, range]);

 // Normalise the series into SVG coordinates
 const CHART_W = 300;
 const CHART_H = 76; // a touch taller so scrubbing feels roomier
 const perfMin = Math.min(...perfSeries);
 const perfMax = Math.max(...perfSeries);
 const perfRange = perfMax - perfMin || 1;
 const padY = 10;
 const pointXY = (i) => {
 const x = (i / (perfSeries.length - 1)) * CHART_W;
 const norm = (perfSeries[i] - perfMin) / perfRange;
 const y = CHART_H - padY - norm * (CHART_H - padY * 2);
 return { x, y };
 };
 const perfPath = (() => {
 const pts = perfSeries.map((_, i) => {
 const { x, y } = pointXY(i);
 return `${x.toFixed(1)},${y.toFixed(1)}`;
 });
 return "M " + pts.join(" L ");
 })();

 // Headline values - if scrubbing, show the value at the cursor; otherwise
 // show the whole-period return.
 const endIdx = perfSeries.length - 1;
 const activeIdx = cursor != null ? Math.max(0, Math.min(endIdx, cursor)) : endIdx;
 const activeReturn = (perfSeries[activeIdx] - 1) * 100;
 const totalReturn = (perfSeries[endIdx] - 1) * 100;
 const activeLabel = cursor != null
 ? (() => {
 const monthsAgo = Math.round((1 - activeIdx / endIdx) * rCfg.months);
 if (monthsAgo === 0) return "Today";
 if (monthsAgo < 12) return `${monthsAgo} month${monthsAgo === 1 ? "" : "s"} ago`;
 const years = monthsAgo / 12;
 return years % 1 === 0
 ? `${years} year${years === 1 ? "" : "s"} ago`
 : `${years.toFixed(1)} years ago`;
 })()
 : `${range} return`;
 const activeValueAtCursor = invested * perfSeries[activeIdx];
 const cursorXY = pointXY(activeIdx);

 // ---- Scrub handlers ----
 const chartRef = React.useRef(null);
 const handleScrub = (clientX) => {
 const el = chartRef.current;
 if (!el) return;
 const rect = el.getBoundingClientRect();
 const rel = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
 setCursor(Math.round(rel * endIdx));
 };
 const onPointerDown = (e) => { e.currentTarget.setPointerCapture?.(e.pointerId); handleScrub(e.clientX); };
 const onPointerMove = (e) => { if (e.buttons || e.pointerType === "touch") handleScrub(e.clientX); };
 const onPointerUp = (e) => { e.currentTarget.releasePointerCapture?.(e.pointerId); setCursor(null); };

 // ---- Projection scrubber ----
 const [projCursor, setProjCursor] = React.useState(null); // 0..10 fractional
 const PROJ_W = 300, PROJ_H = 120, PROJ_PAD = 8;
 const projYAt = (yrs) => {
 const v = projectGrowth(invested, fund, yrs);
 const norm = (v - projMin) / (projMax - projMin || 1);
 return PROJ_H - PROJ_PAD - norm * (PROJ_H - PROJ_PAD * 2);
 };
 const projCursorYrs = projCursor != null ? projCursor : 10;
 const projCursorVal = projectGrowth(invested, fund, projCursorYrs);
 const projCursorX = (projCursorYrs / 10) * PROJ_W;
 const projCursorY = projYAt(projCursorYrs);

 const projRef = React.useRef(null);
 const handleProjScrub = (clientX) => {
 const el = projRef.current;
 if (!el) return;
 const rect = el.getBoundingClientRect();
 const rel = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
 setProjCursor(rel * 10);
 };
 const onProjDown = (e) => { e.currentTarget.setPointerCapture?.(e.pointerId); handleProjScrub(e.clientX); };
 const onProjMove = (e) => { if (e.buttons || e.pointerType === "touch") handleProjScrub(e.clientX); };
 const onProjUp = (e) => { e.currentTarget.releasePointerCapture?.(e.pointerId); setProjCursor(null); };

 // ---- Projection path - smooth compound curve, 10 years ----
 const projPath = (() => {
 const W = 300, H = 120;
 const pts = years.map((y, i) => {
 const x = (i / 10) * W;
 const norm = (values[i] - projMin) / (projMax - projMin || 1);
 const yy = H - 8 - norm * (H - 16);
 return `${x},${yy}`;
 });
 return "M " + pts.join(" L ");
 })();

 return (
 <div className="screen" data-screen-label="12 Portfolio detail">
 <div className="phone-body pd-screen">
 {/* ---- Top bar (back only - no share) ---- */}
 <div className="pd-topbar">
 <button className="topbar-back" onClick={onBack} aria-label="Back">
 <ArrowLeft color="#232323"/>
 </button>
 </div>

 {/* ---- Hero ---- */}
 <div className="pd-hero">
 <h1 className="pd-title">{fund.name}</h1>
 <p className="pd-blurb">{fund.blurb}</p>
 </div>

 {/* ---- Tabs ---- */}
 <div className="pd-tabs">
 {[
 { id: "performance", label: "Performance" },
 { id: "projection", label: "Projection" },
 ].map(t => (
 <button
 key={t.id}
 className={"pd-tab" + (tab === t.id ? " on" : "")}
 onClick={() => setTab(t.id)}
 >
 {t.label}
 </button>
 ))}
 </div>

 {/* ---- PERFORMANCE TAB ---- */}
 {tab === "performance" && (
 <>
 {/* Chart card */}
 <div className="pd-card pd-chart-card">
 <div className="pd-chart-stats">
 <div>
 <div className="pd-stat-l">{activeLabel}</div>
 <div className="pd-stat-v" style={{ color: activeReturn >= 0 ? "#003036" : "#B35A5A" }}>
 {activeReturn >= 0 ? "+" : ""}{fmtPct(activeReturn, 1)}
 </div>
 </div>
 </div>
 <div
 ref={chartRef}
 className="pd-chart-interactive"
 onPointerDown={onPointerDown}
 onPointerMove={onPointerMove}
 onPointerUp={onPointerUp}
 onPointerCancel={onPointerUp}
 onPointerLeave={(e) => { if (cursor != null) setCursor(null); }}
 >
 <svg className="pd-chart-svg" viewBox={`0 0 ${CHART_W} ${CHART_H}`} preserveAspectRatio="none">
 <path d={perfPath + ` L ${CHART_W},${CHART_H} L 0,${CHART_H} Z`} fill="rgba(35,35,35,0.06)"/>
 <path d={perfPath} stroke="#232323" strokeWidth="1.5" fill="none"
 strokeLinecap="round" strokeLinejoin="round"/>
 {cursor != null && (
 <g>
 <line x1={cursorXY.x} y1="0" x2={cursorXY.x} y2={CHART_H}
 stroke="#232323" strokeWidth="0.8" strokeDasharray="2 2"/>
 <circle cx={cursorXY.x} cy={cursorXY.y} r="3.5"
 fill="#FDFAF5" stroke="#232323" strokeWidth="1.5"/>
 </g>
 )}
 </svg>
 </div>
 <div className="pd-chart-axis">
 {rCfg.axis.map((l, i) => <span key={i}>{l}</span>)}
 </div>
 {/* Range switcher */}
 <div className="pd-range-row">
 {["6M", "1Y", "2Y", "5Y"].map(r => (
 <button
 key={r}
 className={"pd-range-btn" + (range === r ? " on" : "")}
 onClick={() => { setRange(r); setCursor(null); }}
 >
 {r}
 </button>
 ))}
 </div>
 </div>

 {/* Composition - tabbed: Top 10 / Sector / Region / Assets */}
 <BreakdownCard
 groups={[
 {
 id: "holdings",
 label: "Top 10",
 rows: fund.topHoldings.map(h => ({ label: h.name, pct: +h.pct.toFixed(1) })),
 footnote: `Represents ${Math.round(fund.topHoldings.reduce((a,b)=>a+b.pct,0))}% of the fund. Updated monthly.`,
 },
 { id: "sector", label: "Sector", rows: fund.sectors },
 { id: "region", label: "Region", rows: fund.regions },
 { id: "asset", label: "Assets", rows: fund.assetAllocation },
 ]}
 />

 {/* Fund details */}
 <div className="pd-card">
 <div className="pd-section-title">Fund details</div>
 <div className="pd-kv-list">
 <div className="pd-kv"><span className="pd-kv-k">Fund name</span><span className="pd-kv-v">{fund.fundDetails.fundName}</span></div>
 <div className="pd-kv"><span className="pd-kv-k">Price ({fund.fundDetails.priceAsOf})</span><span className="pd-kv-v">{fund.fundDetails.price}</span></div>
 <div className="pd-kv"><span className="pd-kv-k">Structure</span><span className="pd-kv-v">{fund.fundDetails.structure}</span></div>
 <div className="pd-kv"><span className="pd-kv-k">Annual fee</span><span className="pd-kv-v">{fmtPct(fund.fee, 2)}</span></div>
 <div className="pd-kv"><span className="pd-kv-k">Minimum</span><span className="pd-kv-v">{fmtGBP(fund.min)}</span></div>
 </div>
 </div>

 {/* Who this suits */}
 <div className="pd-card">
 <div className="pd-section-title">Who this fund suits</div>
 <div className="pd-suits">
 {[
 `Investors with a ${fund.horizon} horizon`,
 `Risk level ${fund.risk} out of 5`,
 `Minimum investment ${fmtGBP(fund.min)}`,
 fund.id === "pe"
 ? "Semi-liquid - withdraw up to 25% at any time"
 : `Annual fee ${fmtPct(fund.fee, 2)}, net of which your returns are shown`,
 fund.id === "pe" && `Annual fee ${fmtPct(fund.fee, 2)}, net of which your returns are shown`,
 ].filter(Boolean).map((t, i) => (
 <div key={i} className="pd-suits-row">
 <TickIcon size={16}/>
 <span>{t}</span>
 </div>
 ))}
 </div>
 </div>
 </>
 )}

 {/* ---- PROJECTION TAB ---- */}
 {tab === "projection" && (
 <>
 <div className="pd-card pd-chart-card">
 <div className="pd-chart-stats">
 <div>
 <div className="pd-stat-l">You invest today</div>
 <div className="pd-stat-v">{fmtGBP(invested)}</div>
 </div>
 <div style={{ textAlign: "right" }}>
 <div className="pd-stat-l">
 {projCursor != null
 ? (projCursorYrs < 0.5 ? "Today" : `In ${projCursorYrs < 1 ? projCursorYrs.toFixed(1) : Math.round(projCursorYrs)} year${projCursorYrs < 1.5 && projCursorYrs >= 0.5 ? "" : "s"}`)
 : "Could be worth in 10 years"}
 </div>
 <div className="pd-stat-v">{fmtGBP(Math.round(projCursorVal))}</div>
 </div>
 </div>
 <div
 ref={projRef}
 className="pd-chart-interactive"
 onPointerDown={onProjDown}
 onPointerMove={onProjMove}
 onPointerUp={onProjUp}
 onPointerCancel={onProjUp}
 onPointerLeave={() => { if (projCursor != null) setProjCursor(null); }}
 >
 <svg className="pd-chart-svg pd-chart-svg-tall" viewBox={`0 0 ${PROJ_W} ${PROJ_H}`} preserveAspectRatio="none">
 {/* subtle baseline grid */}
 <line x1="0" y1="112" x2="300" y2="112" stroke="rgba(35,35,35,0.12)" strokeWidth="0.5"/>
 <line x1="0" y1="60" x2="300" y2="60" stroke="rgba(35,35,35,0.08)" strokeWidth="0.5" strokeDasharray="2 3"/>
 <path d={projPath + ` L ${PROJ_W},${PROJ_H} L 0,${PROJ_H} Z`} fill="rgba(35,35,35,0.07)"/>
 <path d={projPath} stroke="#232323" strokeWidth="1.6" fill="none"
 strokeLinecap="round" strokeLinejoin="round"/>
 {/* cursor line (only while scrubbing) */}
 {projCursor != null && (
 <line x1={projCursorX} y1="0" x2={projCursorX} y2={PROJ_H}
 stroke="#232323" strokeWidth="0.8" strokeDasharray="2 2"/>
 )}
 {/* dot - always visible; sits at end by default, or at the cursor */}
 <circle cx={projCursorX} cy={projCursorY} r="3.5"
 fill={projCursor != null ? "#FDFAF5" : "#232323"}
 stroke="#232323" strokeWidth={projCursor != null ? 1.5 : 0}/>
 </svg>
 </div>
 <div className="pd-chart-axis">
 <span>Year 0</span><span>2</span><span>4</span><span>6</span><span>8</span><span>10</span>
 </div>
 </div>

 {/* Milestone grid */}
 <div className="pd-card">
 <div className="pd-section-title">If {fmtGBP(invested)} stayed invested</div>
 <div className="pd-milestones">
 {[1, 3, 5, 10].map(y => (
 <div key={y} className="pd-milestone">
 <div className="pd-milestone-v">{fmtGBP(Math.round(projectGrowth(invested, fund, y)))}</div>
 <div className="pd-milestone-l">in {y} year{y > 1 ? "s" : ""}</div>
 </div>
 ))}
 </div>
 <div className="pd-footnote">
 Illustrative. Assumes {fmtPct(fund.fiveYr, 1)} average annual return, net of the {fmtPct(fund.fee, 2)} annual fee. Real returns vary year to year.
 </div>
 </div>

 {/* Who this suits (mirrored from performance for context) */}
 <div className="pd-card">
 <div className="pd-section-title">Who this fund suits</div>
 <div className="pd-suits">
 {[
 `Investors with a ${fund.horizon} horizon`,
 `Risk level ${fund.risk} out of 5`,
 `Minimum investment ${fmtGBP(fund.min)}`,
 ].map((t, i) => (
 <div key={i} className="pd-suits-row">
 <TickIcon size={16}/>
 <span>{t}</span>
 </div>
 ))}
 </div>
 </div>
 </>
 )}

 <div className="pd-disclosure">
 Capital at risk. The value of investments can fall and you may get back less than you invest. Tax treatment depends on individual circumstances and may change.
 </div>
 </div>

 {/* Sticky footer - primary CTA only, no watchlist */}
 <div className="bg-group">
 <Button label={fund.id === "pe" ? "Check eligibility" : "Invest now"} variant="primary" onClick={onInvest} showArrow/>
 </div>
 </div>
 );
};

// ---- PE Eligibility gate - sophisticated investor self-certification ----
const EligibilityScreen = ({ onBack, onContinue, amount }) => {
 const [checks, setChecks] = React.useState({
 sophisticated: false,
 illiquid: false,
 lossTolerance: false,
 });
 const allChecked = checks.sophisticated && checks.illiquid && checks.lossTolerance;
 const toggle = (k) => setChecks(c => ({ ...c, [k]: !c[k] }));

 const items = [
 {
 key: "sophisticated",
 label: "I qualify as a high-net-worth or sophisticated investor",
 note: "Annual income over £100k, or net assets over £250k (excluding primary residence and pension).",
 },
 {
 key: "illiquid",
 label: "I understand this is a semi-liquid investment",
 note: "I can withdraw up to 25% at any time; the rest has a 7-day notice period and monthly dealing window.",
 },
 {
 key: "lossTolerance",
 label: "I can afford to lose the amount I'm investing",
 note: "Private markets are higher-risk. You may lose some or all of your capital.",
 },
 ];

 return (
 <div className="screen" data-screen-label="12b Eligibility">
 <div className="phone-body" style={{ display: "flex", flexDirection: "column", background: "var(--color-secondary-100, #FDFAF5)" }}>
 <TopBar onBack={onBack}/>

 <div style={{ padding: "8px 24px 24px" }}>
 <div className="pill pill-neutral" style={{ marginBottom: 16 }}>Eligibility check</div>
 <div style={{ font: "500 32px/36px var(--font-display)", letterSpacing: "-0.8px", color: "var(--fg-1)" }}>
 Before you invest in private equity
 </div>
 <p style={{ font: "400 16px/22px var(--font-body)", color: "var(--fg-2)", marginTop: 14, textWrap: "pretty" }}>
 Private markets aren't for everyone. Confirm each of the following before we continue.
 </p>
 </div>

 <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "0 16px 16px" }}>
 {items.map(it => (
 <button
 key={it.key}
 onClick={() => toggle(it.key)}
 className="elig-row"
 style={{
 display: "flex",
 gap: 14,
 alignItems: "flex-start",
 background: "var(--color-secondary-200, #ECE4D3)",
 padding: "18px 20px",
 border: 0,
 textAlign: "left",
 cursor: "pointer",
 fontFamily: "inherit",
 color: "var(--fg-1)",
 }}
 >
 <span
 aria-hidden="true"
 style={{
 flexShrink: 0,
 width: 22, height: 22,
 marginTop: 2,
 border: `1.5px solid ${checks[it.key] ? "var(--color-primary-600)" : "rgba(0,0,0,0.35)"}`,
 background: checks[it.key] ? "var(--color-primary-600)" : "transparent",
 display: "flex", alignItems: "center", justifyContent: "center",
 }}
 >
 {checks[it.key] && (
 <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 12l5 5L20 7" stroke="#FDFAF5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
 )}
 </span>
 <span style={{ flex: 1 }}>
 <span style={{ display: "block", font: "600 15px/20px var(--font-body)", color: "var(--fg-1)" }}>{it.label}</span>
 <span style={{ display: "block", font: "400 13px/18px var(--font-body)", color: "var(--fg-2)", marginTop: 4 }}>{it.note}</span>
 </span>
 </button>
 ))}
 </div>

 <div style={{ padding: "8px 24px 32px" }}>
 <p style={{ font: "400 12px/17px var(--font-body)", color: "var(--fg-3)", textWrap: "pretty" }}>
 We ask this to meet FCA rules on restricted investments. By continuing you confirm the statements above are accurate.
 </p>
 </div>
 </div>

 <div className="bg-group">
 <Button
 label={allChecked ? "Continue" : "Confirm all to continue"}
 variant="primary"
 onClick={allChecked ? onContinue : undefined}
 showArrow={allChecked}
 disabled={!allChecked}
 />
 </div>
 </div>
 );
};

// ---- Amount + frequency screen (between detail/eligibility and confirm) ----
const FUNDING_SOURCE = {
 fundName: "Stocks & Shares ISA",
 available: 25000,
};

const PRESET_AMOUNTS_ONE = [1000, 5000, 10000, 25000];
const PRESET_AMOUNTS_MONTHLY = [100, 250, 500, 1000];

const AmountInvestScreen = ({ onBack, onContinue, fundName, defaultAmount = 5000, fundMin = 1000, fundMinMonthly = 100 }) => {
 const [amount, setAmount] = React.useState(defaultAmount);
 const [frequency, setFrequency] = React.useState("one-off"); // one-off | monthly
 const formatAmt = (n) => (Number(n) || 0).toLocaleString("en-GB");
 const [rawInput, setRawInput] = React.useState(formatAmt(defaultAmount));

 const commit = (v) => {
 const n = Math.max(0, Math.round(Number(v) || 0));
 setAmount(n);
 setRawInput(formatAmt(n));
 };

 const insufficient = frequency === "one-off" && amount > FUNDING_SOURCE.available;
 const effectiveMin = frequency === "monthly" ? fundMinMonthly : fundMin;
 const belowMin = amount < effectiveMin;
 const canContinue = amount > 0 && !belowMin && !insufficient;

 return (
 <div className="screen" data-screen-label="13 Amount">
 <div className="phone-body" style={{ display: "flex", flexDirection: "column", background: "var(--color-secondary-100, #FDFAF5)" }}>
 <TopBar onBack={onBack}/>

 <div style={{ padding: "8px 24px 24px" }}>
 <div className="pill pill-neutral" style={{ marginBottom: 16 }}>{fundName}</div>
 <div style={{ font: "500 32px/36px var(--font-display)", letterSpacing: "-0.8px", color: "var(--fg-1)" }}>
 How much do you want to invest?
 </div>
 </div>

 {/* Frequency toggle */}
 <div style={{ padding: "0 24px 20px" }}>
 <div className="freq-toggle" role="tablist" aria-label="Frequency">
 <button
 role="tab"
 aria-selected={frequency === "one-off"}
 className={"freq-toggle-opt" + (frequency === "one-off" ? " is-active" : "")}
 onClick={() => {
 setFrequency("one-off");
 if (amount < 1000) commit(5000);
 }}
 >
 One-off
 </button>
 <button
 role="tab"
 aria-selected={frequency === "monthly"}
 className={"freq-toggle-opt" + (frequency === "monthly" ? " is-active" : "")}
 onClick={() => {
 setFrequency("monthly");
 if (amount > 1000) commit(250);
 }}
 >
 Monthly
 </button>
 </div>
 </div>

 {/* Big amount input */}
 <div style={{ padding: "0 24px 16px" }}>
 <div className="amount-input-wrap">
 <span className="amount-input-sym">£</span>
 <input
 className="amount-input"
 type="text"
 inputMode="numeric"
 value={rawInput}
 onChange={(e) => {
 const cleaned = e.target.value.replace(/[^0-9]/g, "");
 const n = Math.round(Number(cleaned) || 0);
 setAmount(n);
 setRawInput(cleaned ? formatAmt(n) : "");
 }}
 onBlur={() => commit(amount)}
 aria-label="Amount"
 />
 {frequency === "monthly" && <span className="amount-input-suffix">/ month</span>}
 </div>
 <div style={{ font: "400 13px/18px var(--font-body)", color: "var(--fg-3)", marginTop: 8 }}>
 Minimum {fmtGBP(effectiveMin)}{frequency === "monthly" ? " per month" : ""}.
 </div>
 </div>

 {/* Preset pills */}
 <div style={{ padding: "4px 24px 24px" }}>
 <div className="amount-presets">
 {(frequency === "monthly" ? PRESET_AMOUNTS_MONTHLY : PRESET_AMOUNTS_ONE).map(v => (
 <button
 key={v}
 type="button"
 className={"amount-preset" + (amount === v ? " is-active" : "")}
 onClick={() => commit(v)}
 >
 {v >= 1000 ? `£${v/1000}k` : `£${v}`}
 </button>
 ))}
 </div>
 </div>

 {/* Funding source */}
 <div style={{ padding: "0 24px 32px" }}>
 <div className="funding-src">
 <div>
 <div className="funding-src-k">Funding from</div>
 <div className="funding-src-v">{FUNDING_SOURCE.fundName}</div>
 </div>
 <div style={{ textAlign: "right" }}>
 <div className="funding-src-k">Available</div>
 <div className="funding-src-v">{fmtGBP(FUNDING_SOURCE.available)}</div>
 </div>
 </div>
 {insufficient && (
 <div style={{ marginTop: 10, font: "400 13px/18px var(--font-body)", color: "#A04040" }}>
 You don't have enough in this account to cover a one-off investment of this size.
 </div>
 )}
 </div>
 </div>

 <div className="bg-group">
 <Button
 label="Continue"
 variant="primary"
 onClick={canContinue ? (() => onContinue({ amount, frequency })) : undefined}
 disabled={!canContinue}
 showArrow={canContinue}
 />
 </div>
 </div>
 );
};

// ---- Confetti-tick Lottie (used on the confirmation screen) ----
const ConfettiTickLottie = ({ size = 220 }) => {
 const holderRef = React.useRef(null);
 React.useEffect(() => {
 if (!holderRef.current || typeof window.lottie === "undefined") return;
 const anim = window.lottie.loadAnimation({
 container: holderRef.current,
 renderer: "svg",
 loop: true,
 autoplay: true,
 path: "assets/lottie/confetti-tick.json",
 rendererSettings: { preserveAspectRatio: "xMidYMid meet" },
 });
 return () => { try { anim.destroy(); } catch {} };
 }, []);
 // Aspect ratio of the source lottie (200 × 140).
 return <div ref={holderRef} style={{ width: size, height: size * (140 / 200) }} aria-hidden="true"/>;
};

// ---- Confirmation (light screen, matches flow vocabulary) ----
const ConfirmScreen = ({ onBack, onHome, fundName, amount, frequency = "one-off" }) => {
 // Stable reference per render of this confirmation
 const ref = React.useMemo(() => "MN-" + Math.floor(100000 + Math.random() * 900000), []);
 return (
 <div className="screen" data-screen-label="15 Confirmation">
 <div className="phone-body flow-screen" style={{ display: "flex", flexDirection: "column" }}>
 <TopBar onBack={onBack}/>

 <div className="content" style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", paddingTop: 40, textAlign: "center", alignItems: "center" }}>
 <div style={{ width: "100%" }}>
 <div
 style={{
 margin: "0 auto 12px",
 display: "flex", alignItems: "center", justifyContent: "center",
 }}
 aria-hidden="true"
 >
 <ConfettiTickLottie size={220}/>
 </div>

 <h2 className="q-title" style={{ textAlign: "center", margin: "24px 0", fontSize: 42, lineHeight: 1.2 }}>Your order has been placed</h2>
 <p className="q-sub" style={{ marginBottom: 24, textAlign: "center" }}>
 {frequency === "monthly"
 ? <>We're setting up your monthly investment of <b style={{ color: "var(--fg-1)" }}>{fmtGBP(amount)}</b> into <b style={{ color: "var(--fg-1)" }}>{fundName}</b>. The first contribution typically settles within two business days.</>
 : <>We're placing <b style={{ color: "var(--fg-1)" }}>{fmtGBP(amount)}</b> into <b style={{ color: "var(--fg-1)" }}>{fundName}</b>. It typically settles within two business days. We'll let you know the moment it's live.</>
 }
 </p>

 {/* Summary rows (flat, secondary-200 panel matching the funding-src treatment) */}
 <div
 style={{
 background: "var(--color-secondary-200, #F5F1E8)",
 border: "1px solid rgba(0, 48, 54, 0.08)",
 padding: "4px 16px",
 }}
 >
 {[
 ["Investment", fundName],
 ["Amount", frequency === "monthly" ? `${fmtGBP(amount)} / month` : fmtGBP(amount)],
 ["Funded from", "Stocks & Shares ISA"],
 ["Reference", ref],
 ].map(([k, v], i, arr) => (
 <div
 key={k}
 style={{
 display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
 padding: "12px 0",
 borderBottom: i < arr.length - 1 ? "1px solid rgba(0, 48, 54, 0.08)" : "none",
 }}
 >
 <span style={{ font: "400 14px/20px var(--font-body)", color: "var(--fg-3)" }}>{k}</span>
 <span style={{ font: "500 14px/20px var(--font-body)", color: "var(--fg-1)", textAlign: "right" }}>{v}</span>
 </div>
 ))}
 </div>
 </div>
 </div>

 <div className="bg-group">
 <Button label="Back to home" variant="primary" onClick={onHome}/>
 </div>
 </div>
 </div>
 );
};

// ---- Holding detail (Stocks & Shares ISA drill-in from Home) ----
const HoldingDetail = ({ holdings = [], onBack }) => {
 const total = holdings.reduce((s, h) => (h.frequency === "one-off" ? s + (h.amount || 0) : s), 0);
 const monthly = holdings.reduce((s, h) => (h.frequency === "monthly" ? s + (h.amount || 0) : s), 0);

 // Group holdings by fundId and aggregate
 const byFund = {};
 holdings.forEach(h => {
 const k = h.fundId;
 if (!byFund[k]) byFund[k] = { fundId: k, fundName: h.fundName, oneOff: 0, monthly: 0, count: 0, last: 0 };
 byFund[k].count += 1;
 if (h.frequency === "monthly") byFund[k].monthly += (h.amount || 0);
 else byFund[k].oneOff += (h.amount || 0);
 if ((h.placedAt || 0) > byFund[k].last) byFund[k].last = h.placedAt || 0;
 });
 const rows = Object.values(byFund).sort((a, b) => b.last - a.last);

 const fmtDate = (ts) => {
 if (!ts) return "";
 const d = new Date(ts);
 return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
 };

 return (
 <div className="screen" data-screen-label="16 Holding detail">
 <div className="phone-body flow-screen" style={{ display: "flex", flexDirection: "column" }}>
 <TopBar onBack={onBack}/>

 <div style={{ padding: "8px 24px 0" }}>
 <div className="pill pill-neutral" style={{ marginBottom: 12 }}>Stocks & Shares ISA</div>
 <div style={{ font: "400 13px/18px var(--font-body)", color: "var(--fg-3)", marginBottom: 2 }}>Total invested</div>
 <div style={{ font: "500 40px/44px var(--font-display)", letterSpacing: "-1px", color: "var(--fg-1)" }}>
 {fmtGBP(total)}
 </div>
 {monthly > 0 && (
 <div style={{ font: "400 14px/20px var(--font-body)", color: "var(--fg-2)", marginTop: 6 }}>
 + {fmtGBP(monthly)} / month recurring
 </div>
 )}
 </div>

 <div style={{ padding: "24px 24px 12px", font: "500 12px/16px var(--font-body)", color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: "0.8px" }}>
 Holdings
 </div>

 <div style={{ padding: "0 24px 24px", display: "flex", flexDirection: "column", gap: 0 }}>
 {rows.map((r, i) => (
 <div
 key={r.fundId}
 style={{
 display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12,
 padding: "16px 0",
 borderTop: "1px solid rgba(0, 48, 54, 0.12)",
 borderBottom: i === rows.length - 1 ? "1px solid rgba(0, 48, 54, 0.12)" : "none",
 }}
 >
 <div style={{ flex: 1, minWidth: 0 }}>
 <div style={{ font: "500 16px/22px var(--font-body)", color: "var(--fg-1)", letterSpacing: "-0.2px", textWrap: "pretty" }}>
 {r.fundName}
 </div>
 <div style={{ font: "400 13px/18px var(--font-body)", color: "var(--fg-3)", marginTop: 2 }}>
 {r.count} {r.count === 1 ? "order" : "orders"}
 {r.monthly > 0 && ` · ${fmtGBP(r.monthly)}/mo`}
 {r.last ? ` · last ${fmtDate(r.last)}` : ""}
 </div>
 </div>
 <div style={{ textAlign: "right", flexShrink: 0 }}>
 <div style={{ font: "500 16px/22px var(--font-body)", color: "var(--fg-1)" }}>
 {fmtGBP(r.oneOff)}
 </div>
 {r.monthly > 0 && r.oneOff === 0 && (
 <div style={{ font: "400 12px/16px var(--font-body)", color: "var(--fg-3)" }}>Monthly only</div>
 )}
 </div>
 </div>
 ))}
 </div>

 <div style={{ padding: "0 24px 32px" }}>
 <div
 style={{
 background: "var(--color-secondary-200, #F5F1E8)",
 border: "1px solid rgba(0, 48, 54, 0.08)",
 padding: "14px 16px",
 font: "400 13px/18px var(--font-body)",
 color: "var(--fg-2)",
 }}
 >
 Settled holdings will show a live value within 48 hours of your first purchase. Future contributions and monthly payments appear here automatically.
 </div>
 </div>
 </div>
 </div>
 );
};

Object.assign(window, { ResultScreen, FundDetail, EligibilityScreen, AmountInvestScreen, ConfirmScreen, HoldingDetail, buildReasons });
