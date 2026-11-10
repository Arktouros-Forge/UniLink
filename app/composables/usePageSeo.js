import { image, imageAlt, pages } from "@app/constants/seo.json";

export const usePageSeo = (key) => {
  const page = pages[key];
  const origin = useSiteConfig().url.replace(/\/$/, "");
  const picture = `${origin}${image}`;
  useSeoMeta({
    title: page.title,
    description: page.description,
    ogTitle: page.title,
    ogDescription: page.description,
    ogType: "website",
    ogLocale: "id_ID",
    ogImage: picture,
    ogImageAlt: imageAlt,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    twitterCard: "summary_large_image",
    twitterTitle: page.title,
    twitterDescription: page.description,
    twitterImage: picture,
    twitterImageAlt: imageAlt,
  });
  return page;
};
