// accounts.jsx - single source of truth for all Monument accounts shown in
// the app (home screen, Lombard flow, holding detail). Bank accounts are
// static; investment wrappers have a seeded base value (existing holdings
// Wasim already owns) PLUS anything added via the invest flow (held in
// `holdings`), so everything stays in sync across screens.

const BANK_ACCOUNTS = [
 { id: "savings", title: "Easy Access Savings", sub: "3.52% AER", value: 82140.00, kind: "bank" },
 { id: "isa", title: "Easy Access Cash ISA", sub: "3.74% AER", value: 20000.00, kind: "bank" },
];

// Investment wrappers - Wasim's existing portfolio.
// - `seeded` lists the funds already held in the wrapper (before any in-app purchase).
// Each has { id, name, ticker, amount, oneYr } - oneYr drives the little perf row.
// - `eligibleForLombard: false` means the SIPP can't be pledged as collateral.
// - Always shown on home screen (even with 0 in-app holdings) because these
// are real accounts the user holds.
const INVESTMENT_WRAPPERS = [
 {
 id: "iss-isa", title: "Stocks & Shares ISA", wrapper: "isa",
 sub: "Tax-efficient · 2025/26", eligibleForLombard: true,
 seeded: [
 { id: "seed-vwrl", name: "Vanguard FTSE All-World ETF", ticker: "VWRL", amount: 42000, oneYr: 9.2 },
 { id: "seed-vusa", name: "Vanguard S&P 500 ETF", ticker: "VUSA", amount: 23000, oneYr: 14.1 },
 { id: "seed-ftse", name: "iShares Core FTSE 100 ETF", ticker: "ISF", amount: 10000, oneYr: 6.3 },
 ],
 },
 {
 id: "gia", title: "General Investment Account", wrapper: "gia",
 sub: "No annual limit", eligibleForLombard: true,
 seeded: [
 { id: "seed-vusa-gia", name: "Vanguard S&P 500 ETF", ticker: "VUSA", amount: 48000, oneYr: 14.1 },
 { id: "seed-vwrl-gia", name: "Vanguard FTSE All-World ETF", ticker: "VWRL", amount: 36000, oneYr: 9.2 },
 { id: "seed-aiai", name: "L&G Artificial Intelligence ETF",ticker: "AIAI", amount: 22000, oneYr: 31.4 },
 { id: "seed-semb", name: "iShares USD Emerging Markets Bond", ticker: "SEMB", amount: 14000, oneYr: 4.1 },
 ],
 },
 {
 id: "sipp", title: "Personal Pension (SIPP)", wrapper: "pension",
 sub: "Tax-relieved · locked to 57", eligibleForLombard: false,
 seeded: [
 { id: "seed-life-2040", name: "BlackRock LifePath 2040", ticker: "LP40", amount: 180000, oneYr: 7.8 },
 { id: "seed-vwrl-sipp", name: "Vanguard FTSE All-World ETF", ticker: "VWRL", amount: 80000, oneYr: 9.2 },
 { id: "seed-gilt", name: "iShares Core UK Gilts ETF", ticker: "IGLT", amount: 40000, oneYr: 2.1 },
 ],
 },
];

// A holding's wrapper is determined by the fund.
// Default routing: PE → GIA (complex, large minimum), everything else → ISA.
// (Nothing is routed into the pension from the invest flow - pensions are a
// separate product journey.)
const holdingWrapper = (h) => (h.fundId === "pe" ? "gia" : "isa");

// Confirmed Lombard drawdowns land in Easy Access Savings immediately.
// Pass the app's `loans` array and we augment the EA Savings balance by the total.
const getBankAccounts = (loans = []) => {
 const drawdownTotal = loans.reduce((s, l) => s + (l.amount || 0), 0);
 return BANK_ACCOUNTS.map(a => (
 a.id === "savings" ? { ...a, value: a.value + drawdownTotal } : { ...a }
 ));
};

const getInvestmentAccounts = (holdings = []) => {
 return INVESTMENT_WRAPPERS.map(w => {
 const seeded = (w.seeded || []).map(s => ({ ...s, source: "seed" }));
 const own = holdings
 .filter(h => holdingWrapper(h) === w.wrapper)
 .map(h => ({
 id: "app-" + (h.placedAt || Math.random()),
 name: h.fundName, ticker: "", amount: h.amount, oneYr: null,
 source: "app", frequency: h.frequency, placedAt: h.placedAt,
 }));
 const allHoldings = [...seeded, ...own];
 const seededValue = seeded.reduce((s, h) => s + (h.amount || 0), 0);
 const ownValue = own.reduce((s, h) => s + (h.amount || 0), 0);
 const monthly = holdings
 .filter(h => holdingWrapper(h) === w.wrapper && h.frequency === "monthly")
 .reduce((s, h) => s + (h.amount || 0), 0);
 return {
 ...w,
 kind: "investment",
 holdings: allHoldings, // full list (seeded + app purchases) for account detail
 appHoldings: own, // only the ones bought in-app (used where relevant)
 value: seededValue + ownValue,
 monthly,
 };
 });
};

// Accounts that can be used as Lombard collateral. Bank accounts count
// at 100% of value; investment accounts count too (pensions excluded - // you can't pledge a SIPP).
const getEligibleAssets = (holdings = []) => {
 const bank = BANK_ACCOUNTS.map(a => ({
 id: a.id, title: a.title, sub: a.sub, value: a.value, kind: "bank",
 }));
 const inv = getInvestmentAccounts(holdings)
 .filter(a => a.eligibleForLombard)
 .map(a => ({
 id: a.id, title: a.title, sub: a.sub, value: a.value, kind: "investment",
 }));
 return [...bank, ...inv];
};

const getAllAccounts = (holdings = [], loans = []) => ({
 bank: getBankAccounts(loans),
 investments: getInvestmentAccounts(holdings),
});

// Total across every account the user owns (used for net-worth calcs).
const getTotalAssets = (holdings = []) => {
 const bankTotal = BANK_ACCOUNTS.reduce((s, a) => s + a.value, 0);
 const invTotal = getInvestmentAccounts(holdings).reduce((s, a) => s + a.value, 0);
 return bankTotal + invTotal;
};

Object.assign(window, {
 BANK_ACCOUNTS,
 INVESTMENT_WRAPPERS,
 getBankAccounts,
 getInvestmentAccounts,
 getAllAccounts,
 getEligibleAssets,
 getTotalAssets,
});
