import { getDictionary } from "@/lib/dictionaries";
import Profile from "@/components/Profile";

export default async function Home({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return <Profile lang={lang} dict={dict} />;
}
