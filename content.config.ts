// https://nuxt-content.zhcndoc.com/docs/collections/define#defining-collections
// https://nuxtseo.com/docs/sitemap/guides/content
import {defineCollection, defineContentConfig} from '@nuxt/content'
import {asSitemapCollection} from '@nuxtjs/sitemap/content'

export default defineContentConfig({
  collections: {
    introduction: defineCollection(asSitemapCollection({
      // 指定内容的类型
      type: 'page',
      // 加载`content`目录下的每个md文件
      source: '**/*.md',
    })),
    operations: defineCollection(asSitemapCollection({
      type: 'page',
      source: '**/*.md',
    })),
    resources: defineCollection(asSitemapCollection({
      type: 'page',
      source: '**/*.md',
    }))
  }
})
