// screens-entry.jsx - Home, Investments intro, and Help-me-pick intro

// ------------ HOME SCREEN ------------
const HomeScreen = ({ onOpenInvestments, onOpenHolding, onOpenBorrow, holdings = [], loans = [], staticMode = false }) => {
 // Intro: full-bleed teal splash with "Good afternoon, Wasim" for ~1.2s,
 // then cross-fade into the regular home. No per-row stagger/shimmer.
 // Only play once per session so re-entries don't replay the splash.
 const alreadySeen = (() => { try { return sessionStorage.getItem("inv_home_seen") === "1"; } catch { return false; } })();
 const [splash, setSplash] = React.useState(!(staticMode || alreadySeen));

 React.useEffect(() => {
 if (staticMode || alreadySeen) return;
 const t = setTimeout(() => {
 setSplash(false);
 try { sessionStorage.setItem("inv_home_seen", "1"); } catch {}
 }, 3400);
 return () => clearTimeout(t);
 }, [staticMode, alreadySeen]);

 // Single source of truth: accounts store. Bank accounts are static;
 // investment wrappers have a seeded base value plus anything added via
 // the invest flow (from `holdings`), so the home screen stays in sync
 // with the Lombard flow (same numbers, same accounts, no drift).
 const bank = getBankAccounts(loans);
 const invAccts = getInvestmentAccounts(holdings);
 const bankTotal = bank.reduce((s, a) => s + a.value, 0);
 const invTotal = invAccts.reduce((s, a) => s + a.value, 0);
 const hasHoldings = invAccts.length > 0;
 const totalLoan = loans.reduce((s, l) => s + (l.amount || 0), 0);
 const hasLoan = loans.length > 0;
 const netWorth = bankTotal + invTotal - totalLoan;

 return (
 <div className="screen screen-home" data-screen-label="01 Home">
 {splash && (
 <div className="home-splash">
 <div className="home-splash-text">Good afternoon, Wasim</div>
 </div>
 )}
 <div className="phone-body">
 <div className="home-hero" style={{padding: "64px 24px", margin: 0}}>
 <div className="home-networth" style={{ position: "static" }}>
 <div className="home-balance-label" style={{textAlign: "center", fontSize: 14}}>Net worth</div>
 <div className="home-balance" style={{textAlign: "center"}}>£{netWorth.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
 <div className="home-perf" style={{textAlign: "center", fontSize: 16}}>▲ £6,719.20 this month</div>
 </div>
 </div>

 <div className={"section-heading"} style={{fontSize: 16, padding: "32px 16px 16px"}}>Savings accounts</div>
 <div className="list-group">
 {bank.map((a, i) => (
 <button key={a.id} className={"listrow"}>
 <span className="listrow-body">
 <span className="listrow-title" style={{fontSize: 16}}>{a.title}</span>
 <span className="listrow-sub">{a.sub}</span>
 </span>
 <span className="listrow-value"><span className="listrow-val">£{a.value.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></span>
 <ChevR/>
 </button>
 ))}
 </div>

 {hasHoldings && (() => {
 const nonPension = invAccts.filter(a => a.wrapper !== "pension");
 const pension = invAccts.filter(a => a.wrapper === "pension");
 const renderRow = (a, i, delayStart) => (
 <button
 key={a.id}
 className={"listrow"}
 onClick={() => onOpenHolding && onOpenHolding(a.id)}
 >
 <span className="listrow-body">
 <span className="listrow-title" style={{fontSize: 16}}>{a.title}</span>
 <span className="listrow-sub">
 {a.holdings.length > 0
 ? <>{a.holdings.length} {a.holdings.length === 1 ? "holding" : "holdings"}{a.monthly > 0 && ` · +£${a.monthly.toLocaleString("en-GB")}/mo`}</>
 : a.sub}
 </span>
 </span>
 <span className="listrow-value">
 <span className="listrow-val">£{a.value.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
 </span>
 <ChevR/>
 </button>
 );
 return (
 <React.Fragment>
 {nonPension.length > 0 && (
 <React.Fragment>
 <div className={"section-heading"} style={{fontSize: 16, padding: "32px 16px 16px"}}>Investments</div>
 <div className="list-group">
 {nonPension.map((a, i) => renderRow(a, i, 240))}
 </div>
 </React.Fragment>
 )}
 {pension.length > 0 && (
 <React.Fragment>
 <div className={"section-heading"} style={{fontSize: 16, padding: "32px 16px 16px"}}>Pension</div>
 <div className="list-group">
 {pension.map((a, i) => renderRow(a, i, 300))}
 </div>
 </React.Fragment>
 )}
 </React.Fragment>
 );
 })()}

 {hasLoan && (
 <React.Fragment>
 <div className={"section-heading"} style={{fontSize: 16, padding: "32px 16px 16px"}}>Borrowing</div>
 <div className="list-group">
 <button className={"listrow"}>
 <span className="listrow-body">
 <span className="listrow-title" style={{fontSize: 16}}>Lombard loan</span>
 <span className="listrow-sub">{LOMBARD_APR.toFixed(2)}% APR · secured against your portfolio</span>
 </span>
 <span className="listrow-value"><span className="listrow-val">−£{totalLoan.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></span>
 <ChevR/>
 </button>
 </div>
 </React.Fragment>
 )}

 <div className={"section-heading"} style={{fontSize: 16, padding: "32px 16px 16px"}}>Do more with Monument</div>
 <div className="list-group">
 <button className={"listrow highlight"} style={{background: "var(--color-secondary-200)", padding: 24, gap: 16}} onClick={onOpenInvestments}>
 <span className="listrow-icon" style={{ background: "transparent", borderRadius: 0, overflow: "visible" }}>
 <img src="assets/icons/home-investments.png" alt="" style={{ width: 44, height: 44, objectFit: "contain" }}/>
 </span>
 <span className="listrow-body">
 <span className="listrow-title" style={{fontSize: 16}}>Investments</span>
 <span className="listrow-sub">Hand-picked funds, ETFs, ETCs and investment trusts picked by experts.</span>
 </span>
 <ChevR/>
 </button>
 <button className={"listrow"} style={{padding: 24, gap: 16}} onClick={onOpenBorrow}>
 <span className="listrow-icon" style={{ background: "transparent", borderRadius: 0, overflow: "visible" }}>
 <img src="assets/icons/home-lending.png" alt="" style={{ width: 44, height: 44, objectFit: "contain" }}/>
 </span>
 <span className="listrow-body">
 <span className="listrow-title" style={{fontSize: 16}}>Borrow against your assets</span>
 <span className="listrow-sub">Rates start at 5.5%</span>
 </span>
 <ChevR/>
 </button>
 </div>
 </div>

 {/* Tab bar */}
 <div className="tabbar">
 <button className="tab active">
 <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 11l9-8 9 8M5 10v10h14V10" strokeWidth="1.8"/></svg>
 <span className="tab-label">Home</span>
 </button>
 <button className="tab" onClick={onOpenInvestments}>
 <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 20V10M10 20V4M16 20v-8M22 20v-4" strokeWidth="1.8" strokeLinecap="round"/></svg>
 <span className="tab-label">Invest</span>
 </button>
 <button className="tab" onClick={() => { window.location.href = "https://gizmo-gulf-75578847.figma.site/"; }}>
 <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M5 8h14l-1 12H6L5 8zM9 8V5a3 3 0 016 0v3" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
 <span className="tab-label">Lifestyle</span>
 </button>
 <button className="tab" onClick={() => window.dispatchEvent(new CustomEvent("proto:reset"))}>
 <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" strokeWidth="1.8"/><path d="M4 20c1-4 5-6 8-6s7 2 8 6" strokeWidth="1.8" strokeLinecap="round"/></svg>
 <span className="tab-label">Profile</span>
 </button>
 </div>
 </div>
 );
};

// ------------ INVESTMENTS LANDING ------------
// Editorial "data card" style illustrations - bold flat shapes in Monument palette
// inspired by Kurzgesagt-style data-viz moodboard
const IllusCommittee = () => (
 <svg viewBox="0 0 320 280" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
 {/* card background, cream */}
 <rect x="0" y="0" width="320" height="280" rx="2" fill="#F5F1E8"/>

 {/* eyebrow label */}
 <text x="24" y="40" fontFamily="var(--font-body), system-ui" fontSize="11" fontWeight="600" fill="#003036" letterSpacing="1.2">
 FUNDS UNIVERSE
 </text>
 <text x="24" y="56" fontFamily="var(--font-body), system-ui" fontSize="10" fill="#66969C">
 5,000+ reviewed → 25 selected
 </text>

 {/* big numeral "25" */}
 <text x="24" y="180" fontFamily="var(--font-display), Georgia, serif" fontSize="120" fontWeight="500" fill="#003036" letterSpacing="-5">
 25
 </text>

 {/* dot grid - cream dots, 25 gold ones highlighted */}
 <g transform="translate(156 76)">
 {Array.from({length: 8*10}).map((_, i) => {
 const col = i % 8, row = Math.floor(i / 8);
 const highlighted = [2,5,9,11,14,17,19,22,25,28,31,34,37,40,43,46,49,52,55,58,61,64,67,70,73].includes(i);
 return (
 <circle
 key={i}
 cx={col * 18}
 cy={row * 18}
 r={highlighted ? 6 : 3}
 fill={highlighted ? "#A36300" : "#D8D1C0"}
 />
 );
 })}
 </g>

 {/* caption */}
 <text x="24" y="244" fontFamily="var(--font-body), system-ui" fontSize="11" fontWeight="600" fill="#003036">
 HAND-PICKED
 </text>
 <line x1="24" y1="252" x2="96" y2="252" stroke="#A36300" strokeWidth="2"/>
 </svg>
);

const IllusInsight = () => (
 <svg viewBox="0 0 320 280" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
 <rect x="0" y="0" width="320" height="280" rx="2" fill="#F5F1E8"/>

 {/* header */}
 <text x="24" y="40" fontFamily="var(--font-body), system-ui" fontSize="11" fontWeight="600" fill="#003036" letterSpacing="1.2">
 QUARTERLY OUTLOOK
 </text>
 <text x="24" y="56" fontFamily="var(--font-body), system-ui" fontSize="10" fill="#66969C">
 Q2 2026 · Investment Committee
 </text>

 {/* ascending bar chart */}
 <g transform="translate(24 90)">
 {[
 {l: "Growth", v: 78, c: "#003036"},
 {l: "Income", v: 56, c: "#66969C"},
 {l: "Balanced", v: 92, c: "#A36300"},
 {l: "Global", v: 44, c: "#99B9BD"},
 {l: "Ethical", v: 66, c: "#00505A"},
 ].map((b, i) => (
 <g key={i} transform={`translate(${i * 56} 0)`}>
 <rect x="0" y={120 - b.v} width="40" height={b.v} fill={b.c}/>
 <text x="20" y={135} fontFamily="var(--font-body), system-ui" fontSize="9" fontWeight="500" fill="#66969C" textAnchor="middle">
 {b.l}
 </text>
 </g>
 ))}
 </g>

 {/* commentary lines */}
 <g transform="translate(24 232)">
 <rect x="0" y="0" width="220" height="3" fill="#003036"/>
 <rect x="0" y="10" width="180" height="3" fill="#99B9BD"/>
 <rect x="0" y="20" width="140" height="3" fill="#D8D1C0"/>
 </g>
 </svg>
);

const IllusGoals = () => (
 <svg viewBox="0 0 320 280" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
 {/* outer cream card, gives the whole illustration affordance on dark page bg */}
 <rect x="0" y="0" width="320" height="280" rx="2" fill="#F5F1E8"/>

 {/* ISA half, cream */}
 <rect x="0" y="0" width="160" height="280" fill="#F5F1E8"/>
 <text x="20" y="40" fontFamily="var(--font-body), system-ui" fontSize="11" fontWeight="600" fill="#003036" letterSpacing="1.2">
 ISA ALLOWANCE
 </text>
 <text x="20" y="56" fontFamily="var(--font-body), system-ui" fontSize="10" fill="#66969C">
 Tax year 2025/26
 </text>
 <text x="20" y="196" fontFamily="var(--font-display), Georgia, serif" fontSize="58" fontWeight="500" fill="#003036" letterSpacing="-2">
 £20k
 </text>
 <text x="20" y="222" fontFamily="var(--font-body), system-ui" fontSize="10" fontWeight="500" fill="#003036">
 Stocks &amp; Shares ISA
 </text>
 <line x1="20" y1="230" x2="120" y2="230" stroke="#A36300" strokeWidth="2"/>

 {/* divider */}
 <line x1="160" y1="16" x2="160" y2="264" stroke="#D8D1C0" strokeWidth="1" strokeDasharray="2 4"/>

 {/* GIA half, stays cream (no teal-on-teal clash) with a teal accent instead */}
 <text x="180" y="40" fontFamily="var(--font-body), system-ui" fontSize="11" fontWeight="600" fill="#003036" letterSpacing="1.2">
 GENERAL ACCOUNT
 </text>
 <text x="180" y="56" fontFamily="var(--font-body), system-ui" fontSize="10" fill="#66969C">
 No annual limit
 </text>

 {/* teal infinity badge with clear affordance */}
 <rect x="180" y="128" width="120" height="80" rx="2" fill="#003036"/>
 <text x="240" y="188" textAnchor="middle" fontFamily="var(--font-display), Georgia, serif" fontSize="56" fontWeight="500" fill="#F5F1E8" letterSpacing="-2">
 ∞
 </text>

 <text x="180" y="222" fontFamily="var(--font-body), system-ui" fontSize="10" fontWeight="500" fill="#003036">
 General Investment Acc.
 </text>
 <line x1="180" y1="230" x2="280" y2="230" stroke="#A36300" strokeWidth="2"/>
 </svg>
);

const IllusPicker = () => (
 <svg viewBox="0 0 320 280" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
 <rect x="0" y="0" width="320" height="280" rx="2" fill="#F5F1E8"/>
 <text x="24" y="40" fontFamily="var(--font-body), system-ui" fontSize="11" fontWeight="600" fill="#003036" letterSpacing="1.2">
 TWO WAYS IN
 </text>
 {/* Two big circles labelled */}
 <circle cx="100" cy="170" r="70" fill="#003036"/>
 <text x="100" y="166" textAnchor="middle" fontFamily="var(--font-display), Georgia, serif" fontSize="32" fontWeight="500" fill="#F5F1E8">
 Help
 </text>
 <text x="100" y="192" textAnchor="middle" fontFamily="var(--font-display), Georgia, serif" fontSize="32" fontWeight="500" fill="#F5F1E8">
 me pick
 </text>

 <circle cx="236" cy="170" r="52" fill="#A36300"/>
 <text x="236" y="166" textAnchor="middle" fontFamily="var(--font-display), Georgia, serif" fontSize="22" fontWeight="500" fill="#F5F1E8">
 Browse
 </text>
 <text x="236" y="186" textAnchor="middle" fontFamily="var(--font-display), Georgia, serif" fontSize="22" fontWeight="500" fill="#F5F1E8">
 all
 </text>
 </svg>
);

const LANDING_SLIDES = [
 {
 kind: "story",
 eyebrow: null,
 title: "Pick from a curated set of funds",
 body: "Access best-in-class funds selected by our Investment Committee.",
 image: "assets/landing-1.png",
 },
 {
 kind: "story",
 eyebrow: null,
 title: "Make decisions backed by expert insights",
 body: "We’ll provide you with the insights to help you decide where to invest.",
 image: "assets/landing-2.png",
 },
 {
 kind: "story",
 eyebrow: null,
 title: "Access hard to buy assets",
 body: "Buy private equity, tokenised investments, alternative assets and more.",
 image: "assets/landing-3.png",
 },
 {
 kind: "story",
 eyebrow: null,
 title: "Manage everything in one place",
 body: "One fee, no transaction fees or trading fees.",
 image: "assets/landing-3.png",
 },
];

// Picker screen - separate full screen on default cream background
const InvestmentsPicker = ({ onBack, onHelpPick, onBrowse, onOpenAccount }) => {
 return (
 <div className="screen" data-screen-label="02b Picker">
 <div className="phone-body picker-screen">
 <div className="topbar">
 <button className="topbar-back" onClick={onBack} aria-label="Back">
 <ArrowLeft/>
 </button>
 <div style={{ flex: 1 }}/>
 </div>

 <div className="picker-hero">
 <div className="picker-eyebrow">Investments</div>
 <div className="picker-title" style={{ fontSize: 36 }}>How would you like to begin?</div>
 </div>

 <nav className="picker-menu" aria-label="Investment options">
 <button className="picker-row picker-row-featured" onClick={onHelpPick}>
 <div className="picker-index">01</div>
 <div className="picker-body">
 <div className="picker-t">Help me choose investments</div>
 <div className="picker-s">Answer a few short questions.</div>
 </div>
 <div className="picker-arrow">→</div>
 </button>

 <button className="picker-row" onClick={onBrowse}>
 <div className="picker-index">02</div>
 <div className="picker-body">
 <div className="picker-t">Browse all funds</div>
 <div className="picker-s">See the full curated lineup and decide for yourself.</div>
 </div>
 <div className="picker-arrow">→</div>
 </button>

 <button className="picker-row" onClick={onOpenAccount}>
 <div className="picker-index">03</div>
 <div className="picker-body">
 <div className="picker-t">Transfer in an account</div>
 <div className="picker-s">Set up an ISA or GIA now, choose investments later.</div>
 </div>
 <div className="picker-arrow">→</div>
 </button>
 </nav>

 <div className="picker-foot">
 <div className="disclosure">
 The value of your investments can go down as well as up and you may get back less than you invest. Capital at risk.
 </div>
 </div>
 </div>
 </div>
 );
};

const InvestmentsLanding = ({ onBack, onContinue }) => {
 const [slide, setSlide] = React.useState(0);
 const last = LANDING_SLIDES.length - 1;

 const goto = (i) => setSlide(Math.max(0, Math.min(last, i)));
 const next = () => {
 if (slide < last) setSlide(slide + 1);
 else onContinue();
 };

 // Touch / swipe
 const touchX = React.useRef(null);
 const onTouchStart = e => { touchX.current = e.touches[0].clientX; };
 const onTouchEnd = e => {
 if (touchX.current == null) return;
 const dx = e.changedTouches[0].clientX - touchX.current;
 if (Math.abs(dx) > 40) {
 if (dx < 0) next();
 if (dx > 0) goto(slide - 1);
 }
 touchX.current = null;
 };

 // Mouse drag (desktop preview)
 const mouseX = React.useRef(null);
 const onMouseDown = e => { mouseX.current = e.clientX; };
 const onMouseUp = e => {
 if (mouseX.current == null) return;
 const dx = e.clientX - mouseX.current;
 if (Math.abs(dx) > 40) {
 if (dx < 0) next();
 if (dx > 0) goto(slide - 1);
 }
 mouseX.current = null;
 };

 return (
 <div className="screen" data-screen-label="02 Investments landing">
 <div className="phone-body carousel-body">
 <div className="topbar carousel-topbar">
 <button className="topbar-back" onClick={() => slide > 0 ? goto(slide - 1) : onBack()} aria-label="Back">
 <ArrowLeft color="#232323"/>
 </button>
 <div className="carousel-dots">
 {LANDING_SLIDES.map((_, i) => (
 <button
 key={i}
 className={"c-dot" + (i === slide ? " active" : "")}
 onClick={() => goto(i)}
 aria-label={`Slide ${i+1}`}
 />
 ))}
 </div>
 </div>

 <div
 className="carousel-viewport"
 onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
 onMouseDown={onMouseDown} onMouseUp={onMouseUp}
 >
 <div className="carousel-track" style={{ transform: `translateX(-${slide * 100}%)` }}>
 {LANDING_SLIDES.map((sl, i) => {
 const Il = sl.Illus;
 return (
 <div className="carousel-slide" key={i}>
 <div className={"carousel-illus" + (sl.image ? " carousel-illus-img" : "")}>
 {sl.image ? <img src={sl.image} alt="" draggable={false}/> : (Il ? <Il/> : null)}
 </div>
 <div className="carousel-copy">
 {sl.eyebrow && <div className="eyebrow">{sl.eyebrow}</div>}
 <div className="title">{sl.title}</div>
 <div className="lede">{sl.body}</div>
 </div>
 </div>
 );
 })}
 </div>
 </div>

 <div className="carousel-footer">
 <Button label={slide < last ? "Continue" : "Get started"} variant="primary" onClick={next} showArrow/>
 </div>
 </div>
 </div>
 );
};

// ------------ WHY / INTRO SHEET (optional - opens before the flow) ------------
const WhyInvestSheet = ({ onContinue, onClose }) => (
 <div className="sheet-backdrop" onClick={onClose}>
 <div className="sheet" onClick={e => e.stopPropagation()} style={{ position: "relative" }}>
 <div className="sheet-grabber"/>
 <button className="sheet-close" onClick={onClose}>×</button>
 <div style={{ padding: "8px 24px 28px", flex: 1, overflow: "auto" }}>
 <div className="pill pill-stone" style={{ marginBottom: 14 }}>Before we begin</div>
 <h2 style={{ fontSize: 30, lineHeight: "34px", letterSpacing: "-1px", marginBottom: 14 }}>
 Investing is different from saving
 </h2>
 <p style={{ color: "var(--fg-2)", marginBottom: 24 }}>
 With savings, your money is protected and your returns are predictable. With investments, you accept some risk in exchange for the possibility of higher returns over time.
 </p>
 <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
 {[
 { t: "Start from £1,000", s: "And we'd suggest five years or more" },
 { t: "FSCS protected to £85,000", s: "Held with an authorised custodian" },
 { t: "0.28% from", s: "All-in annual platform and management" },
 ].map((r, i) => (
 <div key={i} style={{ display: "flex", gap: 12 }}>
 <TickIcon color="#00505A"/>
 <div>
 <div className="body1-bold">{r.t}</div>
 <div className="caption1">{r.s}</div>
 </div>
 </div>
 ))}
 </div>
 </div>
 <div className="bg-group on-sheet" style={{ background: "transparent" }}>
 <Button label="I'm ready" variant="primary" onClick={onContinue} showArrow/>
 </div>
 </div>
 </div>
);

// ------------ ACCOUNT / HOLDING DETAIL ------------
// Shown when the user taps an investment wrapper on the home screen. Lists
// every holding in that wrapper (seeded + any bought in-app) with its value
// and 1-year performance. Styled to match the rest of the app.
window.HoldingDetail = ({ accountId, holdings = [], onBack }) => {
 const accounts = getInvestmentAccounts(holdings);
 const account = accounts.find(a => a.id === accountId) || accounts[0];
 if (!account) {
 return (
 <div className="screen" data-screen-label="Account detail (empty)">
 <div className="phone-body flow-screen" style={{ display: "flex", flexDirection: "column" }}>
 <TopBar onBack={onBack}/>
 <div className="content">
 <h2 className="q-title">Nothing here yet</h2>
 <p className="q-sub">You don't have any investments in this account.</p>
 </div>
 </div>
 </div>
 );
 }

 const perfMonth = (account.value * 0.012); // illustrative monthly perf ~1.2%

 return (
 <div className="screen" data-screen-label={"Account · " + account.title}>
 <div className="phone-body flow-screen" style={{ display: "flex", flexDirection: "column", background: "var(--color-secondary-100)" }}>
 <TopBar onBack={onBack} title={account.title}/>

 <div className="content" style={{ flex: 1, minHeight: 0, overflowY: "auto", paddingBottom: 24 }}>

 {/* Balance hero - paper card */}
 <div style={{ margin: "12px 16px 8px", padding: "24px 24px 28px", background: "var(--color-secondary-200)", textAlign: "center" }}>
 <div style={{ fontSize: 14, color: "var(--color-secondary-500, #66969C)", letterSpacing: 1, fontWeight: 600, textTransform: "uppercase" }}>
 {account.sub}
 </div>
 <div style={{ fontSize: 36, fontFamily: "var(--font-display), Georgia, serif", fontWeight: 500, color: "#003036", marginTop: 8, letterSpacing: -1 }}>
 £{account.value.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
 </div>
 <div style={{ fontSize: 14, color: "#1F7A53", marginTop: 4 }}>
 ▲ £{perfMonth.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} this month
 </div>
 {account.monthly > 0 && (
 <div style={{ fontSize: 14, color: "var(--color-secondary-500, #66969C)", marginTop: 6 }}>
 +£{account.monthly.toLocaleString("en-GB")}/mo direct debit
 </div>
 )}
 </div>

 {/* Holdings list */}
 <div className="section-heading" style={{ fontSize: 16, padding: "24px 16px 12px" }}>
 Holdings
 </div>
 <div className="list-group">
 {account.holdings.map(h => (
 <div key={h.id} className="listrow" style={{ cursor: "default", background: "var(--color-secondary-200)", boxSizing: "border-box", width: "100%" }}>
 <span className="listrow-body">
 <span className="listrow-title" style={{ fontSize: 16 }}>{h.name}</span>
 <span className="listrow-sub">
 {h.ticker ? h.ticker : (h.frequency === "monthly" ? "Monthly direct debit" : "One-off")}
 {h.oneYr != null && <> · <span style={{ color: h.oneYr >= 0 ? "#1F7A53" : "#A33636" }}>{h.oneYr >= 0 ? "▲" : "▼"} {Math.abs(h.oneYr).toFixed(1)}% 1y</span></>}
 </span>
 </span>
 <span className="listrow-value">
 <span className="listrow-val">£{h.amount.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
 </span>
 </div>
 ))}
 </div>

 <div style={{ padding: "16px 24px 24px", fontSize: 14, color: "var(--color-secondary-500, #66969C)", lineHeight: 1.4 }}>
 The value of your investments can go down as well as up. Past performance is not a guide to future returns. 1y figures are illustrative.
 </div>
 </div>
 </div>
 </div>
 );
};

Object.assign(window, { HomeScreen, InvestmentsLanding, InvestmentsPicker, WhyInvestSheet });
