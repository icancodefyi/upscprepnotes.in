# UPSCPrepNotes Launch Checklist

## Phase 1: Data Readiness ✅

- [ ] **Database Cleanup**
  - [ ] Delete fake skeleton docs from MongoDB (filter: `{ firstname: { $exists: false } }`)
  - [ ] Verify all 20 launch toppers are properly seeded
  - [ ] Run migration: `pnpm run migrate:normalize` to validate field names
  - [ ] Confirm topper records have: firstName, lastName, marks, bio, slug, year, rank, optionalSubject

- [ ] **Featured Toppers (20 Launch Cluster)**
  - [ ] Run `pnpm run seed:featured`
  - [ ] Verify all 20 toppers marked with `isFeatured: true` and `isIndexed: true`
  - [ ] Test that each topper profile loads at `/upsc-topper/[slug]`
  - [ ] Validate marks data for all profiles

## Phase 2: SEO Infrastructure ✅

- [ ] **Robots & Sitemap**
  - [ ] Verify `public/robots.txt` exists and points to sitemap.xml
  - [ ] Check `/sitemap.xml` route returns valid XML with ~20 topper URLs + core pages
  - [ ] Validate sitemap lastmod timestamps match topper.updatedAt

- [ ] **Google Search Console Setup**
  - [ ] Register domain in Google Search Console
  - [ ] Submit sitemap.xml URL
  - [ ] Request initial crawl
  - [ ] Monitor indexing status and coverage

- [ ] **Google Analytics Setup**
  - [ ] Create GA4 property for upscprepnotes.in
  - [ ] Install GA measurement ID in `next.config.ts` (if using @next/third-parties)
  - [ ] Verify events tracking on page views
  - [ ] Set up conversion tracking for key actions (click "Explore Toppers", navigate to subject pages)

- [ ] **Metadata & Open Graph**
  - [ ] Homepage: Meta title, description, OG image, OG URL verified
  - [ ] Topper pages: Dynamic metadata with topper name, AIR, marks, optional subject
  - [ ] Optional subject pages: Dynamic metadata per subject
  - [ ] Test OG cards on social share preview tools

## Phase 3: Mobile Optimization ✅

- [ ] **Responsive Design Testing**
  - [ ] **iPhone 12/13 (390px)**: Hero text readable, buttons tap-friendly, no overflow
  - [ ] **iPhone SE (375px)**: Marquee text readable, stats grid 2 cols, toppers cards stack properly
  - [ ] **iPad (768px)**: Layouts scale up correctly, sidebar not visible on tablet
  - [ ] **Desktop (1440px+)**: Left rail visible, all grids render correctly

- [ ] **Homepage Testing**
  - [ ] Hero h1 text: 3xl (mobile) → 4xl (sm) → 5xl (md) → 6xl (lg) → 64px (xl)
  - [ ] Marquee animation plays smoothly on all breakpoints
  - [ ] Stats box responsive: 2x2 grid on mobile with smaller text
  - [ ] Featured toppers cards: single column on mobile, proper grid on md+
  - [ ] Optional subjects grid: 1-2 columns on mobile, 2 on tablet, maintain on desktop

- [ ] **Optional Subject Pages**
  - [ ] Hero title responsive: 3xl (mobile) → 4xl (sm) → 5xl (md) → 6xl (lg)
  - [ ] Stats grid: 2 cols (mobile/sm) → 4 cols (sm+)
  - [ ] Topper cards: single column on mobile with image + title + marks
  - [ ] Footer CTA centered and button size appropriate

- [ ] **Topper Detail Pages**
  - [ ] Left sidebar image visible and properly scaled
  - [ ] Hero section: title, tags, marks grid responsive
  - [ ] Marks breakdown grid: single column (mobile) → md:grid-cols-3 (desktop)
  - [ ] Related toppers section: proper spacing and card layout

- [ ] **Footer**
  - [ ] Links organized in 4-column grid (lg+), collapses to 1 column (mobile)
  - [ ] Text sizes appropriate for mobile
  - [ ] All links clickable and properly spaced

- [ ] **Touch & Interaction**
  - [ ] All links have minimum 44px tap target
  - [ ] Buttons have hover/active states
  - [ ] No text overlap or clipping on mobile
  - [ ] Images load properly on 3G/4G speeds

## Phase 4: Content & Pages ✅

- [ ] **Core Pages**
  - [ ] Homepage: Hero, marquee, featured toppers, optional subjects, philosophy, footer
  - [ ] 20 Featured topper profiles: Load and display complete data
  - [ ] Optional subject pages (PSIR, Sociology, Anthropology): Render stats and toppers
  - [ ] Legal pages: About, Contact, Disclaimer, Privacy Policy, Terms
  - [ ] 404 page: Responsive and links back to home

- [ ] **Navigation**
  - [ ] Homepage navbar links working
  - [ ] Footer links all functional
  - [ ] Breadcrumbs on topper pages correct
  - [ ] Back to home CTAs functional

- [ ] **Performance**
  - [ ] Homepage load time < 3s (3G throttled)
  - [ ] Image optimization verified (dicebear avatars load fast)
  - [ ] CSS and JS properly minified
  - [ ] No console errors or warnings

## Phase 5: Testing & QA ✅

- [ ] **Functional Testing**
  - [ ] Topper page link from homepage works
  - [ ] Subject page link from homepage works
  - [ ] All 20 toppers have valid profiles accessible
  - [ ] Search functionality (if implemented) works
  - [ ] Filters/sorting (if implemented) works

- [ ] **Browser Compatibility**
  - [ ] Chrome latest
  - [ ] Safari latest (iOS 16+)
  - [ ] Firefox latest
  - [ ] Edge latest

- [ ] **404 & Error Handling**
  - [ ] Invalid topper slug shows 404
  - [ ] Invalid subject slug shows error
  - [ ] Database errors handled gracefully
  - [ ] Missing images display fallback

- [ ] **Accessibility**
  - [ ] Color contrast meets WCAG AA standards
  - [ ] Keyboard navigation functional
  - [ ] Images have alt text
  - [ ] Form inputs (if any) properly labeled

## Phase 6: Security & Compliance ✅

- [ ] **Security**
  - [ ] HTTPS enabled on production domain
  - [ ] No sensitive data in code or environment variables exposed
  - [ ] Rate limiting configured (if applicable)
  - [ ] CORS properly configured

- [ ] **Privacy & Legal**
  - [ ] Privacy Policy published and accessible
  - [ ] Terms of Service published and accessible
  - [ ] Disclaimer published
  - [ ] Cookie consent (if using analytics)

- [ ] **Performance & Analytics**
  - [ ] Google Analytics events tracking properly
  - [ ] Page view tracking working
  - [ ] Conversion events firing
  - [ ] Error tracking configured

## Phase 7: Deployment ✅

- [ ] **Pre-Deployment**
  - [ ] All environment variables set in production (.env.production)
  - [ ] MONGODB_URI pointing to production database
  - [ ] Domain DNS configured
  - [ ] SSL certificate issued

- [ ] **Deployment**
  - [ ] Build succeeds: `pnpm build` (0 errors/warnings)
  - [ ] Deploy to production hosting
  - [ ] Verify domain points to correct server
  - [ ] Database connection successful from production
  - [ ] All pages load without 500 errors

- [ ] **Post-Deployment Verification**
  - [ ] Homepage loads at upscprepnotes.in
  - [ ] All featured toppers accessible
  - [ ] Optional subject pages load
  - [ ] Sitemap.xml accessible at upscprepnotes.in/sitemap.xml
  - [ ] robots.txt accessible at upscprepnotes.in/robots.txt

## Phase 8: Launch! 🚀

- [ ] **Final Checks**
  - [ ] Visit upscprepnotes.in - no errors
  - [ ] Navigate to each featured topper - all profiles complete
  - [ ] Check optional subjects - stats and toppers display
  - [ ] Google Search Console: Submit URL for indexing
  - [ ] Monitor first 24 hours for errors

- [ ] **Post-Launch Monitoring (First Week)**
  - [ ] Check Google Search Console for indexing progress
  - [ ] Monitor Analytics for traffic and user behavior
  - [ ] Check error logs for any issues
  - [ ] Respond to any user feedback
  - [ ] Monitor page load times and Core Web Vitals

- [ ] **Future Improvements**
  - [ ] Add more toppers beyond launch cluster (30-50 total)
  - [ ] Implement search/filtering functionality
  - [ ] Add topper comparison tool
  - [ ] Build subject-wise insights pages
  - [ ] Create interview score analysis tool
  - [ ] Add strategy/tips from toppers
  - [ ] Build preparation timeline tool

---

## Key Metrics for Success

- **Indexing**: All 20 topper profiles indexed in Google within 7 days
- **Performance**: Lighthouse score ≥ 85
- **Mobile**: Responsive design passes Google Mobile-Friendly Test
- **Traffic**: 100+ unique visitors in first week
- **Bounce Rate**: < 40% (good content engagement)
- **Conversion**: Click-through on "Explore Toppers" > 20%

---

## Current Status

**Architecture Phase**: ✅ COMPLETE
- ✅ Schema finalized (firstName, lastName, marks, optionalSubject, etc.)
- ✅ Service layer normalized
- ✅ Types defined
- ✅ Optional subject pages built
- ✅ Mobile optimization complete
- ✅ SEO infrastructure (robots.txt, sitemap.xml)
- ✅ Legal pages created

**Pending**: 
- [ ] Delete fake MongoDB docs
- [ ] Run seed:featured
- [ ] Verify sitemap has toppers
- [ ] GSC + Analytics setup
- [ ] Deploy to production
