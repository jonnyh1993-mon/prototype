// screens-lombard.jsx - Borrow against your assets (Lombard credit line) journey
// Model: pledge collateral → approved for a credit line → draw down as needed.
//
// Order:
// 1 Intro carousel 2 Capacity reveal 3 Purpose 4 Pledge 5 Risks
// 6 Approved (credit line) 7 Drawdown amount 8 Repayment preview
// 9 Review 10 Success

// ---------------- CONSTANTS ----------------
const MAX_LTV = 0.5;
const BOE_RATE = 3.75;
const SPREAD = 1.5;
const LOMBARD_APR = BOE_RATE + SPREAD;
const BENCH_APR = 9.9;

// ELIGIBLE_ASSETS now comes from the shared accounts store (see accounts.jsx)
// - bank accounts are static, investment accounts derive from holdings. Each
// Lombard component that needs them accepts an `eligibleAssets` prop.

const LOMBARD_PURPOSES = [
 { id: "home-reno", title: "Home renovation", sub: "Kitchen, extension, refurbishment" },
 { id: "property", title: "Property deposit or bridging",sub: "Complete a purchase before you sell" },
 { id: "car", title: "Car finance", sub: "Avoid dealer finance APRs" },
 { id: "opportunity", title: "Investment opportunity", sub: "Deploy capital without selling down" },
 { id: "consolidate", title: "Consolidate debt", sub: "Pay off higher-APR balances" },
 { id: "tax", title: "Tax bill", sub: "Fund a liability without disturbing investments" },
];

// ---------------- EDITORIAL ILLUSTRATIONS ----------------
const IllusKeepGrowing = () => (
 <svg viewBox="0 0 320 280" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
 <rect x="0" y="0" width="320" height="280" fill="#F5F1E8"/>
 <text x="24" y="40" fontFamily="system-ui" fontSize="11" fontWeight="600" fill="#003036" letterSpacing="1.2">
 PORTFOLIO · UNTOUCHED
 </text>
 <text x="24" y="56" fontFamily="system-ui" fontSize="10" fill="#66969C">
 Keeps compounding while you borrow
 </text>
 <g transform="translate(24 96)">
 <line x1="0" y1="120" x2="272" y2="120" stroke="#D8D1C0" strokeWidth="1"/>
 <polyline points="0,96 40,88 80,78 120,66 160,54 200,40 240,24 272,12"
 fill="none" stroke="#003036" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round"/>
 <polyline points="0,70 40,66 80,62 120,62 160,58 200,58 240,54 272,54"
 fill="none" stroke="#A36300" strokeWidth="3" strokeDasharray="2 6" strokeLinecap="round"/>
 <circle cx="272" cy="12" r="5" fill="#003036"/>
 <circle cx="272" cy="54" r="4" fill="#A36300"/>
 </g>
 <g transform="translate(24 240)">
 <rect x="0" y="0" width="14" height="3" fill="#003036"/>
 <text x="20" y="4" fontFamily="system-ui" fontSize="10" fontWeight="500" fill="#003036">Your portfolio</text>
 <rect x="140" y="0" width="14" height="3" fill="#A36300"/>
 <text x="160" y="4" fontFamily="system-ui" fontSize="10" fontWeight="500" fill="#66969C">Loan drawdown</text>
 </g>
 <line x1="24" y1="256" x2="100" y2="256" stroke="#A36300" strokeWidth="2"/>
 </svg>
);

const IllusRateCompare = () => (
 <svg viewBox="0 0 320 280" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
 <rect x="0" y="0" width="320" height="280" fill="#F5F1E8"/>
 <text x="24" y="40" fontFamily="system-ui" fontSize="11" fontWeight="600" fill="#003036" letterSpacing="1.2">
 YOUR RATE
 </text>
 <text x="24" y="56" fontFamily="system-ui" fontSize="10" fill="#66969C">
 Bank of England + 1.5% margin
 </text>
 <text x="24" y="156" fontFamily="Georgia, serif" fontSize="96" fontWeight="500" fill="#003036" letterSpacing="-5">
 5.25<tspan fontSize="44" dy="-24">%</tspan>
 </text>
 <g transform="translate(24 188)">
 <text x="0" y="0" fontFamily="system-ui" fontSize="11" fontWeight="600" fill="#003036" letterSpacing="1.2">
 HIGH-STREET AVG
 </text>
 <text x="0" y="38" fontFamily="Georgia, serif" fontSize="40" fontWeight="500" fill="#99B9BD" letterSpacing="-1.5">
 9.9<tspan fontSize="20" dy="-10">%</tspan>
 </text>
 <line x1="0" y1="28" x2="120" y2="28" stroke="#A36300" strokeWidth="2"/>
 </g>
 <text x="24" y="262" fontFamily="system-ui" fontSize="10" fontWeight="500" fill="#003036">
 CHEAPER · TRANSPARENT
 </text>
 <line x1="24" y1="270" x2="140" y2="270" stroke="#A36300" strokeWidth="2"/>
 </svg>
);

const IllusTaxEfficient = () => (
 <svg viewBox="0 0 320 280" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
 <rect x="0" y="0" width="320" height="280" fill="#F5F1E8"/>
 <text x="24" y="40" fontFamily="system-ui" fontSize="11" fontWeight="600" fill="#003036" letterSpacing="1.2">
 DON'T SELL · DON'T TRIGGER CGT
 </text>
 <text x="24" y="56" fontFamily="system-ui" fontSize="10" fill="#66969C">
 Pledge your assets instead
 </text>
 <g transform="translate(24 88)">
 <rect x="0" y="0" width="124" height="140" fill="#EDE8DA"/>
 <text x="12" y="20" fontFamily="system-ui" fontSize="10" fontWeight="600" fill="#66969C" letterSpacing="1">
 SELL £50k
 </text>
 <text x="12" y="64" fontFamily="Georgia, serif" fontSize="34" fontWeight="500" fill="#66969C" letterSpacing="-1">
 −£4.2k
 </text>
 <text x="12" y="84" fontFamily="system-ui" fontSize="10" fill="#66969C">Capital gains tax</text>
 <text x="12" y="116" fontFamily="system-ui" fontSize="10" fontWeight="500" fill="#66969C">Growth forfeited</text>

 <rect x="148" y="0" width="124" height="140" fill="#003036"/>
 <text x="160" y="20" fontFamily="system-ui" fontSize="10" fontWeight="600" fill="#F5F1E8" letterSpacing="1">
 PLEDGE £50k
 </text>
 <text x="160" y="64" fontFamily="Georgia, serif" fontSize="34" fontWeight="500" fill="#F5F1E8" letterSpacing="-1">
 £0
 </text>
 <text x="160" y="84" fontFamily="system-ui" fontSize="10" fill="#99B9BD">Capital gains tax</text>
 <text x="160" y="116" fontFamily="system-ui" fontSize="10" fontWeight="500" fill="#F5F1E8">Portfolio stays invested</text>
 </g>
 <text x="24" y="252" fontFamily="system-ui" fontSize="11" fontWeight="600" fill="#003036">TAX EFFICIENT</text>
 <line x1="24" y1="260" x2="98" y2="260" stroke="#A36300" strokeWidth="2"/>
 </svg>
);

const LOMBARD_SLIDES_EDITORIAL = [
 { title: "Keep your investments growing while you borrow",
 body: "Your portfolio stays invested and compounds. Use it as collateral instead of selling.",
 image: "assets/lombard-1.png" },
 { title: "Cheaper than a high-street loan",
 body: "Bank of England base rate plus a 1.5% margin. No hidden fees, no early repayment penalties.",
 image: "assets/lombard-2.png" },
 { title: "Avoid selling and triggering tax",
 body: "Pledging assets means no capital gains event. Keep your allowance, keep your position.",
 image: "assets/lombard-3.png" },
];

const LOMBARD_SLIDES_TYPE = [
 { kicker: "01 / KEEP INVESTING",
 title: "Your money\nstays at work.",
 body: "Pledge your portfolio instead of selling it. Every pound keeps compounding while you spend." },
 { kicker: "02 / THE RATE",
 title: "BoE\n+ 1.5%.",
 body: `Currently ${LOMBARD_APR.toFixed(2)}%. Roughly half what a high-street personal loan costs.` },
 { kicker: "03 / NO TAX EVENT",
 title: "Nothing\ngets sold.",
 body: "Collateralise, don't liquidate. Your gains stay unrealised and your CGT allowance stays untouched." },
];

// ---------------- 1. CAROUSEL ----------------
const LombardCarousel = ({ variant = "editorial", onBack, onContinue }) => {
 const [slide, setSlide] = React.useState(0);
 const slides = variant === "type" ? LOMBARD_SLIDES_TYPE : LOMBARD_SLIDES_EDITORIAL;
 const last = slides.length - 1;
 const goto = (i) => setSlide(Math.max(0, Math.min(last, i)));
 const next = () => slide < last ? setSlide(slide + 1) : onContinue();

 const touchX = React.useRef(null);
 const onTouchStart = e => { touchX.current = e.touches[0].clientX; };
 const onTouchEnd = e => {
 if (touchX.current == null) return;
 const dx = e.changedTouches[0].clientX - touchX.current;
 if (Math.abs(dx) > 40) (dx < 0) ? next() : goto(slide - 1);
 touchX.current = null;
 };
 const mouseX = React.useRef(null);
 const onMouseDown = e => { mouseX.current = e.clientX; };
 const onMouseUp = e => {
 if (mouseX.current == null) return;
 const dx = e.clientX - mouseX.current;
 if (Math.abs(dx) > 40) (dx < 0) ? next() : goto(slide - 1);
 mouseX.current = null;
 };

 const cta = slide < last ? "Continue" : "See how much you can borrow";

 return (
 <div className="screen" data-screen-label="L01 Borrow intro">
 <div className="phone-body carousel-body">
 <div className="topbar carousel-topbar">
 <button className="topbar-back" onClick={() => slide > 0 ? goto(slide - 1) : onBack()} aria-label="Back">
 <ArrowLeft color="#232323"/>
 </button>
 <div className="carousel-dots">
 {slides.map((_, i) => (
 <button key={i} className={"c-dot" + (i === slide ? " active" : "")}
 onClick={() => goto(i)} aria-label={`Slide ${i+1}`}/>
 ))}
 </div>
 <button className="topbar-skip" onClick={onContinue}>Skip</button>
 </div>

 <div className="carousel-viewport"
 onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
 onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
 <div className="carousel-track" style={{ transform: `translateX(-${slide * 100}%)` }}>
 {slides.map((sl, i) => variant === "type" ? (
 <div className="carousel-slide lombard-type-slide" key={i}>
 <div className="lombard-type-kicker">{sl.kicker}</div>
 <div className="lombard-type-title" style={{ whiteSpace: "pre-line" }}>{sl.title}</div>
 <div className="lombard-type-body">{sl.body}</div>
 <div className="lombard-type-rule"/>
 </div>
 ) : (
 <div className="carousel-slide" key={i}>
 <div className={"carousel-illus" + (sl.image ? " carousel-illus-img" : "")}>
 {sl.image ? <img src={sl.image} alt="" draggable={false}/> : <sl.Illus/>}
 </div>
 <div className="carousel-copy">
 <div className="title">{sl.title}</div>
 <div className="lede">{sl.body}</div>
 </div>
 </div>
 ))}
 </div>
 </div>

 <div className="carousel-footer">
 <Button label={cta} variant="primary" onClick={next} showArrow/>
 </div>
 </div>
 </div>
 );
};

// ---------------- 2. CAPACITY REVEAL ----------------
// Premium editorial layout: the headline amount owns the top of the page,
// eligible assets sit in their own titled section with a Vesta-Broad header,
// and each row has enough room to read comfortably.
const LombardCapacity = ({ eligibleAssets = [], onBack, onExit, onContinue }) => {
 const total = eligibleAssets.reduce((s, a) => s + a.value, 0);
 const capacity = Math.floor(total * MAX_LTV);
 // Pensions can't be pledged - surface that so users don't wonder why their SIPP is missing.
 const excludedSipp = (window.INVESTMENT_WRAPPERS || []).find(w => w.eligibleForLombard === false);

 return (
 <div className="screen" data-screen-label="L02 Capacity">
 <div className="phone-body flow-screen" style={{ display: "flex", flexDirection: "column" }}>
 <TopBar onBack={onBack} onClose={onExit || onBack} closeLabel="Exit"/>
 <div className="content">
 <div className="lombard-capacity-hero" style={{ background: "var(--color-secondary-200)", padding: "32px 24px", textAlign: "center", margin: "8px 0 24px" }}>
 <div className="lombard-capacity-label" style={{ color: "var(--fg-1)" }}>YOU COULD BORROW UP TO</div>
 <div className="lombard-capacity-amount" style={{ color: "var(--fg-1)" }}>{fmtGBP(capacity)}</div>
 <div className="lombard-capacity-sub" style={{ color: "var(--fg-1)" }}>
 Based on 50% of your eligible assets at Monument.
 </div>
 </div>

 <div className="lombard-capacity-section">
 <div className="lombard-capacity-section-head">
 <h3 className="lombard-capacity-section-title" style={{ color: "var(--fg-1)" }}>Eligible assets</h3>
 <div className="lombard-capacity-section-count" style={{ color: "var(--fg-1)" }}>{eligibleAssets.length} account{eligibleAssets.length === 1 ? "" : "s"}</div>
 </div>
 <div className="lombard-capacity-list" style={{ display: "flex", flexDirection: "column", gap: 0 }}>
 {eligibleAssets.map(a => (
 <div className="lombard-capacity-row" key={a.id} style={{ background: "var(--color-secondary-200)", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
 <div className="lombard-capacity-row-main" style={{ flex: 1, minWidth: 0 }}>
 <div className="lombard-capacity-row-title" style={{ color: "var(--fg-1)" }}>{a.title}</div>
 </div>
 <div className="lombard-capacity-row-amount" style={{ flexShrink: 0, color: "var(--fg-1)" }}>{fmtGBP(a.value, 2)}</div>
 </div>
 ))}
 <div className="lombard-capacity-row total" style={{ background: "var(--color-secondary-200)", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginTop: 4 }}>
 <div className="lombard-capacity-row-main" style={{ flex: 1, minWidth: 0 }}>
 <div className="lombard-capacity-row-title" style={{ color: "var(--fg-1)" }}>Total eligible</div>
 </div>
 <div className="lombard-capacity-row-amount" style={{ flexShrink: 0, color: "var(--fg-1)" }}>{fmtGBP(total, 2)}</div>
 </div>
 </div>
 </div>

 <div className="lombard-disclosure">
 Final amount depends on which assets you pledge. Your rate is {LOMBARD_APR.toFixed(2)}% APR
 (BoE {BOE_RATE}% + 1.5%).
 {excludedSipp && <> Pensions (SIPP) can't be used as collateral under FCA rules.</>}
 </div>
 </div>
 <div className="bg-group">
 <Button label="Start loan application" variant="primary" onClick={onContinue} showArrow/>
 </div>
 </div>
 </div>
 );
};

// ---------------- 3. PURPOSE ----------------
const LombardPurpose = ({ value, onChange, onBack, onExit, onContinue }) => (
 <div className="screen" data-screen-label="L03 Purpose">
 <div className="phone-body flow-screen" style={{ display: "flex", flexDirection: "column" }}>
 <TopBar onBack={onBack} onClose={onExit || onBack} closeLabel="Exit"/>
 <div className="content">
 <h2 className="q-title">What is the purpose of your loan?</h2>
 <p className="q-sub">Helps us tailor your credit line and confirm suitability.</p>
 <div>
 {LOMBARD_PURPOSES.map(p => (
 <button
 key={p.id}
 className="option option-chev"
 onClick={() => { onChange(p.id); setTimeout(onContinue, 180); }}
 >
 <span className="option-body">
 <span className="option-title">{p.title}</span>
 <span className="option-sub">{p.sub}</span>
 </span>
 <span className="option-chev"><ChevR/></span>
 </button>
 ))}
 </div>
 </div>
 </div>
 </div>
);

// ---------------- 4. PLEDGE ----------------
const LombardPledge = ({ eligibleAssets = [], pledged, onChangePledged, onBack, onExit, onContinue }) => {
 const set = new Set(pledged);
 const toggle = (id) => {
 const n = new Set(set);
 n.has(id) ? n.delete(id) : n.add(id);
 onChangePledged([...n]);
 };

 const totalEligible = eligibleAssets.reduce((s, a) => s + a.value, 0);
 const totalPledged = eligibleAssets.filter(a => set.has(a.id)).reduce((s, a) => s + a.value, 0);
 const capacity = Math.floor(totalPledged * MAX_LTV);
 const canContinue = set.size > 0;

 return (
 <div className="screen" data-screen-label="L04 Pledge">
 <div className="phone-body flow-screen" style={{ display: "flex", flexDirection: "column" }}>
 <TopBar onBack={onBack} onClose={onExit || onBack} closeLabel="Exit"/>
 <div className="content">
 <h2 className="q-title" style={{ marginBottom: 4 }}>Pledge your collateral</h2>
 <p className="q-sub" style={{ marginBottom: 20 }}>
 Choose which holdings to use as security. Pledged assets can't be sold or withdrawn while your
 credit line is open - but you keep ownership and all the upside.
 </p>

 {/* BIG credit line hero - this is the main thing on the screen */}
 <div className="lombard-pledge-hero" style={{
 background: "var(--color-secondary-200)",
 borderRadius: 0,
 padding: "28px 20px 24px",
 margin: "8px 0 24px",
 textAlign: "center",
 }}>
 <div style={{ fontSize: 14, letterSpacing: 1.2, fontWeight: 600, color: "var(--fg-2)", textTransform: "uppercase", marginBottom: 8 }}>
 Credit line you'd unlock
 </div>
 <div style={{
 fontFamily: "var(--font-display), Georgia, serif",
 fontSize: 56,
 fontWeight: 500,
 color: "#003036",
 letterSpacing: -1.5,
 lineHeight: 1,
 }}>
 {fmtGBP(capacity)}
 </div>
 <div style={{ fontSize: 14, color: "var(--fg-2)", marginTop: 10 }}>
 {set.size === 0 ? "Select assets below to pledge" : `${set.size} of ${eligibleAssets.length} pledged · 50% of their value`}
 </div>
 <div className="lombard-pledge-bar" style={{ marginTop: 14 }}>
 <div className="lombard-pledge-bar-fill"
 style={{ width: Math.min(100, totalEligible > 0 ? (totalPledged / totalEligible) * 100 : 0) + "%",
 background: "#003036" }}/>
 </div>
 </div>

 <div>
 {eligibleAssets.map(a => (
 <button
 key={a.id}
 className={"option" + (set.has(a.id) ? " selected" : "")}
 onClick={() => toggle(a.id)}
 >
 <span className="option-body">
 <span className="option-title">{a.title}</span>
 <span className="option-sub">{fmtGBP(a.value, 2)}</span>
 </span>
 <span className="option-box"/>
 </button>
 ))}
 </div>
 </div>
 <div className="bg-group">
 <Button
 label={canContinue ? "Continue" : "Select at least one"}
 variant="primary"
 onClick={onContinue}
 disabled={!canContinue}
 showArrow
 />
 </div>
 </div>
 </div>
 );
};

// ---------------- 5. ELIGIBILITY / RISK ----------------
const LombardEligibility = ({ onBack, onExit, onContinue }) => (
 <div className="screen" data-screen-label="L05 Eligibility">
 <div className="phone-body flow-screen" style={{ display: "flex", flexDirection: "column" }}>
 <TopBar onBack={onBack} onClose={onExit || onBack} closeLabel="Exit"/>
 <div className="content">
 <h2 className="q-title" style={{ marginBottom: 4 }}>A few things to know</h2>
 <p className="q-sub" style={{ marginBottom: 20 }}>
 Borrowing against assets carries real risk. Please read each point carefully.
 </p>

 <ul className="lombard-risk-list">
 <li>
 <div className="lombard-risk-title" style={{ color: "var(--fg-1)" }}>Your pledged assets secure the credit line</div>
 <div className="lombard-risk-body" style={{ fontSize: 16, lineHeight: 1.5 }}>If their value falls significantly, we may ask you to pledge more or reduce your balance ("margin call").</div>
 </li>
 <li>
 <div className="lombard-risk-title" style={{ color: "var(--fg-1)" }}>The rate is variable</div>
 <div className="lombard-risk-body" style={{ fontSize: 16, lineHeight: 1.5 }}>Tracks the Bank of England base rate plus a 1.5% margin. If base rate rises, interest rises with it.</div>
 </li>
 <li>
 <div className="lombard-risk-title" style={{ color: "var(--fg-1)" }}>Pledged assets are locked</div>
 <div className="lombard-risk-body" style={{ fontSize: 16, lineHeight: 1.5 }}>You keep ownership and upside, but can't sell, withdraw or transfer pledged holdings while the credit line is open.</div>
 </li>
 <li>
 <div className="lombard-risk-title" style={{ color: "var(--fg-1)" }}>Capital at risk</div>
 <div className="lombard-risk-body" style={{ fontSize: 16, lineHeight: 1.5 }}>If you can't repay, Monument may sell pledged assets to recover the balance. This could trigger a CGT event.</div>
 </li>
 </ul>
 </div>
 <div className="bg-group">
 <Button label="I understand" variant="primary" onClick={onContinue} showArrow/>
 </div>
 </div>
 </div>
);

// ---------------- 6. APPROVED (CREDIT LINE OPEN) ----------------
const LombardApproved = ({ eligibleAssets = [], pledged, onContinue }) => {
 const totalPledged = eligibleAssets.filter(a => pledged.includes(a.id)).reduce((s, a) => s + a.value, 0);
 const capacity = Math.floor(totalPledged * MAX_LTV);

 return (
 <div className="screen" data-screen-label="L06 Approved">
 <div className="phone-body flow-screen" style={{ display: "flex", flexDirection: "column" }}>
 <TopBar/>
 <div className="content" style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", paddingTop: 40, textAlign: "center", alignItems: "center" }}>
 <div style={{ width: "100%" }}>
 <div style={{ margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center" }} aria-hidden="true">
 <ConfettiTickLottie size={220}/>
 </div>
 <h2 className="q-title" style={{ textAlign: "center", margin: "24px 0", fontSize: 30, lineHeight: 1.2 }}>Your credit line is open</h2>
 <p className="q-sub" style={{ marginBottom: 24, textAlign: "center" }}>
 <b style={{ color: "var(--fg-1)" }}>{fmtGBP(capacity)}</b> is ready to draw down. Your {pledged.length} pledged {pledged.length === 1 ? "holding is" : "holdings are"} now locked as collateral. Interest only accrues on what you use.
 </p>
 <div style={{ background: "var(--color-secondary-200, #F5F1E8)", border: "1px solid rgba(0, 48, 54, 0.08)", padding: "4px 16px" }}>
 {[
 ["Credit line", fmtGBP(capacity)],
 ["Rate", `${LOMBARD_APR.toFixed(2)}% APR`],
 ["Pledged collateral", fmtGBP(totalPledged, 2)],
 ].map(([k, v], i, arr) => (
 <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: "16px 0", borderBottom: i < arr.length - 1 ? "1px solid rgba(0, 48, 54, 0.08)" : "none" }}>
 <span style={{ font: "400 16px/20px var(--font-body)", color: "var(--fg-2)" }}>{k}</span>
 <span style={{ font: "500 15px/20px var(--font-body)", color: "var(--fg-1)", textAlign: "right" }}>{v}</span>
 </div>
 ))}
 </div>
 </div>
 </div>
 <div className="bg-group">
 <Button label="Drawdown now" variant="primary" onClick={onContinue} showArrow/>
 </div>
 </div>
 </div>
 );
};

// ---------------- 7. DRAWDOWN ----------------
const LombardDrawdown = ({ eligibleAssets = [], value, onChange, pledged, onBack, onExit, onContinue }) => {
 const totalPledged = eligibleAssets.filter(a => pledged.includes(a.id)).reduce((s, a) => s + a.value, 0);
 const capacity = Math.floor(totalPledged * MAX_LTV);
 const min = 500;
 const max = Math.max(min, capacity);
 const initial = value != null ? Math.min(value, max) : Math.round(max * 0.25);
 const v = Math.max(min, Math.min(max, initial));
 const pct = max === min ? 0 : ((v - min) / (max - min)) * 100;
 const presets = [5000, 10000, 25000, 50000].filter(p => p <= max);

 return (
 <div className="screen" data-screen-label="L07 Drawdown">
 <div className="phone-body flow-screen" style={{ display: "flex", flexDirection: "column" }}>
 <TopBar onBack={onBack} onClose={onExit || onBack} closeLabel="Exit"/>
 <div className="content">
 <h2 className="q-title" style={{ marginBottom: 4 }}>How much do you want to draw down right now?</h2>
 <p className="q-sub" style={{ marginBottom: 0 }}>
 Interest only accrues on what you use. You can draw again from your credit line anytime.
 </p>

 <div className="amount-display">{fmtGBP(v)}</div>
 <div className="amount-sub" style={{ fontSize: 16 }}>of {fmtGBP(capacity)} available</div>

 <div style={{ padding: "0 8px" }}>
 <div className="slider-track">
 <div className="slider-fill" style={{ width: pct + "%" }}/>
 <div className="slider-thumb" style={{ left: pct + "%" }}/>
 <input
 type="range" min={min} max={max} step={500}
 value={v}
 onChange={e => onChange(parseInt(e.target.value))}
 className="slider-input"
 />
 </div>
 <div className="slider-labels">
 <span style={{ fontSize: 16 }}>{fmtGBP(min)}</span>
 <span style={{ fontSize: 16 }}>{fmtGBP(max)}</span>
 </div>
 </div>

 <div className="bucket-chips">
 {presets.map(p => (
 <button key={p} className={"chip" + (v === p ? " active" : "")} style={{ fontSize: 16 }} onClick={() => onChange(p)}>
 {fmtGBP(p)}
 </button>
 ))}
 </div>

 <div className="lombard-collateral-hint" style={{ fontSize: 16, textAlign: "center", padding: "16px 14px" }}>
 Funds will be available immediately
 </div>
 </div>
 <div className="bg-group">
 <Button label="Choose a repayment period" variant="primary" onClick={onContinue} showArrow/>
 </div>
 </div>
 </div>
 );
};

// ---------------- 8. REPAYMENT PREVIEW ----------------
const monthlyPayment = (principal, annualRatePct, months) => {
 const r = (annualRatePct / 100) / 12;
 if (r === 0) return principal / months;
 return (principal * r) / (1 - Math.pow(1 + r, -months));
};

const LombardPreview = ({ amount, term, onChangeTerm, onBack, onExit, onContinue }) => {
 const months = term;
 const mMonument = monthlyPayment(amount, LOMBARD_APR, months);
 const mHighStreet = monthlyPayment(amount, BENCH_APR, months);
 const savings = (mHighStreet * months) - (mMonument * months);

 const terms = [
 { months: 12, label: "1 yr" },
 { months: 36, label: "3 yrs" },
 { months: 60, label: "5 yrs" },
 { months: 120, label: "10 yrs" },
 ];

 return (
 <div className="screen" data-screen-label="L08 Repayment preview">
 <div className="phone-body flow-screen" style={{ display: "flex", flexDirection: "column" }}>
 <TopBar onBack={onBack} onClose={onExit || onBack} closeLabel="Exit"/>
 <div className="content">
 <h2 className="q-title" style={{ marginBottom: 4 }}>Your repayments</h2>
 <p className="q-sub" style={{ marginBottom: 20 }}>
 {fmtGBP(amount)} drawdown at {LOMBARD_APR.toFixed(2)}% APR (BoE {BOE_RATE}% + 1.5%).
 </p>

 <div className="lombard-term-switch" role="tablist">
 {terms.map(t => (
 <button
 key={t.months}
 role="tab"
 aria-selected={term === t.months}
 className={"lombard-term" + (term === t.months ? " active" : "")}
 style={{ fontSize: 14 }}
 onClick={() => onChangeTerm(t.months)}
 >{t.label}</button>
 ))}
 </div>

 <div className="lombard-repay-card">
 <div className="lombard-repay-row primary">
 <div>
 <div className="lombard-repay-label" style={{ fontSize: 16, fontWeight: 700 }}>Monthly with Monument</div>
 <div className="lombard-repay-sub" style={{ fontSize: 16 }}>{LOMBARD_APR.toFixed(2)}% APR</div>
 </div>
 <div className="lombard-repay-amount" style={{ fontSize: 30 }}>{fmtGBP(Math.round(mMonument))}</div>
 </div>
 <div className="lombard-repay-divider"/>
 <div className="lombard-repay-row faded">
 <div>
 <div className="lombard-repay-label" style={{ fontSize: 16 }}>At a high-street bank</div>
 <div className="lombard-repay-sub" style={{ fontSize: 14 }}>{BENCH_APR}% APR · typical personal loan</div>
 </div>
 <div className="lombard-repay-amount strike">{fmtGBP(Math.round(mHighStreet))}</div>
 </div>
 </div>

 <div className="lombard-savings-card">
 <div className="lombard-savings-eyebrow" style={{ textAlign: "center", fontSize: 15 }}>YOU SAVE</div>
 <div className="lombard-savings-big" style={{ textAlign: "center" }}>{fmtGBP(Math.round(savings))}</div>
 <div className="lombard-savings-sub" style={{ textAlign: "center", fontSize: 16 }}>
 Over {Math.floor(months / 12)} {months / 12 === 1 ? "year" : "years"} vs a typical personal loan.
 </div>
 </div>

 <div className="lombard-disclosure" style={{ fontSize: 15, color: "rgb(35,35,35)", padding: 0 }}>
 Variable rate - moves with Bank of England base rate. Interest capitalised monthly.
 </div>
 </div>
 <div className="bg-group">
 <Button label="Review drawdown" variant="primary" onClick={onContinue} showArrow/>
 </div>
 </div>
 </div>
 );
};

// ---------------- 9. REVIEW ----------------
const LombardReview = ({ amount, term, purpose, pledged, onBack, onExit, onConfirm }) => {
 const mMonument = monthlyPayment(amount, LOMBARD_APR, term);
 const purposeLabel = LOMBARD_PURPOSES.find(p => p.id === purpose)?.title || " - ";

 return (
 <div className="screen" data-screen-label="L09 Review">
 <div className="phone-body flow-screen" style={{ display: "flex", flexDirection: "column" }}>
 <TopBar onBack={onBack} onClose={onExit || onBack} closeLabel="Exit"/>
 <div className="content">
 <h2 className="q-title" style={{ marginBottom: 4 }}>Confirm your drawdown</h2>
 <p className="q-sub" style={{ marginBottom: 24 }}>
 Funds will be immediately available in your Easy Access Savings.
 </p>

 <dl className="lombard-review" style={{ background: "var(--color-secondary-200, #F5F1E8)", borderRadius: 0, padding: "8px 16px", margin: 0, fontSize: 16, color: "#232323" }}>
 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: "1px solid rgba(0,0,0,0.06)" }}><dt style={{ fontSize: 16, color: "#232323", fontWeight: 500 }}>Drawdown</dt><dd style={{ margin: 0, fontSize: 16, color: "#232323", fontVariantNumeric: "tabular-nums" }}>{fmtGBP(amount)}</dd></div>
 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: "1px solid rgba(0,0,0,0.06)" }}><dt style={{ fontSize: 16, color: "#232323", fontWeight: 500 }}>Purpose</dt><dd style={{ margin: 0, fontSize: 16, color: "#232323" }}>{purposeLabel}</dd></div>
 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: "1px solid rgba(0,0,0,0.06)" }}><dt style={{ fontSize: 16, color: "#232323", fontWeight: 500 }}>Repayment term</dt><dd style={{ margin: 0, fontSize: 16, color: "#232323" }}>{Math.floor(term / 12)} {term / 12 === 1 ? "year" : "years"}</dd></div>
 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: "1px solid rgba(0,0,0,0.06)" }}><dt style={{ fontSize: 16, color: "#232323", fontWeight: 500 }}>Rate</dt><dd style={{ margin: 0, fontSize: 16, color: "#232323", fontVariantNumeric: "tabular-nums" }}>{LOMBARD_APR.toFixed(2)}% APR (BoE + 1.5%)</dd></div>
 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: "1px solid rgba(0,0,0,0.06)" }}><dt style={{ fontSize: 16, color: "#232323", fontWeight: 500 }}>Monthly</dt><dd style={{ margin: 0, fontSize: 16, color: "#232323", fontVariantNumeric: "tabular-nums" }}>{fmtGBP(Math.round(mMonument))}</dd></div>
 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0" }}><dt style={{ fontSize: 16, color: "#232323", fontWeight: 500 }}>Pledged</dt><dd style={{ margin: 0, fontSize: 16, color: "#232323" }}>{pledged.length} {pledged.length === 1 ? "holding" : "holdings"}</dd></div>
 </dl>

 <div className="lombard-disclosure" style={{ background: "transparent", borderRadius: 0, padding: "14px 0px", marginTop: 0, fontSize: 16, color: "#232323", lineHeight: 1.45 }}>
 By confirming, you agree to the variable-rate terms and acknowledge the risks of secured borrowing.
 </div>
 </div>
 <div className="bg-group">
 <Button label="Confirm drawdown" variant="primary" onClick={onConfirm} showArrow/>
 </div>
 </div>
 </div>
 );
};

// ---------------- 10. SUCCESS ----------------
const LombardSuccess = ({ amount, term, purpose, onBack, onHome }) => {
 const ref = React.useMemo(() => "MN-" + Math.floor(100000 + Math.random() * 900000), []);
 const purposeLabel = LOMBARD_PURPOSES.find(p => p.id === purpose)?.title || "Drawdown";
 const termLabel = term ? `${Math.floor(term / 12)} ${term / 12 === 1 ? "year" : "years"}` : "—";

 return (
 <div className="screen" data-screen-label="L10 Success">
 <div className="phone-body flow-screen" style={{ display: "flex", flexDirection: "column" }}>
 <TopBar onBack={onBack}/>

 <div className="content" style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", paddingTop: 40, textAlign: "center", alignItems: "center" }}>
 <div style={{ width: "100%" }}>
 <div
 style={{ margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center" }}
 aria-hidden="true"
 >
 <ConfettiTickLottie size={220}/>
 </div>

 <h2 className="q-title" style={{ textAlign: "center", margin: "24px 0", fontSize: 30, lineHeight: 1.2 }}>Your drawdown is complete</h2>
 <p className="q-sub" style={{ marginBottom: 24, textAlign: "center" }}>
 <b style={{ color: "var(--fg-1)" }}>{fmtGBP(amount)}</b> is immediately available in your <b style={{ color: "var(--fg-1)" }}>Easy Access Savings</b>. Your first repayment is due next month, and you can draw again from your credit line anytime.
 </p>

 <div
 style={{
 background: "var(--color-secondary-200, #F5F1E8)",
 border: "1px solid rgba(0, 48, 54, 0.08)",
 padding: "4px 16px",
 }}
 >
 {[
 ["Drawdown", fmtGBP(amount)],
 ["Purpose", purposeLabel],
 ["Repayment term", termLabel],
 ["Rate", `${LOMBARD_APR.toFixed(2)}% APR`],
 ["Landed in", "Easy Access Savings"],
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
 <span style={{ font: "400 14px/20px var(--font-body)", color: "var(--fg-2)" }}>{k}</span>
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

// ---------------- EXPORTS ----------------
Object.assign(window, {
 LombardCarousel, LombardCapacity, LombardPurpose, LombardPledge,
 LombardEligibility, LombardApproved, LombardDrawdown, LombardPreview,
 LombardReview, LombardSuccess,
 LOMBARD_APR, BOE_RATE, MAX_LTV, LOMBARD_PURPOSES,
});
