#!/usr/bin/env node
// Generates local SEO landing pages ("driving lessons in <area>") into the
// repo root, keeps sitemap.xml in sync, and refreshes the "Areas we cover"
// link grid in index.html between AREAS:START/END markers.
//
// Usage: node scripts/generate-areas.mjs
import { readFileSync, writeFileSync } from "node:fs";

const DOMAIN = "https://cruisenpass.com";

// ---------------------------------------------------------------------------
// Area data. `blurb` is hand-written local context; keep it factual and
// specific — thin/templated copy is a doorway-page risk.
// ---------------------------------------------------------------------------
const AREAS = [
  { name: "Manchester", slug: "manchester", blurb: "From the city-centre one-way systems and tram-heavy junctions to the residential streets of Moss Side and Longsight, learning to drive in Manchester proper prepares you for anything the UK road network can throw at you. Our instructors know the Cheetham Hill and West Didsbury test routes inside out." },
  { name: "Manchester City Centre", slug: "manchester-city-centre", blurb: "City-centre driving is its own skill: bus lanes, box junctions, multi-lane roundabouts and constant pedestrians. Lessons around the A57(M) and inner ring road build the confidence to drive anywhere — and the Cheetham Hill test centre is minutes away." },
  { name: "Salford", slug: "salford", blurb: "Salford's mix of dual carriageways (A6, A580 East Lancs Road) and regenerated quays roads makes it a great place to learn. We cover Salford, Salford Quays and Broughton with pick-up from home, work or college." },
  { name: "Broughton", slug: "broughton", blurb: "Lessons around Broughton's terraced streets and the busy A56 Great Clowes Street corridor give you real-world practice close to home, with quick access to test routes towards Salford and Cheetham Hill." },
  { name: "Bolton", slug: "bolton", blurb: "Bolton learners get the best of both worlds: town-centre traffic around the A666 and quieter residential routes in Burnden and Harwood. The Bolton test centre area is our instructors' home turf." },
  { name: "Burnden", slug: "burnden", blurb: "Based around Burnden and the A58, lessons here mix steep residential streets with the busy Manchester–Bolton corridor — ideal preparation for independent driving and sat-nav routes." },
  { name: "Harwood", slug: "harwood", blurb: "Harwood's suburban roads and nearby country lanes towards Edgworth offer calm spaces to build core skills, with busier Bolton routes added as you progress." },
  { name: "Bury", slug: "bury", blurb: "Learn around Bury's market-town traffic, the A58 and the Metrolink-crossed junctions learners are routinely tested on. The Bury test centre is well known to our instructors, right down to its trickiest roundabouts." },
  { name: "Old Trafford", slug: "old-trafford", blurb: "Match-day traffic aside, Old Trafford is a fantastic training ground: the A56, Trafford Bar junctions and Wharf Road loop all feature in local test routes towards the Sale and West Didsbury centres." },
  { name: "Rochdale", slug: "rochdale", blurb: "Rochdale lessons mix the A58 and A627(M) corridors with the town-centre one-way system and quieter routes towards Littleborough. The Rochdale test centre sits right on the training ground — instructor Hassan Iqbal has guided learners to passes here, including a pass with zero minors.", passes: [{"name":"Mary-Ann Addo-Mensah","text":"I passed my test with no minors in Rochdale yesterday and I couldn't have done it without Mr Hassan Iqbal's expertise! I had an extremely limited time to prepare for this test but he was very patient and knowledgeable, explained things clearly, and gave me the confidence I needed."}] },
  { name: "Stretford", slug: "stretford", blurb: "Stretford learners practise on the A5145 and around the Trafford Centre interchange — one of the busiest roundabout systems in Greater Manchester and a genuine test of lane discipline." },
  { name: "Sale", slug: "sale", blurb: "With the Sale test centre on your doorstep, lessons here can mirror real test conditions from day one: the A56 crossroads, Sale Water Park routes and the residential grid off Norris Road." },
  { name: "Chorlton-Cum-Hardy", slug: "chorlton-cum-hardy", blurb: "Chorlton's mix of cycle-heavy streets, the A5103 corridor and quiet Barlow Moor Road side roads makes it perfect for staged learning — quiet starts, busy finishes — with West Didsbury test centre close by." },
  { name: "Withington", slug: "withington", blurb: "Lessons around Withington's busy Burton Road and the student-dense side streets teach observation and anticipation fast. West Didsbury and West Didsbury (Mauldeth Road) test routes are regular practice ground." },
  { name: "Didsbury", slug: "didsbury", blurb: "Didsbury learners train on the A5145 Kingsway, around Didsbury Village and along the Mersey routes — with the West Didsbury test centre practically on the doorstep." },
  { name: "West Didsbury", slug: "west-didsbury", blurb: "Home to one of Manchester's busiest test centres, West Didsbury is where many local tests start and end. Learning here means practising the actual roads your test will use." },
  { name: "Burnage", slug: "burnage", blurb: "Burnage's long straight residential roads are ideal for mastering clutch control and mirror routines early, before progressing to the A34 Kingsway and nearby test routes." },
  { name: "Levenshulme", slug: "levenshulme", blurb: "Levenshulme's A6 Stockport Road is one of South Manchester's most demanding learner corridors — master it here and test-day traffic holds no fears." },
  { name: "Longsight", slug: "longsight", blurb: "Lessons around Longsight build city driving skills quickly: the A6, busy Five Ways junction and dense residential parking all sharpen the skills examiners look for." },
  { name: "Rusholme", slug: "rusholme", blurb: "The Curry Mile teaches more observation per mile than almost anywhere in Manchester. Rusholme learners graduate to the A34 and towards test routes with genuine confidence." },
  { name: "Hulme", slug: "hulme", blurb: "Hulme's grid streets and the Princess Parkway (A5103) junctions offer a compact but complete training ground minutes from the city centre and Cheetham Hill test centre." },
  { name: "Ancoats", slug: "ancoats", blurb: "Ancoats and the New Islington area add tram junctions, 20mph zones and city-centre complexity to your lessons — ideal for learners aiming to drive professionally in town." },
  { name: "Cheetham Hill", slug: "cheetham-hill", blurb: "Cheetham Hill Road is a test-route staple. Learning here means daily practice on the exact roads used by the Cheetham Hill (Aldergrove Road) test centre." },
  { name: "Crumpsall", slug: "crumpsall", blurb: "Crumpsall learners work on the A6010 ring road and the quieter streets off Crumpsall Lane before progressing to Cheetham Hill test routes just down the road." },
  { name: "Blackley", slug: "blackley", blurb: "Blackley's mix of the A6010, Victoria Avenue East and residential estates offers a calm start and a demanding finish — a natural progression route for new learners." },
  { name: "Chadderton", slug: "chadderton", blurb: "Chadderton sits between Oldham and Manchester with the A627(M) and Broadway corridor on the doorstep — and the Chadderton test centre nearby means realistic test-route practice.", passes: [{"name":"Amalu Jose","text":"I am really happy that I passed my driving test in Chadderton today. A special thanks to my instructor, Mr Farhan, who built my confidence throughout my driving lessons and supported me in passing my test. I really appreciate his patience and guidance."},{"name":"Aghabiomon Oladeru","text":"I'm so so excited right now! It was an early morning first time pass for me today at Chadderton test centre. My driving instructor Mr Ali was so so patient and helpful on this journey. I recommend him 100%."},{"name":"Maya G Nair","text":"I passed my driving test in Chadderton test centre today. I do not have words to say thank you to my instructor Mr. Ali. He is one of the best teachers with lots of patience and trust in you. I will highly recommend him for your driving journey."}] },
  { name: "Stockport", slug: "stockport", blurb: "Stockport's iconic pyramid roundabout and the A6 corridor are legendary among local learners. Conquer Stockport's road system and you are ready to pass anywhere in Greater Manchester." },
  { name: "Cheadle", slug: "cheadle", blurb: "Lessons around Cheadle Village, the A34 and Kingsway junctions build the multi-lane confidence examiners reward, with Stockport test routes close at hand." },
  { name: "Cheadle Hulme", slug: "cheadle-hulme", blurb: "Cheadle Hulme's station junctions and residential boulevards are a gentle introduction before tackling the A34 and the famous Stockport roundabouts." },
  { name: "Bramhall", slug: "bramhall", blurb: "Bramhall learners progress from quiet village streets to the A555 and A6 corridors, building towards Stockport and Hazel Grove test routes at their own pace." },
  { name: "Hazel Grove", slug: "hazel-grove", blurb: "The A6 through Hazel Grove is a proper test of lane discipline and anticipation — and a staple of local test routes. Learn it with instructors who drive it every day." },
  { name: "Heald Green", slug: "heald-green", blurb: "Heald Green offers quiet residential starts and quick access to the A538 and M56 junctions — ideal for learners who want motorway-roundabout experience before their test." },
  { name: "Romiley", slug: "romiley", blurb: "Romiley's Compsteyn Bridge roads and the B6104 towards Marple give learners country-road experience rare in Greater Manchester, balanced with Stockport test routes nearby." },
  { name: "Bredbury", slug: "bredbury", blurb: "Bredbury learners master the A560 and the busy Bredbury interchange before progressing towards Stockport — solid preparation for any test centre in the area.", passes: [{"name":"Suba Penmetsa","text":"I passed my driving test in Bredbury today, and I would like to sincerely thank my instructor, Mr. Hassan Iqbal, for his excellent guidance and support throughout my learning journey. Couldn't have done it without him."}] },
  { name: "Atherton", slug: "atherton", blurb: "Atherton's A577 and A579 corridors plus quieter streets towards Hag Fold make a well-rounded training ground, with Bolton and Wigan test centres within easy reach." },
];

// ---------------------------------------------------------------------------
const PACKAGES = [
  { name: "Pay As You Go", price: "£35/hr", desc: "Flexible hourly lessons, 2-hour minimum" },
  { name: "Beginner Boot", price: "£320", desc: "10-hour package for absolute beginners" },
  { name: "Skill Booster", price: "£495", desc: "15 hours — roundabouts and test prep" },
  { name: "Confidence Builder", price: "£660", desc: "20 hours incl. dual carriageways" },
  { name: "Fast Track Pass", price: "£990", desc: "30-hour intensive for a first-attempt pass" },
];

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function page(a) {
  const title = `Driving Lessons in ${a.name} | Cruise'N'Pass — From £35/hr`;
  const desc = `Driving lessons in ${a.name} with DVSA-approved instructors. 90%+ first-time pass rate, flexible pick-ups across ${a.name} and packages from £320. Book today.`;
  const url = `${DOMAIN}/driving-lessons-${a.slug}`;
  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${url}">

  <meta property="og:type" content="website">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="Driving Lessons in ${esc(a.name)} | Cruise'N'Pass">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:image" content="${DOMAIN}/og-image.webp">
  <meta property="og:site_name" content="Cruise'N'Pass">
  <meta property="og:locale" content="en_GB">
  <meta name="twitter:card" content="summary_large_image">

  <meta name="theme-color" content="#00D1A0">
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🚗</text></svg>">
  <script defer data-domain="cruisenpass.com" src="https://plausible.io/js/script.js"></script>
  <link rel="stylesheet" href="styles.css?v=2">
  <link rel="stylesheet" href="assets/vendor/fontawesome/all.min.css">

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {"@type": "WebPage","@id": "${url}#webpage","url": "${url}","name": ${JSON.stringify(title)},"inLanguage": "en-GB","isPartOf": {"@id": "${DOMAIN}/#website"}},
      {"@type": "Service","@id": "${url}#service","serviceType": "Driving lessons","provider": {"@id": "${DOMAIN}/#organization"},"areaServed": {"@type": "Place","name": ${JSON.stringify(a.name)}},"offers": {"@type": "Offer","price": "35","priceCurrency": "GBP","description": "Pay-as-you-go driving lessons in ${esc(a.name)} from £35 per hour"},"url": "${url}"},
      {"@type": "BreadcrumbList","itemListElement": [
        {"@type": "ListItem","position": 1,"name": "Home","item": "${DOMAIN}/"},
        {"@type": "ListItem","position": 2,"name": "Driving Lessons in ${esc(a.name)}","item": "${url}"}
      ]}
    ]
  }
  </script>
</head>
<body class="bg-white text-slate-700 font-sans antialiased overflow-x-hidden">

  <header class="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100">
    <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
      <a href="/" class="flex items-center gap-2 font-heading font-bold text-xl text-brand-dark"><span class="bg-brand-electric p-2 rounded-xl text-white">🚗</span> Cruise'N'Pass</a>
      <nav class="hidden md:flex items-center gap-6 text-sm font-semibold" aria-label="Main">
        <a href="/#prices" class="text-slate-600 hover:text-brand-electric transition-colors">Prices</a>
        <a href="/learn-now" class="text-slate-600 hover:text-brand-electric transition-colors">Learn Now</a>
        <a href="/join-cruisenpass" class="text-slate-600 hover:text-brand-electric transition-colors">Join Us</a>
        <a href="/#contacts" class="bg-brand-electric text-white px-4 py-2 rounded-xl hover:opacity-90 transition-opacity">Book Now</a>
      </nav>
      <a href="tel:07916155054" class="md:hidden bg-brand-electric text-white p-3 rounded-xl" aria-label="Call us"><i class="fa-solid fa-phone"></i></a>
    </div>
  </header>

  <main>
    <section class="py-16 md:py-24 bg-gradient-to-b from-brand-surface to-white">
      <div class="max-w-4xl mx-auto px-6">
        <p class="text-xs font-bold text-brand-accent uppercase tracking-widest mb-3"><i class="fa-solid fa-location-dot mr-1"></i> ${esc(a.name)}, Greater Manchester</p>
        <h1 class="font-heading text-4xl md:text-6xl font-extrabold text-brand-dark tracking-tight mb-6 leading-tight">Driving Lessons in ${esc(a.name)} from £35 an Hour</h1>
        <p class="text-lg text-slate-600 leading-relaxed mb-8">${esc(a.blurb)}</p>
        <div class="flex flex-col sm:flex-row items-center gap-4 mb-10">
          <a href="/#contacts" class="w-full sm:w-auto text-center bg-brand-electric text-white font-bold px-8 py-4 rounded-xl transition-all hover:scale-105 shadow-lg shadow-brand-electric/20">Book a Lesson in ${esc(a.name)}</a>
          <a href="tel:07916155054" class="w-full sm:w-auto text-center bg-white border border-slate-200 text-slate-800 font-bold px-8 py-4 rounded-xl transition-all"><i class="fa-solid fa-phone mr-2"></i>Call 07916 155054</a>
        </div>
        <div class="grid grid-cols-3 gap-4 max-w-lg">
          <div class="text-center p-4 bg-white rounded-2xl border border-slate-100"><p class="font-heading text-2xl font-extrabold text-brand-dark">90%+</p><p class="text-xs text-slate-500">first-time pass rate</p></div>
          <div class="text-center p-4 bg-white rounded-2xl border border-slate-100"><p class="font-heading text-2xl font-extrabold text-brand-dark">DVSA</p><p class="text-xs text-slate-500">approved instructors</p></div>
          <div class="text-center p-4 bg-white rounded-2xl border border-slate-100"><p class="font-heading text-2xl font-extrabold text-brand-dark">£35</p><p class="text-xs text-slate-500">per hour, from</p></div>
        </div>
      </div>
    </section>

    <section class="py-16">
      <div class="max-w-4xl mx-auto px-6">
        <h2 class="font-heading text-3xl md:text-4xl font-extrabold text-brand-dark tracking-tight mb-8">Lesson Packages &amp; Prices</h2>
        <div class="space-y-3">
          ${PACKAGES.map((p) => `
          <div class="flex items-center justify-between gap-4 p-5 bg-brand-surface border border-slate-100 rounded-2xl">
            <div><p class="font-heading font-bold text-brand-dark">${p.name}</p><p class="text-sm text-slate-500">${p.desc}</p></div>
            <p class="font-heading font-extrabold text-xl text-brand-electric whitespace-nowrap">${p.price}</p>
          </div>`).join("")}
        </div>
        <p class="text-sm text-slate-500 mt-4">Full details on our <a href="/#prices" class="text-brand-electric hover:underline">prices page</a>.</p>
      </div>
    </section>${a.passes ? `

    <section class="py-16">
      <div class="max-w-4xl mx-auto px-6">
        <h2 class="font-heading text-3xl md:text-4xl font-extrabold text-brand-dark tracking-tight mb-8">Recent passes near ${esc(a.name)}</h2>
        <div class="space-y-3">
          ${a.passes.map((p) => `
          <div class="p-5 bg-white border border-slate-100 rounded-2xl">
            <p class="text-slate-600 leading-relaxed mb-3">${esc(p.text)}</p>
            <p class="text-sm font-semibold text-slate-700">— ${esc(p.name)}, Google review</p>
          </div>`).join("")}
        </div>
        <p class="mt-4 text-sm text-slate-500"><a href="https://www.google.com/search?q=Cruise%27N%27Pass+driving+school+Manchester+reviews" target="_blank" rel="noopener noreferrer" class="text-brand-electric hover:underline">Read more Google reviews</a></p>
      </div>
    </section>
` : ``}

    <section class="py-16 bg-brand-surface">
      <div class="max-w-4xl mx-auto px-6">
        <h2 class="font-heading text-3xl md:text-4xl font-extrabold text-brand-dark tracking-tight mb-8">Learning to Drive in ${esc(a.name)} — FAQs</h2>
        <div class="space-y-6">
          <div><h3 class="font-heading font-bold text-lg text-brand-dark mb-1">Do you pick up from my home in ${esc(a.name)}?</h3><p class="text-slate-600 leading-relaxed">Yes — we pick up from home, work or college anywhere in ${esc(a.name)} and the surrounding areas at no extra charge.</p></div>
          <div><h3 class="font-heading font-bold text-lg text-brand-dark mb-1">How many lessons will I need?</h3><p class="text-slate-600 leading-relaxed">Most learners need between 20 and 40 hours. Your instructor will give you an honest estimate after your first lesson — no padding, no upselling.</p></div>
          <div><h3 class="font-heading font-bold text-lg text-brand-dark mb-1">Which test centre will I use?</h3><p class="text-slate-600 leading-relaxed">We'll recommend the DVSA test centre that best fits ${esc(a.name)} — usually the one whose routes you've been practising. Your instructor will only book you in when you're genuinely ready.</p></div>
        </div>
      </div>
    </section>

    <section class="py-16">
      <div class="max-w-4xl mx-auto px-6 text-center">
        <h2 class="font-heading text-3xl md:text-4xl font-extrabold text-brand-dark tracking-tight mb-4">Ready to Start in ${esc(a.name)}?</h2>
        <p class="text-slate-600 text-lg mb-8">Message us on WhatsApp or call <a href="tel:07916155054" class="text-brand-electric font-semibold hover:underline">07916 155054</a> — we usually reply within the hour.</p>
        <a href="/#contacts" class="inline-block bg-brand-electric text-white font-bold px-10 py-4 rounded-xl transition-all hover:scale-105 shadow-lg shadow-brand-electric/20">Book Your First Lesson</a>
      </div>
    </section>
  </main>

  <footer class="bg-brand-dark text-slate-300 py-12">
    <div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
      <nav class="order-3 md:order-1 w-full md:w-auto flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm" aria-label="Footer">
        <a href="/" class="text-slate-400 hover:text-white transition-colors">Driving Lessons</a>
        <a href="/learn-now" class="text-slate-400 hover:text-white transition-colors">Free Tutorials</a>
        <a href="/join-cruisenpass" class="text-slate-400 hover:text-white transition-colors">Instructor Careers</a>
        <a href="/privacy" class="text-slate-400 hover:text-white transition-colors">Privacy Policy</a>
        <a href="/driving-lesson-prices" class="text-slate-400 hover:text-white transition-colors">Prices</a>
        <a href="/blog" class="text-slate-400 hover:text-white transition-colors">Blog</a>
        <a href="/driving-faq" class="text-slate-400 hover:text-white transition-colors">FAQs</a>
        <a href="/reviews" class="text-slate-400 hover:text-white transition-colors">Reviews</a>
        <a href="/intensive-driving-course" class="text-slate-400 hover:text-white transition-colors">Intensive Courses</a>
      </nav>
      <p class="text-sm text-slate-400 text-center order-2">© <span id="footer-year">2025</span> Cruise'N'Pass. DVSA-approved driving lessons across Greater Manchester.</p>
      <div class="flex items-center gap-2 order-1 md:order-3">
        <a href="https://www.instagram.com/cruisenpass/" target="_blank" rel="noopener noreferrer" class="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 hover:bg-brand-electric hover:text-white text-slate-300 transition-all" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
        <a href="https://www.youtube.com/@cruisenpass" target="_blank" rel="noopener noreferrer" class="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 hover:bg-red-500 hover:text-white text-slate-300 transition-all" aria-label="YouTube"><i class="fa-brands fa-youtube"></i></a>
        <a href="https://www.tiktok.com/@cruisenpassdriving" target="_blank" rel="noopener noreferrer" class="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white hover:text-black text-slate-300 transition-all" aria-label="TikTok"><i class="fa-brands fa-tiktok"></i></a>
      </div>
    </div>
  </footer>

  <script src="assets/js/site.js?v=2"></script>
</body>
</html>
`;
}

// ---------------------------------------------------------------------------
let created = 0;
for (const a of AREAS) {
  const file = `driving-lessons-${a.slug}.html`;
  writeFileSync(file, page(a));
  created++;
}
console.log(`generate-areas: wrote ${created} landing page(s)`);

// ---- sitemap.xml ----
let sitemap = readFileSync("sitemap.xml", "utf8");
for (const a of AREAS) {
  const url = `${DOMAIN}/driving-lessons-${a.slug}`;
  const entry = `  <url><loc>${url}</loc></url>\n`;
  if (!sitemap.includes(url)) sitemap = sitemap.replace("</urlset>", entry + "</urlset>");
}
writeFileSync("sitemap.xml", sitemap);
console.log("generate-areas: sitemap.xml updated");

// ---- index.html areas grid ----
const index = readFileSync("index.html", "utf8");
const START = "<!-- AREAS:START -->";
const END = "<!-- AREAS:END -->";
const links = AREAS.map(
  (a) => `<a href="driving-lessons-${a.slug}" class="px-5 py-2.5 rounded-full bg-brand-surface border border-slate-200 text-slate-700 hover:text-brand-electric hover:border-brand-electric font-semibold text-sm flex items-center gap-2 transition-colors"><i class="fa-solid fa-location-dot text-brand-active"></i>${esc(a.name)}</a>`
).join("\n          ");
const block = `${START}
          ${links}
          ${END}`;
if (index.includes(START) && index.includes(END)) {
  const re = new RegExp(`${START}[\\s\\S]*?${END}`);
  writeFileSync("index.html", index.replace(re, block));
  console.log("generate-areas: index.html areas grid updated");
} else {
  console.log("generate-areas: NOTE — no AREAS:START/END markers in index.html; add them manually");
}
