"use client";

import Script from "next/script";

export default function AnalyticsScripts({ isInternal }: { isInternal?: boolean }) {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script
        id="site-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              var isAdmin = location.pathname.indexOf('/admin') === 0;
              if (location.search.indexOf('optex=1') !== -1) { localStorage.setItem('_optex', '1'); window.history.replaceState({}, '', location.pathname); }
              if (location.search.indexOf('optex=0') !== -1) { localStorage.removeItem('_optex'); window.history.replaceState({}, '', location.pathname); }
              var selfExclude = localStorage.getItem('_optex') === '1';
              var isInternalUser = ${!!isInternal};
              if (selfExclude || isAdmin || isInternalUser) return;

              // Google Analytics
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', { send_page_view: true });

              // Microsoft Clarity
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "x0uxeg9kkg");

              // Own analytics backend
              function getSessionId() {
                var s = sessionStorage.getItem('_sid');
                if (!s) { s = 's' + Date.now() + Math.random().toString(36).slice(2,8); sessionStorage.setItem('_sid', s); }
                return s;
              }
              function getVisitorId() {
                try {
                  var m = document.cookie.match(/(?:^|;\s*)_vid=([^;]*)/);
                  if (m) return m[1];
                  var id = 'v' + Date.now() + Math.random().toString(36).slice(2,12);
                  document.cookie = '_vid=' + id + ';path=/;max-age=31536000;SameSite=Lax';
                  return id;
                } catch(e) { return 'unknown'; }
              }
              function getDeviceType() {
                var ua = navigator.userAgent;
                if (/Mobile|Android|iPhone|iP(od|hone)/i.test(ua) && !/iPad/i.test(ua)) return 'mobile';
                if (/iPad|Tablet/i.test(ua)) return 'tablet';
                return 'desktop';
              }
              function fireAnalytics(event, meta) {
                try {
                  if (location.pathname.indexOf('/admin') === 0) return;
                  var d = JSON.stringify({ event: event, pagePath: location.pathname, sessionId: getSessionId(), visitorId: getVisitorId(), referrer: document.referrer || '', userAgent: navigator.userAgent || '', deviceType: getDeviceType(), metadata: meta || {} });
                  var b = new Blob([d], { type: 'application/json' });
                  navigator.sendBeacon('/api/analytics/event', b);
                } catch(e) {}
              }
              fireAnalytics('page_view', { title: document.title });

              var scrollDepths = {};
              function trackScroll() {
                var h = document.documentElement;
                var p = Math.round(((h.scrollTop || document.body.scrollTop) / (h.scrollHeight - h.clientHeight)) * 100);
                var depths = [25, 50, 75, 90, 100];
                for (var i = 0; i < depths.length; i++) {
                  if (p >= depths[i] && !scrollDepths[depths[i]]) {
                    scrollDepths[depths[i]] = true;
                    gtag('event', 'scroll_depth', { depth: depths[i] + '%' });
                    fireAnalytics('scroll_depth', { depth: depths[i] + '%' });
                  }
                }
              }
              var scrollTimer;
              window.addEventListener('scroll', function() {
                clearTimeout(scrollTimer);
                scrollTimer = setTimeout(trackScroll, 300);
              });

              document.addEventListener('click', function(e) {
                var el = e.target.closest('a, button, [data-track]');
                if (!el) return;
                var tag = el.tagName.toLowerCase();
                var href = el.getAttribute('href') || '';
                var text = (el.innerText || '').trim().substring(0, 100);
                var trackAttr = el.getAttribute('data-track') || '';
                var isOutbound = href && href.indexOf(location.hostname) === -1 && href.indexOf('http') === 0;
                gtag('event', 'click', { event_label: trackAttr || (tag === 'a' ? 'link' : 'button'), link_url: href, link_text: text, link_type: tag, is_outbound: isOutbound, page_path: location.pathname });
                fireAnalytics('click', { linkText: text, linkUrl: href, linkType: tag, trackAttr: trackAttr, isOutbound: isOutbound });
              });

              document.addEventListener('submit', function(e) {
                var el = e.target;
                var text = (el.querySelector('button[type=submit], input[type=submit]') || {}).innerText || '';
                gtag('event', 'form_submit', { event_label: el.getAttribute('data-track') || 'form', form_text: text.trim().substring(0, 100), page_path: location.pathname });
                fireAnalytics('form_submit', { formLabel: el.getAttribute('data-track') || 'form', formText: text.trim().substring(0, 100) });
              });

              var pageLoadTime = Date.now();
              window.addEventListener('beforeunload', function() {
                var dep = Math.round((window.scrollY / Math.max(document.documentElement.scrollHeight - document.documentElement.clientHeight, 1)) * 100) + '%';
                var time = Math.round((Date.now() - pageLoadTime) / 1000) + 's';
                gtag('event', 'page_exit', { depth: dep, time_on_page: time, page_path: location.pathname });
                fireAnalytics('page_exit', { scrollDepth: dep, timeOnPage: time });
              });
            })();
          `,
        }}
      />
    </>
  );
}
