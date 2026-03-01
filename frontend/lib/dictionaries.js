const dictionaries = {
  zh: () => import("@/dictionaries/zh.json").then((m) => m.default),
  en: () => import("@/dictionaries/en.json").then((m) => m.default),
};

export async function getDictionary(locale) {
  if (!(locale in dictionaries)) {
    return dictionaries.en();
  }
  return dictionaries[locale]();
}
