// funds.jsx - fund catalog + matching logic
//
// Each result is a single real fund:
// retirement → BlackRock LifePath 2040
// ai → L&G Artificial Intelligence UCITS ETF (AIAI)
// pe → Partners Group Listed Private Equity
//
// Numbers are illustrative but close to the funds' public return profiles.
// Holdings, sector/region/asset breakdowns, and fund facts are modelled.

const FUNDS = [
 {
 id: "retirement",
 name: "Retire by 2040",
 tag: "BlackRock LifePath 2040",
 archetype: "retirement",
 risk: 3,
 horizon: "10–20 years",
 blurb: "A target-date fund that starts growth-tilted and glides automatically toward safer assets as 2040 approaches. Managed by BlackRock, it does the de-risking for you.",
 fiveYr: 7.4, // ~annualised, illustrative
 oneYr: 6.1,
 fee: 0.21,
 min: 1000,

 // Top-10 underlying holdings (snapshot - names only, illustrative weights)
 topHoldings: [
 { name: "Microsoft Corp", pct: 3.1 },
 { name: "Apple Inc", pct: 2.8 },
 { name: "NVIDIA Corp", pct: 2.4 },
 { name: "Amazon.com Inc", pct: 1.7 },
 { name: "Alphabet Inc", pct: 1.5 },
 { name: "Meta Platforms", pct: 1.1 },
 { name: "US Treasury 2.5% 2034", pct: 1.0 },
 { name: "UK Gilt 4.25% 2036", pct: 0.9 },
 { name: "Taiwan Semiconductor", pct: 0.8 },
 { name: "Berkshire Hathaway", pct: 0.7 },
 ],
 sectors: [
 { label: "Technology", pct: 22 },
 { label: "Financials", pct: 14 },
 { label: "Healthcare", pct: 12 },
 { label: "Industrials", pct: 10 },
 { label: "Consumer", pct: 10 },
 { label: "Government bonds", pct: 18 },
 { label: "Corporate bonds", pct: 9 },
 { label: "Other", pct: 5 },
 ],
 regions: [
 { label: "North America", pct: 55 },
 { label: "Europe ex-UK", pct: 14 },
 { label: "UK", pct: 10 },
 { label: "Asia-Pacific", pct: 11 },
 { label: "Emerging markets", pct: 8 },
 { label: "Cash", pct: 2 },
 ],
 assetAllocation: [
 { label: "Global equities", pct: 62 },
 { label: "Global bonds", pct: 23 },
 { label: "UK gilts", pct: 10 },
 { label: "Cash", pct: 5 },
 ],

 fundDetails: {
 fundName: "BlackRock LifePath 2040 Fund",
 price: "£18.21", // as of yesterday (illustrative)
 priceAsOf: "yesterday's close",
 structure: "Open-ended OEIC, UCITS",
 },

 tags: {
 purpose: ["retirement", "preserve", "future", "legacy"],
 horizon: ["medium", "long"],
 values: ["stability", "long-term", "growth"],
 reassure: ["neutral", "worried", "confident"],
 },
 },

 {
 id: "ai",
 name: "Invest in AI companies",
 tag: "L&G Artificial Intelligence ETF",
 archetype: "ai",
 risk: 5,
 horizon: "7+ years",
 blurb: "L&G's flagship AI UCITS ETF, tracking companies enabling and applying artificial intelligence - from chip designers to model builders to the platforms using AI at scale.",
 fiveYr: 16.2,
 oneYr: 28.4,
 fee: 0.49,
 min: 1000,

 topHoldings: [
 { name: "NVIDIA Corp", pct: 8.6 },
 { name: "Microsoft Corp", pct: 6.9 },
 { name: "Meta Platforms", pct: 5.8 },
 { name: "Alphabet Inc", pct: 5.1 },
 { name: "Taiwan Semiconductor", pct: 4.4 },
 { name: "Amazon.com Inc", pct: 4.1 },
 { name: "Broadcom Inc", pct: 3.7 },
 { name: "ASML Holding NV", pct: 3.2 },
 { name: "Palantir Technologies", pct: 2.8 },
 { name: "AMD", pct: 2.4 },
 ],
 sectors: [
 { label: "Semiconductors", pct: 34 },
 { label: "Software & internet", pct: 28 },
 { label: "Hardware & infra", pct: 14 },
 { label: "Communication services", pct: 12 },
 { label: "Data & analytics", pct: 7 },
 { label: "Other", pct: 5 },
 ],
 regions: [
 { label: "North America", pct: 72 },
 { label: "Asia-Pacific", pct: 18 },
 { label: "Europe", pct: 9 },
 { label: "Other", pct: 1 },
 ],
 assetAllocation: [
 { label: "Equities", pct: 98 },
 { label: "Cash", pct: 2 },
 ],

 fundDetails: {
 fundName: "Legal & General Artificial Intelligence UCITS ETF (AIAI)",
 price: "£18.46",
 priceAsOf: "yesterday's close",
 structure: "UCITS ETF, Irish-domiciled",
 },

 tags: {
 purpose: ["grow", "wealth", "future"],
 horizon: ["medium", "long"],
 values: ["growth", "long-term"],
 reassure: ["confident", "neutral"],
 },
 },

 {
 id: "pe",
 name: "Invest in private equity",
 tag: "Partners Group Listed PE",
 archetype: "pe",
 risk: 4,
 horizon: "7–10 years",
 blurb: "A listed vehicle from Partners Group giving access to institutional private equity - buyouts, growth equity, and secondaries usually reserved for pension funds. Semi-liquid: withdraw up to 25% at any time.",
 fiveYr: 11.7,
 oneYr: 9.3,
 fee: 1.25,
 min: 10000,

 topHoldings: [
 { name: "KinderCare Learning", pct: 4.8 },
 { name: "Techem GmbH", pct: 4.2 },
 { name: "Civica Group", pct: 3.9 },
 { name: "Cerba Healthcare", pct: 3.6 },
 { name: "Rovensa SA", pct: 3.3 },
 { name: "EyeCare Partners", pct: 3.1 },
 { name: "SPi Global", pct: 2.8 },
 { name: "United Group", pct: 2.6 },
 { name: "Breitling AG", pct: 2.4 },
 { name: "Foncia Groupe", pct: 2.2 },
 ],
 sectors: [
 { label: "Healthcare", pct: 22 },
 { label: "Industrials", pct: 18 },
 { label: "Consumer services", pct: 16 },
 { label: "Technology", pct: 14 },
 { label: "Financial services", pct: 10 },
 { label: "Education", pct: 8 },
 { label: "Other", pct: 12 },
 ],
 regions: [
 { label: "Europe", pct: 48 },
 { label: "North America", pct: 38 },
 { label: "Asia-Pacific", pct: 10 },
 { label: "Rest of world", pct: 4 },
 ],
 assetAllocation: [
 { label: "Direct buyouts", pct: 58 },
 { label: "Secondaries", pct: 20 },
 { label: "Growth equity", pct: 10 },
 { label: "Liquidity sleeve", pct: 12 },
 ],

 fundDetails: {
 fundName: "Partners Group Listed Private Equity",
 price: "£164.20",
 priceAsOf: "yesterday's close",
 structure: "Listed investment company (semi-liquid)",
 },

 tags: {
 purpose: ["wealth", "grow", "legacy"],
 horizon: ["long"],
 values: ["growth", "long-term"],
 reassure: ["confident"],
 },
 },
];

// ----------- matching ------------
function scoreFund(fund, answers) {
 let score = 0;

 if (answers.purpose && fund.tags.purpose.includes(answers.purpose)) score += 30;

 if (answers.horizon) {
 const horizonBucket = {
 lt1: "short", "1to3": "short", "3to5": "short",
 "5to10": "medium",
 gt10: "long",
 short: "short", medium: "medium", long: "long",
 };
 const bucket = horizonBucket[answers.horizon] || "medium";
 if (fund.tags.horizon.includes(bucket)) score += 25;
 if (bucket === "short" && fund.risk <= 2) score += 15;
 if (bucket === "medium" && fund.risk >= 2 && fund.risk <= 4) score += 15;
 if (bucket === "long" && fund.risk >= 3) score += 15;
 }

 if (answers.reassure) {
 if (answers.reassure === "worried" && fund.risk <= 3) score += 15;
 if (answers.reassure === "neutral" && fund.risk >= 2 && fund.risk <= 4) score += 10;
 if (answers.reassure === "confident" && fund.risk >= 4) score += 15;
 }

 if (answers.values) {
 for (const v of answers.values) {
 if (fund.tags.values.includes(v)) score += 10;
 }
 }

 return score;
}

function matchFunds(answers) {
 const scored = FUNDS.map(f => ({ fund: f, score: scoreFund(f, answers) }));
 scored.sort((a, b) => b.score - a.score);
 return scored.map((s) => ({ fund: s.fund, rawScore: s.score }));
}

// Always returns the three funds in a stable order: retirement, ai, pe.
function portfolioMatches(/* answers */) {
 return FUNDS.map(f => ({ archetype: f.archetype, fund: f }));
}

// Growth projection - simple compound at fund 5yr rate - fee
function projectGrowth(amount, fund, years) {
 const r = (fund.fiveYr - fund.fee) / 100;
 return amount * Math.pow(1 + r, years);
}

Object.assign(window, { FUNDS, scoreFund, matchFunds, portfolioMatches, projectGrowth });
