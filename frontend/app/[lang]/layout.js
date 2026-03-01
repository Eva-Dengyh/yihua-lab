import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getDictionary } from "@/lib/dictionaries";
import { locales } from "@/i18n-config";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function LangLayout({ children, params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header lang={lang} dict={dict} />
      <main className="main-content flex-1 flex flex-col">{children}</main>
      <Footer dict={dict} />
    </div>
  );
}
