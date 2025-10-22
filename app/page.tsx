import { redirect } from "next/navigation";
import { defaultLanguage } from "@/config/i18n";

export default function RootRedirectPage() {
    redirect(`/${defaultLanguage}`);
}