import type { MaybeRefOrGetter } from 'vue';
import { computed, toValue } from 'vue';

type PageSeoOptions = {
  title: MaybeRefOrGetter<string>;
  description: MaybeRefOrGetter<string>;
  path?: MaybeRefOrGetter<string>;
  type?: 'website' | 'article';
  robots?: 'all' | 'noindex, nofollow' | 'noindex, follow' | 'index, follow';
};

const siteUrl = 'https://ef.yituliu.cn';

export const pageSeoDefaults = {
  ogLocale: 'zh_CN',
  ogLocaleAlternate: ['en_US'],
  ogType: 'website',
  robots: 'all',
  twitterCard: 'summary',
} as const;

export function usePageSeo(options: PageSeoOptions) {
  const route = useRoute();
  const canonicalUrl = computed(() => `${siteUrl}${toValue(options.path) ?? route.path}`);
  const title = computed(() => toValue(options.title));
  const description = computed(() => toValue(options.description));

  useSeoMeta({
    title: () => title.value,
    description: () => description.value,
    ogTitle: () => title.value,
    ogDescription: () => description.value,
    ogUrl: () => canonicalUrl.value,
    ogLocale: pageSeoDefaults.ogLocale,
    ogLocaleAlternate: pageSeoDefaults.ogLocaleAlternate,
    ogType: options.type ?? pageSeoDefaults.ogType,
    robots: options.robots ?? pageSeoDefaults.robots,
    twitterCard: pageSeoDefaults.twitterCard,
  });

  useHead({
    title: () => title.value,
    link: [
      {
        rel: 'canonical',
        href: () => canonicalUrl.value,
      },
    ],
  });
}
