'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';

export default function NewsletterFormClient() {
    const t = useTranslations('footer.newsletter');
    const locale = useLocale();

    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | ''>('');
    const [msg, setMsg] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            setSubmitStatus('error');
            setMsg(t('errors.missingEmail'));
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus('');
        setMsg('');

        try {
            const formData = new FormData();
            formData.append('EMAIL', email);
            // honeypot must keep exact name for Mailchimp
            formData.append('b_b5c4e06a78dece913db9a1f79_78ff17c433', '');

            await fetch(
                'https://omnitechs.us12.list-manage.com/subscribe/post?u=b5c4e06a78dece913db9a1f79&id=78ff17c433&f_id=002bc7e8f0',
                {
                    method: 'POST',
                    mode: 'no-cors',
                    body: formData
                }
            );

            setSubmitStatus('success');
            setMsg(t('success'));
            setEmail('');
        } catch {
            setSubmitStatus('error');
            setMsg(t('errors.generic'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form id="mailchimp-subscribe" onSubmit={handleSubmit} className="space-y-3" aria-live="polite">
            <label htmlFor="EMAIL" className="sr-only">
                {t('emailLabel')}
            </label>
            <input
                type="email"
                id="EMAIL"
                name="EMAIL"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B9E4C9] focus:border-[#B9E4C9] outline-none transition-colors text-sm"
                placeholder={t('placeholder')}
                autoComplete="email"
                inputMode="email"
                aria-invalid={submitStatus === 'error' ? true : undefined}
                aria-describedby={submitStatus ? 'newsletter-status' : undefined}
                lang={locale}
            />

            {/* Honeypot (must keep same name) */}
            <input
                type="text"
                name="b_b5c4e06a78dece913db9a1f79_78ff17c433"
                tabIndex={-1}
                value=""
                readOnly
                style={{ position: 'absolute', left: '-5000px' }}
                aria-hidden="true"
            />

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#8472DF] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#7461D1] transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                aria-busy={isSubmitting}
            >
                {isSubmitting ? t('sending') : t('subscribe')}
            </button>

            {submitStatus && (
                <div
                    id="newsletter-status"
                    className={`text-xs p-2 rounded ${
                        submitStatus === 'success'
                            ? 'bg-green-50 text-green-700'
                            : 'bg-red-50 text-red-700'
                    }`}
                    role={submitStatus === 'error' ? 'alert' : 'status'}
                >
                    {msg}
                </div>
            )}

            <p className="text-xs text-gray-500 mt-3">{t('privacy')}</p>
        </form>
    );
}
