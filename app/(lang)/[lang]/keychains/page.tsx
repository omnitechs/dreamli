import KeychainHero from './KeychainHero';
import KeychainBuilder from "@/components/KeychainMaker";
import {LanguageCode} from "@/config/i18n";

export default async function KeychainsPage(props: { params: Promise<{ lang: LanguageCode }>}) {
    const { lang } = await props.params;
  return (
    <div className="min-h-screen">
      <KeychainHero lang={lang} />
        <KeychainBuilder woocommerceConfig={{
            productId: 50361, // Your WooCommerce product ID
            apiUrl: 'https://shop.dreamli.nl/wp-json/custom/v1/add-to-cart'
        }}/>
    </div>
  );
}
