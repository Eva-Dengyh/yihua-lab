import { getAllCategories } from "@/lib/posts";
import CategoryCard from "@/components/CategoryCard";

export const metadata = {
  title: "Categories",
};

export default async function CategoryPage() {
  const categories = await getAllCategories();

  return (
    <div className="px-4 flex-1 flex flex-col">
      <div className="post-wrap relative w-full max-w-[780px] mx-auto pt-8">
        <h2 className="text-3xl leading-relaxed font-semibold text-center">
          -&nbsp;Categories&nbsp;-
        </h2>
        <div className="flex flex-wrap justify-between mt-4 px-4 sm:px-10 leading-relaxed">
          {categories.map((cat) => (
            <CategoryCard key={cat.name} category={cat} />
          ))}
        </div>
      </div>
    </div>
  );
}
