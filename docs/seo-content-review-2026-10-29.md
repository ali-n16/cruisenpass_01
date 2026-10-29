# Cruise'N'Pass — SEO Content Review

**Site:** [cruisenpass.com](https://cruisenpass.com)  
**Reviewed:** 29 October 2026  
**Scope:** 52 HTML pages (51 indexable + the 404), live `robots.txt`/`sitemap.xml`, metadata, headings, body copy, internal links, local accuracy, structured data and E-E-A-T signals.  
**Method:** parsed the local build; measured `<main>` word counts; compared the 35 area pages using 5-gram Jaccard similarity and exact-sentence overlap; checked all titles, descriptions, H1s, canonicals and schema; cross-checked test-centre claims against DVSA's published data. The audit was completed before implementation; section 13 lists the fixes applied in this PR.

---

## 1. Bottom line

**6.5/10 — a strong foundation with a content-uniqueness ceiling.**

You have better architecture, metadata discipline and pricing transparency than most Manchester driving schools. The problem is not that you need more pages. It is that **35 location pages are roughly 50% identical**, and several local claims are wrong or overconfident. Adding more pages in the current template would increase the risk rather than the return.

> **The one-line diagnosis:** you do not have a content-volume problem; you have a content-uniqueness and trust problem.

Fix the accuracy issues and the 11 Tier A area pages first. Then split the test-centre content and add named instructors. That is a stronger growth path than another 20 area pages.

---

## 2. Scorecard

| Dimension | Score | Comment |
|---|---:|---|
| Architecture & keyword map | 8/10 | Clear hubs, service pages and 35 area pages. Some homepage/hub and prices/costs overlap. |
| Titles, descriptions, H1s | 8/10 | All unique; sensible lengths; one H1 per page. Area titles are templated and leave CTR on the table. |
| Content depth & uniqueness | **4/10** | Area pages are ~50% shared text; five important pages are under 500 words. |
| Local accuracy & E-E-A-T | **5/10** | Wrong road/centre claims; no About page; anonymous author; several overclaims. |
| Structured data | 6/10 | Good WebPage/Service/Breadcrumb/FAQ graph, but the `aggregateRating` is a policy risk and blog authorship is an organisation, not a person. |
| Internal linking | 7/10 | Every page is reachable; area-to-area mesh is thin and the homepage link grid is flat. |
| Freshness & proof | 7/10 | October 2026 dates; real reviews. Relative review dates will age badly. |
| Conversion content | 8/10 | Clear pricing, CTAs, phone/WhatsApp and social proof. |

---

## 3. What is genuinely strong

These are not consolation prizes — they are the reasons the site can rank once the content issues are fixed.

- **Every indexable page has a unique title, meta description and H1.** No duplicate titles or descriptions across 51 pages.
- **One H1 per page**, logical H2/H3 structure, and breadcrumbs on area pages.
- **Self-referencing canonicals** on all indexable pages; 404 is `noindex`; sitemap contains all 51 indexable URLs; `robots.txt` is clean and deliberately allows AI search crawlers.
- **The copy is natural.** There is no obvious keyword stuffing. Where the local detail is accurate, it is genuinely better than the average driving-school page.
- **Pricing is transparent.** The costs page explains DVSA fees and total cost of learning; the prices page shows the block discount maths. That is a real trust asset.
- **Real reviews with names and instructors.** The Cheetham Hill, Chadderton, Rochdale and Bredbury proof points are stronger than most competitors'.
- **The schema foundation is right:** `LocalBusiness` + `AutomotiveBusiness`, `Service`, `BreadcrumbList`, `FAQPage`, `BlogPosting`, `WebSite`. The invalid `DrivingSchool` type has already been removed.
- **The build has sensible checks:** canonical, JSON-LD, internal references, CSP, regressions and SEO checks.

---

## 4. The big problem: 35 area pages, about half the same

### The evidence

| Measure | Result |
|---|---|
| Area pages | 35 |
| Body length | 521–684 words (most ~529) |
| 5-gram similarity vs Didsbury | 0.44–0.63 Jaccard (most 0.50–0.63) |
| Sentences shared verbatim with at least one other area page | About 50% on most pages (32–57% range) |
| Images on area pages | **0** |
| Shared H2 structure | 6 shared H2 sections on almost every page |
| Shared FAQs | The same 4 questions with the place name swapped |
| Shared package block | The same 5 package cards on every page |

The clearest example is **Didsbury vs West Didsbury**. Apart from the place name and two intro sentences, the pages are the same: same headings, same package cards, same four FAQs, same nearby-area block. The 21-word difference between the two pages is essentially the local intro.

The image gap is sitewide, not just an area-page problem: **49 of the 52 HTML pages contain no `<img>` element at all.** Only the homepage, reviews page and Learn Now page carry imagery. For a local service business, that is a missed trust and engagement signal.

This is the pattern Google's doorway-page and scaled-content policies are designed to catch: multiple location pages with near-identical content, existing mainly to capture "driving lessons in [area]" searches and funnel to the same booking form. That does not mean a penalty is imminent. It does mean the pages are unlikely to earn rankings on their own merit, and publishing more of them increases the risk.

It also matters for AI search. ChatGPT, Perplexity and Google AI Overviews are looking for unique, first-hand, locally specific answers. Thirty-five near-duplicates give them nothing to choose between.

### What to do instead

**Pause new area pages.** Tier the existing 35 and give each one a real reason to exist.

| Tier | Pages | Target | Action |
|---|---|---|---|
| **A** | Manchester, Manchester City Centre, Salford, Didsbury, West Didsbury, Chorlton-cum-Hardy, Sale, Stretford, Old Trafford, Cheetham Hill, Stockport (11) | 700–900 words of **unique** body copy | Photo, 2 real reviews, named instructor, official test-centre data, 5+ unique sections |
| **B** | Bury, Bolton, Rochdale, Chadderton, Atherton, Cheadle, Cheadle Hulme, Bramhall, Hazel Grove, Bredbury, Withington, Burnage, Levenshulme, Rusholme (14) | 500–700 unique words | 4 of the 7 local elements below; one photo or a shared local image with unique alt text |
| **C** | Ancoats, Broughton, Crumpsall, Blackley, Harwood, Burnden, Romiley, Hulme, Longsight, Heald Green (10) | Enrich or consolidate | If you cannot write 400+ genuinely local words, merge into the parent area and 301 |

**"Unique" means unique body copy, excluding the package table, header, footer and generic FAQs.** The current pages have roughly 200–250 words that are not boilerplate. Tier A needs 700–900; Tier B needs 500–700.

A page should contain at least **4 of these 7 elements**:

1. **Named roads and junctions**, plus what learners actually struggle with there. Not a list of road numbers — a teaching insight.
2. **Test-centre specifics:** distance/time, current median wait, first-attempt pass rate, test-day parking and logistics.
3. **Two real area reviews** with first name, test centre and instructor. Rotate them; do not put the same three reviews on every page.
4. **A named instructor** with photo, ADI status, transmission, areas covered and one human detail.
5. **Pick-up landmarks**, not just "home, work or college": e.g. Didsbury Village, Parrs Wood, East Didsbury tram stop.
6. **One original local photo** (car at a landmark, pupil pass, local roundabout) with descriptive alt text.
7. **Three area-specific FAQs**, not the same four generic questions with the name changed.

That is enough to make the page useful without writing 1,200 words of filler.

### Consolidation candidates

If a page cannot support 400+ unique words, merge it rather than padding it:

- Burnden → Bolton
- Harwood → Bolton
- Ancoats → Manchester City Centre
- Broughton → Salford
- Crumpsall / Blackley → Cheetham Hill or a "North Manchester" page
- Romiley → Stockport
- Hulme → Manchester City Centre / Salford

Keep the URL only if it has meaningful impressions or links in Search Console. Otherwise 301 to the parent page.

---

## 5. Local accuracy and trust issues

These are the findings I would fix this week. Several are small edits, but they undermine the "we know Manchester" positioning.

| Page | Current claim | Problem | Fix |
|---|---|---|---|
| Didsbury | "Didsbury learners train on the **A5145 Kingsway**" | The A5145 runs Stockport–Stretford, but in Didsbury it is Wilmslow Road / Parrs Wood Lane / Barlow Moor Road. **Kingsway is the A34.** The sentence merges two different roads. | "the **A34 Kingsway**"; refer to the A5145 as Wilmslow Road/Parrs Wood Lane, or as the Barlow Moor Road corridor towards Stretford |
| Atherton | "with **Bolton and Wigan** test centres within easy reach" | **Atherton (Manchester)** is an open DVSA centre. Wigan is not in DVSA's current list. | "Atherton (Manchester) and Bolton"; verify Wigan before repeating it |
| Test centres / Stockport area pages | "**Stockport** test centre" listed alongside Bredbury | DVSA's current list has **Bredbury (Manchester)**, which serves Stockport. There is no separate Stockport centre in the published data. | "Bredbury (Manchester), serving Stockport"; remove Stockport as a separate centre |
| Withington | "West Didsbury and **West Didsbury (Mauldeth Road)** test routes" | DVSA lists **West Didsbury (Manchester)** only; there is no separate Mauldeth Road centre in the current data. | Use "West Didsbury (Manchester)" only |
| Cheetham Hill, West Didsbury, test centres | "the **exact** roads used", "the **actual** routes you will face" | DVSA does not publish test routes; examiners vary them. This contradicts your own Cheetham Hill article, which correctly says so. | "the roads and junctions local tests **commonly** use" |
| Homepage | "DVSA-approved **driving school**" | DVSA approves **instructors** (ADIs), not schools. | "DVSA-approved **instructors**" |
| Homepage | "**Top Rated** Driving School in Manchester" | Unsubstantiated superlative. | "Rated 5.0 from 115 Google reviews" — only if that is exact |
| Sitewide | "100+ **five-star** Google reviews" | Verify the current average. If any review is below 5★, the claim is false. | "100+ Google reviews · 4.9 average" or whatever is exact |
| Area pages vs prices page | "we usually reply **within the hour**" vs "we reply **within 24 hours**" | Inconsistent promise; both cannot be the standard. | Pick the real SLA and use it everywhere |
| Sitewide | "free pick-up **anywhere in Greater Manchester**" | Only true if you genuinely cover every listed area. | "free pick-up across our covered areas" + list or map |

### The "8 centres" inconsistency

The site variously says **8 centres**, lists **9 names**, and uses **Stockport** and **Bredbury** as if they were two. The official local list contains nine open centres:

**Atherton (Manchester), Bolton (Manchester), Bredbury (Manchester), Bury (Manchester), Chadderton, Cheetham Hill (Manchester), Rochdale (Manchester), Sale (Manchester), West Didsbury (Manchester).**

Decide which ones you actually use. If you cover Atherton, say nine and add it. If you do not, say eight and remove Atherton from the count — but then do not tell Atherton learners that Wigan is their centre.

### Overclaims to tone down

- "Exact/actual test routes" — replace with "the roads and junctions local tests commonly use."
- "Top Rated" — replace with a verifiable rating/count.
- "DVSA-approved driving school" — "DVSA-approved instructors."
- "Pass first time" style framing — keep the pass stories, but do not imply a guarantee. The intensive page already says no honest school guarantees a pass; good.

---

## 6. Page-level content review

| Page | Words | Main issue | Priority |
|---|---:|---|---|
| Homepage | 1,460 | Strong. No About/instructor section; `aggregateRating` risk; flat area grid. | P0 |
| `/driving-lessons-manchester` | 985 | Good local guide, but overlaps homepage for "driving lessons in Manchester." | P1 |
| 35 area pages | 521–684 | ~50% shared text; no images; same FAQs. | **P0** |
| `/driving-test-centres-manchester` | 626 | Too thin for nine centres; no official pass rates/waiting times; Stockport/Bredbury conflict. | P0/P1 |
| `/cheetham-hill-driving-test-centre` | 871 | Best content template on the site. Add current pass rate/wait and link to the area page. | P1 |
| `/driving-lesson-prices` | 518 | Good commercial page. Clarify what is excluded (DVSA test fee) and link to the costs guide. | P1 |
| `/driving-lesson-costs-manchester` | 977 | Strong informational asset. H1 "[2026 Prices]" competes with the prices page. | P1 |
| `/intensive-driving-course` | 468 | Thin for a high-competition term. No schedule examples, test-date logistics or real intensive story. | P1 |
| `/manual-vs-automatic` | 445 | Thin. Add automatic/manual pass-rate data, licence rules, insurance/resale and Manchester traffic context. | P1 |
| `/driving-faq` | 417 | Only 11 questions; generic. Expand to 20+ grouped by topic. | P1 |
| `/automatic-driving-lessons-manchester` | 748 | Good. Add official automatic vs manual pass-rate comparison. | P1 |
| `/female-driving-instructor-manchester` | 701 | Sensitive and well written, but does not name a female instructor. If you have one, prove it; if not, the page cannot satisfy the intent. | P0/P1 |
| `/reviews` | 635 | Real proof, but relative dates ("a month ago") will age; no review context by area/test centre. | P1 |
| `/blog` | 219 | Thin listing for five guides; no featured post, categories or author. | P2 |
| `/learn-now` | 199 | Thin video hub; add summaries/transcripts and learning outcomes. | P2 |
| `/join-cruisenpass` | 529 | Fine; add pay/earnings detail and the application process if recruiting. | P2 |
| `/privacy` | 498 | Fine; meta description is 182 characters and will truncate. | P2 |
| 404 | 26 | Correctly `noindex`. | — |

### Metadata notes

- **Titles:** all unique and within 60 characters. Area titles are formulaic (`Driving Lessons in X | Cruise'N'Pass`). For Tier A pages, add the price where it fits: `Driving Lessons in Didsbury from £35/hr | Cruise'N'Pass` (52 characters).
- **Descriptions:** mostly 102–136 characters, which is good. They are templated by area; add a local hook rather than only swapping the place name.
- **Homepage** title/description are strong. The H1 is long but contains the keyword and price; the "test-ready, not just lesson-ready" promise sits in the supporting paragraph.
- **Privacy** description is too long; **404** is `noindex`, so its description does not matter.
- **No duplicate titles, descriptions or H1s.** That is a real strength.
- **Reviews:** every visible review is 5★. If you have a genuine 4★ review, include it — a wall of perfect scores reads as less credible than a 4.9 average with real detail. Never invent one.

### Cannibalisation

**Homepage vs `/driving-lessons-manchester`.** Both target "driving lessons in Manchester." Keep the homepage as the commercial head-term page. Make the hub the guide: areas, test centres, what to expect. A title like `Driving Lessons in Manchester Guide (2026) | Cruise'N'Pass` (58 characters) differentiates it; the H1 can stay.

**`/driving-lesson-prices` vs `/driving-lesson-costs-manchester`.** These overlap on "prices/cost." Give them distinct jobs:

- Prices page: "Driving Lesson Prices in Manchester" — packages, what is included, how to book.
- Costs page: "How Much Do Driving Lessons Cost in Manchester? (2026)" — total cost, DVSA fees, hours maths, budgeting. Remove "Prices" from the H1 and link to the prices page as the commercial next step.

**Test-centre hub vs Cheetham Hill article.** Both target Cheetham Hill, but one is a hub and one is an informational deep dive. That is fine if they cross-link with distinct anchors. The article should target "Cheetham Hill test centre" and the hub should target "driving test centres Manchester."

---

## 7. Structured data: one high-risk item, several small wins

### Remove the `aggregateRating` from `LocalBusiness` (P0)

The homepage marks up:

```json
"aggregateRating": {
  "@type": "AggregateRating",
  "ratingValue": "5.0",
  "reviewCount": "115"
}
```

The reviews shown on the site are Google reviews, so this markup is effectively claiming third-party reviews as first-party. Google's review-snippet guidelines require reviews to be about the entity, visible on the page, and not copied from a third-party review site. Self-serving reviews on `LocalBusiness` are also not eligible for star rich results. At best the markup is ignored; at worst it is a manual-action/spam risk.

**Do:** remove `aggregateRating` from the `LocalBusiness` node. Keep the reviews visible. If you want review rich results, collect first-party reviews on the site (no gating, no incentives) and mark those up. Do not mark up Google reviews as your own.

### Smaller schema fixes

- **Blog author:** `"author": {"@type": "Organization"}` → a named `Person` with `jobTitle`, `worksFor`, `url`/`sameAs`, and a short bio. Add a visible author box.
- **`sameAs`:** add Instagram, Facebook, YouTube, TikTok and the Google Business Profile URL to the organisation node.
- **`areaServed`:** add the covered areas (or a `GeoCircle`/`AdministrativeArea`) to the organisation node, not only to each `Service`.
- **`Service.offers.price`:** use a number, plus `priceSpecification` with `unitText: "HOUR"` where relevant.
- **`WebPage.isPartOf`:** area pages reference `https://cruisenpass.com/#website`, but the WebSite node is only defined on the homepage. Add a WebSite node to the area-page graph or drop the reference.
- **FAQ alignment:** make the JSON-LD answer text match the visible answer exactly. Several area pages have slightly different wording.
- **`AboutPage` / `ContactPage`:** add when those pages exist.

---

## 8. Content gaps that matter

### P0 — before more area pages

1. **About / Meet the instructors page.** This is the biggest E-E-A-T gap. Include each instructor's name, photo, ADI status, years teaching, transmission, areas covered, languages and a first-hand line. The reviews already name Farhan, Hassan and Ali; give them faces and credentials. Link from the nav, footer, homepage and every area page.
2. **Individual test-centre pages.** A 626-word hub is unlikely to rank strongly for nine different centre queries. Build at least four: West Didsbury, Bury, Sale and Bredbury (Stockport). Then Bolton, Chadderton, Rochdale and Atherton. Each should have official data, local roads, parking/test-day logistics and links to the relevant area pages.
3. **Official test-centre data module.** A table of current median waits and first-attempt pass rates, with source and date, is more useful than another 500 words of generic copy. It also gives AI search something to cite.

### P1 — next 30–60 days

4. **An Areas hub** (`/driving-lessons-manchester` can do this) grouped by North Manchester, South Manchester, Trafford, Stockport, Bolton/Bury and Rochdale/Oldham. Replace the flat 35-link grid on the homepage with the same grouping.
5. **Contact page** with NAP, hours, service area, response time, map and booking options. The homepage anchor is not a substitute for a stable contact URL.
6. **First lesson guide** — high-volume, low-competition, strong conversion intent.
7. **Theory test guide** and **driving test fees/waiting times** — useful, linkable, and supports the cost page.
8. **Nervous drivers / refresher lessons** — only if you actually staff and want this work. Same for **student driving lessons** and **cheap driving lessons**. Do not create pages you cannot fulfil.

### P2 — 60–90 days

9. **Pass Plus / motorway lessons** if offered.
10. **Video transcripts and summaries** on `/learn-now`.
11. **Local pass stories** (with consent) and a quarterly "pass map" or roundup.
12. **Two to four new blog posts** from the existing content plan, each with a named author and a money-page link in the first three paragraphs.

**Do not add more area pages until Tier A and B are genuinely differentiated.** More thin pages is the one move most likely to make things worse.

---

## 9. Official DVSA data you can use

Your test-centre content currently says "pass rates vary" without numbers. DVSA publishes the data. These are the September 2026 median waits and the 2025/26 first-attempt pass rates for the local centres:

| Centre | Median wait (weeks, Sep 2026) | First-attempt pass rate (2025/26) |
|---|---:|---:|
| Atherton (Manchester) | 10.0 | 45.1% |
| Bolton (Manchester) | 12.4 | 52.8% |
| Bredbury (Manchester) — serves Stockport | 16.1 | **57.9%** |
| Bury (Manchester) | **5.7** | 45.7% |
| Chadderton | 16.1 | 45.6% |
| Cheetham Hill (Manchester) | 10.0 | 44.1% |
| Rochdale (Manchester) | **5.6** | 48.6% |
| Sale (Manchester) | 18.3 | 53.0% |
| West Didsbury (Manchester) | **19.9** | 48.1% |

**Sources:** DVSA, *Car driving test waiting times and availability by driving test centre* (DRT122F, September 2026) and *Car driving test pass rates by first driving attempt* (DRT122C, 2025/26). Always link to the GOV.UK dataset and date the table.

**How to use it without misleading people:**

- Pass rates reflect the learner population, route mix and local traffic — not a simple "easiest centre" ranking. Say that explicitly.
- Waiting times change monthly. Date the table and refresh it monthly or quarterly.
- "Shortest wait" is not the same as "best centre." The right centre is the one whose roads you have practised, as your current copy says.
- The data corrects two current errors: Atherton is open, and Stockport is served by Bredbury.

This one table gives you a genuine content advantage over competitors who only write "we know the test routes."

---

## 10. Example rewrite: Didsbury

### Current

- **Title:** `Driving Lessons in Didsbury | Cruise'N'Pass` (43)
- **Description:** `Driving lessons in Didsbury with DVSA-approved instructors. West Didsbury test routes, £35/hr, free pick-up. Book today.` (120)
- **H1:** `Driving Lessons in Didsbury from £35 an Hour`
- **Intro:** "Didsbury learners train on the A5145 Kingsway, around Didsbury Village and along the Mersey routes — with the West Didsbury test centre practically on the doorstep."

"A5145 Kingsway" merges two different roads: Kingsway is the A34, while the A5145 in this part of Manchester is Wilmslow Road / Parrs Wood Lane / Barlow Moor Road. The rest is generic enough to appear on any area page.

### Proposed

**Title:** `Driving Lessons in Didsbury from £35/hr | Cruise'N'Pass` (55)  
**Description:** `Driving lessons in Didsbury from £35/hr. A34 Kingsway, Didsbury Village and West Didsbury test-centre practice. Free pick-up, 7 days.` (133)  
**H1:** `Driving Lessons in Didsbury from £35 an Hour`

**Intro:**

> Didsbury learners usually start on the quieter roads around Didsbury Village and Fog Lane, then build up to the A34 Kingsway, Parrs Wood and the A5145 corridor towards Stretford. The West Didsbury test centre is a short drive away, so lessons regularly include mock-test practice on the roads local tests commonly use.

**Add these sections:**

- **"The Didsbury roads learners find hardest"** — A34 Kingsway lane discipline, Parrs Wood, the A5145 corridor towards Stretford, and the residential streets around Didsbury Village. What goes wrong and how lessons fix it.
- **"Your test centre: West Didsbury"** — distance, current median wait (19.9 weeks, Sept 2026), first-attempt pass rate (48.1%, 2025/26), parking/test-day logistics, link to the centre page.
- **"Where we pick up in Didsbury"** — Didsbury Village, East Didsbury tram stop, Parrs Wood, the Wilmslow Road corridor and M20.
- **"A Didsbury learner's story"** — one real review, with first name, instructor and test centre. If you do not have one for Didsbury, do not invent it; use a nearby area and say so.
- **"Didsbury FAQs"** — three questions that only make sense here: "Is Didsbury Village easy to practise in?", "How long does it take to get to West Didsbury test centre?", "Do you pick up from East Didsbury tram stop?"
- **One photo** of the car or a pupil at a recognisable Didsbury location, with alt text such as "Driving lesson in Didsbury near Didsbury Village."

That structure is repeatable, but the content inside it is not. That is the difference between a local page and a doorway page.

---

## 11. 30 / 60 / 90-day plan

### First 30 days — fix trust and the top of the funnel

1. **Fix every item in the accuracy table** (A5145, Atherton/Wigan, Stockport/Bredbury, Mauldeth Road, exact-route claims, DVSA-approved school, Top Rated, response times, free pick-up).
2. **Remove `aggregateRating`** from the LocalBusiness schema.
3. **Rewrite the first seven Tier A area pages** to the Tier A target (700–900 unique words), with a photo, two real reviews, a named instructor and official test-centre data: Didsbury, West Didsbury, Chorlton, Sale, Stockport, Cheetham Hill and Manchester City Centre.
4. **Publish an About / Meet the Instructors page** and add a short instructor section to the homepage.
5. **Add the official pass-rate/waiting-time table** to `/driving-test-centres-manchester` and the Cheetham Hill article.
6. **Differentiate the prices and costs pages** (titles, H1s, internal links, "what's included/excluded").
7. **Add named author boxes** to the costs and Cheetham Hill articles.

### Days 31–60 — depth and structure

8. **Finish the remaining Tier A pages**, rewrite Tier B, and consolidate Tier C pages that cannot reach 400 unique words.
9. **Build four individual test-centre pages:** West Didsbury, Bury, Sale, Bredbury (Stockport). Then Bolton, Chadderton, Rochdale and Atherton.
10. **Expand `/intensive-driving-course`, `/manual-vs-automatic` and `/driving-faq`** to 900–1,200 words with first-hand detail and official data.
11. **Add an Areas hub** and group the homepage/hub links by region.
12. **Publish two new guides** from the existing plan: "What happens on your first driving lesson" and "Driving test fees and waiting times in 2026."

### Days 61–90 — compounding

13. Finish the remaining area pages and add local photos/reviews.
14. Publish two more guides: automatic vs manual (with data), and a test-centre comparison.
15. Add local link-building and GBP posts; keep the review-request system running.
16. Set a quarterly content-refresh calendar; update DVSA data monthly/quarterly.

---

## 12. How to measure whether this works

**Search Console (weekly):**

- Impressions, clicks and average position for "driving lessons [area]", "driving test centre [area]", "driving lesson prices/cost Manchester".
- Index coverage: watch "Crawled — currently not indexed" and "Discovered — currently not indexed" on area pages. That is the clearest signal Google is treating them as low-value.
- Query/page mismatch: which area pages are ranking for the wrong area?

**Conversions (weekly):**

- Calls, form submissions and WhatsApp clicks by landing page.
- Area-page conversion rate vs homepage and hub.
- Cost-page assisted conversions (it is a research page, so judge it on assists, not last-click).

**Google Business Profile (weekly):**

- Calls, direction requests, website clicks, new reviews and review velocity.
- Use UTM-tagged GBP links so organic and GBP traffic do not blur.

**Content QA (quarterly):**

- Unique word count per area page (target 500+).
- Shared-sentence percentage (target under 20%).
- At least one image and two area-specific reviews per Tier A page.
- Every price, centre name, wait time and pass rate re-checked against the source.

**Rank tracking:** use a geo-grid tool for the Map Pack (BrightLocal, Local Falcon or Whitespark), not a single citywide rank check. Organic citywide rankings can be tracked separately.

---

## 13. Fixes applied in this PR (29 October 2026)

This section was added after implementation, so the review above remains a record of the original state.

### Fixed

- **Local accuracy:** Didsbury now uses the A34 Kingsway and the A5145 as Wilmslow Road / Parrs Wood Lane / Barlow Moor Road; Atherton uses the Atherton (Manchester) centre and mentions Bolton; the Stockport cluster uses Bredbury (Manchester) and states that there is no separate Stockport centre; Withington no longer refers to a "Mauldeth Road" centre.
- **Route claims:** "exact/actual test routes" replaced with "the roads and junctions local tests commonly use" across the site. The Cheetham Hill article's disclaimer is now consistent with the rest of the site.
- **Trust claims:** "DVSA-approved driving school" corrected to "DVSA-approved instructors"; "Top Rated" replaced with the verifiable 100+ Google reviews; "five-star" claims removed; reply-time promises standardised to 24 hours.
- **Structured data:** `aggregateRating` removed from the homepage `LocalBusiness`; the third-party `Review` ItemList removed from the reviews page; area-page `WebSite` node added; `Service` price made numeric; `sameAs` added to the area organisation node.
- **Official data:** DVSA September 2026 waits and 2025/26 first-attempt pass rates added to the test-centres page, the Cheetham Hill article and the area-page test-centre sections, with source and date.
- **Centre list:** corrected to the nine centres used: Cheetham Hill, West Didsbury, Sale, Bury, Chadderton, Bolton, Bredbury, Rochdale and Atherton. Stockport is treated as served by Bredbury, not as a separate centre.
- **About page:** `/about` added with the school's approach, coverage, review proof, team note, pricing/test-centre links and `AboutPage` schema. Linked from the homepage, area pages and every standard footer; added to the sitemap, build manifest and SEO checks.
- **Area pages:** priority areas (Didsbury, West Didsbury, Chorlton, Sale, Stockport, Cheetham Hill, Manchester City Centre) now have a unique local-driving note and two area-specific FAQs. All area pages now show official test-centre data and link to the guide.
- **Metadata:** Manchester hub title differentiated to `Driving Lessons in Manchester Guide (2026)`; costs page retitled and H1 changed to remove the "Prices" overlap; privacy description shortened; relative review dates replaced with "Google review" and a sync date.
- **"Driving school in Manchester" targeting:** homepage title, H1 and opening copy now use the exact phrase; added a "Why learners choose Cruise'N'Pass" section; About page title/H1 now target the same phrase; footer link text and hub intro reinforced it. This is on-page work, not a ranking guarantee.
- **Regression checks:** `scripts/seo-check.mjs` now requires the About page, asserts it is in the sitemap and blocks `aggregateRating` returning to the homepage.

### Still outstanding

- **Full area-page rewrite.** The seven priority pages are materially better, but most area pages still share the package block, generic FAQs and template sections. Tier B/C pages still need 500+ words of genuinely unique local content, or consolidation.
- **Individual test-centre pages.** The guide now has the data and nine centre summaries, but only Cheetham Hill has a dedicated page. West Didsbury, Bury, Sale and Bredbury are the next four.
- **Named instructor bios.** The About page names the instructors mentioned in reviews, but there are no photos, ADI numbers, specialisms or area coverage per instructor. These need real business input.
- **Original local photography.** No new images were added; the existing Instagram imagery remains the only visual proof. Area pages still have no local photo.
- **First-party review collection / schema.** Google reviews are visible but no longer marked up. If review rich results are wanted, collect first-party reviews on the site and mark those up.
- **Link building and GBP execution.** The local SEO action plan's review-growth, GBP posting and citation work is outside this PR.
- **Search Console and Google Business Profile verification.** Without verified access, index status and Map Pack visibility cannot be confirmed or fixed from the codebase. The user must verify the property, submit the sitemap, request indexing and confirm the GBP category/website/service areas. See `docs/google-search-visibility-2026-10-29.md` for the step-by-step plan.

### Verification

`npm run build` and `npm run check` both pass, including HTML validation, local reference checks, anchor checks, JSON-LD, CSP, SEO checks and regression checks.

---

## Appendix: method and sources

- Parsed 52 local HTML files; extracted `<main>` text and counted words after removing scripts, styles, header and footer.
- Compared 35 `driving-lessons-*.html` pages using 5-gram Jaccard similarity and exact-sentence overlap.
- Checked all titles, meta descriptions, H1s, canonicals, robots directives, JSON-LD types and internal links.
- Fetched live `robots.txt` and `sitemap.xml`; confirmed 51 sitemap URLs and no missing indexable pages.
- Cross-checked test-centre names, waiting times and pass rates against DVSA's published datasets:
  - [Driving test and theory test data: cars](https://www.gov.uk/government/statistical-data-sets/driving-test-and-theory-test-data-cars)
  - DRT122F — waiting times by test centre, September 2026
  - DRT122C — first-attempt pass rates by test centre, 2025/26
- Google guidance referenced:
  - [Doorway pages](https://developers.google.com/search/docs/essentials/spam-policies#doorway-pages)
  - [Scaled content abuse](https://developers.google.com/search/docs/essentials/spam-policies#scaled-content)
  - [Review snippet guidelines](https://developers.google.com/search/docs/appearance/structured-data/review-snippet)
- No access to Search Console, Analytics or Google Business Profile insights, so this review does not include traffic, ranking or revenue data. Recommendations are based on the content, structure and published data, not measured performance.
- The audit was completed before implementation; section 13 records the fixes applied in this PR and what remains.
