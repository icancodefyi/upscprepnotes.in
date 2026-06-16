import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppShell from "@/components/AppShell";
import AuthProvider from "@/components/AuthProvider";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: {
    default: "UPSCPrepNotes — Topper Strategies, Answer Copies & Marksheets",
    template: "%s | UPSCPrepNotes",
  },
  description:
    "India's UPSC preparation intelligence platform. 280+ topper profiles, 50+ verified handwritten answer copies (GS1–4, Essay, Optional), marks breakdowns, optional subject analysis, and AI-powered preparation insights.",
  metadataBase: new URL("https://upscprepnotes.in"),
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  alternates: {},
  openGraph: {
    title: "UPSCPrepNotes — Topper Strategies, Answer Copies & Marksheets",
    description:
      "Structured topper profiles, marksheet analysis, 50+ handwritten answer copies, optional subject trends, and preparation strategies for UPSC aspirants.",
    url: "https://upscprepnotes.in",
    siteName: "UPSCPrepNotes",
    images: [{ url: "/logo.png", width: 512, height: 512 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "UPSCPrepNotes — Topper Strategies, Answer Copies & Marksheets",
    description:
      "India's UPSC preparation intelligence platform. 280+ topper profiles, 50+ handwritten answer copies, optional analysis.",
  },
  keywords: [
    "UPSC",
    "UPSC CSE",
    "UPSC toppers",
    "IAS preparation",
    "UPSC answer copies",
    "topper answer sheets",
    "UPSC marksheets",
    "UPSC strategy",
    "Civil Services Examination",
    "handwritten answer copies",
    "topper compilation",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", plusJakarta.variable)}>
      <head>
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              var isAdmin = location.pathname.indexOf('/admin') === 0;
              var selfExclude = localStorage.getItem('_optex') === '1';

              if (!selfExclude) {
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                if (!isAdmin) {
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
                    send_page_view: true
                  });
                }

                // --- own analytics backend ---
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
                if (location.pathname.indexOf('/admin') !== 0) {
                  fireAnalytics('page_view', { title: document.title });
                }
                // --- end own analytics ---

                var scrollDepths = {};
                function trackScroll() {
                  var h = document.documentElement;
                  var p = Math.round(((h.scrollTop || document.body.scrollTop) / (h.scrollHeight - h.clientHeight)) * 100);
                  var depths = [25, 50, 75, 90, 100];
                  for (var i = 0; i < depths.length; i++) {
                    if (p >= depths[i] && !scrollDepths[depths[i]]) {
                      scrollDepths[depths[i]] = true;
                      if (!isAdmin) gtag('event', 'scroll_depth', { depth: depths[i] + '%' });
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

                  if (!isAdmin) gtag('event', 'click', {
                    event_label: trackAttr || (tag === 'a' ? 'link' : 'button'),
                    link_url: href,
                    link_text: text,
                    link_type: tag,
                    is_outbound: isOutbound,
                    page_path: location.pathname
                  });

                  fireAnalytics('click', { linkText: text, linkUrl: href, linkType: tag, trackAttr: trackAttr, isOutbound: isOutbound });
                });

                document.addEventListener('submit', function(e) {
                  var el = e.target;
                  var text = (el.querySelector('button[type=submit], input[type=submit]') || {}).innerText || '';
                  if (!isAdmin) gtag('event', 'form_submit', {
                    event_label: el.getAttribute('data-track') || 'form',
                    form_text: text.trim().substring(0, 100),
                    page_path: location.pathname
                  });

                  fireAnalytics('form_submit', { formLabel: el.getAttribute('data-track') || 'form', formText: text.trim().substring(0, 100) });
                });

                var pageLoadTime = Date.now();
                window.addEventListener('beforeunload', function() {
                  var dep = Math.round((window.scrollY / Math.max(document.documentElement.scrollHeight - document.documentElement.clientHeight, 1)) * 100) + '%';
                  var time = Math.round((Date.now() - pageLoadTime) / 1000) + 's';
                  if (!isAdmin) gtag('event', 'page_exit', { depth: dep, time_on_page: time, page_path: location.pathname });
                  fireAnalytics('page_exit', { scrollDepth: dep, timeOnPage: time });
                });
              }
            `,
          }}
        />

        {/* Microsoft Clarity — session recordings + heatmaps */}
        <Script
          id="microsoft-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "x0uxeg9kkg");
            `,
          }}
        />

        {/* Organization Schema */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "UPSCPrepNotes",
              url: "https://upscprepnotes.in",
              description:
                "Structured UPSC preparation intelligence with topper profiles, marksheets, and optional subject insights",
              logo: {
                "@type": "ImageObject",
                url: "https://upscprepnotes.in/logo.png",
                width: 512,
                height: 512,
              },
              sameAs: [
                "https://www.youtube.com/@upscprepnotes",
                "https://www.instagram.com/upscprepnotes.in/",
              ],
            }),
          }}
        />

        {/* WebSite Schema */}
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "UPSCPrepNotes",
              url: "https://upscprepnotes.in",
              description:
                "India's UPSC preparation intelligence platform. Access 280+ topper profiles, marks breakdowns, answer copies, and optional subject analysis.",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://upscprepnotes.in/search?q={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${plusJakarta.variable} ${jetbrainsMono.variable} antialiased bg-[#F8F9FA]`}
      >
        <TooltipProvider>
          <AuthProvider>
            <AppShell>
              {children}
            </AppShell>
          </AuthProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
