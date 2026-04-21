// screens-entry.jsx — Home, Investments intro, and Help-me-pick intro

// ------------ HOME SCREEN ------------
const HomeScreen = ({ onOpenInvestments, onOpenHolding, holdings = [], staticMode = false }) => {
  // Phases: "greeting" (first 1.2s) -> "networth" (fade swap) -> account rows stagger in
  const [phase, setPhase] = React.useState(staticMode ? "networth" : "greeting");
  const [revealed, setRevealed] = React.useState(staticMode);

  React.useEffect(() => {
    if (staticMode) return;
    const t1 = setTimeout(() => setPhase("networth"), 1400);
    const t2 = setTimeout(() => setRevealed(true), 1700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [staticMode]);

  // Aggregate holdings into an ISA line
  const isaTotal = holdings
    .filter(h => h.frequency === "one-off")
    .reduce((s, h) => s + (h.amount || 0), 0);
  const monthlyTotal = holdings
    .filter(h => h.frequency === "monthly")
    .reduce((s, h) => s + (h.amount || 0), 0);
  const hasHoldings = holdings.length > 0;
  const netWorth = 245310.22 + isaTotal;

  return (
    <div className="screen screen-home" data-screen-label="01 Home">
      <div className="phone-body">
        <div className="home-hero" style={{padding: "24px 24px 32px", margin: 0}}>
          <div className={"home-greet-swap " + phase}>
            <div className="home-hello">Good morning, Wasim</div>
            <div className="home-networth">
              <div className="home-balance-label" style={{textAlign: "center", fontSize: 14}}>Net worth</div>
              <div className="home-balance" style={{textAlign: "center"}}>£{netWorth.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              <div className="home-perf" style={{textAlign: "center", fontSize: 16}}>▲ £6,719.20 this month</div>
            </div>
          </div>
        </div>

        <div className={"section-heading home-reveal" + (revealed ? " in" : "")} style={{fontSize: 16, padding: "32px 16px 16px", "--d": "0ms"}}>Accounts</div>
        <div className="list-group">
          <button className={"listrow home-reveal" + (revealed ? " in" : "")} style={{"--d": "60ms"}}>
            <span className="listrow-body">
              <span className="listrow-title" style={{fontSize: 16}}>Easy Access savings</span>
              <span className="listrow-sub">4.50% AER</span>
            </span>
            <span className="listrow-value"><span className="listrow-val">£82,140.00</span></span>
            <ChevR/>
          </button>
          <button className={"listrow home-reveal" + (revealed ? " in" : "")} style={{"--d": "120ms"}}>
            <span className="listrow-body">
              <span className="listrow-title" style={{fontSize: 16}}>Easy Access Cash ISA</span>
              <span className="listrow-sub">4.75% AER ·</span>
            </span>
            <span className="listrow-value"><span className="listrow-val">£20,000.00</span></span>
            <ChevR/>
          </button>
        </div>

        {hasHoldings && (
          <React.Fragment>
            <div className={"section-heading home-reveal" + (revealed ? " in" : "")} style={{fontSize: 16, padding: "32px 16px 16px", "--d": "200ms"}}>Investments</div>
            <div className="list-group">
              <button
                className={"listrow home-reveal" + (revealed ? " in" : "")}
                style={{"--d": "240ms"}}
                onClick={onOpenHolding}
              >
                <span className="listrow-body">
                  <span className="listrow-title" style={{fontSize: 16}}>Stocks & Shares ISA</span>
                  <span className="listrow-sub">
                    {holdings.length} {holdings.length === 1 ? "holding" : "holdings"}
                    {monthlyTotal > 0 && ` · +£${monthlyTotal.toLocaleString("en-GB")}/mo`}
                  </span>
                </span>
                <span className="listrow-value">
                  <span className="listrow-val">£{isaTotal.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </span>
                <ChevR/>
              </button>
            </div>
          </React.Fragment>
        )}

        <div className={"section-heading home-reveal" + (revealed ? " in" : "")} style={{fontSize: 16, padding: "32px 16px 16px", "--d": "260ms"}}>Do more with Monument</div>
        <div className="list-group">
          <button className={"listrow highlight home-reveal" + (revealed ? " in" : "")} style={{"--d": "320ms", background: "var(--color-secondary-200)"}} onClick={onOpenInvestments}>
            <span className="listrow-icon" style={{ background: "#003036" }}>
              <img src={icon("portfolio-performance")} alt="" style={{ filter: "brightness(0) invert(1)", opacity: 0.85, width: 26, height: 26 }}/>
            </span>
            <span className="listrow-body">
              <span className="listrow-title" style={{fontSize: 16}}>Investments</span>
              <span className="listrow-sub">Hand-picked funds, ETFs, ETCs and investment trusts picked by experts.</span>
            </span>
            <ChevR/>
          </button>
          <button className={"listrow home-reveal" + (revealed ? " in" : "")} style={{"--d": "380ms"}}>
            <span className="listrow-icon"><img src={icon("house")} alt="" /></span>
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
        <button className="tab">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 20V10M10 20V4M16 20v-8M22 20v-4" strokeWidth="1.8" strokeLinecap="round"/></svg>
          <span className="tab-label">Invest</span>
        </button>
        <button className="tab">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M5 8h14l-1 12H6L5 8zM9 8V5a3 3 0 016 0v3" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span className="tab-label">Lifestyle</span>
        </button>
        <button className="tab">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" strokeWidth="1.8"/><path d="M4 20c1-4 5-6 8-6s7 2 8 6" strokeWidth="1.8" strokeLinecap="round"/></svg>
          <span className="tab-label">Profile</span>
        </button>
      </div>
    </div>
  );
};

// ------------ INVESTMENTS LANDING ------------
// Editorial "data card" style illustrations — bold flat shapes in Monument palette
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
        {l: "Growth",   v: 78, c: "#003036"},
        {l: "Income",   v: 56, c: "#66969C"},
        {l: "Balanced", v: 92, c: "#A36300"},
        {l: "Global",   v: 44, c: "#99B9BD"},
        {l: "Ethical",  v: 66, c: "#00505A"},
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
      <rect x="0"  y="0"  width="220" height="3" fill="#003036"/>
      <rect x="0"  y="10" width="180" height="3" fill="#99B9BD"/>
      <rect x="0"  y="20" width="140" height="3" fill="#D8D1C0"/>
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
    Illus: IllusCommittee,
  },
  {
    kind: "story",
    eyebrow: null,
    title: "Make decisions backed by expert insights",
    body: "We’ll provide you with the insights to help you decide where to invest.",
    Illus: IllusInsight,
  },
  {
    kind: "story",
    eyebrow: null,
    title: "Accounts fit for your goals",
    body: "Tax efficient investing in a Stocks & Shares ISA or full flexibility in a General Investment Account.",
    Illus: IllusGoals,
  },
];

// Picker screen — separate full screen on default cream background
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
        <div className="topbar dark carousel-topbar">
          <button className="topbar-back" onClick={() => slide > 0 ? goto(slide - 1) : onBack()} aria-label="Back">
            <ArrowLeft color="#fff"/>
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
          <button className="topbar-skip">Skip</button>
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
                  <div className="carousel-illus">
                    {Il ? <Il/> : null}
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

// ------------ WHY / INTRO SHEET (optional — opens before the flow) ------------
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
        <p style={{ color: "var(--fg-2)", marginBottom: 24, textWrap: "pretty" }}>
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

Object.assign(window, { HomeScreen, InvestmentsLanding, InvestmentsPicker, WhyInvestSheet });
