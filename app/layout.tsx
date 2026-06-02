import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import ExitIntentPopup from "@/components/ExitIntentPopup";
import ScrollSlideIn from "@/components/ScrollSlideIn";
import Header from "@/components/header";
import Footer from "@/components/footer";


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
  title: "UPSCPrepNotes — Topper Strategies, Answer Copies & Marksheets",
  description:
    "India's UPSC preparation intelligence platform. Access 280+ topper profiles, marks breakdowns, answer copies, optional subject analysis, and AI-powered preparation insights.",
  alternates: {
    canonical: "https://upscprepnotes.in",
  },
  openGraph: {
    title: "UPSCPrepNotes — Topper Strategies, Answer Copies & Marksheets",
    description:
      "Structured topper profiles, marksheet analysis, optional subject trends, and preparation strategies for UPSC aspirants.",
    url: "https://upscprepnotes.in",
  },
  keywords: [
    "UPSC",
    "UPSC CSE",
    "UPSC toppers",
    "IAS preparation",
    "UPSC answer copies",
    "UPSC marksheets",
    "UPSC strategy",
    "Civil Services Examination",
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
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
                send_page_view: true
              });

              var scrollDepths = {};
              function trackScroll() {
                var h = document.documentElement;
                var p = Math.round(((h.scrollTop || document.body.scrollTop) / (h.scrollHeight - h.clientHeight)) * 100);
                var depths = [25, 50, 75, 90, 100];
                for (var i = 0; i < depths.length; i++) {
                  if (p >= depths[i] && !scrollDepths[depths[i]]) {
                    scrollDepths[depths[i]] = true;
                    gtag('event', 'scroll_depth', { depth: depths[i] + '%' });
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

                gtag('event', 'click', {
                  event_label: trackAttr || (tag === 'a' ? 'link' : 'button'),
                  link_url: href,
                  link_text: text,
                  link_type: tag,
                  is_outbound: isOutbound,
                  page_path: location.pathname
                });
              });

              document.addEventListener('submit', function(e) {
                var el = e.target;
                var text = (el.querySelector('button[type=submit], input[type=submit]') || {}).innerText || '';
                gtag('event', 'form_submit', {
                  event_label: el.getAttribute('data-track') || 'form',
                  form_text: text.trim().substring(0, 100),
                  page_path: location.pathname
                });
              });

              var pageExitFired = false;
              document.addEventListener('visibilitychange', function() {
                if (document.visibilityState === 'hidden' && !pageExitFired) {
                  pageExitFired = true;
                  var st = window.scrollY || document.documentElement.scrollTop;
                  var sh = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                  gtag('event', 'page_exit', {
                    scroll_depth: Math.round((st / Math.max(sh, 1)) * 100) + '%',
                    time_on_page: Math.round((Date.now() - performance.now()) / 1000) + 's',
                    page_path: location.pathname
                  });
                }
              });

              window.addEventListener('beforeunload', function() {
                if (!pageExitFired) {
                  gtag('event', 'page_exit', {
                    depth: Math.round((window.scrollY / Math.max(document.documentElement.scrollHeight - document.documentElement.clientHeight, 1)) * 100) + '%',
                    page_path: location.pathname
                  });
                }
              });
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
              sameAs: [],
            }),
          }}
        />
      </head>
      <body
        className={`${plusJakarta.variable} ${jetbrainsMono.variable} antialiased bg-[#F8F9FA]`}
      >
        {/* Announcement Strip — Marquee */}
        <div className="group bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white py-2.5 sticky top-0 z-50 border-b border-gray-800 overflow-hidden">
          <a
            href="/toppers/toppers-copy-compilation"
            className="block text-[11px] sm:text-xs font-medium tracking-wide cursor-pointer"
          >
            <div className="flex animate-marquee whitespace-nowrap gap-12 group-hover:[animation-play-state:paused]">
              <span><span className="font-bold">30+ UPSC Resources Bundle</span><span className="text-white/60 mx-2">·</span><span className="text-[#C4F9D7] font-semibold">21 Guides + Topper Copies</span><span className="text-white/60 mx-2">·</span><span>₹799 Launch Offer →</span></span>
              <span><span className="font-bold">30+ UPSC Resources Bundle</span><span className="text-white/60 mx-2">·</span><span className="text-[#C4F9D7] font-semibold">21 Guides + Topper Copies</span><span className="text-white/60 mx-2">·</span><span>₹799 Launch Offer →</span></span>
              <span><span className="font-bold">30+ UPSC Resources Bundle</span><span className="text-white/60 mx-2">·</span><span className="text-[#C4F9D7] font-semibold">21 Guides + Topper Copies</span><span className="text-white/60 mx-2">·</span><span>₹799 Launch Offer →</span></span>
            </div>
          </a>
        </div>

        <TooltipProvider>
          <Header />
          {children}
          <Footer />
          <ExitIntentPopup />
          <ScrollSlideIn />
        </TooltipProvider>
      </body>
    </html>
  );
}
