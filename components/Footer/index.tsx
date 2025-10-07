// app/components/Footer.tsx (SERVER)
import Link from 'next/link';
import Image from 'next/image';
import NewsletterForm from '@/components/Footer/NewsletterForm';
import TrustPilot from '@/components/Footer/TrustPilot';
import {getTranslations} from 'next-intl/server';

export default async function Footer() {
    const t = await getTranslations('footer');
    const year = new Date().getFullYear();

    return (
        <footer className="bg-gradient-to-br from-gray-50 to-gray-100 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-4 gap-8">
                    {/* Logo and tagline */}
                    <div>
                        <Link href="/home" className="cursor-pointer mb-4 inline-block" aria-label={t('aria.home')}>
                            <Image
                                src="https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/48224f9cc1b0c55ac8c088f51f17f701.png"
                                alt={t('logoAlt')}
                                width={160}
                                height={56}
                                className="h-14 w-auto"
                                priority
                            />
                        </Link>
                        <p className="text-gray-600 max-w-sm leading-relaxed">
                            {t('tagline.line1')}<br />
                            {t('tagline.line2')}
                        </p>

                        <div className="flex space-x-4 mt-4">
                            <a
                                href="https://www.instagram.com/dreamli.art"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                                aria-label={t('social.instagram')}
                            >
                                <i className="ri-instagram-fill text-white text-lg" />
                            </a>
                            <a
                                href="https://www.facebook.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                                aria-label={t('social.facebook')}
                            >
                                <i className="ri-facebook-fill text-white text-lg" />
                            </a>
                            <a
                                href="https://wa.me/31645559587"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-gradient-to-r from-green-400 to-teal-400 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                                aria-label={t('social.whatsapp')}
                            >
                                <i className="ri-whatsapp-fill text-white text-lg" />
                            </a>
                        </div>
                    </div>

                    {/* Company Information */}
                    <div>
                        <h3 className="font-bold text-gray-900 mb-4">{t('company.heading')}</h3>
                        <div className="space-y-3 text-gray-600">
                            <div className="flex items-center space-x-2">
                                <i className="ri-building-2-line text-purple-600" />
                                <a
                                    href="https://omnitechs.nl"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm font-medium hover:text-purple-600 transition-colors cursor-pointer"
                                >
                                    {t('company.name')}
                                </a>
                            </div>

                            <div className="flex items-start space-x-2">
                                <i className="ri-map-pin-line text-purple-600 mt-1" />
                                <address className="not-italic text-sm">
                                    <p>{t('company.address.line1')}</p>
                                    <p>{t('company.address.line2')}</p>
                                    <p>{t('company.address.country')}</p>
                                </address>
                            </div>

                            <div className="flex items-center space-x-2">
                                <i className="ri-building-line text-purple-600" />
                                <p className="text-sm">{t('company.kvk', {kvk: '93814429'})}</p>
                            </div>

                            <div className="flex items-center space-x-2">
                                <i className="ri-phone-line text-purple-600" />
                                <a href="tel:+31645559587" className="text-sm hover:text-purple-600 transition-colors">
                                    {t('company.phone', {phone: '+31 6 4555 9587'})}
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Collaboration Hub */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-purple-800">{t('collab.heading')}</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/collaboration" className="text-gray-600 hover:text-purple-600 transition-colors">
                                    {t('collab.partner')}
                                </Link>
                            </li>
                            <li>
                                <a
                                    href="https://omnitechs.nl/about-founder"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-600 hover:text-purple-600 transition-colors"
                                >
                                    {t('collab.aboutFounder')}
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="font-bold text-gray-900 mb-4">{t('newsletter.heading')}</h3>
                        <p className="text-gray-600 text-sm mb-4">{t('newsletter.blurb')}</p>
                        <NewsletterForm />
                    </div>
                </div>

                {/* Trustpilot Widget */}
                <div className="mt-8 flex justify-center">
                    <TrustPilot />
                </div>

                <div className="border-t border-gray-200 mt-12 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <p className="text-gray-600 text-sm">
                            {t('legal.copyright', {year})}
                        </p>
                        <div className="flex space-x-6 text-sm text-gray-600">
                            <Link href="/privacy" className="hover:text-purple-600 transition-colors cursor-pointer">
                                {t('legal.privacy')}
                            </Link>
                            <Link href="/terms" className="hover:text-purple-600 transition-colors cursor-pointer">
                                {t('legal.terms')}
                            </Link>
                            <Link href="/cookies" className="hover:text-purple-600 transition-colors cursor-pointer">
                                {t('legal.cookies')}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
