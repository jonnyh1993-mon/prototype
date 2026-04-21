// screens-flow.jsx — the "help me pick" questionnaire screens

// ---- 1. Felicia intro video screen ----
const FeliciaIntro = ({ onBack, onContinue }) => (
  <div className="screen" data-screen-label="03 Felicia intro">
    <div className="phone-body felicia-screen">
      <div className="topbar">
        <button className="topbar-back" onClick={onBack} aria-label="Back">
          <ArrowLeft/>
        </button>
        <div style={{ flex: 1 }}/>
      </div>

      <div className="felicia-scroll">
        <div className="felicia-body" style={{ padding: "20px 28px 32px" }}>
          <div className="felicia-eyebrow">How we pick funds</div>
          <h2 className="felicia-headline">
            An independent committee, searching the world for the best funds
          </h2>

          <ul className="felicia-ticks">
            <li>
              <TickIcon size={18}/>
              <span style={{ fontSize: 16, lineHeight: 1.4 }}>Independent of Monument, so decisions are made in your interest</span>
            </li>
            <li>
              <TickIcon size={18}/>
              <span style={{ fontSize: 16, lineHeight: 1.4 }}>Thousands of funds screened globally, only a handful make it through</span>
            </li>
            <li>
              <TickIcon size={18}/>
              <span style={{ fontSize: 16, lineHeight: 1.4 }}>Chosen for strong long-term records, low costs, and managers we trust</span>
            </li>
          </ul>
        </div>

        <div className="meet-team">
          <div className="meet-team-header" style={{ padding: "32px 28px 14px" }}>
            <div className="felicia-eyebrow">Meet the team</div>
            <h3 className="meet-team-title">A committee led by experience</h3>
          </div>
          <button className="felicia-hero" type="button" aria-label="Watch a message from Felicia, Head of Investments (1:32)">
            <div className="felicia-hero-img" />
            <div className="felicia-hero-overlay">
              <div className="felicia-hero-time">1:32</div>
            </div>
          </button>
          <p className="meet-team-bio">
            Felicia leads the Investment Committee at Monument. She previously spent over 8 years at Baillie Gifford as an investment manager, and founded her own Investment firm.
          </p>
        </div>
      </div>

      <div className="felicia-foot">
        <Button label="Get started" variant="primary" onClick={onContinue} showArrow/>
      </div>
    </div>
  </div>
);

// ---- 2. Reason for investing (radio) ----
const PURPOSES = [
  { id: "grow",        title: "Grow long-term wealth",          sub: "Put money to work over the long term",   icon: "portfolio-performance" },
  { id: "retirement",  title: "Save for retirement",            sub: "Build on top of my pension",              icon: "hourglass" },
  { id: "purchase",    title: "Saving for a future purchase",   sub: "Deposit or upsize in the coming years",   icon: "house" },
  { id: "income",      title: "Earn regular income",            sub: "Regular distributions I can draw on",     icon: "coin" },
  { id: "inflation",   title: "Protect my money against inflation", sub: "Stay ahead of rising costs",          icon: "dashboard" },
];

const PurposeScreen = ({ onBack, onExit, onContinue, value, onChange, progress }) => (
  <div className="screen" data-screen-label="04 Purpose">
    <div className="phone-body flow-screen" style={{ display: "flex", flexDirection: "column" }}>
      <TopBar onBack={onBack} onClose={onExit || (() => onBack())} closeLabel="Exit" progress={progress}/>
      <div className="content">
        <h2 className="q-title">What is your main reason for investing right now?</h2>
        <p className="q-sub">Pick the closest fit. You can change your option later.</p>

        <div>
          {PURPOSES.map(p => (
            <button
              key={p.id}
              className="option option-chev"
              onClick={() => { onChange(p.id); setTimeout(onContinue, 180); }}
            >
              <span className="option-body">
                <span className="option-title">{p.title}</span>
                <span className="option-sub">{p.sub}</span>
              </span>
              <span className="option-chev"><ChevR /></span>
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ---- 2b. Priority — growth vs. protection tradeoff ----
const PRIORITIES = [
  { id: "growth",     title: "Growing my money",               sub: "Even if I have to accept more volatility in the short-term" },
  { id: "balanced",   title: "A mix of growth and protection", sub: "I'm happy to see mixed volatility" },
  { id: "protection", title: "Protecting my money",            sub: "Even if I have to sacrifice growth over the long-term" },
];

const PriorityScreen = ({ onBack, onExit, onContinue, value, onChange, progress }) => (
  <div className="screen" data-screen-label="05 Priority">
    <div className="phone-body flow-screen" style={{ display: "flex", flexDirection: "column" }}>
      <TopBar onBack={onBack} onClose={onExit || (() => onBack())} closeLabel="Exit" progress={progress}/>
      <div className="content">
        <h2 className="q-title">What matters more to you right now?</h2>
        <p className="q-sub">Pick the closest fit.</p>
        <div>
          {PRIORITIES.map(p => (
            <button
              key={p.id}
              className="option option-chev"
              onClick={() => { onChange(p.id); setTimeout(onContinue, 180); }}
            >
              <span className="option-body">
                <span className="option-title">{p.title}</span>
                <span className="option-sub">{p.sub}</span>
              </span>
              <span className="option-chev"><ChevR /></span>
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ---- 3. Reassurance interstitial (dynamic copy, tailored per question + answer) ----
// Keyed as REASSURANCE_COPY[question][answerId]. Each question has a default fallback.
const REASSURANCE_COPY = {
  purpose: {
    grow:       { title: "Time is the biggest lever",                   body: "Ten pounds invested for thirty years matters more than a thousand pounds invested for one. We'll match you to a fund that makes the most of your horizon." },
    retirement: { title: "A layer on top of your pension",              body: "We'll assume this sits alongside your existing retirement provision, complementing it, not replacing it." },
    purchase:   { title: "A short horizon needs a different tool",      body: "Short horizons need different tools. We'll lean toward funds that protect your capital while still working harder than a savings account." },
    income:     { title: "Income that's paid, not promised",            body: "The funds we shortlist will have a genuine income yield from real holdings, dividends, coupons, and distributions, not just capital you're drawing down." },
    inflation:  { title: "Keep up with the cost of living",             body: "Cash loses value quietly. We'll shortlist funds designed to outpace inflation over the long run, so your money holds its real-world worth." },
    _default:   { title: "A goal, not a guarantee",                     body: "Whatever you're investing for, we'll match the fund to the job, not the other way around." },
  },
  priority: {
    growth:     { title: "Growth rewards patience",                     body: "Leaning toward growth means we'll favour funds with more equity exposure. That drives returns over time, but expect bigger swings on the way." },
    balanced:   { title: "A foot in both camps",                        body: "A balanced priority lets us blend growth assets with stabilisers, diversifying so no single bad year dominates your experience." },
    protection: { title: "Protection first",                            body: "We'll lean on funds with more bonds, cash-like holdings, and defensive assets. Expect steadier ground, and more modest long-term growth." },
    _default:   { title: "Priorities shape the shortlist",              body: "Your answer here is one of the biggest levers in the match we'll show you." },
  },
  exclusions: {
    _default:   { title: "Invest in line with your values",             body: "We'll filter the shortlist so the fund we match you to doesn't hold companies you'd rather avoid, no matter how profitable they look on paper." },
    _any:       { title: "Exclusions respected",                        body: "The fund we shortlist will screen out the sectors you picked. If a perfect fit isn't available, we'll tell you, not quietly override your choice." },
    _none:      { title: "Cast a wider net",                            body: "Without exclusions, we can consider the full opportunity set, which usually means a broader, more diversified fund." },
  },
  horizon: {
    lt1:    { title: "Under a year is cash territory",                  body: "For money you need within twelve months, protecting capital matters more than growing it. We'll lean heavily toward funds that behave more like a savings buffer than a long-term investment." },
    "1to3": { title: "Gentle handling for a short window",              body: "There's time for your money to work, but not enough to ride out a deep dip. We'll favour funds that dampen the swings while still aiming to beat cash." },
    "3to5": { title: "Closer to shore",                                 body: "Short horizons need different tools. We'll lean toward funds that protect your capital while still working harder than a savings account." },
    "5to10":{ title: "A useful window",                                 body: "Long enough for growth assets to do their work, short enough that we won't ignore the downside. We'll aim for balanced exposure." },
    gt10:   { title: "A long horizon changes the maths",                body: "Ten-plus years lets compounding do the heavy lifting. We can look past short-term noise and focus on funds built for the long game." },
    _default: { title: "Time beats timing",                             body: "Whatever your horizon, we'll pick a fund that fits it, not one that fights it." },
  },
  risk: {
    worried:   { title: "We'll stay protective",                        body: "A 20% drop shouldn't be the reason you abandon a good plan. We'll favour funds that limit the downside, even if that caps some upside." },
    neutral:   { title: "Cycles are normal",                            body: "You're comfortable holding through volatility, which opens up funds with stronger long-term return potential but bumpier rides." },
    confident: { title: "Volatility as opportunity",                    body: "If a 20% drop looks like a sale, we can consider funds with higher growth potential, and meaningful swings along the way." },
    _default:  { title: "Risk isn't a number",                          body: "We'll pick a fund whose ups and downs you can actually live with." },
  },
  amount: {
    _default:  { title: "Start where you're comfortable",               body: "The amount you begin with matters less than starting. You can top up, pause, or adjust at any time, this isn't locked in." },
  },
  values: {
    _default:  { title: "A portfolio that reflects you",                body: "Your priorities shape the shortlist. We'll weight the match toward funds that align with what matters most to you." },
  },
};

const getReassureCopy = (question, answer) => {
  const q = REASSURANCE_COPY[question] || {};
  // For multi-select (array) answers, prefer _any / _none paths
  if (Array.isArray(answer)) {
    if (answer.length === 0 && q._none) return q._none;
    if (answer.length > 0 && q._any) return q._any;
    return q._default || { title: "A word from us", body: "Every answer shapes the shortlist we'll show you." };
  }
  return q[answer] || q._default || { title: "A word from us", body: "Every answer shapes the shortlist we'll show you." };
};

const ReassuranceScreen = ({ onBack, onExit, onContinue, question, answer, progress }) => {
  const copy = getReassureCopy(question, answer);
  return (
    <div className="screen" data-screen-label={"Reassure · " + question}>
      <div className="phone-body flow-screen" style={{ display: "flex", flexDirection: "column" }}>
        <TopBar onBack={onBack} onClose={onExit || (() => onBack())} closeLabel="Exit" progress={progress}/>
        <div className="content" style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", paddingTop: 40 }}>
          <div>
          <div className="pill pill-on-primary" style={{ marginBottom: 16 }}>Our insight</div>
          <h2 className="q-title">{copy.title}</h2>
          <p className="q-sub" style={{ marginBottom: 24 }}>{copy.body}</p>

          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 0", borderTop: "1px solid var(--color-secondary-975)" }}>
            <img src="assets/felicia-photo.png" alt="Felicia Hjertman" style={{ width: 40, height: 40, borderRadius: 9999, objectFit: "cover", flexShrink: 0 }}/>
            <div style={{ fontSize: 16, lineHeight: "20px" }}>
              <div style={{ color: "var(--fg-1)", fontWeight: 600 }}>Felicia Hjertman</div>
              <div style={{ color: "var(--fg-2)" }}>Head of Investments, Monument</div>
            </div>
          </div>
          </div>
        </div>
        <div className="bg-group">
          <Button label="Got it" variant="primary" onClick={onContinue} showArrow/>
        </div>
      </div>
    </div>
  );
};

// ---- 4. How long can you leave it invested? ----
const HORIZONS = [
  { id: "lt1",    title: "Less than 1 year",  sub: "I might need this money very soon" },
  { id: "1to3",   title: "1–3 years",         sub: "A short window, closer to saving than investing" },
  { id: "3to5",   title: "3–5 years",         sub: "I might need this soon" },
  { id: "5to10",  title: "5–10 years",        sub: "I'm in no immediate rush" },
  { id: "gt10",   title: "More than 10 years",sub: "This is long-term money" },
];

// ---- 5. Exclusions — multi-select opt-outs ----
const EXCLUSIONS = [
  { id: "fossil",   title: "Fossil fuels",         sub: "Oil, gas, coal producers" },
  { id: "animal",   title: "Animal testing",       sub: "Cosmetics and pharma testing" },
  { id: "gambling", title: "Gambling",             sub: "Casinos, betting operators" },
  { id: "alcohol",  title: "Alcohol",              sub: "Producers and distributors" },
  { id: "tobacco",  title: "Tobacco",              sub: "Cigarettes, smokeless and vapes" },
  { id: "weapons",  title: "Weapons",              sub: "Civilian firearms and defence" },
  { id: "riba",     title: "Ribā",                 sub: "Interest-bearing finance" },
  { id: "adult",    title: "Adult entertainment",  sub: "Adult content and venues" },
];

const ExclusionsScreen = ({ onBack, onExit, onContinue, value = [], onChange, progress }) => {
  const toggle = (id) => {
    if (value.includes(id)) onChange(value.filter(v => v !== id));
    else onChange([...value, id]);
  };
  return (
    <div className="screen" data-screen-label="05 Exclusions">
      <div className="phone-body flow-screen" style={{ display: "flex", flexDirection: "column" }}>
        <TopBar onBack={onBack} onClose={onExit || (() => onBack())} closeLabel="Exit" progress={progress}/>
        <div className="content">
          <h2 className="q-title">Do you want to make any exclusions?</h2>
          <p className="q-sub">Select as many as you like.</p>

          <div>
            {EXCLUSIONS.map(e => (
              <button
                key={e.id}
                className={"option" + (value.includes(e.id) ? " selected" : "")}
                onClick={() => toggle(e.id)}
              >
                <span className="option-body">
                  <span className="option-title">{e.title}</span>
                  <span className="option-sub">{e.sub}</span>
                </span>
                <span className="option-box"/>
              </button>
            ))}
          </div>
        </div>
        <div className="bg-group">
          <Button
            label={value.length === 0 ? "No exclusions, continue" : "Continue"}
            variant="primary" onClick={onContinue} showArrow
          />
        </div>
      </div>
    </div>
  );
};

const HorizonScreen = ({ onBack, onExit, onContinue, value, onChange, progress }) => (
  <div className="screen" data-screen-label="06 Horizon">
    <div className="phone-body flow-screen" style={{ display: "flex", flexDirection: "column" }}>
      <TopBar onBack={onBack} onClose={onExit || (() => onBack())} closeLabel="Exit" progress={progress}/>
      <div className="content">
        <h2 className="q-title" style={{ margin: "12px 0px 32px" }}>How long are you looking to stay invested?</h2>
        <div>
          {HORIZONS.map(h => (
            <button key={h.id}
              className="option option-chev"
              onClick={() => { onChange(h.id); setTimeout(onContinue, 180); }}>
              <span className="option-body" style={{ padding: "6px 0" }}>
                <span className="option-title">{h.title}</span>
                <span className="option-sub">{h.sub}</span>
              </span>
              <span className="option-chev"><ChevR /></span>
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ---- 5. Risk comfort ----
const REASSURES = [
  { id: "worried",   title: "It would worry me",        sub: "I want to know the downside is limited" },
  { id: "neutral",   title: "I'd ride it out",          sub: "I understand markets move in cycles" },
  { id: "confident", title: "It would be a buying opportunity", sub: "Volatility doesn't faze me" },
];

const RiskScreen = ({ onBack, onExit, onContinue, value, onChange, progress }) => (
  <div className="screen" data-screen-label="07 Risk">
    <div className="phone-body flow-screen" style={{ display: "flex", flexDirection: "column" }}>
      <TopBar onBack={onBack} onClose={onExit || (() => onBack())} closeLabel="Exit" progress={progress}/>
      <div className="content">
        <h2 className="q-title">If markets fell 20% next year, how would you feel?</h2>
        <p className="q-sub">There are no wrong answers. We just want to match the risk to the person.</p>
        <div>
          {REASSURES.map(r => (
            <button key={r.id}
              className={"option" + (value === r.id ? " selected" : "")}
              onClick={() => onChange(r.id)}>
              <span className="option-body" style={{ padding: "6px 0" }}>
                <span className="option-title">{r.title}</span>
                <span className="option-sub">{r.sub}</span>
              </span>
              <span className="option-check"/>
            </button>
          ))}
        </div>
      </div>
      <div className="bg-group">
        <Button label="Continue" variant="primary" onClick={onContinue} disabled={!value} showArrow/>
      </div>
    </div>
  </div>
);

// ---- 6. Amount slider ----
const AmountScreen = ({ onBack, onExit, onContinue, value, onChange, progress }) => {
  const min = 1000, max = 250000;
  // non-linear-feeling via quick presets
  const presets = [5000, 25000, 50000, 100000];
  return (
    <div className="screen" data-screen-label="08 Amount">
      <div className="phone-body flow-screen" style={{ display: "flex", flexDirection: "column" }}>
        <TopBar onBack={onBack} onClose={onExit || (() => onBack())} closeLabel="Exit" progress={progress}/>
        <div className="content">
          <h2 className="q-title" style={{ marginBottom: 4 }}>How much are you thinking?</h2>
          <p className="q-sub" style={{ marginBottom: 0 }}>A rough figure is fine. You can change it before you fund.</p>

          <div className="amount-display">{fmtGBP(value)}</div>
          <div className="amount-sub">Initial investment</div>

          <div style={{ padding: "0 8px" }}>
            <div className="slider-track">
              <div className="slider-fill" style={{ width: ((value - min) / (max - min) * 100) + "%" }}/>
              <div className="slider-thumb" style={{ left: ((value - min) / (max - min) * 100) + "%" }}/>
              <input
                type="range" min={min} max={max} step={1000}
                value={value} onChange={e => onChange(parseInt(e.target.value))}
                className="slider-input"
              />
            </div>
            <div className="slider-labels">
              <span>{fmtGBP(min)}</span>
              <span>{fmtGBP(max)}+</span>
            </div>
          </div>

          <div className="bucket-chips">
            {presets.map(p => (
              <button key={p} className={"chip" + (value === p ? " active" : "")} onClick={() => onChange(p)}>
                {fmtGBP(p)}
              </button>
            ))}
          </div>

          <div style={{ marginTop: 32, background: "#fff", padding: 16 }}>
            <div className="caption1-bold" style={{ marginBottom: 4, color: "var(--fg-1)" }}>
              Projected in 10 years
            </div>
            <div className="caption1" style={{ color: "var(--fg-2)" }}>
              At a 6.5% average annual return, net of fees: <b style={{ color: "var(--fg-1)" }}>{fmtGBP(Math.round(value * Math.pow(1.065, 10)))}</b>
            </div>
            <div className="caption2" style={{ color: "var(--fg-3)", marginTop: 6 }}>
              An illustrative estimate, not a forecast.
            </div>
          </div>
        </div>
        <div className="bg-group">
          <Button label="Continue" variant="primary" onClick={onContinue} showArrow/>
        </div>
      </div>
    </div>
  );
};

// ---- 7. Values (multi-select) ----
const VALUES = [
  { id: "growth",         title: "Growth",         sub: "Maximise long-term returns",          icon: "portfolio-performance" },
  { id: "stability",      title: "Stability",      sub: "Smooth out the bumps",                icon: "check" },
  { id: "income",         title: "Income",         sub: "Regular payments I can live on",      icon: "coin" },
  { id: "sustainability", title: "Sustainability", sub: "Only companies I can stand behind",   icon: "dashboard" },
  { id: "diversification",title: "Diversification",sub: "Spread across regions and assets",    icon: "portfolio" },
  { id: "long-term",      title: "Long-term",      sub: "Built to hold for decades",           icon: "hourglass" },
];

const ValuesScreen = ({ onBack, onExit, onContinue, value = [], onChange, progress }) => {
  const toggle = (id) => {
    if (value.includes(id)) onChange(value.filter(v => v !== id));
    else if (value.length < 3) onChange([...value, id]);
  };
  return (
    <div className="screen" data-screen-label="09 Values">
      <div className="phone-body flow-screen" style={{ display: "flex", flexDirection: "column" }}>
        <TopBar onBack={onBack} onClose={onExit || (() => onBack())} closeLabel="Exit" progress={progress}/>
        <div className="content">
          <h2 className="q-title">What matters most to you?</h2>
          <p className="q-sub">Pick up to three.</p>
          <div className="values-counter">{value.length} of 3 selected</div>
          <div>
            {VALUES.map(v => (
              <button key={v.id}
                className={"option" + (value.includes(v.id) ? " selected" : "") + (value.length >= 3 && !value.includes(v.id) ? " disabled" : "")}
                onClick={() => toggle(v.id)}
                style={value.length >= 3 && !value.includes(v.id) ? { opacity: 0.4 } : null}>
                <span className="option-icon"><img src={icon(v.icon)} alt=""/></span>
                <span className="option-body">
                  <span className="option-title">{v.title}</span>
                  <span className="option-sub">{v.sub}</span>
                </span>
                <span className="option-box"/>
              </button>
            ))}
          </div>
        </div>
        <div className="bg-group">
          <Button label="Find my fund" variant="primary" onClick={onContinue} disabled={value.length === 0} showArrow/>
        </div>
      </div>
    </div>
  );
};

// ---- 8. Processing / loading — single "Gathering your options" screen ----
const ProcessingScreen = ({ onDone }) => {
  const TOTAL = 5000;   // total duration
  const FADE  = 700;    // fade-out duration before handoff

  const [leaving, setLeaving] = React.useState(false);

  React.useEffect(() => {
    const fadeAt = setTimeout(() => setLeaving(true), TOTAL - FADE);
    const done   = setTimeout(() => onDone && onDone(),   TOTAL);
    return () => { clearTimeout(fadeAt); clearTimeout(done); };
  }, []);

  return (
    <div className="screen" data-screen-label="10 Processing">
      <div className={"phone-body proc-screen" + (leaving ? " proc-leaving" : "")}>
        {/* Orbit graphic — concentric hairline tracks with orbiting dots */}
        <div className="proc-graphic" aria-hidden="true">
          <div className="proc-orbit">
            <div className="proc-track proc-track-1"><span className="proc-dot"/></div>
            <div className="proc-track proc-track-2"><span className="proc-dot"/></div>
            <div className="proc-track proc-track-3"><span className="proc-dot"/></div>
            <span className="proc-core"/>
          </div>
        </div>

        <div className="proc-text">
          <h1 className="proc-body">Gathering your options</h1>
          <p className="proc-caption">This will only take a moment</p>
        </div>

        {/* Progress hairline — fills over the full duration */}
        <div className="proc-progress" aria-hidden="true">
          <span className="proc-progress-fill"/>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, {
  FeliciaIntro, PurposeScreen, ReassuranceScreen,
  PriorityScreen, ExclusionsScreen, HorizonScreen, RiskScreen, AmountScreen, ValuesScreen,
  ProcessingScreen, PURPOSES, PRIORITIES, HORIZONS, EXCLUSIONS, REASSURES, VALUES,
});
