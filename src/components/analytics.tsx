"use client";

import { useEffect } from "react";
import Script from "next/script";

export function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;

  useEffect(() => {
    function loadAnalytics() {
      if (gaId && typeof window !== "undefined") {
        // GA loaded via Script component
      }
    }

    const consent = localStorage.getItem("sepide-cookie-consent");
    if (consent === "all") loadAnalytics();

    window.addEventListener("cookie-consent-granted", loadAnalytics);
    return () =>
      window.removeEventListener("cookie-consent-granted", loadAnalytics);
  }, [gaId]);

  if (!gaId && !clarityId) return null;

  return (
    <>
      {gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              if (localStorage.getItem('sepide-cookie-consent') === 'all') {
                gtag('config', '${gaId}');
              }
            `}
          </Script>
        </>
      )}
      {clarityId && (
        <Script id="clarity" strategy="afterInteractive">
          {`
            if (localStorage.getItem('sepide-cookie-consent') === 'all') {
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${clarityId}");
            }
          `}
        </Script>
      )}
    </>
  );
}
