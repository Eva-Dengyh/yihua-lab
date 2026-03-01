import { getAllCategories } from "@/lib/posts";
import { getDictionary } from "@/lib/dictionaries";
import CategoryCard from "@/components/CategoryCard";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return { title: dict.common.categories };
}

export default async function CategoryPage({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const categories = await getAllCategories();

  return (
    <div className="px-4 flex-1 flex flex-col">
      <div className="post-wrap relative w-full max-w-[780px] mx-auto pt-8">
        <h2 className="text-3xl leading-relaxed font-semibold text-center">
          -&nbsp;{dict.common.categories}&nbsp;-
        </h2>
        <div className="flex flex-wrap justify-between mt-4 px-4 sm:px-10 leading-relaxed">
          {categories.map((cat) => (
            <CategoryCard key={cat.name} category={cat} lang={lang} dict={dict} />
          ))}
        </div>
      </div>
    </div>
  );
}
