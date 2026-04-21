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
 { id: "car", title: "New car", sub: "Avoid dealer finance APRs" },
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
 Illus: IllusKeepGrowing },
 { title: "Cheaper than a high-street loan",
 body: "Bank of England base rate plus a 1.5% margin. No hidden fees, no early repayment penalties.",
 Illus: IllusRateCompare },
 { title: "Avoid selling and triggering tax",
 body: "Pledging assets means no capital gains event. Keep your allowance, keep your position.",
 Illus: IllusTaxEfficient },
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
 <div className="carousel-illus"><sl.Illus/></div>
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
 <div className="lombard-capacity-hero">
 <div className="lombard-capacity-label">YOU COULD BORROW UP TO</div>
 <div className="lombard-capacity-amount">{fmtGBP(capacity)}</div>
 <div className="lombard-capacity-sub">
 Based on 50% of your eligible assets at Monument.
 </div>
 </div>

 <div className="lombard-capacity-section">
 <div className="lombard-capacity-section-head">
 <h3 className="lombard-capacity-section-title">Eligible assets</h3>
 <div className="lombard-capacity-section-count">{eligibleAssets.length} account{eligibleAssets.length === 1 ? "" : "s"}</div>
 </div>
 <div className="lombard-capacity-list">
 {eligibleAssets.map(a => (
 <div className="lombard-capacity-row" key={a.id}>
 <div className="lombard-capacity-row-main">
 <div className="lombard-capacity-row-title">{a.title}</div>
 <div className="lombard-capacity-row-sub">{a.sub}</div>
 </div>
 <div className="lombard-capacity-row-amount">{fmtGBP(a.value, 2)}</div>
 </div>
 ))}
 <div className="lombard-capacity-divider"/>
 <div className="lombard-capacity-row total">
 <div className="lombard-capacity-row-main">
 <div className="lombard-capacity-row-title">Total eligible</div>
 </div>
 <div className="lombard-capacity-row-amount">{fmtGBP(total, 2)}</div>
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
 <h2 className="q-title">What would you use it for?</h2>
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
 <div className="lombard-risk-title">Your pledged assets secure the credit line</div>
 <div className="lombard-risk-body">If their value falls significantly, we may ask you to pledge more or reduce your balance ("margin call").</div>
 </li>
 <li>
 <div className="lombard-risk-title">The rate is variable</div>
 <div className="lombard-risk-body">Tracks the Bank of England base rate plus a 1.5% margin. If base rate rises, interest rises with it.</div>
 </li>
 <li>
 <div className="lombard-risk-title">Pledged assets are locked</div>
 <div className="lombard-risk-body">You keep ownership and upside, but can't sell, withdraw or transfer pledged holdings while the credit line is open.</div>
 </li>
 <li>
 <div className="lombard-risk-title">Capital at risk</div>
 <div className="lombard-risk-body">If you can't repay, Monument may sell pledged assets to recover the balance. This could trigger a CGT event.</div>
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
 <div className="phone-body flow-screen" style={{ display: "flex", flexDirection: "column", background: "var(--color-secondary-200)" }}>
 <div className="content" style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start", paddingTop: 32 }}>
 <div className="lombard-success-mark">
 <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden="true">
 <circle cx="28" cy="28" r="27" stroke="#003036" strokeWidth="1.5"/>
 <path d="M17 29l8 8 15-18" stroke="#003036" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
 </svg>
 </div>
 <div className="lombard-success-eyebrow">CREDIT LINE OPEN</div>
 <h1 className="lombard-success-title">{fmtGBP(capacity)}<br/>ready to use.</h1>
 <p className="lombard-success-sub" style={{ marginBottom: 18 }}>
 Your {pledged.length} pledged {pledged.length === 1 ? "holding is" : "holdings are"} now locked
 as collateral. Draw down whenever you need it - interest only accrues on what you use.
 </p>
 <div className="lombard-approved-meta">
 <div><span>Rate</span><strong>{LOMBARD_APR.toFixed(2)}% APR</strong></div>
 <div><span>Pledged</span><strong>{fmtGBP(totalPledged, 2)}</strong></div>
 </div>
 </div>
 <div className="bg-group">
 <Button label="Draw down now" variant="primary" onClick={onContinue} showArrow/>
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
 <div className="pill pill-stone" style={{ marginBottom: 14 }}>Drawdown</div>
 <h2 className="q-title" style={{ marginBottom: 4 }}>How much do you want to draw down right now?</h2>
 <p className="q-sub" style={{ marginBottom: 0 }}>
 Interest only accrues on what you use. You can draw again from your credit line anytime.
 </p>

 <div className="amount-display">{fmtGBP(v)}</div>
 <div className="amount-sub">of {fmtGBP(capacity)} available</div>

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
 <span>{fmtGBP(min)}</span>
 <span>{fmtGBP(max)}</span>
 </div>
 </div>

 <div className="bucket-chips">
 {presets.map(p => (
 <button key={p} className={"chip" + (v === p ? " active" : "")} onClick={() => onChange(p)}>
 {fmtGBP(p)}
 </button>
 ))}
 </div>

 <div className="lombard-collateral-hint">
 Funds land in your Easy Access Savings account within 1 working day.
 </div>
 </div>
 <div className="bg-group">
 <Button label="Continue" variant="primary" onClick={onContinue} showArrow/>
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
 <div className="pill pill-stone" style={{ marginBottom: 14 }}>Repayment plan</div>
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
 onClick={() => onChangeTerm(t.months)}
 >{t.label}</button>
 ))}
 </div>

 <div className="lombard-repay-card">
 <div className="lombard-repay-row primary">
 <div>
 <div className="lombard-repay-label">Monthly with Monument</div>
 <div className="lombard-repay-sub">{LOMBARD_APR.toFixed(2)}% APR</div>
 </div>
 <div className="lombard-repay-amount">{fmtGBP(Math.round(mMonument))}</div>
 </div>
 <div className="lombard-repay-divider"/>
 <div className="lombard-repay-row faded">
 <div>
 <div className="lombard-repay-label">At a high-street bank</div>
 <div className="lombard-repay-sub">{BENCH_APR}% APR · typical personal loan</div>
 </div>
 <div className="lombard-repay-amount strike">{fmtGBP(Math.round(mHighStreet))}</div>
 </div>
 </div>

 <div className="lombard-savings-card">
 <div className="lombard-savings-eyebrow">YOU SAVE</div>
 <div className="lombard-savings-big">{fmtGBP(Math.round(savings))}</div>
 <div className="lombard-savings-sub">
 Over {Math.floor(months / 12)} {months / 12 === 1 ? "year" : "years"} vs a typical personal loan.
 </div>
 </div>

 <div className="lombard-disclosure">
 Variable rate - moves with Bank of England base rate. Interest capitalised monthly.
 </div>
 </div>
 <div className="bg-group">
 <Button label="Continue" variant="primary" onClick={onContinue} showArrow/>
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
 <div className="pill pill-stone" style={{ marginBottom: 14 }}>Final review</div>
 <h2 className="q-title" style={{ marginBottom: 4 }}>Confirm your drawdown</h2>
 <p className="q-sub" style={{ marginBottom: 24 }}>
 Funds will land in your Easy Access Savings account within 1 working day.
 </p>

 <dl className="lombard-review">
 <div><dt>Drawdown</dt><dd>{fmtGBP(amount)}</dd></div>
 <div><dt>Purpose</dt><dd>{purposeLabel}</dd></div>
 <div><dt>Repayment term</dt><dd>{Math.floor(term / 12)} {term / 12 === 1 ? "year" : "years"}</dd></div>
 <div><dt>Rate</dt><dd>{LOMBARD_APR.toFixed(2)}% APR (BoE + 1.5%)</dd></div>
 <div><dt>Monthly</dt><dd>{fmtGBP(Math.round(mMonument))}</dd></div>
 <div><dt>Pledged</dt><dd>{pledged.length} {pledged.length === 1 ? "holding" : "holdings"}</dd></div>
 </dl>

 <div className="lombard-disclosure">
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
const LombardSuccess = ({ amount, onHome }) => (
 <div className="screen" data-screen-label="L10 Success">
 <div className="phone-body flow-screen" style={{ display: "flex", flexDirection: "column", background: "var(--color-secondary-200)" }}>
 <div className="content" style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start", paddingTop: 40 }}>
 <div className="lombard-success-mark">
 <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden="true">
 <circle cx="28" cy="28" r="27" stroke="#003036" strokeWidth="1.5"/>
 <path d="M17 29l8 8 15-18" stroke="#003036" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
 </svg>
 </div>
 <div className="lombard-success-eyebrow">DRAWDOWN CONFIRMED</div>
 <h1 className="lombard-success-title">{fmtGBP(amount)}<br/>on its way.</h1>
 <p className="lombard-success-sub">
 Funds will land in your Easy Access Savings account within 1 working day.
 Your first repayment is due next month, and you can draw again from your credit line anytime.
 </p>
 </div>
 <div className="bg-group">
 <Button label="Back to home" variant="primary" onClick={onHome} showArrow/>
 </div>
 </div>
 </div>
);

// ---------------- EXPORTS ----------------
Object.assign(window, {
 LombardCarousel, LombardCapacity, LombardPurpose, LombardPledge,
 LombardEligibility, LombardApproved, LombardDrawdown, LombardPreview,
 LombardReview, LombardSuccess,
 LOMBARD_APR, BOE_RATE, MAX_LTV, LOMBARD_PURPOSES,
});
