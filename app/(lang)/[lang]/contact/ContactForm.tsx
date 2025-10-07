'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function ContactForm() {
    const t = useTranslations('Contact.form');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('');

        try {
            // Simulate form submission
            await new Promise(resolve => setTimeout(resolve, 1500));
            setSubmitStatus(t('status.success'));
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch {
            setSubmitStatus(t('status.error'));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        {t('title')}
                    </h2>
                    <p className="text-xl text-gray-700">
                        {t('subtitle')}
                    </p>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <form id="contact-form" onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('fields.name.label')} *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
                                    placeholder={t('fields.name.placeholder')}
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('fields.email.label')} *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
                                    placeholder={t('fields.email.placeholder')}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                {t('fields.subject.label')} *
                            </label>
                            <select
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors appearance-none bg-white"
                            >
                                <option value="">{t('fields.subject.placeholder')}</option>
                                <option value="general">{t('fields.subject.options.general')}</option>
                                <option value="order">{t('fields.subject.options.order')}</option>
                                <option value="technical">{t('fields.subject.options.technical')}</option>
                                <option value="partnership">{t('fields.subject.options.partnership')}</option>
                                <option value="feedback">{t('fields.subject.options.feedback')}</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                {t('fields.message.label')} *
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                rows={6}
                                value={formData.message}
                                onChange={handleChange}
                                maxLength={500}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors resize-none"
                                placeholder={t('fields.message.placeholder')}
                            ></textarea>
                            <div className="text-right text-sm text-gray-500 mt-1">
                                {formData.message.length}/500 {t('fields.message.characters')}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting || formData.message.length > 500}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-8 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
                        >
                            {isSubmitting ? t('buttons.sending') : t('buttons.send')}
                        </button>

                        {submitStatus && (
                            <div
                                className={`p-4 rounded-lg ${
                                    submitStatus === t('status.success')
                                        ? 'bg-green-50 text-green-700'
                                        : 'bg-red-50 text-red-700'
                                }`}
                            >
                                {submitStatus}
                            </div>
                        )}
                    </form>

                    <div className="mt-8 pt-8 border-t border-gray-200">
                        <div className="grid md:grid-cols-3 gap-6 text-center">
                            <div className="flex items-center justify-center space-x-3">
                                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                    <i className="ri-time-line text-purple-600"></i>
                                </div>
                                <div className="text-left">
                                    <div className="font-semibold text-gray-900">{t('badges.fast.title')}</div>
                                    <div className="text-sm text-gray-600">{t('badges.fast.subtitle')}</div>
                                </div>
                            </div>

                            <div className="flex items-center justify-center space-x-3">
                                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                    <i className="ri-shield-check-line text-purple-600"></i>
                                </div>
                                <div className="text-left">
                                    <div className="font-semibold text-gray-900">{t('badges.secure.title')}</div>
                                    <div className="text-sm text-gray-600">{t('badges.secure.subtitle')}</div>
                                </div>
                            </div>

                            <div className="flex items-center justify-center space-x-3">
                                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                    <i className="ri-customer-service-2-line text-purple-600"></i>
                                </div>
                                <div className="text-left">
                                    <div className="font-semibold text-gray-900">{t('badges.support.title')}</div>
                                    <div className="text-sm text-gray-600">{t('badges.support.subtitle')}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
