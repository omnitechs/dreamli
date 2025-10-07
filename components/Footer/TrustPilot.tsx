// app/components/footer/TrustpilotCta.tsx
import {getTranslations} from 'next-intl/server';

type Props = {
    href?: string;                              // Trustpilot profile URL
    variant?: 'button' | 'logo';                // default: 'button'
    className?: string;
};

function TrustpilotMark() {
    // Slightly bigger: larger icon and text
    return (
        <span className="inline-flex items-center gap-3">
      <svg
          width="22" height="22" viewBox="0 0 20 20" aria-hidden
          className="shrink-0"
      >
        <path
            d="M10 1.6l2.2 6.2h6.5l-5.3 3.8 2 6.2-5.4-3.9-5.4 3.9 2-6.2L1.3 7.8h6.5L10 1.6z"
            fill="#00B67A"
        />
      </svg>
      <span className="text-[#191919] font-semibold text-[18px] leading-none">
        Trustpilot
      </span>
    </span>
    );
}

export default async function TrustpilotCta({
                                                href = 'https://www.trustpilot.com/review/dreamli.nl',
                                                variant = 'button',
                                                className = ''
                                            }: Props) {
    const t = await getTranslations('footer.trustpilot');

    if (variant === 'logo') {
        // Bigger inline wordmark
        return (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-3 ${className}`}
                aria-label={t('ariaOpen')}
                title="Trustpilot"
            >
                <TrustpilotMark />
            </a>
        );
    }

    // Bigger bordered CTA
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('ariaOpen')}
            className={[
                "inline-flex items-center gap-3 rounded border border-[#00B67A]",
                "px-5 py-2.5 bg-white hover:bg-[#F7FFFC] transition-colors",
                "text-[#191919]",
                className
            ].join(' ')}
        >
            <TrustpilotMark />
        </a>
    );
}
