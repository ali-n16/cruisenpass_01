# Google Search Visibility — "driving school in Manchester"

**Date:** 29 October 2026  
**Issue:** cruisenpass.com does not appear in Google when searching for "driving school in Manchester".  
**Important:** this document separates what can be fixed in the website from what can only be fixed in Google Search Console and Google Business Profile. No honest SEO can guarantee a #1 ranking for a competitive local head term.

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
