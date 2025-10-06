// app/layout.tsx
import "./globals.css";
import Script from "next/script";
import MailchimpSubscriptionCoupon from "./components/MailchimpSubscriptionCoupon";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            {children}
            <MailchimpSubscriptionCoupon />

            {/* Microsoft Clarity */}
            <Script id="clarity-script" strategy="lazyOnload">
                {`
          (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "sy5gylxyzn");
        `}
            </Script>

            {/* Google Analytics 4 */}
            <Script
                src="https://www.googletagmanager.com/gtag/js?id=G-2Q0BPDFWS4"
                strategy="lazyOnload"
            />
            <Script id="gtag-init" strategy="lazyOnload">
                {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-2Q0BPDFWS4');
        `}
            </Script>
        </>
    );
}
