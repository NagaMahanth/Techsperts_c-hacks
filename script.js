/* ================================
   RECEIPT — SDG 12
   ================================ */

/* Verified per-unit impact factors.
   Sources: WWF, FAO, UNEP, IEA, ICAO. Rounded averages. */
const IMPACT = {
  clothes:   { water: 2700, co2: 10,    waste: 300,  label: "Fast-fashion item" },
  meat:      { water: 2200, co2: 3.9,   waste: 0,    label: "Meat-based meal"   },
  bottles:   { water: 5,    co2: 0.082, waste: 10,   label: "Plastic bottle"    },
  orders:    { water: 20,   co2: 0.5,   waste: 1170, label: "Online order"      },
  streaming: { water: 0,    co2: 0.036, waste: 0,    label: "Hour of HD stream" },
  flights:   { water: 0,    co2: 250,   waste: 0,    label: "Short-haul flight" },
  food:      { water: 300,  co2: 0.5,   waste: 400,  label: "Wasted meal"       },
};

/* Live slider output */
const sliders = ["clothes", "meat", "bottles", "orders", "streaming", "flights", "food"];
sliders.forEach((k) => {
  const input = document.getElementById(`q_${k}`);
  const out   = document.getElementById(`o_${k}`);
  input.addEventListener("input", () => (out.textContent = input.value));
});

/* Form submit */
const form = document.getElementById("receiptForm");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputs = {};
  sliders.forEach((k) => (inputs[k] = +document.getElementById(`q_${k}`).value));
  renderReceipt(inputs);
});

/* Reset */
document.getElementById("resetBtn").addEventListener("click", () => {
  document.getElementById("receipt-section").hidden = true;
  document.getElementById("form").scrollIntoView({ behavior: "smooth" });
});

/* ---------- RECEIPT RENDERER ---------- */
function renderReceipt(inputs) {
  const items    = document.getElementById("receipt_items");
  const totals   = document.getElementById("receipt_totals");
  const section  = document.getElementById("receipt-section");
  const metaEl   = document.getElementById("receipt_meta");
  const dmgEl    = document.getElementById("receipt_damage_value");
  const codeEl   = document.getElementById("receipt_code");
  const retGrid  = document.getElementById("returnGrid");

  items.innerHTML   = "";
  totals.innerHTML  = "";
  retGrid.innerHTML = "";

  /* Meta */
  const now = new Date();
  const stamp = now.toLocaleString("en-GB", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
  const order = String(Math.floor(100000 + Math.random() * 900000));
  metaEl.textContent = `ORDER #${order} · ${stamp}`;
  codeEl.textContent = `* * * ${order} * * *`;

  /* Build line items */
  const lines = [];
  let tWater = 0, tCo2 = 0, tWaste = 0;

  sliders.forEach((k) => {
    const q = inputs[k];
    if (q <= 0) return;
    const imp = IMPACT[k];
    const w  = imp.water * q;
    const c  = imp.co2   * q;
    const g  = imp.waste * q;
    tWater += w; tCo2 += c; tWaste += g;

    const label = `${q}× ${imp.label}${q > 1 ? "s" : ""}`;
    const value = formatImpactLine(w, c, g);
    lines.push({ type: "item", left: label, right: value });
  });

  if (lines.length === 0) {
    lines.push({ type: "item", left: "No consumption logged", right: "A rare week." });
  }

  /* Totals block */
  const totalLines = [
    { type: "cat", left: "SUBTOTAL",         right: "" },
    { type: "sub", left: "Water used",       right: `${fmt(tWater)} L` },
    { type: "sub", left: "CO₂ emitted",      right: `${fmt(tCo2, 1)} kg` },
    { type: "sub", left: "Packaging waste",  right: `${fmt(tWaste)} g` },
  ];

  /* Compute a single "damage index" so the red total means something */
  const damage = Math.round(
    tWater * 0.001 +   // 1 point per 1000 L water
    tCo2   * 1.5   +   // 1.5 points per kg CO2
    tWaste * 0.002     // small weight for packaging grams
  );
  dmgEl.textContent = `${damage} pts`;

  /* Report card + compare */
  updateReportCard(damage);
  updateCompareBar(damage);

  /* Reveal section */
  section.hidden = false;
  section.scrollIntoView({ behavior: "smooth", block: "start" });

  /* Render lines */
  const allLines = [...lines, ...totalLines];
  allLines.forEach((ln) => {
    const div = document.createElement("div");
    div.className = `r-line ${ln.type === "cat" ? "cat" : ln.type === "sub" ? "sub" : ""}`;
    div.innerHTML = `<span>${ln.left}</span><span>${ln.right}</span>`;
    (ln.type === "cat" || ln.type === "sub") ? totals.appendChild(div) : items.appendChild(div);
  });

  /* Animate line-by-line (GSAP if available, otherwise plain) */
  const nodes = document.querySelectorAll(".r-line");
  if (window.gsap) {
    gsap.to(nodes, {
      opacity: 1,
      y: 0,
      duration: 0.25,
      stagger: 0.08,
      ease: "power1.out",
      onStart: () => nodes.forEach((n) => n.classList.add("show")),
    });
  } else {
    nodes.forEach((n, i) =>
      setTimeout(() => n.classList.add("show"), i * 80)
    );
  }

  /* Return items */
  buildReturnCards(inputs, retGrid);
}

/* Format a per-row impact string */
function formatImpactLine(w, c, g) {
  const parts = [];
  if (w > 0) parts.push(`${fmt(w)} L`);
  if (c > 0) parts.push(`${fmt(c, 1)} kg CO₂`);
  if (g > 0) parts.push(`${fmt(g)} g`);
  return parts.join(" · ") || "—";
}

function fmt(n, dp = 0) {
  if (n >= 1000) return n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
  return n.toLocaleString("en-IN", { maximumFractionDigits: dp });
}

/* ---------- RETURN CARDS ---------- */
function buildReturnCards(inputs, grid) {
  const swaps = [];
  if (inputs.clothes > 0)   swaps.push(["🧥", "Swap one new buy for secondhand", "Save ~2,700 L water."]);
  if (inputs.meat > 3)      swaps.push(["🥗", "Skip 2 meat meals", "Cut ~8 kg CO₂ next week."]);
  if (inputs.bottles > 2)   swaps.push(["🚰", "Carry a reusable bottle", "Avoid ~400 g plastic/month."]);
  if (inputs.orders > 2)    swaps.push(["📦", "Batch orders into one delivery", "Half the packaging."]);
  if (inputs.streaming > 10) swaps.push(["📺", "Stream in SD when possible", "Up to 10× less data."]);
  if (inputs.flights > 0)   swaps.push(["🚆", "Pick train for one trip", "Save ~200 kg CO₂."]);
  if (inputs.food > 1)      swaps.push(["🥘", "Plan meals before shopping", "Cut food waste by half."]);
  if (swaps.length === 0)   swaps.push(["🌱", "Keep going", "Your receipt is lighter than most."]);

  swaps.forEach(([e, h, p]) => {
    const d = document.createElement("div");
    d.className = "return__card";
    d.innerHTML = `<div class="emoji">${e}</div><h4>${h}</h4><p>${p}</p>`;
    grid.appendChild(d);
  });
}

/* ---------- REPORT CARD ---------- */
function updateReportCard(damage) {
  const g = document.getElementById("reportGrade");
  const t = document.getElementById("reportTitle");
  const m = document.getElementById("reportMsg");
  let grade, title, msg;
  if (damage < 20)       { grade = "A"; title = "Light footprint";     msg = "Among the lowest 10% of weeks. The planet barely noticed."; }
  else if (damage < 40)  { grade = "B"; title = "Below average";        msg = "Better than most. A few small swaps and you'd be in the top tier."; }
  else if (damage < 70)  { grade = "C"; title = "Average week";         msg = "You're where most people are. Which is a problem, because 'most people' is the problem."; }
  else if (damage < 120) { grade = "D"; title = "Heavy consumption";    msg = "Noticeable damage. The 'Return Items' section below is for you."; }
  else                   { grade = "F"; title = "Industrial-grade week"; msg = "A single week of yours equals a month for someone else. Start with one pledge."; }
  g.textContent = grade;
  t.textContent = title;
  m.textContent = msg;
}

/* ---------- COMPARE BAR ---------- */
function updateCompareBar(damage) {
  const indiaAvg = 52, globalAvg = 78, maxScale = 200;
  const youPct = Math.min(100, Math.round((damage / maxScale) * 100));
  const bar = document.getElementById("barYou");
  const val = document.getElementById("valYou");
  setTimeout(() => { bar.style.width = youPct + "%"; }, 300);
  val.textContent = `${damage} pts`;
  bar.classList.remove("compare__fill--good");
  if (damage < 30) bar.classList.add("compare__fill--good");
}

/* ---------- PLEDGE ---------- */
const pledgeTexts = {
  bottle:     "Carry a reusable bottle for one week.",
  meatless:   "One meatless day for the next 7 days.",
  secondhand: "No new clothes for one week.",
  batch:      "All online orders in one delivery day this week.",
  repair:     "Repair one broken item instead of replacing it.",
  meal:       "Finish every plate. No food in the bin this week.",
};
const pledgeBaseCount = {
  bottle: 1247, meatless: 892, secondhand: 614, batch: 503, repair: 421, meal: 1056,
};
document.querySelectorAll(".pledge__card").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".pledge__card").forEach((c) => c.classList.remove("selected"));
    btn.classList.add("selected");
    const key = btn.dataset.pledge;
    document.getElementById("pledgeText").textContent = pledgeTexts[key];
    const count = (pledgeBaseCount[key] || 500) + Math.floor(Math.random() * 50);
    document.getElementById("pledgeCount").textContent = count.toLocaleString("en-IN");
    document.getElementById("pledgeConfirm").hidden = false;
  });
});

/* ---------- CITY MULTIPLIER ---------- */
const actionImpact = {
  bottle:   { water: 5,    co2: 0.082, equiv: "trees planted",       equivFactor: 0.004 },
  meatless: { water: 2200, co2: 3.9,   equiv: "cars off road / day", equivFactor: 0.001 },
  shirt:    { water: 2700, co2: 10,    equiv: "swimming pools water", equivFactor: 0.000004 },
  order:    { water: 20,   co2: 0.5,   equiv: "garbage trucks waste", equivFactor: 0.0001 },
};
function updateMultiplier() {
  const city = +document.getElementById("citySelect").value;
  const key = document.getElementById("actionSelect").value;
  const a = actionImpact[key];
  const weeks = 52;
  const w = city * a.water * weeks;
  const c = city * a.co2 * weeks;
  const e = Math.round(city * a.equivFactor * weeks);
  document.getElementById("mWater").textContent = formatBig(w);
  document.getElementById("mCo2").textContent   = formatBig(c);
  document.getElementById("mEquiv").textContent = formatBig(e);
  document.getElementById("mEquivUnit").textContent = a.equiv;
}
function formatBig(n) {
  if (n >= 1e9) return (n / 1e9).toFixed(1) + "B";
  if (n >= 1e7) return (n / 1e7).toFixed(1) + " Cr";
  if (n >= 1e5) return (n / 1e5).toFixed(1) + " L";
  if (n >= 1e3) return (n / 1e3).toFixed(1) + "k";
  return n.toLocaleString("en-IN");
}
document.getElementById("citySelect").addEventListener("change", updateMultiplier);
document.getElementById("actionSelect").addEventListener("change", updateMultiplier);
updateMultiplier();

/* ---------- MYTH CARDS ---------- */
const myths = [
  { myth: "Recycling plastic solves the plastic problem.",       fact: "Less than 9% of plastic ever made has been recycled. Reducing use matters more." },
  { myth: "Paper bags are always better than plastic.",          fact: "A paper bag needs ~4 reuses to beat a plastic bag's carbon footprint. Reuse what you have." },
  { myth: "Local food is always greener.",                       fact: "Transport is only ~10% of food emissions. What you eat matters far more than where it came from." },
  { myth: "Electric cars have zero environmental cost.",         fact: "Battery production is carbon-intensive. EVs win over time, but reducing driving wins faster." },
  { myth: "Fast fashion is cheap for the planet too.",           fact: "The industry produces 10% of global carbon emissions and 20% of wastewater." },
  { myth: "One person can't make a difference.",                 fact: "One person × a lifetime × a network × a vote. Scale is how 'one' becomes everything." },
];
const mythGrid = document.getElementById("mythGrid");
myths.forEach((m, i) => {
  const btn = document.createElement("button");
  btn.className = "myth__card";
  btn.innerHTML = `
    <div class="myth__inner">
      <div class="myth__face">
        <span class="myth__badge">MYTH #${String(i + 1).padStart(2, "0")}</span>
        <p class="myth__text">${m.myth}</p>
        <span class="myth__hint">Tap to flip →</span>
      </div>
      <div class="myth__face myth__face--back">
        <span class="myth__badge">FACT</span>
        <p class="myth__text">${m.fact}</p>
        <span class="myth__hint">Tap to flip back</span>
      </div>
    </div>`;
  btn.addEventListener("click", () => btn.classList.toggle("flipped"));
  mythGrid.appendChild(btn);
});

/* ---------- FACTS CAROUSEL ---------- */
const facts = [
  { quote: "A single pair of jeans uses about 7,500 litres of water to produce.", cite: "— UN Environment Programme" },
  { quote: "The world throws away 1.3 billion tonnes of food every year. One-third of all food produced.", cite: "— FAO" },
  { quote: "The fashion industry emits more carbon than all international flights and shipping combined.", cite: "— UNEP" },
  { quote: "If every Indian city skipped one plastic bottle per person per week, we'd save 70 million bottles a year.", cite: "— Estimate from UNEP data" },
  { quote: "The average smartphone contains traces of 30 different metals, many mined in conditions we would never accept at home.", cite: "— UN Trade & Development" },
  { quote: "By 2050, oceans could contain more plastic by weight than fish.", cite: "— Ellen MacArthur Foundation" },
];
let factIdx = 0;
const factQ = document.getElementById("factQuote");
const factC = document.getElementById("factCite");
const factDots = document.getElementById("factDots");
facts.forEach(() => { const s = document.createElement("span"); factDots.appendChild(s); });
function showFact(i) {
  factIdx = (i + facts.length) % facts.length;
  factQ.style.opacity = "0";
  factC.style.opacity = "0";
  setTimeout(() => {
    factQ.textContent = `"${facts[factIdx].quote}"`;
    factC.textContent = facts[factIdx].cite;
    factQ.style.opacity = "1";
    factC.style.opacity = "1";
    [...factDots.children].forEach((d, j) => d.classList.toggle("active", j === factIdx));
  }, 250);
}
document.getElementById("factPrev").addEventListener("click", () => showFact(factIdx - 1));
document.getElementById("factNext").addEventListener("click", () => showFact(factIdx + 1));
showFact(0);
setInterval(() => showFact(factIdx + 1), 7000);
