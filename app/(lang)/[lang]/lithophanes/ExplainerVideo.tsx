// app/(lang)[lang]/_components/ExplainerVideo.tsx
import { getTranslations } from "next-intl/server";

export default async function ExplainerVideo() {
    const t = await getTranslations("lithosphanes.ExplainerVideo" );

    return (
        <section className="py-24 bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-6">
                        {t("title")}
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        {t("blurb")}
                    </p>
                </div>

                <div className="relative max-w-4xl mx-auto">
                    <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
                        <iframe
                            src="https://www.youtube.com/embed/NXiZzYpax3o?autoplay=1&loop=1&playlist=NXiZzYpax3o&mute=1&controls=1&modestbranding=1&rel=0"
                            className="absolute inset-0 w-full h-full"
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                            title={t("videoTitle")}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
