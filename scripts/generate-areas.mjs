#!/usr/bin/env node
// Generates local SEO landing pages ("driving lessons in <area>") into the
// repo root, keeps sitemap.xml in sync, and refreshes the "Areas we cover"
// link grid in index.html between AREAS:START/END markers.
//
// Usage: node scripts/generate-areas.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { statSync } from "node:fs";

const DOMAIN = "https://cruisenpass.com";

// ---------------------------------------------------------------------------
// Area data. `blurb` is hand-written local context; keep it factual and
// specific — thin/templated copy is a doorway-page risk.
// `testCentre` is the nearest DVSA test centre we train around for this area.
// `nearby` is a hand-curated list of geographically adjacent covered areas —
// used for the "Nearby Areas We Also Cover" block instead of array order.
// ---------------------------------------------------------------------------
const AREAS = [
  { name: "Manchester", slug: "manchester", testCentre: "Cheetham Hill and West Didsbury", nearby: ["manchester-city-centre", "hulme", "longsight"], localNote: "Central lessons tackle one-way systems, bus lanes and Metrolink junctions before branching out to residential streets in Moss Side and Longsight and the test corridors around Cheetham Hill and West Didsbury.", faqs: [{ q: "Which test centre do most Manchester learners use?", a: "Cheetham Hill (10.0-week median wait in Sep 2026, 44.1% pass rate in 2025/26) and West Didsbury (19.9-week median wait, 48.1% pass rate) are the main centres for Manchester proper, alongside Sale, Bury and Chadderton for outer districts." }, { q: "Do Manchester lessons cost more in the city centre?", a: "No. Lessons anywhere in Manchester are £35/hr pay-as-you-go (2-hour minimum) or from £32/hr on block bookings, with free pick-up." }], blurb: "Cruise'N'Pass is a driving school in Manchester. From the city-centre one-way systems and tram-heavy junctions to the residential streets of Moss Side and Longsight, learning to drive in Manchester proper prepares you for anything the UK road network can throw at you. Our instructors know the roads and junctions around the Cheetham Hill and West Didsbury centres inside out." },
  { name: "Manchester City Centre", slug: "manchester-city-centre", testCentre: "Cheetham Hill", nearby: ["ancoats", "hulme", "cheetham-hill"], localNote: "City-centre lessons cover bus lanes, box junctions, tram tracks and one-way systems. We build up from quieter periods to weekday traffic, so the level of stimulation does not come as a shock.", faqs: [{ q: "Can learners drive in Manchester city centre?", a: "Yes — with a DVSA-approved instructor in a dual-controlled car. We start with the quieter streets and build up to the bus lanes, box junctions and one-way systems." }, { q: "Which test centre is closest to the city centre?", a: "Cheetham Hill (Manchester) is the usual local centre for city-centre learners; West Didsbury is another option depending on where you practise." }], blurb: "City-centre driving is its own skill: bus lanes, box junctions, multi-lane roundabouts and constant pedestrians. Lessons around the A57(M) and inner ring road build the confidence to drive anywhere — and the Cheetham Hill test centre is minutes away." },
  { name: "Salford", slug: "salford", testCentre: "Cheetham Hill", nearby: ["broughton", "cheetham-hill", "old-trafford"], localNote: "Salford routes combine higher-speed dual carriageways along the A6 and A580 East Lancs Road with busy quayside junctions and narrow residential streets towards Broughton.", faqs: [{ q: "Do you pick up from Salford Quays and MediaCity?", a: "Yes — we cover Salford, Salford Quays and Broughton with free pick-up from home, work or university." }, { q: "Which driving test centre serves Salford?", a: "Salford learners usually test at Cheetham Hill (Manchester), which sits a short drive east and had a 10.0-week median wait in DVSA's September 2026 data." }], blurb: "Salford's mix of dual carriageways (A6, A580 East Lancs Road) and regenerated quays roads makes it a great place to learn. We cover Salford, Salford Quays and Broughton with pick-up from home, work or college." },
  { name: "Broughton", slug: "broughton", testCentre: "Cheetham Hill", nearby: ["salford", "cheetham-hill", "crumpsall"], blurb: "Lessons around Broughton's terraced streets and the busy A56 Great Clowes Street corridor give you real-world practice close to home, with quick access to the roads around Salford and Cheetham Hill." },
  { name: "Bolton", slug: "bolton", testCentre: "Bolton", nearby: ["burnden", "harwood", "atherton"], localNote: "Bolton routes contrast multi-lane town-centre junctions around the A666 with residential streets in Burnden and Harwood, letting beginners build control before handling faster traffic.", faqs: [{ q: "Do you cover the Bolton (Manchester) test centre area?", a: "Yes — the Bolton centre is our instructors' local turf, so we integrate its surrounding road types and independent-driving routes into your lessons." }, { q: "What is the pass rate at Bolton test centre?", a: "DVSA figures for 2025/26 show a 52.8% pass rate at Bolton (Manchester) with a 12.4-week median wait as of September 2026." }], blurb: "Bolton learners get the best of both worlds: town-centre traffic around the A666 and quieter residential routes in Burnden and Harwood. The Bolton test centre area is our instructors' home turf." },
  { name: "Burnden", slug: "burnden", testCentre: "Bolton", nearby: ["bolton", "harwood", "bury"], blurb: "Based around Burnden and the A58, lessons here mix steep residential streets with the busy Manchester–Bolton corridor — ideal preparation for independent driving and sat-nav routes." },
  { name: "Harwood", slug: "harwood", testCentre: "Bolton", nearby: ["bolton", "burnden", "bury"], blurb: "Harwood's suburban roads and nearby country lanes towards Edgworth offer calm spaces to build core skills, with busier Bolton routes added as you progress." },
  { name: "Bury", slug: "bury", testCentre: "Bury", nearby: ["burnden", "rochdale", "bolton"], localNote: "Bury lessons prepare you for Metrolink-crossed junctions, the A58 corridor and multi-exit town roundabouts so timing, lane choice and mirror checks hold up under pressure.", faqs: [{ q: "Do you practise near the Bury test centre?", a: "Yes — we train on the A58, Metrolink crossings and nearby roundabouts around Bury so you are comfortable with the local road layout before test day." }, { q: "How long is the wait at Bury test centre?", a: "DVSA's September 2026 figures show a 5.7-week median wait at Bury (Manchester) alongside a 45.7% pass rate in 2025/26." }], blurb: "Learn around Bury's market-town traffic, the A58 and the Metrolink-crossed junctions learners are routinely tested on. The Bury test centre is well known to our instructors, right down to its trickiest roundabouts." },
  { name: "Old Trafford", slug: "old-trafford", testCentre: "Sale", nearby: ["stretford", "salford", "chorlton-cum-hardy"], localNote: "Old Trafford blends dense urban side streets with the A56, Trafford Bar tram junctions and the Wharf Road loop, plus heavier flows on match days.", faqs: [{ q: "Which test centres are closest to Old Trafford?", a: "Sale (Manchester) and West Didsbury (Manchester) are both close to Old Trafford, and we practise the A56 and Trafford Bar corridors connecting them." }, { q: "Do lessons still run on Old Trafford match days?", a: "Yes — though we time route choices around stadium traffic, or use quieter neighbouring streets if you are at an early stage." }], blurb: "Match-day traffic aside, Old Trafford is a fantastic training ground: the A56, Trafford Bar junctions and Wharf Road loop are useful preparation for the Sale and West Didsbury centres." },
  { name: "Rochdale", slug: "rochdale", testCentre: "Rochdale", nearby: ["blackley", "crumpsall", "bury"], localNote: "Rochdale tuition balances town-centre one-way systems and the A58/A627(M) corridors with quieter stretches towards Littleborough, right beside the local DVSA centre.", faqs: [{ q: "Is Rochdale test centre quick to book?", a: "DVSA's September 2026 data shows Rochdale at a 5.6-week median wait — the shortest in Greater Manchester — alongside a 48.6% pass rate in 2025/26." }, { q: "Do you cover areas towards Littleborough?", a: "Yes — our Rochdale lessons include town-centre corridors as well as quieter roads heading towards Littleborough." }], blurb: "Rochdale lessons mix the A58 and A627(M) corridors with the town-centre one-way system and quieter routes towards Littleborough. The Rochdale test centre sits right on the training ground — instructor Hassan Iqbal has guided learners to passes here, including a pass with zero minors.", passes: [{"name":"Mary-Ann Addo-Mensah","text":"I passed my test with no minors in Rochdale yesterday and I couldn't have done it without Mr Hassan Iqbal's expertise! I had an extremely limited time to prepare for this test but he was very patient and knowledgeable, explained things clearly, and gave me the confidence I needed."}] },
  { name: "Stretford", slug: "stretford", testCentre: "Sale", nearby: ["old-trafford", "sale", "chorlton-cum-hardy"], localNote: "Stretford routes pair the A5145 with multi-lane approaches near the Trafford Centre interchange, building steady lane discipline before Sale test-centre mock drives.", faqs: [{ q: "Do Stretford lessons cover the Trafford Centre roundabouts?", a: "Yes — once your basic car control is secure, we practise the multi-lane roundabouts around the Trafford Centre interchange and A5145." }, { q: "Which test centre do Stretford learners use?", a: "Most Stretford learners use nearby Sale (Manchester), which posted a 53.0% pass rate in DVSA's 2025/26 figures." }], blurb: "Stretford learners practise on the A5145 and around the Trafford Centre interchange — one of the busiest roundabout systems in Greater Manchester and a genuine test of lane discipline." },
  { name: "Sale", slug: "sale", testCentre: "Sale", nearby: ["stretford", "old-trafford", "salford"], localNote: "The A56 Washway Road is fast and multi-lane, and the Sale Water Park area adds roundabouts and merges. We practise both, plus the residential grid around Norris Road, so test-day traffic is familiar.", faqs: [{ q: "Is the A56 difficult for learners?", a: "It can be — it is fast and multi-lane, with busy junctions. We introduce it in stages after you are comfortable with quieter roads and lane discipline." }, { q: "Is the Sale test centre easy to reach?", a: "Yes — Sale (Manchester) is local, so lessons can include the roads and junctions around the centre before your test." }], blurb: "With the Sale test centre on your doorstep, lessons here can mirror real test conditions from day one: the A56 crossroads, Sale Water Park roads and the residential grid off Norris Road." },
  { name: "Chorlton-Cum-Hardy", slug: "chorlton-cum-hardy", testCentre: "West Didsbury", nearby: ["old-trafford", "stretford", "withington"], localNote: "Chorlton is cycle-heavy and full of parked cars, especially around Barlow Moor Road and Wilbraham Road. We use the quieter side streets first, then build in the busy junctions and residential traffic.", faqs: [{ q: "Is Chorlton good for learner drivers?", a: "It is a useful mix: quiet side streets for the basics, then busy junctions, cyclists and parked cars. That progression suits most learners, and the West Didsbury test centre is close by." }, { q: "How do I get to the test centre from Chorlton?", a: "West Didsbury (Manchester) is a short drive away. We build test-centre practice into lessons rather than leaving it to test day." }], blurb: "Chorlton's mix of cycle-heavy streets, the A5103 corridor and quiet Barlow Moor Road side roads makes it perfect for staged learning — quiet starts, busy finishes — with West Didsbury test centre close by." },
  { name: "Withington", slug: "withington", testCentre: "West Didsbury", nearby: ["chorlton-cum-hardy", "didsbury", "burnage"], testCentreNote: "West Didsbury (Manchester) is the local DVSA centre.", localNote: "Withington combines busy pedestrian activity along Burton Road with student-dense side streets full of parked cars — ideal for developing clearance judgement and mirror checks.", faqs: [{ q: "How close is Withington to the West Didsbury test centre?", a: "Withington sits right next to West Didsbury, so your lessons routinely cross the roads and junctions around the local test centre." }, { q: "Are Withington streets tough for nervous beginners?", a: "We begin on quieter residential streets away from Burton Road and introduce busier meeting-traffic sections gradually as your clutch and steering settle." }], blurb: "Lessons around Withington's busy Burton Road and the student-dense side streets teach observation and anticipation fast. West Didsbury (Manchester) is the local test centre, and its surrounding roads are regular practice ground." },
  { name: "Didsbury", slug: "didsbury", testCentre: "West Didsbury", nearby: ["west-didsbury", "withington", "cheadle"], localNote: "The A34 Kingsway is the big local challenge: multiple lanes, busy fuel stations and the Parrs Wood junction. We build up to it from quieter Didsbury Village streets so observations and lane changes are automatic before test day.", faqs: [{ q: "Is Didsbury Village easy to practise in?", a: "Yes — we use the quieter streets around the village first, then build up to the A34 Kingsway, Parrs Wood and the A5145 corridor towards Stretford as your confidence grows." }, { q: "How far is the West Didsbury test centre?", a: "It is a short drive from Didsbury, so lessons can include mock-test practice around the centre without eating into your lesson time." }], blurb: "Didsbury learners start around Didsbury Village and Fog Lane, then build up to the A34 Kingsway, Parrs Wood and the A5145 corridor towards Stretford — with the West Didsbury test centre a short drive away." },
  { name: "West Didsbury", slug: "west-didsbury", testCentre: "West Didsbury", nearby: ["didsbury", "withington", "chorlton-cum-hardy"], localNote: "Burton Road and Barlow Moor Road are the local training staples: parked cars, bus stops, cyclists and plenty of turnings. The test centre area adds busier A-road stretches, so we mix both before mock tests.", faqs: [{ q: "Is West Didsbury a busy test centre?", a: "Yes — DVSA's September 2026 data shows a median wait of 19.9 weeks, one of the longer waits locally. We book only when your mock tests show you are ready." }, { q: "Can I practise on Burton Road?", a: "Yes — Burton Road and the surrounding West Didsbury streets are part of our local route practice, alongside Barlow Moor Road and the A-road approaches." }], blurb: "Home to one of Manchester's busiest test centres, West Didsbury is where many local tests start and end. Learning here means practising the roads and junctions local tests commonly use — not memorising a route." },
  { name: "Burnage", slug: "burnage", testCentre: "West Didsbury", nearby: ["levenshulme", "withington", "heald-green"], localNote: "Long, straight residential streets in Burnage give new learners space for moving off and gear changes before merging onto the A34 Kingsway towards West Didsbury.", faqs: [{ q: "Is Burnage a good place to start from scratch?", a: "Yes — Burnage's straighter residential roads let complete beginners focus on clutch control and mirrors before stepping up to the A34 Kingsway." }, { q: "Which test centre serves Burnage?", a: "Most Burnage learners take their test at West Didsbury (Manchester), a short drive along nearby corridors." }], blurb: "Burnage's long straight residential roads are ideal for mastering clutch control and mirror routines early, before progressing to the A34 Kingsway and nearby test-area roads." },
  { name: "Levenshulme", slug: "levenshulme", testCentre: "West Didsbury", nearby: ["longsight", "burnage", "rusholme"], localNote: "Lessons in Levenshulme bridge quiet residential side streets with the busy A6 Stockport Road, training lane discipline, pedestrian crossings and anticipation.", faqs: [{ q: "Do lessons include the A6 Stockport Road?", a: "Once you are ready, yes — handling the A6 through Levenshulme builds strong hazard awareness before test-area driving around West Didsbury." }, { q: "Where can my instructor pick me up in Levenshulme?", a: "Anywhere in Levenshulme and neighbouring Burnage or Longsight — home, work or station — at no extra fee." }], blurb: "Levenshulme's A6 Stockport Road is one of South Manchester's most demanding learner corridors — master it here and test-day traffic holds no fears." },
  { name: "Longsight", slug: "longsight", testCentre: "West Didsbury", nearby: ["rusholme", "levenshulme", "burnage"], blurb: "Lessons around Longsight build city driving skills quickly: the A6, busy Five Ways junction and dense residential parking all sharpen the skills examiners look for." },
  { name: "Rusholme", slug: "rusholme", testCentre: "West Didsbury", nearby: ["longsight", "levenshulme", "withington"], localNote: "Rusholme's dense traffic around the Curry Mile sharpens hazard perception early, while nearby residential roads and the A34 offer varied test-style speeds.", faqs: [{ q: "Do you pick up near Manchester universities from Rusholme?", a: "Yes — students living in Rusholme or commuting along the Oxford Road/A34 corridor get free pick-up from accommodation, campus or work." }, { q: "Which test centre do Rusholme learners usually use?", a: "West Didsbury (Manchester) is the standard local test centre south of Rusholme." }], blurb: "The Curry Mile teaches more observation per mile than almost anywhere in Manchester. Rusholme learners graduate to the A34 and towards test-area roads with genuine confidence." },
  { name: "Hulme", slug: "hulme", testCentre: "Cheetham Hill", nearby: ["manchester-city-centre", "rusholme", "old-trafford"], blurb: "Hulme's grid streets and the Princess Parkway (A5103) junctions offer a compact but complete training ground minutes from the city centre and Cheetham Hill test centre." },
  { name: "Ancoats", slug: "ancoats", testCentre: "Cheetham Hill", nearby: ["manchester-city-centre", "cheetham-hill", "hulme"], blurb: "Ancoats and the New Islington area add tram junctions, 20mph zones and city-centre complexity to your lessons — ideal for learners aiming to drive professionally in town." },
  { name: "Cheetham Hill", slug: "cheetham-hill", testCentre: "Cheetham Hill", nearby: ["broughton", "crumpsall", "manchester-city-centre"], localNote: "Cheetham Hill Road is dense, bus-heavy and full of side roads. We teach observation and planning first, then add the A6010 roundabouts and the Salford border junctions.", faqs: [{ q: "Is Cheetham Hill hard to learn in?", a: "It is busy, but that is useful preparation. We start on quieter streets and build up to Cheetham Hill Road, the A6010 and the test-centre area." }, { q: "Where is the Cheetham Hill test centre?", a: "It is on Alderglen Road, Cheetham, Manchester, M8 0AL. We practise the roads and junctions around it; DVSA does not publish the actual test route." }], blurb: "Cheetham Hill Road is a test-area staple. Learning here means regular practice on the roads and junctions local tests commonly use around the Cheetham Hill (Alderglen Road) centre." },
  { name: "Crumpsall", slug: "crumpsall", testCentre: "Cheetham Hill", nearby: ["blackley", "cheetham-hill", "broughton"], blurb: "Crumpsall learners work on the A6010 ring road and the quieter streets off Crumpsall Lane before progressing to the roads around Cheetham Hill just down the road." },
  { name: "Blackley", slug: "blackley", testCentre: "Cheetham Hill", nearby: ["crumpsall", "rochdale", "cheetham-hill"], blurb: "Blackley's mix of the A6010, Victoria Avenue East and residential estates offers a calm start and a demanding finish — a natural progression route for new learners." },
  { name: "Chadderton", slug: "chadderton", testCentre: "Chadderton", nearby: ["blackley", "manchester-city-centre", "cheetham-hill"], localNote: "Chadderton tuition covers the Broadway corridor, A627(M) approaches and busy local roundabouts around the Chadderton test centre area.", faqs: [{ q: "Do you cover Chadderton driving test centre routes?", a: "We train on the road types, roundabouts and junctions around Chadderton test centre so independent driving feels familiar, without relying on memorised routes." }, { q: "What is the pass rate at Chadderton test centre?", a: "DVSA's 2025/26 data records a 45.6% pass rate at Chadderton, with a 16.1-week median wait in September 2026." }], blurb: "Chadderton sits between Oldham and Manchester with the A627(M) and Broadway corridor on the doorstep — and the Chadderton test centre nearby means realistic test-area practice.", passes: [{"name":"Amalu Jose","text":"I am really happy that I passed my driving test in Chadderton today. A special thanks to my instructor, Mr Farhan, who built my confidence throughout my driving lessons and supported me in passing my test. I really appreciate his patience and guidance."},{"name":"Aghabiomon Oladeru","text":"I'm so so excited right now! It was an early morning first time pass for me today at Chadderton test centre. My driving instructor Mr Ali was so so patient and helpful on this journey. I recommend him 100%."},{"name":"Maya G Nair","text":"I passed my driving test in Chadderton test centre today. I do not have words to say thank you to my instructor Mr. Ali. He is one of the best teachers with lots of patience and trust in you. I will highly recommend him for your driving journey."}] },
  { name: "Stockport", slug: "stockport", testCentre: "Bredbury", nearby: ["cheadle", "cheadle-hulme", "hazel-grove"], localNote: "Stockport is roundabout country: the A6, the Pyramid and the M60 approaches demand early lane choice. We break the junctions down, then link them into full mock-test drives.", faqs: [{ q: "Which test centre serves Stockport?", a: "Bredbury (Manchester) is the DVSA centre for Stockport. There is no separate Stockport test centre, so that is the one to plan around." }, { q: "Are Stockport's roundabouts on the test?", a: "Large roundabouts and the A6 are a core part of local driving, but DVSA does not publish test routes. We teach the road types and junctions, not a memorised route." }], testCentreNote: "Bredbury (Manchester) is the DVSA centre serving Stockport; there is no separate Stockport test centre.", blurb: "Stockport's A6 corridor and large roundabouts are a proper test of lane discipline. We train here on the roads local tests commonly use, with the Bredbury (Manchester) centre serving the town." },
  { name: "Cheadle", slug: "cheadle", testCentre: "Bredbury", nearby: ["stockport", "cheadle-hulme", "didsbury"], localNote: "Cheadle combines village streets with multi-lane Kingsway and A34 junctions, helping learners practise decisive lane positioning ahead of Bredbury test-area drives.", faqs: [{ q: "Do Cheadle lessons include the A34 Kingsway?", a: "Yes — once your core control is steady around Cheadle Village, we introduce multi-lane A34 and Kingsway junctions progressively." }, { q: "Which test centre do Cheadle learners use?", a: "Bredbury (Manchester) is the usual DVSA centre serving Cheadle and Stockport." }], blurb: "Lessons around Cheadle Village, the A34 and Kingsway junctions build the multi-lane confidence examiners reward, with the roads around Bredbury close at hand." },
  { name: "Cheadle Hulme", slug: "cheadle-hulme", testCentre: "Bredbury", nearby: ["bramhall", "cheadle", "stockport"], localNote: "Residential boulevards in Cheadle Hulme give a calm start before linking station junctions with the A34 and Stockport's larger roundabouts.", faqs: [{ q: "Is Cheadle Hulme suitable for beginners?", a: "Yes — quieter residential avenues let new drivers settle in gently before stepping up to station junctions and A34 traffic." }, { q: "Do you offer automatic lessons in Cheadle Hulme?", a: "We offer both manual and automatic lessons at the same £35/hr pay-as-you-go rate — just mention your preference when booking." }], blurb: "Cheadle Hulme's station junctions and residential boulevards are a gentle introduction before tackling the A34 and the large Stockport roundabouts." },
  { name: "Bramhall", slug: "bramhall", testCentre: "Bredbury", nearby: ["cheadle-hulme", "hazel-grove", "romiley"], localNote: "Bramhall lessons progress from quieter village roads to faster dual-carriageway stretches on the A555 and A6 leading towards Bredbury.", faqs: [{ q: "Do Bramhall learners practise on the A555?", a: "Yes — the A555 and A6 give great higher-speed merging and roundabout practice as you build towards test standard." }, { q: "Which test centre covers Bramhall?", a: "Bredbury (Manchester) serves Bramhall and surrounding Stockport areas." }], blurb: "Bramhall learners progress from quiet village streets to the A555 and A6 corridors, building towards the roads around Bredbury at their own pace." },
  { name: "Hazel Grove", slug: "hazel-grove", testCentre: "Bredbury", nearby: ["stockport", "bramhall", "romiley"], localNote: "Practising along the A6 in Hazel Grove develops early mirror checks, lane discipline and gap judgement before tackling junctions around Bredbury.", faqs: [{ q: "Is the A6 through Hazel Grove covered in lessons?", a: "Yes — once residential fundamentals are in place, A6 driving through Hazel Grove is a key step towards Bredbury test-centre readiness." }, { q: "What is the pass rate at Bredbury test centre?", a: "DVSA's 2025/26 data records a 57.9% pass rate at Bredbury (Manchester), alongside a 16.1-week median wait as of September 2026." }], blurb: "The A6 through Hazel Grove is a proper test of lane discipline and anticipation — and a staple of local test-area driving. Learn it with instructors who drive it every day." },
  { name: "Heald Green", slug: "heald-green", testCentre: "Bredbury", nearby: ["cheadle", "cheadle-hulme", "stockport"], blurb: "Heald Green offers quiet residential starts and quick access to the A538 and M56 junctions — useful practice for learners who want dual-carriageway confidence." },
  { name: "Romiley", slug: "romiley", testCentre: "Bredbury", nearby: ["bredbury", "hazel-grove", "bramhall"], blurb: "Romiley's Compsteyn Bridge roads and the B6104 towards Marple give learners country-road experience rare in Greater Manchester, balanced with the roads around Bredbury nearby." },
  { name: "Bredbury", slug: "bredbury", testCentre: "Bredbury", nearby: ["romiley", "stockport", "hazel-grove"], localNote: "Bredbury training focuses on the A560, the Bredbury interchange and the mix of speeds between Stockport roads and quieter residential loops near the test centre.", faqs: [{ q: "Do you train right around the Bredbury test centre?", a: "Yes — we cover the A560, Bredbury interchange and neighbouring roads used by local tests." }, { q: "What are the DVSA stats for Bredbury test centre?", a: "In DVSA's 2025/26 annual data Bredbury (Manchester) had a 57.9% pass rate, with a 16.1-week median wait in September 2026." }], blurb: "Bredbury learners master the A560 and the busy Bredbury interchange before progressing towards Stockport — solid preparation for any test centre in the area.", passes: [{"name":"Suba Penmetsa","text":"I passed my driving test in Bredbury today, and I would like to sincerely thank my instructor, Mr. Hassan Iqbal, for his excellent guidance and support throughout my learning journey. Couldn't have done it without him."}] },
  { name: "Atherton", slug: "atherton", testCentre: "Atherton", nearby: ["bolton", "burnden", "bury"], testCentreNote: "Atherton (Manchester) is the local DVSA centre; Bolton is also within easy reach.", localNote: "Atherton offers a natural step-up from residential streets near Hag Fold to busier arterial routes serving the local Atherton test centre and neighbouring Bolton.", faqs: [{ q: "Do you offer lessons near Atherton test centre?", a: "Yes — we train around Atherton (Manchester) test centre as well as residential streets towards Hag Fold and nearby Bolton." }, { q: "What is the waiting time at Atherton test centre?", a: "DVSA's September 2026 data records a 10.0-week median wait at Atherton (Manchester) and a 45.1% pass rate for 2025/26." }], blurb: "Atherton's mix of busy arterial roads and quieter streets towards Hag Fold makes a well-rounded training ground, with the Atherton (Manchester) test centre in town and Bolton a short drive away." },
];

// Official DVSA figures used in the area pages. Keep the date/source with the
// numbers: waiting times are monthly, pass rates are annual.
// DRT122F (September 2026) and DRT122C (2025/26).
const CENTRES = {
  "Cheetham Hill": { official: "Cheetham Hill (Manchester)", wait: "10.0", pass: "44.1" },
  "West Didsbury": { official: "West Didsbury (Manchester)", wait: "19.9", pass: "48.1" },
  "Sale": { official: "Sale (Manchester)", wait: "18.3", pass: "53.0" },
  "Bury": { official: "Bury (Manchester)", wait: "5.7", pass: "45.7" },
  "Chadderton": { official: "Chadderton", wait: "16.1", pass: "45.6" },
  "Bolton": { official: "Bolton (Manchester)", wait: "12.4", pass: "52.8" },
  "Bredbury": { official: "Bredbury (Manchester)", wait: "16.1", pass: "57.9" },
  "Rochdale": { official: "Rochdale (Manchester)", wait: "5.6", pass: "48.6" },
  "Atherton": { official: "Atherton (Manchester)", wait: "10.0", pass: "45.1" },
};

function centreDataLine(a) {
  if (a.slug === "manchester") return "";
  const key = a.testCentre.split(" and ")[0];
  const c = CENTRES[key];
  if (!c) return "";
  return `DVSA's latest published data shows a median wait of ${c.wait} weeks (September 2026) and a first-attempt pass rate of ${c.pass}% (2025/26) at ${c.official}.`;
}

// ---------------------------------------------------------------------------
const PACKAGES = [
  { name: "Pay As You Go", price: "£35/hr", desc: "Flexible hourly lessons, 2-hour minimum" },
  { name: "Beginner Boot", price: "£320", desc: "10-hour package for absolute beginners" },
  { name: "Skill Booster", price: "£495", desc: "15 hours — roundabouts and test prep" },
  { name: "Confidence Builder", price: "£660", desc: "20 hours incl. dual carriageways" },
  { name: "Fast Track Pass", price: "£990", desc: "30-hour intensive for a first-attempt pass" },
];

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function nearbyAreas(a) {
  const bySlug = new Map(AREAS.map((x) => [x.slug, x]));
  const out = [];
  // Hand-curated geographic neighbours first…
  for (const slug of a.nearby || []) {
    const n = bySlug.get(slug);
    if (n && n.slug !== a.slug && !out.includes(n)) out.push(n);
    if (out.length === 3) return out;
  }
  // …then fall back to array positions for any area without a full list.
  const index = AREAS.indexOf(a);
  const n = AREAS.length;
  for (const off of [-1, 1, 2]) {
    if (out.length === 3) break;
    const j = (index + off + n) % n;
    if (j !== index && !out.includes(AREAS[j])) out.push(AREAS[j]);
  }
  return out;
}

function lastmodFor(url) {
  let file = "";
  try {
    const path = new URL(url).pathname;
    file = path.endsWith("/") ? path.replace(/\/$/, "") || "index.html" : path.replace(/^\//, "");
  } catch {
    return null;
  }
  if (file === "") file = "index.html";
  if (!/\.[a-z0-9]+$/i.test(file)) file += ".html";
  // Prefer the file's last git commit date (the build regenerates area pages,
  // so mtimes always look "fresh"); fall back to mtime outside a git repo.
  try {
    const res = spawnSync("git", ["log", "-1", "--format=%ad", "--date=short", "--", file], { encoding: "utf8" });
    const date = res.status === 0 ? (res.stdout || "").trim() : "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  } catch { /* fall through to mtime */ }
  try {
    return statSync(file).mtime.toISOString().slice(0, 10);
  } catch {
    return null;
  }
}

function areaFaqs(a) {
  const centreLabel = a.testCentre.includes(" and ")
    ? `${a.testCentre} centres`
    : `the ${a.testCentre} test centre`;
  const note = a.testCentreNote ? ` ${a.testCentreNote}` : "";
  return [
    { q: `Do you pick up from my home in ${a.name}?`, a: `Yes — we pick up from home, work or college anywhere in ${a.name} and the surrounding areas at no extra charge, 7 days a week from 8am to 8pm.` },
    { q: `How much are driving lessons in ${a.name}?`, a: `Pay-as-you-go lessons are £35 per hour (2-hour minimum) with block packages from £320 for 10 hours. See our driving lesson prices for the full list.` },
    ...(a.faqs || []),
    { q: `How many driving lessons will I need in ${a.name}?`, a: `Most learners need between 20 and 40 hours. Your instructor will give you an honest estimate after your first lesson in ${a.name} — no padding, no upselling.` },
    { q: `Which driving test centre covers ${a.name}?`, a: `We usually train ${a.name} learners around ${centreLabel} and only book you in when you are genuinely test-ready.${note}` },
  ];
}

function faqJsonLd(a) {
  return JSON.stringify(
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: areaFaqs(a).map((x) => ({
        "@type": "Question",
        name: x.q,
        acceptedAnswer: { "@type": "Answer", text: x.a },
      })),
    },
    null,
    2
  );
}

function pillarHub() {
  const allLinks = AREAS.filter((x) => x.slug !== "manchester").map((x) => `<a href="/driving-lessons-${x.slug}" class="px-5 py-2.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-brand-electric hover:border-brand-electric font-semibold text-sm transition-colors">Driving lessons in ${esc(x.name)}</a>`).join("\n          ");
  return `
        <div class="bg-brand-surface border border-slate-100 rounded-2xl p-6 mt-6">
          <h3 class="font-heading font-bold text-xl text-brand-dark mb-3">City centre vs suburbs: where will you learn?</h3>
          <p class="text-slate-600 leading-relaxed mb-3">Manchester is two tests in one. Central lessons cover bus lanes, tram-shared junctions around St Peter's Square, box junctions and multi-lane roundabouts on the inner ring road — see our dedicated <a href="/driving-lessons-manchester-city-centre" class="text-brand-electric underline underline-offset-2">driving lessons in Manchester City Centre</a> page. Suburban lessons in Moss Side, Longsight, Levenshulme and Didsbury build residential observation, parked-car meets and independent sat-nav driving. Your instructor blends both so test day holds no surprises, whether you test at Cheetham Hill or West Didsbury.</p>
          <p class="text-slate-600 leading-relaxed">Already passed the basics? Practise with our <a href="/learn-now" class="text-brand-electric underline underline-offset-2">free driving tutorials</a> and check <a href="/driving-lesson-prices" class="text-brand-electric underline underline-offset-2">lesson prices</a> before you book.</p>
        </div>
        <div class="bg-white border border-slate-100 rounded-2xl p-6 mt-6">
          <h3 class="font-heading font-bold text-xl text-brand-dark mb-3">Postcode districts we pick up from</h3>
          <p class="text-slate-600 leading-relaxed mb-3">Free pick-up from home, work, college or university across Greater Manchester — 7 days a week, 8am to 8pm. Example postcode districts include:</p>
          <ul class="list-disc pl-5 space-y-1 text-slate-600 leading-relaxed mb-3">
            <li>City centre and inner areas: M1, M2, M3, M4, M15</li>
            <li>North Manchester: M8 (Cheetham Hill, Crumpsall), M9 (Blackley, Harpurhey), M40 (Collyhurst, Miles Platting)</li>
            <li>South Manchester: M14 (Fallowfield, Rusholme), M19 (Levenshulme, Burnage), M20–M21 (Didsbury, Withington, Chorlton)</li>
            <li>Salford and Trafford: M5–M7, M16–M17, M32–M33 (Sale, Stretford, Old Trafford)</li>
            <li>Bolton, Bury and Rochdale: BL1–BL4, BL8–BL9, OL11–OL12</li>
            <li>Stockport: SK1–SK7 (Stockport, Cheadle, Bramhall, Hazel Grove, Romiley, Bredbury)</li>
          </ul>
          <p class="text-slate-600 leading-relaxed">Outside these districts? <a href="tel:+447916155054" class="text-brand-electric underline underline-offset-2">Call 07916 155054</a> — if you are in Greater Manchester we can usually cover you.</p>
        </div>
        <div class="bg-white border border-slate-100 rounded-2xl p-6 mt-6">
          <h3 class="font-heading font-bold text-xl text-brand-dark mb-3">Test centres we train around</h3>
          <p class="text-slate-600 leading-relaxed mb-3">We train on the roads and junctions local tests commonly use from early on, and only book you in when mock tests show you are ready: Cheetham Hill, West Didsbury, Sale, Bury, Chadderton, Bolton, Bredbury, Rochdale and Atherton. Full addresses, test-day notes and current waiting times in our <a href="/driving-test-centres-manchester" class="text-brand-electric underline underline-offset-2">Manchester driving test centres guide</a>.</p>
        </div>
        <div class="mt-8">
          <h3 class="font-heading font-bold text-xl text-brand-dark mb-3">Browse every Manchester area we cover</h3>
          <p class="text-slate-600 leading-relaxed mb-4">Choose your neighbourhood for local route notes, your nearest test centre and area FAQs:</p>
          <div class="flex flex-wrap gap-3">
          ${allLinks}
          </div>
        </div>`;
}

const IMAGE_BY_SLUG = {
  "didsbury": { src: "/assets/ig/DE99V_vMmcr.webp", w: 640, h: 800, alt: "Cruise'N'Pass learner driving lesson in Didsbury, South Manchester" },
  "west-didsbury": { src: "/assets/ig/DE99V_vMmcr.webp", w: 640, h: 800, alt: "Driving lesson practice near West Didsbury test centre in Manchester" },
  "salford": { src: "/assets/ig/DZaU9BYMm2H.webp", w: 640, h: 800, alt: "Cruise'N'Pass driving lesson and test manoeuvres in Salford, Greater Manchester" },
  "stockport": { src: "/assets/ig/DCouUKIMov-.webp", w: 640, h: 578, alt: "Cruise'N'Pass learner driving test pass celebration in Stockport" },
  "bury": { src: "/assets/ig/DHtYK5gMYVu.webp", w: 640, h: 800, alt: "Practical driving test pass with Cruise'N'Pass in Bury, Greater Manchester" },
};

function areaImage(a) {
  return IMAGE_BY_SLUG[a.slug] || {
    src: "/assets/img/hero-index.webp",
    w: 1200,
    h: 800,
    alt: `Cruise'N'Pass DVSA-approved driving lesson car in ${a.name}, Greater Manchester`,
  };
}

function page(a, index) {
  const isManchesterPillar = a.slug === "manchester";
  // Pillar is the local guide/hub — homepage (/) is the primary transactional
  // target for "driving lessons Manchester", so the pillar uses guide intent
  // to avoid keyword cannibalization.
  const richTitle = `Driving Lessons in ${a.name} from £35/hr | Cruise'N'Pass`;
  const title = isManchesterPillar
    ? `Driving Lessons in Manchester Guide (2026) | Cruise'N'Pass`
    : richTitle.length <= 60
      ? richTitle
      : `Driving Lessons in ${a.name} | Cruise'N'Pass`;
  const desc = isManchesterPillar
    ? `Manchester driving lessons guide: areas covered, Cheetham Hill & West Didsbury test centres, £35/hr prices and FAQs.`
    : `Driving lessons in ${a.name} with DVSA-approved instructors. ${a.testCentre} test centre area, £35/hr, free pick-up. Book today.`;
  const ogTitle = isManchesterPillar ? title : title;
  const h1 = isManchesterPillar
    ? `Driving Lessons in Manchester: The Complete Local Guide`
    : `Driving Lessons in ${esc(a.name)} from £35 an Hour`;
  const introLinks = isManchesterPillar
    ? `Most learners need 20–40 hours — your instructor gives you an honest estimate after your first lesson. Ready to start? <a href="/#contacts" class="text-brand-electric font-semibold underline underline-offset-2">Book driving lessons in Manchester</a> or read <a href="/how-many-driving-lessons" class="text-brand-electric underline underline-offset-2">how many lessons you need</a>.`
    : `Most learners need 20–40 hours — your instructor gives you an honest estimate after your first lesson. New to driving? Start with our <a href="/driving-lessons-manchester" class="text-brand-electric font-semibold underline underline-offset-2">driving lessons in Manchester</a> hub or read <a href="/how-many-driving-lessons" class="text-brand-electric underline underline-offset-2">how many lessons you need</a>.`;
  const img = areaImage(a);
  const cheethamLink = a.testCentre.includes("Cheetham Hill")
    ? ` For local route and fault details, read our <a href="/cheetham-hill-driving-test-centre" class="text-brand-electric underline underline-offset-2">Cheetham Hill test centre guide</a> alongside our`
    : ` Full addresses, test-day notes and current waiting times in our`;
  const url = `${DOMAIN}/driving-lessons-${a.slug}`;
  const nearby = nearbyAreas(a);
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
  <meta property="og:title" content="${ogTitle}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:image" content="${DOMAIN}/og-image.webp">
  <meta property="og:image:alt" content="Cruise'N'Pass — DVSA-approved driving lessons in Manchester from £35/hr">
  <meta property="og:site_name" content="Cruise'N'Pass">
  <meta property="og:locale" content="en_GB">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="${DOMAIN}/og-image.webp">

  <meta name="theme-color" content="#00D1A0">
  <link rel="icon" type="image/png" sizes="48x48" href="/assets/img/favicon-48.png">
  <link rel="icon" type="image/png" sizes="192x192" href="/assets/img/favicon-192.png">
  <link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
  <script defer data-domain="cruisenpass.com" src="https://plausible.io/js/script.js"></script>
  <link rel="stylesheet" href="styles.css?v=3">
  <link rel="stylesheet" href="assets/vendor/fontawesome/all.min.css" media="print" onload="this.media='all'">
  <noscript><link rel="stylesheet" href="assets/vendor/fontawesome/all.min.css"></noscript>

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {"@type": "WebPage","@id": "${url}#webpage","url": "${url}","name": ${JSON.stringify(title)},"description": ${JSON.stringify(desc)},"inLanguage": "en-GB","isPartOf": {"@id": "${DOMAIN}/#website"}},
      {"@type": "WebSite","@id": "${DOMAIN}/#website","url": "${DOMAIN}/","name": "Cruise'N'Pass","publisher": {"@id": "${DOMAIN}/#organization"}},
      {"@type": "LocalBusiness","@id": "${DOMAIN}/#organization","name": "Cruise'N'Pass","url": "${DOMAIN}","telephone": "+447916155054","email": "cruisenpass@gmail.com","priceRange": "££","image": "${DOMAIN}/og-image.webp","logo": "${DOMAIN}/logo.png","sameAs": ["https://m.facebook.com/CruiseNPass-211956475539908/","https://www.instagram.com/cruisenpass/","https://www.youtube.com/@cruisenpass","https://www.tiktok.com/@cruisenpassdriving"]},
      {"@type": "Service","@id": "${url}#service","serviceType": "Driving lessons","provider": {"@id": "${DOMAIN}/#organization"},"areaServed": {"@type": "Place","name": ${JSON.stringify(a.name)}},"offers": {"@type": "Offer","price": 35,"priceCurrency": "GBP","priceSpecification": {"@type": "UnitPriceSpecification","price": 35,"priceCurrency": "GBP","unitText": "HOUR"},"description": "Pay-as-you-go driving lessons in ${esc(a.name)} from £35 per hour"},"url": "${url}"},
      {"@type": "BreadcrumbList","itemListElement": [
        {"@type": "ListItem","position": 1,"name": "Home","item": "${DOMAIN}/"},
        {"@type": "ListItem","position": 2,"name": "Driving Lessons in ${esc(a.name)}","item": "${url}"}
      ]}
    ]
  }
  </script>
  <script type="application/ld+json">
${faqJsonLd(a)}
  </script>
</head>
<body class="bg-white text-slate-700 font-sans antialiased overflow-x-hidden">
  <a href="#main" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:bg-brand-electric focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:font-bold focus:shadow-lg">Skip to content</a>

  <header class="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100">
    <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
      <a href="/" class="flex items-center gap-2 font-heading font-bold text-xl text-brand-dark"><span class="bg-brand-electric p-2 rounded-xl text-white">🚗</span> Cruise'N'Pass</a>
      <nav class="hidden md:flex items-center gap-6 text-sm font-semibold" aria-label="Main">
        <a href="/#prices" class="text-slate-600 hover:text-brand-electric transition-colors">Prices</a>
        <a href="/about" class="text-slate-600 hover:text-brand-electric transition-colors">About</a>
        <a href="/learn-now" class="text-slate-600 hover:text-brand-electric transition-colors">Learn Now</a>
        <a href="/join-cruisenpass" class="text-slate-600 hover:text-brand-electric transition-colors">Join Us</a>
        <a href="/#contacts" class="bg-brand-electric text-white px-4 py-2 rounded-xl hover:opacity-90 transition-opacity">Book Now</a>
      </nav>
      <a href="tel:+447916155054" class="md:hidden bg-brand-electric text-white p-3 rounded-xl" aria-label="Call us"><i aria-hidden="true" class="fa-solid fa-phone"></i></a>
    </div>
  </header>

  <main id="main">
    <section class="py-16 md:py-24 bg-gradient-to-b from-brand-surface to-white">
      <div class="max-w-4xl mx-auto px-6">
        <nav aria-label="Breadcrumb" class="text-xs text-slate-500 mb-4"><a href="/" class="hover:text-brand-electric underline underline-offset-2">Home</a> <span aria-hidden="true">›</span> <a href="/#areas" class="hover:text-brand-electric underline underline-offset-2">Areas</a> <span aria-hidden="true">›</span> <span aria-current="page" class="text-slate-700 font-semibold">Driving lessons in ${esc(a.name)}</span></nav>
        <p class="text-xs font-bold text-brand-accent uppercase tracking-widest mb-3"><i aria-hidden="true" class="fa-solid fa-location-dot mr-1"></i> ${esc(a.name)}, Greater Manchester</p>
        <h1 class="font-heading text-4xl md:text-6xl font-extrabold text-brand-dark tracking-tight mb-6 leading-tight">${h1}</h1>
        <p class="text-lg text-slate-600 leading-relaxed mb-4">${esc(a.blurb)}</p>
        <p class="text-slate-600 leading-relaxed mb-8">Lessons are 1-to-1 with a DVSA-approved instructor in a dual-controlled car, with pick-up from home, work, college or university anywhere in ${esc(a.name)} and nearby — 7 days a week, 8am to 8pm. Beginners start on quiet local roads; as you progress you train on the roads and junctions around ${esc(a.testCentre)}, covering roundabouts, dual carriageways, independent driving and manoeuvres. ${introLinks}</p>
        <div class="flex flex-col sm:flex-row items-center gap-4 mb-10">
          <a href="/#contacts" class="w-full sm:w-auto text-center bg-brand-electric text-white font-bold px-8 py-4 rounded-xl transition-all hover:scale-105 shadow-lg shadow-brand-electric/20">Book a Lesson in ${esc(a.name)}</a>
          <a href="tel:+447916155054" class="w-full sm:w-auto text-center bg-white border border-slate-200 text-slate-800 font-bold px-8 py-4 rounded-xl transition-all"><i aria-hidden="true" class="fa-solid fa-phone mr-2"></i>Call 07916 155054</a>
        </div>
        <div class="grid grid-cols-3 gap-4 max-w-lg">
          <div class="text-center p-4 bg-white rounded-2xl border border-slate-100"><p class="font-heading text-2xl font-extrabold text-brand-dark">100+</p><p class="text-xs text-slate-500">Google reviews</p></div>
          <div class="text-center p-4 bg-white rounded-2xl border border-slate-100"><p class="font-heading text-2xl font-extrabold text-brand-dark">DVSA</p><p class="text-xs text-slate-500">approved instructors</p></div>
          <div class="text-center p-4 bg-white rounded-2xl border border-slate-100"><p class="font-heading text-2xl font-extrabold text-brand-dark">£35</p><p class="text-xs text-slate-500">per hour, from</p></div>
        </div>
      </div>
    </section>

    <section class="py-16">
      <div class="max-w-4xl mx-auto px-6">
        <h2 class="font-heading text-3xl md:text-4xl font-extrabold text-brand-dark tracking-tight mb-4">What Your Lessons in ${esc(a.name)} Cover</h2>
        <p class="text-slate-600 leading-relaxed mb-6">A structured plan from first clutch control to test standard: quiet-road starts in ${esc(a.name)}, then busier junctions, the ${esc(a.testCentre)} test-area road network, night and wet-weather driving, and mock tests under exam conditions. Prefer an intensive route? See our <a href="/intensive-driving-course" class="text-brand-electric underline underline-offset-2">intensive driving courses in Manchester</a> or compare <a href="/manual-vs-automatic" class="text-brand-electric underline underline-offset-2">manual vs automatic</a>.</p>${a.localNote ? `
        <div class="mt-6 p-5 bg-white border border-slate-100 rounded-2xl">
          <h3 class="font-heading font-bold text-lg text-brand-dark mb-2">Local driving notes</h3>
          <p class="text-slate-600 leading-relaxed">${esc(a.localNote)}</p>
        </div>` : ``}
        <figure class="my-8 bg-brand-surface border border-slate-100 rounded-2xl overflow-hidden max-w-xl">
          <img src="${img.src}" alt="${esc(img.alt)}" width="${img.w}" height="${img.h}" loading="lazy" decoding="async" class="w-full h-64 object-cover">
          <figcaption class="px-4 py-3 text-xs text-slate-500">One-to-one tuition in ${esc(a.name)} with DVSA-approved Cruise'N'Pass instructors.</figcaption>
        </figure>${isManchesterPillar ? pillarHub() : ``}
        <h2 class="font-heading text-3xl md:text-4xl font-extrabold text-brand-dark tracking-tight mb-8">Lesson Packages &amp; Prices</h2>
        <div class="space-y-3">
          ${PACKAGES.map((p) => `
          <div class="flex items-center justify-between gap-4 p-5 bg-brand-surface border border-slate-100 rounded-2xl">
            <div><p class="font-heading font-bold text-brand-dark">${p.name}</p><p class="text-sm text-slate-500">${p.desc}</p></div>
            <p class="font-heading font-extrabold text-xl text-brand-electric whitespace-nowrap">${p.price}</p>
          </div>`).join("")}
        </div>
        <p class="text-sm text-slate-500 mt-4">Full details on our <a href="/driving-lesson-prices" class="text-brand-electric underline underline-offset-2">driving lesson prices in Manchester</a> page.</p>
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
        <p class="mt-4 text-sm text-slate-500"><a href="https://www.google.com/search?q=Cruise%27N%27Pass+driving+school+Manchester+reviews" target="_blank" rel="noopener noreferrer" class="text-brand-electric underline underline-offset-2" title="Opens in new tab">Read more Google reviews</a> · <a href="/reviews" class="text-brand-electric underline underline-offset-2">All reviews</a></p>
      </div>
    </section>
` : ``}

    <section class="py-16 bg-brand-surface">
      <div class="max-w-4xl mx-auto px-6">
        <h2 class="font-heading text-3xl md:text-4xl font-extrabold text-brand-dark tracking-tight mb-4">Which Test Centre for ${esc(a.name)}?</h2>
        <p class="text-slate-600 leading-relaxed mb-4">Most ${esc(a.name)} learners test around <strong class="text-brand-dark">${esc(a.testCentre)}</strong>${a.testCentreNote ? ` — ${esc(a.testCentreNote)}` : "."} We train on the roads and junctions local tests commonly use, and only book you in when mock tests show you are ready.</p>
        <p class="text-sm text-slate-500 leading-relaxed mb-8">${centreDataLine(a) ? `${centreDataLine(a)} These figures reflect the local learner population and route mix, not how "easy" a centre is.` : ""}${cheethamLink} <a href="/driving-test-centres-manchester" class="text-brand-electric underline underline-offset-2">Manchester driving test centres guide</a>.</p>
        <h2 class="font-heading text-3xl md:text-4xl font-extrabold text-brand-dark tracking-tight mb-8">Learning to Drive in ${esc(a.name)} — FAQs</h2>
        <div class="space-y-6">
          ${areaFaqs(a).map((f) => `<div><h3 class="font-heading font-bold text-lg text-brand-dark mb-1">${esc(f.q)}</h3><p class="text-slate-600 leading-relaxed">${esc(f.a)}</p></div>`).join("\n          ")}
        </div>
        <p class="text-sm text-slate-500 mt-6">Helpful links: <a href="/driving-lesson-prices" class="text-brand-electric underline underline-offset-2">driving lesson prices</a> · <a href="/driving-lesson-costs-manchester" class="text-brand-electric underline underline-offset-2">true cost breakdown</a> · <a href="/automatic-driving-lessons-manchester" class="text-brand-electric underline underline-offset-2">automatic lessons</a> · <a href="/female-driving-instructor-manchester" class="text-brand-electric underline underline-offset-2">female instructors</a> · <a href="/how-many-driving-lessons" class="text-brand-electric underline underline-offset-2">how many lessons you need</a> · <a href="/driving-test-centres-manchester" class="text-brand-electric underline underline-offset-2">test centres guide</a> · <a href="/intensive-driving-course" class="text-brand-electric underline underline-offset-2">intensive courses</a> · <a href="/about" class="text-brand-electric underline underline-offset-2">about us</a>.</p>
      </div>
    </section>

    <section class="py-16">
      <div class="max-w-4xl mx-auto px-6">
        <h2 class="font-heading text-3xl md:text-4xl font-extrabold text-brand-dark tracking-tight mb-4">Nearby Areas We Also Cover</h2>
        <p class="text-slate-600 leading-relaxed mb-6">Also learning nearby? We cover:</p>
        <div class="flex flex-wrap gap-3 mb-10">
          ${nearby.map((n) => `<a href="/driving-lessons-${n.slug}" class="px-5 py-2.5 rounded-full bg-brand-surface border border-slate-200 text-slate-700 hover:text-brand-electric hover:border-brand-electric font-semibold text-sm transition-colors">Driving lessons in ${esc(n.name)}</a>`).join("\n          ")}
        </div>
        <div class="text-center">
          <h2 class="font-heading text-3xl md:text-4xl font-extrabold text-brand-dark tracking-tight mb-4">Ready to Start in ${esc(a.name)}?</h2>
          <p class="text-slate-600 text-lg mb-4">Message us on <a href="https://wa.me/447916155054" target="_blank" rel="noopener noreferrer" class="text-brand-electric font-semibold underline underline-offset-2" title="Opens in new tab">WhatsApp</a> or call <a href="tel:+447916155054" class="text-brand-electric font-semibold underline underline-offset-2">07916 155054</a> — we usually reply within 24 hours.</p>
          <address class="not-italic text-sm text-slate-500 mb-8">Cruise'N'Pass · ${esc(a.name)}, Greater Manchester · <a href="tel:+447916155054" class="text-brand-electric underline underline-offset-2">07916 155054</a> · <a href="mailto:cruisenpass@gmail.com" class="text-brand-electric underline underline-offset-2">cruisenpass@gmail.com</a> · Open 7 days, 8am–8pm</address>
          <a href="/#contacts" class="inline-block bg-brand-electric text-white font-bold px-10 py-4 rounded-xl transition-all hover:scale-105 shadow-lg shadow-brand-electric/20">Book Your First Lesson</a>
        </div>
      </div>
    </section>
  </main>

  <footer class="bg-brand-dark text-slate-300 py-12">
    <div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
      <nav class="order-3 md:order-1 w-full md:w-auto flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm" aria-label="Footer">
        <a href="/" class="text-slate-400 hover:text-white transition-colors">Driving school in Manchester</a>
        <a href="/learn-now" class="text-slate-400 hover:text-white transition-colors">Free Tutorials</a>
        <a href="/join-cruisenpass" class="text-slate-400 hover:text-white transition-colors">Instructor Careers</a>
        <a href="/about" class="text-slate-400 hover:text-white transition-colors">About</a>
        <a href="/privacy" class="text-slate-400 hover:text-white transition-colors">Privacy Policy</a>
        <a href="/driving-lesson-prices" class="text-slate-400 hover:text-white transition-colors">Prices</a>
        <a href="/blog" class="text-slate-400 hover:text-white transition-colors">Blog</a>
        <a href="/driving-faq" class="text-slate-400 hover:text-white transition-colors">FAQs</a>
        <a href="/reviews" class="text-slate-400 hover:text-white transition-colors">Reviews</a>
        <a href="/intensive-driving-course" class="text-slate-400 hover:text-white transition-colors">Intensive Courses</a>
      </nav>
      <p class="text-sm text-slate-400 text-center order-2">© <span id="footer-year">2026</span> Cruise'N'Pass. DVSA-approved driving lessons in ${esc(a.name)} and across Greater Manchester.<br><span class="text-xs">07916 155054 · cruisenpass@gmail.com · 7 days, 8am–8pm</span></p>
      <div class="flex items-center gap-2 order-1 md:order-3">
        <a href="https://www.instagram.com/cruisenpass/" target="_blank" rel="noopener noreferrer" class="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 hover:bg-brand-electric hover:text-white text-slate-300 transition-all" aria-label="Instagram (opens in new tab)" title="Opens in new tab"><i aria-hidden="true" class="fa-brands fa-instagram"></i></a>
        <a href="https://www.youtube.com/@cruisenpass" target="_blank" rel="noopener noreferrer" class="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 hover:bg-red-500 hover:text-white text-slate-300 transition-all" aria-label="YouTube (opens in new tab)" title="Opens in new tab"><i aria-hidden="true" class="fa-brands fa-youtube"></i></a>
        <a href="https://www.tiktok.com/@cruisenpassdriving" target="_blank" rel="noopener noreferrer" class="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white hover:text-black text-slate-300 transition-all" aria-label="TikTok (opens in new tab)" title="Opens in new tab"><i aria-hidden="true" class="fa-brands fa-tiktok"></i></a>
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
for (const [i, a] of AREAS.entries()) {
  const file = `driving-lessons-${a.slug}.html`;
  writeFileSync(file, page(a, i));
  created++;
}
console.log(`generate-areas: wrote ${created} landing page(s)`);

// ---- sitemap.xml ----
const today = () => new Date().toISOString().slice(0, 10);
let sitemap = readFileSync("sitemap.xml", "utf8");
for (const a of AREAS) {
  const url = `${DOMAIN}/driving-lessons-${a.slug}`;
  if (!sitemap.includes(url)) {
    sitemap = sitemap.replace("</urlset>", `  <url><loc>${url}</loc><lastmod>${lastmodFor(url) || today()}</lastmod></url>\n</urlset>`);
  }
}

// Refresh <lastmod> on every sitemap entry from the page file's last git
// commit date (mtime fallback), so the sitemap never drifts out of date.
sitemap = sitemap.replace(/<url>[\s\S]*?<\/url>/g, (m) => {
  const loc = m.match(/<loc>([^<]+)<\/loc>/)?.[1];
  if (!loc) return m;
  return `<url><loc>${loc}</loc><lastmod>${lastmodFor(loc) || today()}</lastmod></url>`;
});
writeFileSync("sitemap.xml", sitemap);
console.log("generate-areas: sitemap.xml updated (lastmod refreshed from git)");

// ---- index.html areas grid ----
const index = readFileSync("index.html", "utf8");
const START = "<!-- AREAS:START -->";
const END = "<!-- AREAS:END -->";
const links = AREAS.map(
  (a) => `<a href="/driving-lessons-${a.slug}" class="px-5 py-2.5 rounded-full bg-brand-surface border border-slate-200 text-slate-700 hover:text-brand-electric hover:border-brand-electric font-semibold text-sm flex items-center gap-2 transition-colors"><i aria-hidden="true" class="fa-solid fa-location-dot text-brand-active"></i>${esc(a.name)}</a>`
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
