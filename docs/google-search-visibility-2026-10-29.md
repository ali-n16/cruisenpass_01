# Google Search Visibility — "driving school in Manchester"

**Date:** 29 October 2026  
**Issue:** cruisenpass.com does not appear in Google when searching for "driving school in Manchester".  
**Important:** this document separates what can be fixed in the website from what can only be fixed in Google Search Console and Google Business Profile. No honest SEO can guarantee a #1 ranking for a competitive local head term.

---

## 0. Check results — 29 October 2026

### Live site

- Homepage title is live as `Driving School in Manchester | Lessons from £35/hr`.
- The "Why learners choose Cruise'N'Pass" section, `/about` page and sitewide "Driving school in Manchester" footer link are live.
- Sitemap returns 52 URLs; IndexNow accepted 52 URLs.
- DNS has a `google-site-verification` TXT record, so the Search Console domain property has been verified at some point. I cannot see the index report or sitemap status without account access.

### Google Maps / Google Business Profile — the important finding

Searching Google Maps for `Cruise'N'Pass Manchester` returns **two listings for the same business**:

| | Listing A | Listing B |
|---|---|---|
| Name | `Cruise'N'Pass` | `cruisenpass driving school` |
| Rating | 5.0 | No reviews |
| Category | Driving school | Driving school |
| Website | cruisenpass.com | cruisenpass.com |
| Phone | 07916 155054 | 07916 155054 |
| Address shown | None | 81 Broadway, Manchester M40 3PD |
| Hours | Closes 6pm | Closes 8pm |
| Map pin | **47.73855, 12.5088275** — Unterwössen, Bavaria, Germany | 53.5179374, -2.1679703 — Manchester |

Place IDs:

- Listing A: `ChIJMRHz3_Cqqa4R8hXOlAsZokI`
- Listing B: `ChIJ89cmFTONLCgRFSzRjfjzIEQ`

A Maps search for `driving school in Manchester` returned six results in the limited view, and **neither listing appeared**. The top results were other driving schools and sponsored listings.

**Diagnosis:** this is a Google Business Profile problem, not a website-content problem. The listing with the 5.0 rating and the business's website/phone is pinned in Bavaria, and a second Manchester listing at 81 Broadway has no reviews. Google is being asked to rank a mislocated listing and a duplicate listing; that is very likely why the business is absent from the Manchester Map Pack. The duplicate also splits reviews and authority, and the 6pm/8pm hours conflict.

### What to do about the listings

1. Sign in at [business.google.com](https://business.google.com) and check which of the two listings you actually manage/own. If you do not recognise one, it may be an old or third-party-created duplicate.
2. **Fix Listing A's location first.** If Cruise'N'Pass is a service-area business, remove any physical address, set the service areas to Manchester and the covered areas, and make sure the map pin is in Greater Manchester — not Bavaria. If you have a real customer-facing address, use only that address.
3. **Merge or remove Listing B.** Do not delete the listing with the reviews until Google confirms the reviews will move. Use "Suggest an edit" → "Close or remove" → "Duplicate", or contact Google Business Profile support and ask them to merge the duplicate into the verified listing.
4. **Do not create a third listing.** That makes the duplicate problem worse.
5. Set both listings to the same hours (the site says 8am–8pm; Listing A says 6pm), category **Driving school**, website and phone.
6. After the merge/fix, ask Google support for the case ID, then monitor Maps for 2–4 weeks. Review counts and rankings can take time to settle.
7. If the 5.0 listing is not yours and cannot be claimed, report it as a fake/duplicate listing using the Business Profile redress form.

---

## 1. What has been changed on the website

The homepage previously targeted "driving lessons in Manchester" everywhere; "driving school in Manchester" appeared mainly in image alt text and a review. That is a relevance gap for the exact query. The following changes are in the PR branch:

- Homepage `<title>` is now `Driving School in Manchester | Lessons from £35/hr`.
- Homepage H1 is now `Driving School in Manchester` with the supporting line `Driving lessons from £35 an hour.`
- The opening paragraph now says `Cruise'N'Pass is a driving school in Manchester...`
- Added a "Why learners choose Cruise'N'Pass" section using the exact phrase and linking to About, prices and test centres.
- About page title/H1/description now target `driving school in Manchester`.
- The Manchester hub intro and sitewide footer anchor text now reinforce the phrase.
- Sitemap `lastmod` dates updated for the changed pages.
- Technical checks pass: indexable, self-canonical, no `noindex`, robots.txt allows crawling, sitemap contains 52 URLs.

**This improves relevance. It does not create authority or a Google Business Profile.** Those are the two factors most likely to decide whether a local driving-school query shows your site.

---

## 2. First, check whether Google has indexed the site

Open Google and search:

```text
site:cruisenpass.com
```

### If no pages appear

This is an indexing problem, not a ranking problem. In Google Search Console:

1. Add/verify the property `cruisenpass.com` (Domain property via DNS is best; URL-prefix with the HTML tag also works).
2. Go to **Sitemaps** and submit `https://cruisenpass.com/sitemap.xml`.
3. Use **URL Inspection** on `https://cruisenpass.com/` and click **Request indexing**.
4. Check **Page indexing** for "Discovered — currently not indexed", "Crawled — currently not indexed", "Duplicate, Google chose different canonical", or "Excluded by noindex".
5. Check **Security & Manual Actions** for any manual action or security issue.
6. If the homepage is indexed but inner pages are not, request indexing for the priority area pages and the test-centres guide.

### If pages appear in `site:` but not for the query

This is a ranking/authority problem. Continue with sections 3–5.

---

## 3. Google Business Profile — the biggest lever for this query

"Driving school in Manchester" is a local-intent query. Most clicks go to the **Map Pack**, not the blue links. A website alone is unlikely to outrank established schools for the head term.

In [Google Business Profile](https://business.google.com):

1. Claim and verify the listing for **Cruise'N'Pass**.
2. Primary category: **Driving school**. Secondary: **Driving instructor** only if available.
3. Business name exactly `Cruise'N'Pass` — do not add "Manchester" or keywords (suspension risk).
4. Website: `https://cruisenpass.com/?utm_source=google&utm_medium=organic&utm_campaign=gbp`.
5. Booking link: `https://cruisenpass.com/?utm_source=google&utm_medium=organic&utm_campaign=gbp_booking#contacts`.
6. Phone: `07916 155054`; hours: Mon–Sun 08:00–20:00.
7. Set the real service areas (up to 20). If you are mobile-only, hide the address and use service areas; do not invent a storefront.
8. Add every package as a **Service** with the same prices as the site.
9. Add 10+ real photos: car, instructor, lessons, pass celebrations, local roads. Add 3–5 new photos per week.
10. Publish one Google Post per week (offer, pass story, test-centre tip).
11. Ask every pupil for a review at the pass/lesson milestone — no incentives, no gating; reply to every review within 72 hours.
12. Check for duplicate or suspended listings, and make sure the name, phone and website match the site exactly.

If the profile is not verified, the site cannot appear in the Map Pack for this query, regardless of on-page work.

---

## 4. Authority and citations

For a competitive head term, Google needs to see the business referenced elsewhere. Do these in the first 30 days:

- **Bing Places** and **Apple Business Connect** — free, quick, and consistent NAP.
- **Yell**, **Thomson Local**, **FreeIndex**, **Cylex**, **Brownbook** — complete profiles with the same name, phone, website and category.
- **Facebook Page** and **Instagram** — already linked; ensure the website and phone match.
- **Driving-school directories** and local business associations.
- **Local sponsorships or partnerships** — a genuine link from a football club, college, community group or charity is worth more than 50 directory links.
- **Supplier/partner pages** — instructor training providers, car lease/insurance partners, local businesses.
- **Local press** — offer comment on DVSA waiting times, test fees or new-driver safety. One Manchester Evening News link is a strong authority signal.

Avoid paid link networks, guest-post farms, and "SEO package" backlinks. They create more risk than value.

---

## 5. Content and conversion

The site already has strong assets: 35 area pages, a test-centres guide, a costs guide, reviews and clear pricing. The next content priorities are:

- Finish the Tier A/B area-page rewrites (the review flags the remaining shared copy).
- Build individual pages for West Didsbury, Bury, Sale and Bredbury test centres.
- Add named instructor profiles with photos and ADI credentials.
- Add original local photos to the priority area pages.
- Keep the blog cadence at 2–4 useful posts per month, each with a named author and a link to a money page.

Check that every priority page has:

- One H1 containing the target phrase.
- A title under ~60 characters and a description under ~155.
- A clear CTA above the fold.
- Internal links from the homepage/hub and at least two related pages.
- A visible last-updated date.

---

## 6. Measurement

Track weekly:

- **Search Console:** impressions, clicks, CTR and average position for "driving school in Manchester", "driving lessons Manchester", and the area/test-centre terms.
- **Indexing:** number of indexed pages and "not indexed" reasons.
- **GBP Insights:** calls, direction requests, website clicks, messages, new reviews.
- **Conversions:** calls, forms and WhatsApp clicks by landing page.
- **Map Pack:** a geo-grid tool (Local Falcon, BrightLocal or Whitespark), not a single citywide rank check.

Use a 28-day comparison, not daily rank checks. Local rankings move by searcher location.

---

## 7. Realistic timeline

| Time | What to expect |
|---|---|
| 0–2 weeks | Indexing/recrawl; GSC and GBP fixes; no ranking change yet |
| 2–6 weeks | Long-tail area terms may move; branded search should show the site |
| 6–12 weeks | Head-term movement if GBP is verified and citations/links are building |
| 3–6 months | Realistic window to compete for "driving school in Manchester" |
| Ongoing | Reviews, posts, links and fresh content decide whether you stay there |

A new domain or a site with few external links will not jump to page one for a competitive local head term in a few days. The on-page changes remove a self-inflicted relevance problem; the GBP, reviews and links do the heavy lifting.

---

## 8. Immediate checklist

- [ ] Deploy/merge the latest PR branch to production (the live homepage still shows the old title at the time of writing).
- [ ] Verify `cruisenpass.com` in Google Search Console.
- [ ] Submit `https://cruisenpass.com/sitemap.xml`.
- [ ] Inspect the homepage and request indexing.
- [ ] Check Page indexing and Manual Actions.
- [ ] Claim/verify the Google Business Profile; set category to "Driving school".
- [ ] Add the website, booking link, phone, hours and services to GBP.
- [ ] Upload 10+ real photos and publish one Google Post.
- [ ] Add Bing Places, Apple Business Connect and three local citations.
- [ ] Ask five recent pupils for a Google review (no incentives).
- [ ] Recheck `site:cruisenpass.com` and GBP insights in 14 days.

---

## 9. Do not

- Do not add "driving school Manchester" to the GBP business name.
- Do not buy reviews, gate reviews, or offer incentives.
- Do not buy bulk backlinks or use PBNs.
- Do not create fake locations or doorway pages for areas you do not cover.
- Do not expect a guaranteed #1 ranking from any agency or tool.
