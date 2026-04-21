// app.jsx — top-level router/state

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "showSecondPhone": false,
  "introSheet": true,
  "feliciaIntro": true,
  "reassuranceStyle": "personal"
}/*EDITMODE-END*/;

const INITIAL_ANSWERS = {
  purpose: null,
  priority: null,
  exclusions: [],
  reassure: null,
  horizon: null,
  amount: 25000,
  values: [],
  investFrequency: "one-off",
};

const TOTAL_STEPS = 4; // purpose, priority, horizon, exclusions

function App() {
  const [tweaks, setTweaks] = React.useState(TWEAK_DEFAULTS);
  const [tweakVisible, setTweakVisible] = React.useState(false);

  // Route state is: { name, ... }
  const VALID_ROUTES = new Set(["home","investments","picker","felicia","purpose","reassure-purpose","priority","reassure-priority","horizon","reassure-horizon","exclusions","reassure-exclusions","processing","result","detail","eligibility","invest-amount","confirm","holding-detail"]);
  const saved = (() => {
    try {
      const s = JSON.parse(localStorage.getItem("inv_proto_v1") || "null");
      if (s?.route?.name && !VALID_ROUTES.has(s.route.name)) return null;
      return s;
    } catch (_) { return null; }
  })();

  const [route, setRoute] = React.useState(saved?.route || { name: "home" });
  const [answers, setAnswers] = React.useState(saved?.answers || INITIAL_ANSWERS);
  const [holdings, setHoldings] = React.useState(saved?.holdings || []);
  const [whyOpen, setWhyOpen] = React.useState(false);

  // Persist
  React.useEffect(() => {
    localStorage.setItem("inv_proto_v1", JSON.stringify({ route, answers, holdings }));
  }, [route, answers, holdings]);

  // Edit-mode plumbing
  React.useEffect(() => {
    const handler = (e) => {
      if (!e.data) return;
      if (e.data.type === "__activate_edit_mode") setTweakVisible(true);
      else if (e.data.type === "__deactivate_edit_mode") setTweakVisible(false);
    };
    window.addEventListener("message", handler);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", handler);
  }, []);

  const applyTweak = (key, val) => {
    setTweaks(t => ({ ...t, [key]: val }));
    window.parent.postMessage({ type: "__edit_mode_set_keys", edits: { [key]: val } }, "*");
  };
  const resetProto = () => {
    setRoute({ name: "home" });
    setAnswers(INITIAL_ANSWERS);
    setHoldings([]);
    localStorage.removeItem("inv_proto_v1");
    try { sessionStorage.removeItem("inv_home_seen"); } catch {}
  };

  // Expose reset to children (Profile tab on Home) via a window event
  React.useEffect(() => {
    const h = () => resetProto();
    window.addEventListener("proto:reset", h);
    return () => window.removeEventListener("proto:reset", h);
  }, []);

  const setAnswer = (k, v) => setAnswers(a => ({ ...a, [k]: v }));

  // ---- navigation actions ----
  const startHelpPick = () => {
    if (tweaks.feliciaIntro) setRoute({ name: "felicia" });
    else setRoute({ name: "purpose" });
  };

  const openInvestments = () => {
    if (tweaks.introSheet) {
      setRoute({ name: "investments" });
      setTimeout(() => setWhyOpen(true), 300);
    } else setRoute({ name: "investments" });
  };

  // step number within the flow
  const stepProgress = (stepIdx) => Math.round((stepIdx / TOTAL_STEPS) * 100);

  // Render currently-active primary screen
  const renderScreen = () => {
    switch (route.name) {
      case "home":
        return <HomeScreen onOpenInvestments={openInvestments} holdings={holdings} onOpenHolding={() => setRoute({ name: "holding-detail" })}/>;

      case "investments":
        return <InvestmentsLanding
          onBack={() => setRoute({ name: "home" })}
          onContinue={() => setRoute({ name: "picker" })}
        />;

      case "picker":
        return <InvestmentsPicker
          onBack={() => setRoute({ name: "investments" })}
          onHelpPick={startHelpPick}
          onBrowse={startHelpPick}
          onOpenAccount={startHelpPick}
        />;

      case "felicia":
        return <FeliciaIntro
          onBack={() => setRoute({ name: "picker" })}
          onContinue={() => setRoute({ name: "purpose" })}
        />;

      case "purpose":
        return <PurposeScreen
          onBack={() => setRoute({ name: tweaks.feliciaIntro ? "felicia" : "investments" })} onExit={() => setRoute({ name: "picker" })}
          onContinue={() => {
            if (tweaks.reassuranceStyle !== "none") setRoute({ name: "reassure-purpose" });
            else setRoute({ name: "horizon" });
          }}
          value={answers.purpose}
          onChange={v => setAnswer("purpose", v)}
          progress={stepProgress(1)}
        />;

      case "reassure-purpose":
        return <ReassuranceScreen
          onBack={() => setRoute({ name: "purpose" })} onExit={() => setRoute({ name: "picker" })}
          onContinue={() => setRoute({ name: "priority" })}
          question="purpose"
          answer={answers.purpose}
          progress={stepProgress(1)}
        />;

      case "priority":
        return <PriorityScreen
          onBack={() => setRoute({ name: tweaks.reassuranceStyle !== "none" ? "reassure-purpose" : "purpose" })} onExit={() => setRoute({ name: "picker" })}
          onContinue={() => {
            if (tweaks.reassuranceStyle !== "none") setRoute({ name: "reassure-priority" });
            else setRoute({ name: "horizon" });
          }}
          value={answers.priority}
          onChange={v => setAnswer("priority", v)}
          progress={stepProgress(2)}
        />;

      case "reassure-priority":
        return <ReassuranceScreen
          onBack={() => setRoute({ name: "priority" })} onExit={() => setRoute({ name: "picker" })}
          onContinue={() => setRoute({ name: "horizon" })}
          question="priority"
          answer={answers.priority}
          progress={stepProgress(2)}
        />;

      case "horizon":
        return <HorizonScreen
          onBack={() => setRoute({ name: tweaks.reassuranceStyle !== "none" ? "reassure-priority" : "priority" })} onExit={() => setRoute({ name: "picker" })}
          onContinue={() => {
            if (tweaks.reassuranceStyle !== "none") setRoute({ name: "reassure-horizon" });
            else setRoute({ name: "exclusions" });
          }}
          value={answers.horizon}
          onChange={v => setAnswer("horizon", v)}
          progress={stepProgress(3)}
        />;

      case "reassure-horizon":
        return <ReassuranceScreen
          onBack={() => setRoute({ name: "horizon" })} onExit={() => setRoute({ name: "picker" })}
          onContinue={() => setRoute({ name: "exclusions" })}
          question="horizon"
          answer={answers.horizon}
          progress={stepProgress(3)}
        />;

      case "exclusions":
        return <ExclusionsScreen
          onBack={() => setRoute({ name: tweaks.reassuranceStyle !== "none" ? "reassure-horizon" : "horizon" })} onExit={() => setRoute({ name: "picker" })}
          onContinue={() => {
            if (tweaks.reassuranceStyle !== "none") setRoute({ name: "reassure-exclusions" });
            else setRoute({ name: "processing" });
          }}
          value={answers.exclusions}
          onChange={v => setAnswer("exclusions", v)}
          progress={stepProgress(4)}
        />;

      case "reassure-exclusions":
        return <ReassuranceScreen
          onBack={() => setRoute({ name: "exclusions" })} onExit={() => setRoute({ name: "picker" })}
          onContinue={() => setRoute({ name: "processing" })}
          question="exclusions"
          answer={answers.exclusions}
          progress={stepProgress(4)}
        />;

      case "processing":
        return <ProcessingScreen onDone={() => setRoute({ name: "result" })}/>;

      case "result":
        return <ResultScreen
          answers={answers}
          onBack={() => setRoute({ name: "exclusions" })}
          onRestart={() => setRoute({ name: "purpose" })}
          onPickAlt={(id) => setRoute({ name: "detail", fundId: id })}
          onOpenDetail={(id) => setRoute({ name: "detail", fundId: id })}
        />;

      case "detail":
        return <FundDetail
          fundId={route.fundId}
          amount={answers.amount}
          onBack={() => setRoute({ name: "result" })}
          onInvest={() => {
            if (route.fundId === "pe") setRoute({ name: "eligibility", fundId: route.fundId });
            else setRoute({ name: "invest-amount", fundId: route.fundId });
          }}
        />;

      case "eligibility":
        return <EligibilityScreen
          amount={answers.amount}
          onBack={() => setRoute({ name: "detail", fundId: route.fundId })}
          onContinue={() => setRoute({ name: "invest-amount", fundId: route.fundId })}
        />;

      case "invest-amount": {
        const f = FUNDS.find(f => f.id === route.fundId);
        return <AmountInvestScreen
          fundName={f?.name}
          defaultAmount={answers.amount || 5000}
          fundMin={route.fundId === "pe" ? 10000 : 1000}
          fundMinMonthly={route.fundId === "pe" ? 500 : 100}
          onBack={() => setRoute(route.fundId === "pe"
            ? { name: "eligibility", fundId: route.fundId }
            : { name: "detail", fundId: route.fundId }
          )}
          onContinue={({ amount, frequency }) => {
            setAnswers(a => ({ ...a, amount, investFrequency: frequency }));
            setRoute({ name: "confirm", fundId: route.fundId });
          }}
        />;
      }

      case "confirm": {
        const f = FUNDS.find(f => f.id === route.fundId);
        return <ConfirmScreen
          fundName={f?.name}
          amount={answers.amount}
          frequency={answers.investFrequency || "one-off"}
          onBack={() => setRoute({ name: "invest-amount", fundId: route.fundId })}
          onHome={() => {
            setHoldings(hs => [...hs, {
              fundId: route.fundId,
              fundName: f?.name,
              amount: answers.amount,
              frequency: answers.investFrequency || "one-off",
              placedAt: Date.now(),
            }]);
            setRoute({ name: "home" });
            setAnswers(INITIAL_ANSWERS);
          }}
        />;
      }

      case "holding-detail":
        return <HoldingDetail
          holdings={holdings}
          onBack={() => setRoute({ name: "home" })}
        />;

      default:
        // Unknown route — reset to home
        setTimeout(() => setRoute({ name: "home" }), 0);
        return null;
    }
  };

  // The peek phone: shows the next screen forward, or the result, to add narrative
  const peekScreen = () => {
    // Forward-looking companion to add context
    const peek = {
      home: { kind: "investments" },
      investments: { kind: "picker" },
      picker: { kind: "felicia" },
      felicia: { kind: "purpose" },
      purpose: { kind: "reassure-purpose" },
      "reassure-purpose": { kind: "horizon" },
      horizon: { kind: "reassure-horizon" },
      "reassure-horizon": { kind: "amount" },
      amount: { kind: "reassure-amount" },
      "reassure-amount": { kind: "values" },
      values: { kind: "reassure-values" },
      "reassure-values": { kind: "processing" },
      processing: { kind: "result" },
      result: { kind: "detail" },
      detail: { kind: "invest-amount" },
      eligibility: { kind: "invest-amount" },
      "invest-amount": { kind: "confirm" },
      confirm: { kind: "holding-detail" },
      "holding-detail": { kind: "home" },
    }[route.name];
    if (!peek) return null;

    // Render a small, inert version of the next screen
    switch (peek.kind) {
      case "investments": return <InvestmentsLanding onBack={()=>{}} onContinue={()=>{}}/>;
      case "picker": return <InvestmentsPicker onBack={()=>{}} onHelpPick={()=>{}} onBrowse={()=>{}} onOpenAccount={()=>{}}/>;
      case "felicia":     return <FeliciaIntro onBack={()=>{}} onContinue={()=>{}}/>;
      case "purpose":            return <PurposeScreen onBack={()=>{}} onContinue={()=>{}} value={answers.purpose} onChange={()=>{}} progress={stepProgress(1)}/>;
      case "reassure-purpose":   return <ReassuranceScreen onBack={()=>{}} onContinue={()=>{}} question="purpose" answer={answers.purpose || "grow"} progress={stepProgress(1)}/>;
      case "horizon":            return <HorizonScreen onBack={()=>{}} onContinue={()=>{}} value={answers.horizon} onChange={()=>{}} progress={stepProgress(2)}/>;
      case "reassure-horizon":   return <ReassuranceScreen onBack={()=>{}} onContinue={()=>{}} question="horizon" answer={answers.horizon || "long"} progress={stepProgress(2)}/>;
      case "amount":             return <AmountScreen onBack={()=>{}} onContinue={()=>{}} value={answers.amount} onChange={()=>{}} progress={stepProgress(3)}/>;
      case "reassure-amount":    return <ReassuranceScreen onBack={()=>{}} onContinue={()=>{}} question="amount" answer={answers.amount} progress={stepProgress(3)}/>;
      case "values":             return <ValuesScreen onBack={()=>{}} onContinue={()=>{}} value={answers.values} onChange={()=>{}} progress={stepProgress(4)}/>;
      case "reassure-values":    return <ReassuranceScreen onBack={()=>{}} onContinue={()=>{}} question="values" answer={answers.values} progress={stepProgress(4)}/>;
      case "processing":  return <ProcessingScreen onDone={()=>{}}/>;
      case "result":      return <ResultScreen answers={{...answers, purpose: answers.purpose || "grow", horizon: answers.horizon || "long", reassure: answers.reassure || "neutral", values: answers.values.length ? answers.values : ["growth","long-term"]}} onBack={()=>{}} onRestart={()=>{}} onPickAlt={()=>{}} onOpenDetail={()=>{}}/>;
      case "detail": {
        // Default to the match for the current answers, or growth
        const answersWithDefaults = {...answers, purpose: answers.purpose || "grow", horizon: answers.horizon || "long", reassure: answers.reassure || "neutral", values: answers.values.length ? answers.values : ["growth"]};
        const m = matchFunds(answersWithDefaults);
        return <FundDetail fundId={m[0].fund.id} amount={answers.amount} onBack={()=>{}} onInvest={()=>{}}/>;
      }
      case "invest-amount": {
        const answersWithDefaults = {...answers, purpose: answers.purpose || "grow", horizon: answers.horizon || "long", reassure: answers.reassure || "neutral", values: answers.values.length ? answers.values : ["growth"]};
        const m = matchFunds(answersWithDefaults);
        return <AmountInvestScreen fundName={m[0].fund.name} defaultAmount={answers.amount || 5000} fundMin={m[0].fund.id === "pe" ? 10000 : 1000} onBack={()=>{}} onContinue={()=>{}}/>;
      }
      case "confirm":
        return <ConfirmScreen fundName="Monument Growth" amount={answers.amount} frequency={answers.investFrequency || "one-off"} onBack={()=>{}} onHome={()=>{}}/>;
      case "home":
        return <HomeScreen onOpenInvestments={()=>{}}/>;
      default: return null;
    }
  };

  // ---- Transitional screen wrapper (push-left / push-right like iOS nav) ----
  // Track the previous screen during a route change so we can render it sliding
  // out while the new screen slides in. Direction derived from STEP_ORDER index.
  const [prevRoute, setPrevRoute] = React.useState(null);
  const [dir, setDir] = React.useState("forward"); // "forward" | "back"
  const lastRoute = React.useRef(route);
  React.useEffect(() => {
    if (lastRoute.current.name === route.name) return;
    const fromIdx = STEP_ORDER.indexOf(lastRoute.current.name);
    const toIdx = STEP_ORDER.indexOf(route.name);
    const direction = toIdx >= fromIdx ? "forward" : "back";
    setDir(direction);
    setPrevRoute(lastRoute.current);
    lastRoute.current = route;
    const t = setTimeout(() => setPrevRoute(null), 380); // animation duration + small buffer
    return () => clearTimeout(t);
  }, [route]);

  const renderPrevScreen = () => {
    if (!prevRoute) return null;
    const r = prevRoute;
    switch (r.name) {
      case "home": return <HomeScreen onOpenInvestments={()=>{}} staticMode={true}/>;
      case "investments": return <InvestmentsLanding onBack={()=>{}} onContinue={()=>{}}/>;
      case "picker": return <InvestmentsPicker onBack={()=>{}} onHelpPick={()=>{}} onBrowse={()=>{}} onOpenAccount={()=>{}}/>;
      case "felicia": return <FeliciaIntro onBack={()=>{}} onContinue={()=>{}}/>;
      case "purpose": return <PurposeScreen onBack={()=>{}} onContinue={()=>{}} value={answers.purpose} onChange={()=>{}} progress={stepProgress(1)}/>;
      case "reassure": return <ReassuranceScreen onBack={()=>{}} onContinue={()=>{}} purpose={answers.purpose || "grow"} progress={stepProgress(2)}/>;
      case "horizon": return <HorizonScreen onBack={()=>{}} onContinue={()=>{}} value={answers.horizon} onChange={()=>{}} progress={stepProgress(2)}/>;
      case "amount": return <AmountScreen onBack={()=>{}} onContinue={()=>{}} value={answers.amount} onChange={()=>{}} progress={stepProgress(3)}/>;
      case "values": return <ValuesScreen onBack={()=>{}} onContinue={()=>{}} value={answers.values} onChange={()=>{}} progress={stepProgress(4)}/>;
      case "processing": return <ProcessingScreen onDone={()=>{}}/>;
      case "result": return <ResultScreen answers={answers} onBack={()=>{}} onRestart={()=>{}} onPickAlt={()=>{}} onOpenDetail={()=>{}}/>;
      case "detail": return <FundDetail fundId={r.fundId} amount={answers.amount} onBack={()=>{}} onInvest={()=>{}}/>;
      case "invest-amount": {
        const f = FUNDS.find(f => f.id === r.fundId);
        return <AmountInvestScreen fundName={f?.name} defaultAmount={answers.amount || 5000} fundMin={r.fundId === "pe" ? 10000 : 1000} onBack={()=>{}} onContinue={()=>{}}/>;
      }
      case "confirm": {
        const f = FUNDS.find(f => f.id === r.fundId);
        return <ConfirmScreen fundName={f?.name} amount={answers.amount} frequency={answers.investFrequency || "one-off"} onBack={()=>{}} onHome={()=>{}}/>;
      }
      default: return null;
    }
  };

  // Determine dark chrome based on current route
  const darkChromeRoutes = ["home","investments","result"];
  const isDark = darkChromeRoutes.includes(route.name);

  // Labels shown above each phone
  const currentLabel = ({
    home: "Monument home",
    investments: "Investments landing",
    felicia: "Felicia's intro",
    purpose: "Why invest?",
    reassure: "Our insight",
    horizon: "Time horizon",
    amount: "Amount",
    values: "What matters",
    processing: "Matching…",
    result: "Your funds",
    detail: "Fund detail",
    eligibility: "Eligibility check",
    "invest-amount": "How much?",
    confirm: "Confirmed",
    "holding-detail": "Your investments",
  })[route.name] || "";

  const peekLabel = "What comes next";

  return (
    <>
      <GlobalKeys route={route} setRoute={setRoute}/>
      <div className="stage">
        <div className="stage-col">
          <div className="caption">{currentLabel}</div>
          <PhoneFrame darkChrome={isDark}>
            <div className="nav-stack" data-dir={dir}>
              {prevRoute && (
                <div className="nav-layer nav-leaving" key={"prev-" + prevRoute.name}>
                  {renderPrevScreen()}
                </div>
              )}
              <div className={"nav-layer" + (prevRoute ? " nav-entering" : "")} key={"cur-" + route.name}>
                {renderScreen()}
              </div>
            </div>
          </PhoneFrame>
        </div>
        {tweaks.showSecondPhone && (
          <div className="stage-col" style={{ opacity: 0.9 }}>
            <div className="caption">{peekLabel}</div>
            <div style={{ pointerEvents: "none", filter: "saturate(0.95)" }}>
              <PhoneFrame darkChrome={darkChromeRoutes.includes(route.name === "home" ? "investments" : route.name)}>{peekScreen()}</PhoneFrame>
            </div>
          </div>
        )}
      </div>

      {/* Sheet overlay lives on top of live phone when open */}
      {whyOpen && route.name === "investments" && (
        /* Render sheet inside a floating clone of the phone — simpler: absolute within page? */
        /* We'll portal it as an absolute element on the live phone. */
        null
      )}

      {tweakVisible && (
        <div className="tweaks-panel">
          <div className="tweaks-title">Tweaks</div>

          <div className="tweaks-row">
            <label>Show "up next" phone</label>
            <div className="opts">
              <button className={"opt" + (tweaks.showSecondPhone ? " active" : "")} onClick={() => applyTweak("showSecondPhone", true)}>On</button>
              <button className={"opt" + (!tweaks.showSecondPhone ? " active" : "")} onClick={() => applyTweak("showSecondPhone", false)}>Off</button>
            </div>
          </div>

          <div className="tweaks-row">
            <label>Felicia intro video step</label>
            <div className="opts">
              <button className={"opt" + (tweaks.feliciaIntro ? " active" : "")} onClick={() => applyTweak("feliciaIntro", true)}>Include</button>
              <button className={"opt" + (!tweaks.feliciaIntro ? " active" : "")} onClick={() => applyTweak("feliciaIntro", false)}>Skip</button>
            </div>
          </div>

          <div className="tweaks-row">
            <label>Reassurance interstitial</label>
            <div className="opts">
              <button className={"opt" + (tweaks.reassuranceStyle === "personal" ? " active" : "")} onClick={() => applyTweak("reassuranceStyle", "personal")}>Personal</button>
              <button className={"opt" + (tweaks.reassuranceStyle === "none" ? " active" : "")} onClick={() => applyTweak("reassuranceStyle", "none")}>Skip</button>
            </div>
          </div>

          <button className="tweaks-reset" onClick={resetProto}>↺ Reset flow to start</button>
        </div>
      )}

      <div className="kb-hint">← → arrow keys skip forward / back · {route.name}</div>
    </>
  );
}

// Global keyboard: arrows to skip between steps (attached in App via useEffect)
const STEP_ORDER = ["home","investments","picker","felicia","purpose","reassure-purpose","priority","reassure-priority","horizon","reassure-horizon","exclusions","reassure-exclusions","processing","result","detail","eligibility","invest-amount","confirm","holding-detail"];

function GlobalKeys({ route, setRoute }) {
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.target.matches?.("input, textarea, select")) return;
      const idx = STEP_ORDER.indexOf(route.name);
      if (e.key === "ArrowRight" && idx < STEP_ORDER.length - 1) {
        const next = STEP_ORDER[idx + 1];
        if (next === "detail" || next === "confirm" || next === "invest-amount") setRoute({ name: next, fundId: "retirement" });
        else if (next === "eligibility") setRoute({ name: next, fundId: "pe" });
        else setRoute({ name: next });
      } else if (e.key === "ArrowLeft" && idx > 0) {
        const prev = STEP_ORDER[idx - 1];
        if (prev === "detail" || prev === "confirm" || prev === "invest-amount") setRoute({ name: prev, fundId: "retirement" });
        else if (prev === "eligibility") setRoute({ name: prev, fundId: "pe" });
        else setRoute({ name: prev });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [route.name]);
  return null;
}

// Render
ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
